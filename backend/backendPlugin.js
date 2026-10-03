// Tiny file-based "backend" that runs inside the Vite dev/preview server.
//
// Every prescription step (clinical examination, each writing section, final prescription) is POSTed to
// /api/prescription-step and written as one JSON file:
//
//   backend/data/patient_<id>_<name>/visit_<visitId>/<NN>_<step>.json
//
// Uploaded investigation reports (data URLs) are decoded and stored next to the JSON in ./attachments,
// and the JSON keeps only their relative path. Re-completing a step overwrites that step's file.
// For production, replace this with a real server (same endpoint and payload).
import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const MAX_BODY_BYTES = 25 * 1024 * 1024;

const safe = (value) =>
  String(value ?? '').replace(/[^A-Za-z0-9_-]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 60) || 'x';

const safeFileName = (name) =>
  String(name ?? 'file').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '').slice(-80) || 'file';

// Replace every { name, dataUrl } with { name, path } after writing the decoded file to disk.
function extractAttachments(node, dir, counter = { n: 0 }) {
  if (Array.isArray(node)) { node.forEach(child => extractAttachments(child, dir, counter)); return; }
  if (!node || typeof node !== 'object') return;
  if (typeof node.dataUrl === 'string' && node.dataUrl.startsWith('data:')) {
    const match = node.dataUrl.match(/^data:([^;,]*)(;base64)?,(.*)$/s);
    if (match) {
      const buffer = match[2] ? Buffer.from(match[3], 'base64') : Buffer.from(decodeURIComponent(match[3]));
      const fileName = `${String(++counter.n).padStart(2, '0')}_${safeFileName(node.name)}`;
      const attachDir = path.join(dir, 'attachments');
      fs.mkdirSync(attachDir, { recursive: true });
      fs.writeFileSync(path.join(attachDir, fileName), buffer);
      node.path = `attachments/${fileName}`;
      node.size = buffer.length;
    }
    delete node.dataUrl;
  }
  Object.values(node).forEach(child => extractAttachments(child, dir, counter));
}

function saveStep(payload) {
  const { patient, visitId, step, order = 0, data } = payload || {};
  if (!patient?.id || !visitId || !step) throw new Error('patient.id, visitId and step are required');

  const dir = path.join(DATA_DIR, `patient_${safe(patient.id)}_${safe(patient.name)}`, `visit_${safe(visitId)}`);
  fs.mkdirSync(dir, { recursive: true });

  const body = JSON.parse(JSON.stringify(data ?? null));
  extractAttachments(body, dir);

  const record = {
    schemaVersion: 1,
    step,
    order,
    savedAt: new Date().toISOString(),
    visitId,
    patient: { id: patient.id, name: patient.name, serial: patient.serial, dob: patient.dob, gender: patient.gender },
    data: body,
  };

  const fileName = `${String(order).padStart(2, '0')}_${safe(step)}.json`;
  const target = path.join(dir, fileName);
  const temp = `${target}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(record, null, 2));
  fs.renameSync(temp, target); // atomic replace
  return path.relative(process.cwd(), target).split(path.sep).join('/');
}

function handler(req, res, next) {
  const url = (req.url || '').split('?')[0];
  if (url !== '/api/prescription-step') return next();

  const reply = (status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };
  if (req.method !== 'POST') return reply(405, { success: false, error: 'Use POST' });

  const chunks = [];
  let size = 0;
  req.on('data', (chunk) => {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) { reply(413, { success: false, error: 'Payload too large' }); req.destroy(); return; }
    chunks.push(chunk);
  });
  req.on('end', () => {
    try {
      const file = saveStep(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      reply(200, { success: true, file });
    } catch (err) {
      reply(400, { success: false, error: err.message });
    }
  });
}

export default function prescriptionBackend() {
  return {
    name: 'prescription-backend',
    configureServer(server) { server.middlewares.use(handler); },
    configurePreviewServer(server) { server.middlewares.use(handler); },
  };
}
