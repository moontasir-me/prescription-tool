// Vercel serverless function: stores every prescription step in Neon Postgres.
//   POST /api/prescription-step                      body: { patient, visitId, step, order, data }
//   GET  /api/prescription-step?patientId=1[&visitId=2]   -> saved steps
// Needs the DATABASE_URL environment variable (added by the Neon integration in Vercel).
// Uploaded reports stay inside the JSON as data URLs (the app already limits each file to 1.5 MB).
import { neon } from '@neondatabase/serverless';

let ready;
const ensureTable = (sql) => (ready ??= sql`
  create table if not exists prescription_steps (
    id          bigserial primary key,
    patient_id  text not null,
    visit_id    text not null,
    step        text not null,
    step_order  int  not null default 99,
    patient     jsonb,
    data        jsonb not null,
    saved_at    timestamptz not null default now(),
    unique (patient_id, visit_id, step)
  )`);

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return res.status(500).json({ success: false, error: 'DATABASE_URL is not set' });

  try {
    const sql = neon(url);
    await ensureTable(sql);

    if (req.method === 'GET') {
      const { patientId, visitId } = req.query;
      if (!patientId) return res.status(400).json({ success: false, error: 'patientId is required' });
      const rows = visitId
        ? await sql`select step, step_order, visit_id, patient, data, saved_at from prescription_steps
                    where patient_id = ${String(patientId)} and visit_id = ${String(visitId)} order by step_order`
        : await sql`select step, step_order, visit_id, patient, data, saved_at from prescription_steps
                    where patient_id = ${String(patientId)} order by visit_id, step_order`;
      return res.status(200).json({ success: true, steps: rows });
    }

    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Use GET or POST' });

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { patient, visitId, step, order = 99, data } = body || {};
    if (!patient?.id || !visitId || !step) {
      return res.status(400).json({ success: false, error: 'patient.id, visitId and step are required' });
    }
    await sql`
      insert into prescription_steps (patient_id, visit_id, step, step_order, patient, data)
      values (${String(patient.id)}, ${String(visitId)}, ${String(step)}, ${Number(order)},
              ${JSON.stringify(patient)}::jsonb, ${JSON.stringify(data ?? null)}::jsonb)
      on conflict (patient_id, visit_id, step)
      do update set data = excluded.data, patient = excluded.patient,
                    step_order = excluded.step_order, saved_at = now()`;
    return res.status(200).json({ success: true, file: `${String(order).padStart(2, '0')}_${step} (Neon)` });
  } catch (err) {
    console.error('prescription-step failed', err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
