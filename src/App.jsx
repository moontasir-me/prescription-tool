import React, { useState, useEffect, useRef } from 'react';
import {
  Home, Calendar, FileText, User, Settings, LogOut,
  Search, Bell, Plus, Trash2, Save, RotateCcw, Printer, X,
  UserPlus, FolderHeart, SearchIcon, ChevronDown, UserCheck, Activity,
  AlertTriangle, ClipboardList, Edit2, Check, Lock, Paperclip
} from 'lucide-react';

// ==========================================
// APP VERSION
// ==========================================
const APP_DATA_VERSION = 'v19';

// ==========================================
// PREDEFINED TERMS
// ==========================================
const healthScreeningTerms = ["Temperature", "HFA", "WFA", "MUAC", "Pulse Rate"];
const onExaminationTerms = ["ANEMIA", "DEHYDRATION", "JAUNDICE"];
const systemicExaminationTerms = ["ABDOMEN", "HEART", "LUNG"];
const investigationResultsTerms = ["CBC", "Blood Sugar", "Urine R/E", "X-Ray", "ECG", "Ultrasound", "CT Scan", "MRI", "Biopsy"];

const SECTION_ORDER = ['chiefComplaints', 'diagnosis', 'investigations', 'ancPnc', 'rx', 'advice', 'followUps'];

// ==========================================
// INITIAL MOCK DATA
// ==========================================
const INITIAL_PATIENTS = [
  { id: 1, name: 'James Suarez', serial: '555-0118', dob: '1977-08-12', gender: 'Male', contact: '405-880-0379', address: '525 Meadow Drive, Oklahoma City, US', bloodGroup: 'B (ve)', visits: 3, tags: ['Diabetic', 'Allergic', 'Surcical History: Yes', 'G/H: High Pressure'], lastVisit: '15 Nov 2022', visitHistory: [] },
  { id: 2, name: 'Esther Howard', serial: '308-0121', dob: '1996-03-04', gender: 'Female', contact: '405-880-0380', address: '123 Main St, Oklahoma City, US', bloodGroup: 'O+', visits: 1, tags: [], lastVisit: '10 Nov 2022', visitHistory: [] },
  { id: 3, name: 'Jacob Jones', serial: '671-0110', dob: '1952-01-20', gender: 'Male', contact: '405-880-0381', address: '456 Oak St, Oklahoma City, US', bloodGroup: 'A+', visits: 1, tags: ['G/H: High Pressure'], lastVisit: '05 Nov 2022', visitHistory: [] },
  { id: 4, name: 'Floyd Miles', serial: '702-0122', dob: '1970-12-15', gender: 'Male', contact: '405-880-0382', address: '789 Pine St, Oklahoma City, US', bloodGroup: 'AB+', visits: 0, tags: ['Diabetic'], lastVisit: '01 Nov 2022', visitHistory: [] },
  { id: 5, name: 'Ronald Richards', serial: '555-0100', dob: '1941-10-10', gender: 'Male', contact: '405-880-0383', address: '321 Elm St, Oklahoma City, US', bloodGroup: 'B+', visits: 0, tags: ['Allergic'], lastVisit: '28 Oct 2022', visitHistory: [] },
];

// ==========================================
// SYNTHETIC SAMPLE VISITS (demo data only - not real patients)
// ==========================================
const termRows = (pairs, prefix) => pairs.map(([term, value], i) => ({ id: `${prefix}-${i}`, term, value }));
const textRows = (prefix, arr) => arr.map((text, i) => ({ id: `${prefix}-${i}`, text }));
const rxRows = (prefix, arr) => arr.map(([form, medicine, strength, dosage, duration, instruction], i) => ({ id: `${prefix}-rx${i}`, form, medicine, strength, dosage, duration, instruction }));

const SAMPLE_VISITS = {
  1: [
    {
      id: 9001, date: 'Tuesday, 12 July 2022',
      heightFeet: '5', heightInch: '9', weight: '84', bmi: '27.35', bsa: '2.00',
      onExamination: termRows([['ANEMIA', 'Absent'], ['DEHYDRATION', 'Absent'], ['JAUNDICE', 'Absent']], 'v1oe'),
      healthScreening: termRows([['Temperature', '98.4 °F'], ['Pulse Rate', '82 /min']], 'v1hs'),
      systemicExamination: termRows([['ABDOMEN', 'Soft, non-tender'], ['HEART', 'S1 S2 normal, no murmur'], ['LUNG', 'Clear']], 'v1se'),
      investigationResults: termRows([['Blood Sugar', 'FBS 9.2 mmol/L'], ['Urine R/E', 'Sugar +, protein nil']], 'v1ir'),
      referredBy: '', referredTo: '',
      chiefComplaints: textRows('v1cc', ['Increased thirst and frequent urination for 3 weeks', 'Occasional headache']),
      diagnosis: textRows('v1dx', ['Type 2 diabetes mellitus (newly detected)', 'Hypertension, stage 1']),
      generalExaminations: textRows('v1ge', ['BP 148/92 mmHg (right arm, sitting)']),
      investigations: textRows('v1inv', ['HbA1c', 'Lipid profile', 'Serum creatinine', 'Urine ACR']),
      ancPncNotes: textRows('v1anc', ['N/A']),
      rxList: rxRows('v1', [['Tab.', 'Metformin', '500 mg', '1-0-1', '30 days', 'After meals'], ['Tab.', 'Amlodipine', '5 mg', '1-0-0', '30 days', 'Morning']]),
      adviceList: textRows('v1adv', ['Low-sugar, low-salt diet', 'Walk 30 minutes daily', 'Home BP log twice daily']),
      followUps: textRows('v1fu', ['After 2 weeks with reports']),
    },
    {
      id: 9002, date: 'Tuesday, 20 September 2022',
      heightFeet: '5', heightInch: '9', weight: '82', bmi: '26.70', bsa: '1.98',
      onExamination: termRows([['ANEMIA', 'Absent'], ['DEHYDRATION', 'Mild'], ['JAUNDICE', 'Absent']], 'v2oe'),
      healthScreening: termRows([['Temperature', '100.2 °F'], ['Pulse Rate', '92 /min']], 'v2hs'),
      systemicExamination: termRows([['ABDOMEN', 'Soft, non-tender'], ['HEART', 'Normal'], ['LUNG', 'Clear, no wheeze']], 'v2se'),
      investigationResults: [],
      referredBy: '', referredTo: '',
      chiefComplaints: textRows('v2cc', ['Fever, sore throat and runny nose for 2 days', 'Dry cough']),
      diagnosis: textRows('v2dx', ['Acute upper respiratory tract infection (viral)']),
      generalExaminations: textRows('v2ge', ['Throat congested, no exudate', 'BP 138/86 mmHg']),
      investigations: textRows('v2inv', ['N/A']),
      ancPncNotes: textRows('v2anc', ['N/A']),
      rxList: rxRows('v2', [['Tab.', 'Napa', '500 mg', '1-1-1', '3 days', 'If fever > 100 °F'], ['Tab.', 'Cetirizine', '10 mg', '0-0-1', '5 days', 'At bedtime'], ['Tab.', 'Metformin', '500 mg', '1-0-1', 'Continue', 'After meals'], ['Tab.', 'Amlodipine', '5 mg', '1-0-0', 'Continue', 'Morning']]),
      adviceList: textRows('v2adv', ['Plenty of oral fluids', 'Warm saline gargle', 'Rest for 2 days']),
      followUps: textRows('v2fu', ['If fever persists beyond 3 days']),
    },
    {
      id: 9003, date: 'Tuesday, 15 November 2022',
      heightFeet: '5', heightInch: '9', weight: '80', bmi: '26.05', bsa: '1.96',
      onExamination: termRows([['ANEMIA', 'Absent'], ['DEHYDRATION', 'Absent'], ['JAUNDICE', 'Absent']], 'v3oe'),
      healthScreening: termRows([['Temperature', '98.2 °F'], ['Pulse Rate', '76 /min']], 'v3hs'),
      systemicExamination: termRows([['ABDOMEN', 'Soft, non-tender'], ['HEART', 'Normal'], ['LUNG', 'Clear']], 'v3se'),
      investigationResults: termRows([['Blood Sugar', 'FBS 7.1 mmol/L'], ['Lipid profile', 'LDL 3.4 mmol/L'], ['ECG', 'Normal sinus rhythm']], 'v3ir'),
      referredBy: '', referredTo: 'Ophthalmology (annual retinal screening)',
      chiefComplaints: textRows('v3cc', ['Routine diabetes and hypertension follow-up', 'No new complaints']),
      diagnosis: textRows('v3dx', ['Type 2 diabetes mellitus, improving control', 'Hypertension, controlled']),
      generalExaminations: textRows('v3ge', ['BP 128/80 mmHg', 'Foot examination: sensation intact, no ulcer']),
      investigations: textRows('v3inv', ['HbA1c after 3 months', 'Urine ACR']),
      ancPncNotes: textRows('v3anc', ['N/A']),
      rxList: rxRows('v3', [['Tab.', 'Metformin', '500 mg', '1-0-1', '60 days', 'After meals'], ['Tab.', 'Amlodipine', '5 mg', '1-0-0', '60 days', 'Morning']]),
      adviceList: textRows('v3adv', ['Continue diet and exercise', 'Daily foot inspection', 'Annual eye check']),
      followUps: textRows('v3fu', ['After 2 months with HbA1c report']),
    },
  ],
  2: [
    {
      id: 9004, date: 'Thursday, 10 November 2022',
      heightFeet: '5', heightInch: '4', weight: '62', bmi: '23.46', bsa: '1.66',
      onExamination: termRows([['ANEMIA', 'Mild pallor'], ['DEHYDRATION', 'Absent'], ['JAUNDICE', 'Absent']], 'v4oe'),
      healthScreening: termRows([['Temperature', '98.0 °F'], ['Pulse Rate', '88 /min']], 'v4hs'),
      systemicExamination: termRows([['ABDOMEN', 'Uterus corresponds to ~20 weeks'], ['HEART', 'Normal'], ['LUNG', 'Clear']], 'v4se'),
      investigationResults: termRows([['Blood Sugar', 'Random 5.4 mmol/L'], ['Urine R/E', 'Normal'], ['Ultrasound', 'Single live fetus, normal liquor']], 'v4ir'),
      referredBy: '', referredTo: '',
      chiefComplaints: textRows('v4cc', ['Routine antenatal check-up', 'Mild fatigue']),
      diagnosis: textRows('v4dx', ['Pregnancy ~20 weeks, mild anemia']),
      generalExaminations: textRows('v4ge', ['BP 112/70 mmHg', 'No pedal edema']),
      investigations: textRows('v4inv', ['CBC with Hb', 'Serum ferritin']),
      ancPncNotes: textRows('v4anc', ['Gravida 1, Para 0', 'Fetal movement felt', 'Tetanus toxoid dose advised']),
      rxList: rxRows('v4', [['Tab.', 'Ferrous fumarate + folic acid', '', '1-0-0', '30 days', 'After lunch, not with tea'], ['Tab.', 'Calcium', '500 mg', '0-0-1', '30 days', 'At night']]),
      adviceList: textRows('v4adv', ['Iron-rich diet', 'Adequate rest', 'Report bleeding, severe headache or reduced fetal movement immediately']),
      followUps: textRows('v4fu', ['After 4 weeks for next ANC visit']),
    },
  ],
  3: [
    {
      id: 9005, date: 'Saturday, 05 November 2022',
      heightFeet: '5', heightInch: '6', weight: '70', bmi: '24.91', bsa: '1.79',
      onExamination: termRows([['ANEMIA', 'Absent'], ['DEHYDRATION', 'Absent'], ['JAUNDICE', 'Absent']], 'v5oe'),
      healthScreening: termRows([['Temperature', '97.9 °F'], ['Pulse Rate', '72 /min']], 'v5hs'),
      systemicExamination: termRows([['ABDOMEN', 'Soft'], ['HEART', 'Normal'], ['LUNG', 'Clear']], 'v5se'),
      investigationResults: termRows([['ECG', 'Left ventricular hypertrophy pattern'], ['Urine R/E', 'Normal']], 'v5ir'),
      referredBy: '', referredTo: '',
      chiefComplaints: textRows('v5cc', ['Knee pain on walking for 3 months', 'Known hypertension, irregular medication']),
      diagnosis: textRows('v5dx', ['Hypertension', 'Osteoarthritis of both knees']),
      generalExaminations: textRows('v5ge', ['BP 152/94 mmHg', 'Bilateral knee crepitus, no effusion']),
      investigations: textRows('v5inv', ['X-ray both knees (weight bearing)', 'Serum creatinine']),
      ancPncNotes: textRows('v5anc', ['N/A']),
      rxList: rxRows('v5', [['Tab.', 'Amlodipine', '5 mg', '1-0-0', '30 days', 'Morning, daily without gaps'], ['Tab.', 'Napa', '500 mg', '1-0-1', '10 days', 'If pain; avoid NSAIDs']]),
      adviceList: textRows('v5adv', ['Regular quadriceps-strengthening exercises', 'Avoid prolonged stair climbing', 'Reduce salt intake']),
      followUps: textRows('v5fu', ['After 2 weeks with X-ray and creatinine report']),
    },
  ],
};

INITIAL_PATIENTS.forEach(pt => { if (SAMPLE_VISITS[pt.id]) pt.visitHistory = SAMPLE_VISITS[pt.id]; });

// ==========================================
// HELPERS
// ==========================================
const generateSerialNumber = () => {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  return `${day}${month}${year}-${random}`;
};

const calculateAge = (dob) => {
  if (!dob) return '—';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return '—';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
  if (age < 0) return '—';
  return `${age} years`;
};

const formatDobForDisplay = (dob) => {
  if (!dob) return '';
  const date = new Date(dob);
  if (isNaN(date.getTime())) return dob;
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
};

const sanitizePatientForModal = (patient) => {
  if (!patient) return null;
  return {
    id: patient.id, name: patient.name || '', dob: patient.dob || '', gender: patient.gender || 'Male',
    address: patient.address || '', contact: patient.contact || '', serial: patient.serial || '',
    bloodGroup: patient.bloodGroup || 'A+', visits: patient.visits || 0, visitHistory: patient.visitHistory || [],
    tags: patient.tags || [], tagColors: patient.tagColors || {}, lastVisit: patient.lastVisit || '',
  };
};

const buildTermRows = (terms) => terms.map((term, i) => ({ id: Date.now() + i + Math.random(), term, value: '' }));

const sectionHasContent = (sectionKey, items) => {
  return (items || []).some(item => {
    if (sectionKey === 'rx') return item.medicine && item.medicine.trim() && item.medicine.trim() !== 'N/A';
    return item.text && item.text.trim() && item.text.trim() !== 'N/A';
  });
};

const fillNA = (sectionKey, items) => {
  if (sectionHasContent(sectionKey, items)) {
    return (items || []).filter(item => {
      if (sectionKey === 'rx') return item.medicine && item.medicine.trim();
      return item.text && item.text.trim();
    });
  }
  if (sectionKey === 'rx') return [{ id: Date.now(), medicine: 'N/A', dosage: '', duration: '', instruction: '' }];
  return [{ id: Date.now(), text: 'N/A' }];
};

const saveSectionToBackend = async (patientId, visitId, sectionName, data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const key = `backend_autosave_${patientId}_${visitId}_${sectionName}`;
      localStorage.setItem(key, JSON.stringify({ patientId, visitId, sectionName, data, savedAt: new Date().toISOString() }));
      console.log(`✅ [AUTO-SAVE] "${sectionName}" saved for patient ${patientId}`, data);
      resolve({ success: true, key });
    }, 200);
  });
};

// ==========================================
// DELETE CONFIRMATION
// ==========================================
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, patientName }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#2B324B]/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
        <div className="w-16 h-16 bg-[#E0565F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="text-[#E0565F]" size={32} />
        </div>
        <h3 className="text-xl font-bold text-[#2B324B] mb-2">Delete Patient?</h3>
        <p className="text-sm text-[#808493] mb-6">
          Are you sure you want to delete <span className="font-semibold text-[#2B324B]">{patientName}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-[#F4F6F8] text-[#2B324B] rounded-full font-medium hover:bg-[#e2e8f0] transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-[#E0565F] text-white rounded-full font-medium hover:bg-[#d04650] transition-colors">Delete</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// TAG EDITOR (Editable Tags)
// ==========================================
// Colours a doctor can give a tag. Tags without a chosen colour keep the automatic red/green rule.
const TAG_COLORS = ['#E0565F', '#F08A24', '#E3B341', '#28CD85', '#14B8A6', '#0CAAFF', '#4264D0', '#8B5CF6', '#EC4899', '#808493'];

const TagEditor = ({ tags, colors = {}, onChange }) => {
  const [colorPickerIndex, setColorPickerIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newTagValue, setNewTagValue] = useState('');

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(tags[index] || '');
  };

  const saveEdit = () => {
    if (editingValue.trim()) {
      const newTags = [...tags];
      const oldName = newTags[editingIndex];
      const newName = editingValue.trim();
      newTags[editingIndex] = newName;
      const newColors = { ...colors };
      if (oldName !== newName && newColors[oldName]) { newColors[newName] = newColors[oldName]; delete newColors[oldName]; }
      onChange(newTags, newColors);
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const deleteTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    const newColors = { ...colors };
    if (!newTags.includes(tags[index])) delete newColors[tags[index]];
    onChange(newTags, newColors);
  };

  const addTag = () => {
    if (newTagValue.trim()) {
      onChange([...tags, newTagValue.trim()], colors);
    }
    setAddingNew(false);
    setNewTagValue('');
  };

  const setTagColor = (tag, color) => {
    const newColors = { ...colors };
    if (color) newColors[tag] = color; else delete newColors[tag];
    onChange(tags, newColors);
  };

  // A doctor-chosen colour is applied inline; otherwise fall back to the automatic classes below.
  const customStyle = (tag) => {
    const c = colors[tag];
    return c ? { color: c, backgroundColor: `${c}14`, borderColor: `${c}40` } : undefined;
  };

  const getTagStyle = (tag) => {
    if (colors[tag]) return '';
    const t = (tag || '').toLowerCase();
    const isWarning = t.includes('diabetic') || t.includes('allergic') || t.includes('pressure');
    return isWarning
      ? 'bg-[#E0565F]/5 text-[#E0565F] border-[#E0565F]/20 hover:border-[#E0565F]/50'
      : 'bg-[#28CD85]/5 text-[#28CD85] border-[#28CD85]/20 hover:border-[#28CD85]/50';
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 items-center">
      {tags.map((tag, i) => (
        editingIndex === i ? (
          <input
            key={`edit-${i}`}
            autoFocus
            type="text"
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); saveEdit(); }
              if (e.key === 'Escape') { e.preventDefault(); cancelEdit(); }
            }}
            className="px-3 py-1 rounded-full text-xs font-medium border border-[#0CAAFF] outline-none bg-white text-[#2B324B] min-w-[100px]"
          />
        ) : (
          <div
            key={`tag-${i}`}
            className={`group relative flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors ${getTagStyle(tag)}`}
            style={customStyle(tag)}
            title="Click to edit"
          >
            <span onClick={() => startEdit(i)}>{tag}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setColorPickerIndex(colorPickerIndex === i ? null : i); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5"
              title="Change tag colour"
            >
              <span className="block w-2.5 h-2.5 rounded-full border border-current" style={{ background: colors[tag] || 'currentColor' }} />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); deleteTag(i); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 hover:text-red-600"
              title="Remove tag"
            >
              <X size={11} strokeWidth={3} />
            </button>
            {colorPickerIndex === i && (
              <div
                className="absolute left-0 top-full mt-2 z-40 bg-white border border-[#F4F6F8] rounded-xl shadow-xl p-2.5 w-52 text-[#2B324B] cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-[10px] uppercase tracking-wider text-[#808493] font-semibold mb-1.5">Tag colour</p>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {TAG_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setTagColor(tag, c); setColorPickerIndex(null); }}
                      className={`w-5 h-5 rounded-full border-2 ${colors[tag] === c ? 'border-[#2B324B]' : 'border-white shadow'}`}
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-[11px] text-[#808493] cursor-pointer">
                    <input type="color" value={colors[tag] || '#0CAAFF'} onChange={(e) => setTagColor(tag, e.target.value)} className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer" />
                    Custom
                  </label>
                  <button type="button" onClick={() => { setTagColor(tag, null); setColorPickerIndex(null); }} className="text-[11px] text-[#0CAAFF] hover:underline">Auto</button>
                </div>
              </div>
            )}
          </div>
        )
      ))}

      {addingNew ? (
        <input
          autoFocus
          type="text"
          value={newTagValue}
          onChange={(e) => setNewTagValue(e.target.value)}
          onBlur={addTag}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(); }
            if (e.key === 'Escape') { e.preventDefault(); setAddingNew(false); setNewTagValue(''); }
          }}
          placeholder="Type tag, press Enter..."
          className="px-3 py-1 rounded-full text-xs font-medium border border-[#0CAAFF] outline-none bg-white text-[#2B324B] min-w-[140px]"
        />
      ) : (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="px-3 py-1 rounded-full text-xs font-medium border border-dashed border-[#808493]/40 text-[#808493] hover:bg-[#F4F6F8] hover:border-[#0CAAFF] hover:text-[#0CAAFF] transition-colors flex items-center gap-1"
        >
          <Plus size={11} /> Other tags
        </button>
      )}
    </div>
  );
};

// ==========================================
// TERM-VALUE TABLE
// ==========================================
// ==========================================
// INVESTIGATION REPORT ATTACHMENTS
// ==========================================
const MAX_ATTACHMENT_BYTES = 1.5 * 1024 * 1024; // stored in the browser (localStorage) in this demo, so keep it small

const readFileAsAttachment = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

const openAttachment = async (file) => {
  if (!file?.dataUrl) return;
  const blob = await (await fetch(file.dataUrl)).blob(); // blob: URLs open reliably, data: URLs are blocked for new tabs
  window.open(URL.createObjectURL(blob), '_blank', 'noopener');
};

const TermChip = ({ row }) => (
  <span>
    <span className="font-semibold">{row.term || '—'}:</span> {row.value || '—'}
    {row.file && (
      <button type="button" onClick={() => openAttachment(row.file)} title={`Open report: ${row.file.name}`} className="inline-flex items-center ml-1 text-[#0CAAFF] hover:text-[#4264D0] align-middle">
        <Paperclip size={12} />
      </button>
    )}
  </span>
);

const TermValueTable = ({ title, items, onChange, onDelete, onAddCustom, allowFiles = false }) => {
  const [fileError, setFileError] = useState({});
  const handlePick = async (id, e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_ATTACHMENT_BYTES) { setFileError(prev => ({ ...prev, [id]: 'File too large (max 1.5 MB)' })); return; }
    setFileError(prev => ({ ...prev, [id]: '' }));
    onChange(id, 'file', await readFileAsAttachment(file));
  };
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-[#2B324B] bg-[#0CAAFF]/10 px-3 py-1.5 rounded-full">{title}</h3>
        <button type="button" onClick={onAddCustom} className="text-[#0CAAFF] hover:bg-[#0CAAFF]/10 p-1 rounded-full transition-colors" title="Add custom term">
          <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => (
          <div key={item.id} className="border border-[#F4F6F8] rounded-xl overflow-hidden bg-white">
            <input
              type="text"
              value={item.term || ''}
              onChange={(e) => onChange(item.id, 'term', e.target.value)}
              placeholder="Term"
              className="w-full text-xs font-semibold text-[#2B324B] bg-[#F4F6F8] px-3 py-1.5 outline-none focus:bg-[#0CAAFF]/10 border-b border-[#F4F6F8]"
            />
            <div className="flex items-center">
              <input
                type="text"
                value={item.value || ''}
                onChange={(e) => onChange(item.id, 'value', e.target.value)}
                placeholder="Enter value..."
                className="w-full px-3 py-2 text-sm text-[#2B324B] outline-none bg-white"
              />
              {allowFiles && (
                <label className={`p-1.5 cursor-pointer shrink-0 transition-colors hover:bg-[#0CAAFF]/10 ${item.file ? 'text-[#28CD85]' : 'text-[#0CAAFF]'}`} title={item.file ? 'Replace report (PDF / image)' : 'Attach report (PDF / image)'}>
                  <Paperclip size={14} />
                  <input type="file" accept="application/pdf,image/*" className="hidden" onChange={(e) => handlePick(item.id, e)} />
                </label>
              )}
              <button type="button" onClick={() => onDelete(item.id)} className="text-[#E0565F] p-1.5 hover:bg-[#E0565F]/10 transition-colors shrink-0" title="Remove">
                <Trash2 size={14} />
              </button>
            </div>
            {allowFiles && item.file && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#28CD85]/10 text-[11px] text-[#2B324B]">
                <FileText size={12} className="text-[#28CD85] shrink-0" />
                <button type="button" onClick={() => openAttachment(item.file)} className="truncate hover:underline text-left" title="Open report">{item.file.name}</button>
                <button type="button" onClick={() => onChange(item.id, 'file', null)} className="ml-auto text-[#E0565F] shrink-0" title="Remove attachment"><X size={12} /></button>
              </div>
            )}
            {allowFiles && fileError[item.id] && <p className="px-3 py-1 text-[11px] text-[#E0565F]">{fileError[item.id]}</p>}
          </div>
        ))}
      </div>

      {items.length === 0 && <p className="text-xs text-[#808493] italic">No terms yet. Click "+" to add.</p>}
    </div>
  );
};

// ==========================================
// MEDICINE DATABASE + AUTOCOMPLETE
// ==========================================
const FREQUENCY_SUGGESTIONS = ['1-0-1', '1-1-1', '1-0-0', '0-1-0', '0-0-1', '1-1-0', '0-1-1', '1-1-1-1', '½-0-½', '½-0-0', 'SOS', 'STAT', 'Once weekly'];

// Display name of an Rx line, e.g. "Tab. Napa 500 mg" (dosage form label + trade name + strength).
const rxName = (rx) => [rx.form, rx.medicine, rx.strength].filter(Boolean).join(' ');

// Dosage-form words that doctors type before the name; ignored while searching.
const FORM_PREFIX = /^(tablets?|tabs?|capsules?|caps?|syrup|syr|syp|injection|inj|suspension|susp|drops?|ointment|oint|cream|gel|suppository|supp)\.?\s+(?=\S)/i;

let medicineDbPromise = null;
const loadMedicineDb = () => {
  if (!medicineDbPromise) {
    medicineDbPromise = import('./data/drugs.json').then(mod => mod.default.map(([brand, form, generic, strength, variants]) => ({
      brand, form, generic, strength, variants,
      b: brand.toLowerCase(), g: generic.toLowerCase(), s: strength.toLowerCase(), f: form.toLowerCase(),
    })));
  }
  return medicineDbPromise;
};

const searchMedicines = (db, rawQuery, limit = 12) => {
  let q = rawQuery.toLowerCase().trim();
  let prev;
  do { prev = q; q = q.replace(FORM_PREFIX, ''); } while (q !== prev);
  if (!q) return [];
  const scored = [];
  for (const m of db) {
    let score = 9;
    if (m.b === q) score = -1;
    else if (m.b.startsWith(q) || (m.b + ' ' + m.s).startsWith(q)) score = 0;
    else if (m.b.includes(' ' + q) || (m.b + ' ' + m.f).startsWith(q)) score = 1;
    else if (m.g.startsWith(q)) score = 2;
    else if (m.b.includes(q)) score = 3;
    else if (m.g.includes(q)) score = 4;
    if (score === 9) continue;
    // Push down 1-3 letter codes (unless the doctor has typed 2+ letters of them).
    if (m.b.length <= 3 && q.length < 2) score += 5;
    scored.push([score, m]);
  }
  // Same brand: oral solids first, then liquids, then everything else, injections/infusions last.
  const formRank = (f) => {
    const x = f.toLowerCase();
    if (/^(inj|inf)/.test(x)) return 3;
    if (/^(tab|cap)/.test(x)) return 0;
    if (/^(syp|susp|drops|ped)/.test(x)) return 1;
    return 2;
  };
  // Within a tier: tablets/capsules first, then brands with more presentations (a rough sign of an established trade name) come first.
  scored.sort((a, c) => a[0] - c[0] || formRank(a[1].form) - formRank(c[1].form) || c[1].variants - a[1].variants || a[1].b.length - c[1].b.length || a[1].b.localeCompare(c[1].b) || a[1].strength.localeCompare(c[1].strength, undefined, { numeric: true }));
  // Show at most a few presentations per brand so one brand cannot fill the whole list;
  // typing the strength or form after the name ("napa 500", "napa syrup") narrows it down.
  const perBrand = {};
  const out = [];
  for (const [, m] of scored) {
    perBrand[m.b] = (perBrand[m.b] || 0) + 1;
    if (perBrand[m.b] > 4) continue;
    out.push(m);
    if (out.length >= limit) break;
  }
  return out;
};

const MedicineInput = ({ item, onPatch }) => {
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const runSearch = (text) => {
    loadMedicineDb().then(db => {
      setResults(searchMedicines(db, text));
      setActive(0);
    });
  };

  const choose = (m) => {
    onPatch(item.id, { medicine: m.brand, strength: m.strength, form: m.form, generic: m.generic });
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); choose(results[active]); }
    else if (e.key === 'Escape') setOpen(false);
  };

  const caption = [item.generic, item.strength].filter(Boolean).join(' · ');

  return (
    <div className="relative col-span-2">
      <div className="flex items-baseline gap-1.5">
      {item.form && <span className="text-sm font-semibold text-[#0CAAFF] shrink-0">{item.form}</span>}
      <input
        value={item.medicine}
        onChange={(e) => {
          // typing again clears the previously chosen product details
          onPatch(item.id, { medicine: e.target.value, strength: '', form: '', generic: '' });
          setOpen(true);
          runSearch(e.target.value);
        }}
        onFocus={() => { if (item.medicine && !item.strength) { setOpen(true); runSearch(item.medicine); } else loadMedicineDb(); }}
        onBlur={() => setOpen(false)}
        onKeyDown={handleKeyDown}
        placeholder="Medicine name (type to search)"
        autoComplete="off"
        className="w-full font-medium bg-transparent border-b border-transparent hover:border-[#F4F6F8] focus:border-[#0CAAFF] outline-none pb-1 text-[#2B324B]"
      />
      </div>
      {caption && <p className="text-[11px] text-[#808493] mt-0.5">{caption}</p>}
      {open && results.length > 0 && (
        <ul className="absolute z-30 left-0 right-0 top-full mt-1 bg-white border border-[#F4F6F8] rounded-xl shadow-xl max-h-64 overflow-y-auto custom-scrollbar py-1">
          {results.map((m, i) => (
            <li
              key={`${m.brand}-${m.form}-${m.strength}-${i}`}
              onMouseDown={(e) => { e.preventDefault(); choose(m); }}
              onMouseEnter={() => setActive(i)}
              className={`px-3 py-1.5 cursor-pointer ${i === active ? 'bg-[#0CAAFF]/10' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold text-[#2B324B]"><span className="text-[#0CAAFF] font-medium">{m.form}</span> {m.brand}</span>
                <span className="text-xs text-[#2B324B]">{m.strength}</span>
              </div>
              {m.generic && <div className="text-[11px] text-[#808493]">{m.generic}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const FrequencyInput = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const typed = (value || '').toLowerCase();
  const options = FREQUENCY_SUGGESTIONS.filter(f => !typed || f.toLowerCase().includes(typed) || FREQUENCY_SUGGESTIONS.some(x => x.toLowerCase() === typed));
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        placeholder="Frequency (e.g. 1-0-1)"
        autoComplete="off"
        className="w-full text-xs text-[#808493] bg-transparent border-b border-transparent hover:border-[#F4F6F8] focus:border-[#0CAAFF] outline-none pb-1"
      />
      {open && options.length > 0 && (
        <div className="absolute z-30 left-0 top-full mt-1 w-64 bg-white border border-[#F4F6F8] rounded-xl shadow-xl p-2 flex flex-wrap gap-1.5">
          {options.map(f => (
            <button key={f} type="button" onMouseDown={(e) => { e.preventDefault(); onChange(f); setOpen(false); }} className="text-xs px-2.5 py-1 rounded-full bg-[#0CAAFF]/10 text-[#0CAAFF] hover:bg-[#0CAAFF]/20 transition-colors">{f}</button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// SEQUENTIAL SECTION COMPONENT
// ==========================================
const SequentialSection = ({ title, sectionKey, items, isActive, isCompleted, onAdd, onChange, onDelete, onComplete, onEdit, onPatch, isRx = false }) => {
  if (isCompleted) {
    const hasContent = sectionHasContent(sectionKey, items);
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 bg-[#28CD85]/10 px-4 py-1.5 rounded-full">
            <Check size={14} className="text-[#28CD85]" strokeWidth={3} />
            <h3 className="text-sm font-semibold text-[#28CD85]">{title}</h3>
            <Lock size={12} className="text-[#28CD85] ml-1" />
          </div>
          <button type="button" onClick={onEdit} className="text-[#0CAAFF] hover:bg-[#0CAAFF]/10 px-2 py-1 rounded-full transition-colors text-xs font-medium flex items-center gap-1">
            <Edit2 size={12} /> Edit
          </button>
        </div>
        <div className="pl-2 space-y-1">
          {!hasContent ? (
            <div className="text-sm text-[#808493] py-1 px-2 bg-[#F4F6F8]/50 rounded italic">N/A</div>
          ) : (
            items.map((item) => {
              if (isRx) {
                const formatted = [rxName(item), item.dosage, item.duration, item.instruction].filter(Boolean).join(' — ');
                if (!formatted) return null;
                return <div key={item.id} className="text-sm text-[#2B324B] py-1 px-2 bg-[#F4F6F8]/50 rounded">℞ {formatted}</div>;
              }
              if (!item.text) return null;
              return <div key={item.id} className="text-sm text-[#2B324B] py-1 px-2 bg-[#F4F6F8]/50 rounded">• {item.text}</div>;
            })
          )}
        </div>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="mb-6 opacity-40">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-2 bg-[#F4F6F8] px-4 py-1.5 rounded-full">
            <Lock size={12} className="text-[#808493]" />
            <h3 className="text-sm font-semibold text-[#808493]">{title}</h3>
          </div>
        </div>
        <div className="pl-2 text-xs text-[#808493] italic">Complete the previous section to unlock.</div>
      </div>
    );
  }

  return (
    <div className="mb-6 border-2 border-[#0CAAFF]/30 rounded-2xl p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[#2B324B] bg-[#0CAAFF]/10 px-4 py-1.5 rounded-full">{title}</h3>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onAdd} className="text-[#0CAAFF] hover:bg-[#0CAAFF]/10 p-1.5 rounded-full transition-colors" title="Add Item">
            <Plus size={18} />
          </button>
          <button type="button" onClick={onComplete} className="bg-[#28CD85] hover:bg-[#20b075] text-white p-1.5 rounded-full transition-colors shadow-md shadow-[#28CD85]/20" title="Mark Complete (empty = N/A)">
            <Check size={18} strokeWidth={3} />
          </button>
        </div>
      </div>
      <div className="space-y-3 pl-2">
        {items.map((item) => {
          if (isRx) {
            return (
              <div key={item.id} className="group flex gap-3 items-start text-sm">
                <span className="text-[#808493] mt-2">•</span>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <MedicineInput item={item} onPatch={onPatch} />
                  <FrequencyInput value={item.dosage} onChange={(v) => onChange(item.id, 'dosage', v)} />
                  <input value={item.duration} onChange={(e) => onChange(item.id, 'duration', e.target.value)} placeholder="Duration" className="text-xs text-[#808493] bg-transparent border-b border-transparent hover:border-[#F4F6F8] focus:border-[#0CAAFF] outline-none pb-1" />
                  <input value={item.instruction} onChange={(e) => onChange(item.id, 'instruction', e.target.value)} placeholder="Instruction" className="col-span-2 text-xs text-[#808493] bg-transparent border-b border-transparent hover:border-[#F4F6F8] focus:border-[#0CAAFF] outline-none pb-1" />
                </div>
                <button type="button" onClick={() => onDelete(item.id)} className="text-[#E0565F] opacity-0 group-hover:opacity-100 p-1 hover:bg-[#E0565F]/10 rounded transition-all mt-1"><Trash2 size={16} /></button>
              </div>
            );
          }
          return (
            <div key={item.id} className="group flex items-start justify-between">
              <div className="flex items-start gap-2 w-full">
                <span className="text-[#808493] mt-1 text-xs">•</span>
                <input type="text" value={item.text} placeholder="Type here..." onChange={(e) => onChange(item.id, 'text', e.target.value)} className="bg-transparent border-b border-transparent hover:border-[#F4F6F8] focus:border-[#0CAAFF] outline-none text-sm text-[#2B324B] w-full pb-1 transition-colors" />
              </div>
              <button type="button" onClick={() => onDelete(item.id)} className="text-[#E0565F] opacity-0 group-hover:opacity-100 p-1 hover:bg-[#E0565F]/10 rounded transition-all ml-2"><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-[#808493] italic mt-3 pl-2">Click the green ✓ to save. If empty, it will be saved as N/A.</p>
    </div>
  );
};

// ==========================================
// ADD PRESCRIPTION MODAL
// ==========================================
const AddPrescriptionModal = ({ isOpen, onClose, onSave, patient }) => {
  const buildDefaults = () => ({
    heightFeet: '', heightInch: '', weight: '', bmi: '0.0', bsa: '0.0',
    onExamination: buildTermRows(onExaminationTerms),
    healthScreening: buildTermRows(healthScreeningTerms),
    systemicExamination: buildTermRows(systemicExaminationTerms),
    investigationResults: buildTermRows(investigationResultsTerms),
    referredBy: '', referredTo: ''
  });
  const [formData, setFormData] = useState(buildDefaults());

  useEffect(() => {
    if (isOpen) setFormData(buildDefaults());
  }, [isOpen]);

  useEffect(() => {
    const { heightFeet, heightInch, weight } = formData;
    if (heightFeet && weight) {
      const ft = parseFloat(heightFeet) || 0;
      const inch = parseFloat(heightInch) || 0;
      const wt = parseFloat(weight) || 0;
      const heightInches = (ft * 12) + inch;
      const heightMeters = heightInches * 0.0254;
      const heightCm = heightInches * 2.54;
      let bmi = heightMeters > 0 ? wt / (heightMeters * heightMeters) : 0;
      let bsa = (heightCm > 0 && wt > 0) ? 0.007184 * Math.pow(heightCm, 0.725) * Math.pow(wt, 0.425) : 0;
      setFormData(prev => ({ ...prev, bmi: bmi > 0 ? bmi.toFixed(2) : '0.0', bsa: bsa > 0 ? bsa.toFixed(2) : '0.0' }));
    } else {
      setFormData(prev => ({ ...prev, bmi: '0.0', bsa: '0.0' }));
    }
  }, [formData.heightFeet, formData.heightInch, formData.weight]);

  if (!isOpen) return null;

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleAddTermRow = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], { id: Date.now() + Math.random(), term: '', value: '' }] }));
  const handleChangeTermRow = (field, id, key, value) => setFormData(prev => ({ ...prev, [field]: prev[field].map(item => item.id === id ? { ...item, [key]: value } : item) }));
  const handleDeleteTermRow = (field, id) => setFormData(prev => ({ ...prev, [field]: prev[field].filter(item => item.id !== id) }));

  return (
    <div className="fixed inset-0 bg-[#2B324B]/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F6F8]">
          <div className="flex items-center gap-3">
            <Activity className="text-[#0CAAFF]" size={20} />
            <div>
              <h2 className="text-lg font-bold text-[#2B324B]">Add Prescription</h2>
              <p className="text-xs text-[#808493]">{patient?.name} • {patient?.serial} • {calculateAge(patient?.dob)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 bg-[#E0565F]/10 text-[#E0565F] rounded-full hover:bg-[#E0565F]/20 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F4F6F8]/50">
          <div className="bg-white p-6 rounded-2xl border border-[#F4F6F8] mb-6 shadow-sm">
            <h3 className="text-sm font-bold text-[#2B324B] mb-4 flex items-center gap-2"><Activity size={16} className="text-[#0CAAFF]" /> Clinical Examination</h3>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Height</label>
                <div className="flex border border-[#F4F6F8] rounded-xl overflow-hidden bg-white">
                  <input type="text" placeholder="feet" value={formData.heightFeet} onChange={(e) => handleChange('heightFeet', e.target.value)} className="w-1/2 px-3 py-2 outline-none border-r border-[#F4F6F8] text-sm text-[#2B324B]" />
                  <input type="text" placeholder="inch" value={formData.heightInch} onChange={(e) => handleChange('heightInch', e.target.value)} className="w-1/2 px-3 py-2 outline-none text-sm text-[#2B324B]" />
                  <button type="button" className="px-2 border-l border-[#F4F6F8] bg-[#F4F6F8] text-[#808493] text-xs flex items-center">ft/in <ChevronDown size={12} /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Weight</label>
                <div className="flex border border-[#F4F6F8] rounded-xl overflow-hidden bg-white">
                  <input type="text" placeholder="weight" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} className="w-full px-3 py-2 outline-none text-sm text-[#2B324B]" />
                  <button type="button" className="px-3 border-l border-[#F4F6F8] bg-[#F4F6F8] text-[#808493] text-xs flex items-center">kg <ChevronDown size={12} /></button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">BMI</label>
                <input type="text" placeholder="0.0" value={formData.bmi} readOnly className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 outline-none bg-[#F4F6F8] text-[#808493] cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1 text-nowrap">BSA <span className="text-[10px] text-[#808493] font-normal">(Auto)</span></label>
                <input type="text" placeholder="0.0" value={formData.bsa} readOnly className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 outline-none bg-[#F4F6F8] text-[#808493] cursor-not-allowed" />
              </div>
            </div>

            <TermValueTable
              title="On Examination"
              items={formData.onExamination}
              onChange={(id, key, value) => handleChangeTermRow('onExamination', id, key, value)}
              onDelete={(id) => handleDeleteTermRow('onExamination', id)}
              onAddCustom={() => handleAddTermRow('onExamination')}
            />

            <TermValueTable
              title="Health Screening"
              items={formData.healthScreening}
              onChange={(id, key, value) => handleChangeTermRow('healthScreening', id, key, value)}
              onDelete={(id) => handleDeleteTermRow('healthScreening', id)}
              onAddCustom={() => handleAddTermRow('healthScreening')}
            />

            <TermValueTable
              title="Systemic Examination"
              items={formData.systemicExamination}
              onChange={(id, key, value) => handleChangeTermRow('systemicExamination', id, key, value)}
              onDelete={(id) => handleDeleteTermRow('systemicExamination', id)}
              onAddCustom={() => handleAddTermRow('systemicExamination')}
            />

            <TermValueTable
              title="Investigation Results"
              items={formData.investigationResults}
              onChange={(id, key, value) => handleChangeTermRow('investigationResults', id, key, value)}
              onDelete={(id) => handleDeleteTermRow('investigationResults', id)}
              onAddCustom={() => handleAddTermRow('investigationResults')}
              allowFiles
            />

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Referred By</label>
                <div className="relative">
                  <input type="text" placeholder="Search/Add" value={formData.referredBy} onChange={(e) => handleChange('referredBy', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 outline-none bg-white text-sm text-[#2B324B] focus:border-[#0CAAFF]" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808493]" size={16} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Referred To</label>
                <div className="relative">
                  <input type="text" placeholder="Search/Add" value={formData.referredTo} onChange={(e) => handleChange('referredTo', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 outline-none bg-white text-sm text-[#2B324B] focus:border-[#0CAAFF]" />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808493]" size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#F4F6F8] bg-white">
          <button type="button" onClick={() => { onSave(formData); onClose(); }} className="w-full bg-[#0CAAFF] hover:bg-[#4264D0] text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#0CAAFF]/20">
            <Plus size={20} /> Continue to Prescription
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// EDIT PATIENT MODAL
// ==========================================
const EditPatientModal = ({ isOpen, onClose, onSave, initialData }) => {
  const defaultData = { name: '', dob: '', gender: 'Male', address: '', contact: '', serial: '', bloodGroup: 'A+', tags: [], tagColors: {} };
  const [formData, setFormData] = useState(defaultData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) setFormData(sanitizePatientForModal(initialData));
      else setFormData({ ...defaultData, serial: generateSerialNumber() });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="fixed inset-0 bg-[#2B324B]/40 backdrop-blur-sm flex items-center justify-center z-[80] p-4">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F6F8]">
          <div className="flex items-center gap-2">
            <UserPlus className="text-[#0CAAFF]" size={20} />
            <h2 className="text-lg font-bold text-[#2B324B]">{initialData ? 'Edit Patient Information' : 'Add New Patient'}</h2>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 bg-[#E0565F]/10 text-[#E0565F] rounded-full hover:bg-[#E0565F]/20 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#F4F6F8]/50">
          <div className="bg-white p-6 rounded-2xl border border-[#F4F6F8] shadow-sm">
            <h3 className="text-sm font-bold text-[#2B324B] mb-4 flex items-center gap-2"><UserCheck size={16} className="text-[#0CAAFF]" /> Personal Information</h3>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Name</label>
                <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 text-[#2B324B] focus:ring-2 focus:ring-[#0CAAFF]/20 focus:border-[#0CAAFF] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Date of Birth</label>
                <input type="date" value={formData.dob} onChange={(e) => handleChange('dob', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 text-[#2B324B] focus:ring-2 focus:ring-[#0CAAFF]/20 focus:border-[#0CAAFF] outline-none" />
                <p className="text-xs text-[#808493] mt-1">{formData.dob ? `Age: ${calculateAge(formData.dob)}` : 'Age will be auto-calculated'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Gender</label>
                <div className="flex bg-white rounded-xl border border-[#F4F6F8] overflow-hidden">
                  {['Male', 'Female', 'Others'].map(g => (
                    <button type="button" key={g} onClick={() => handleChange('gender', g)} className={`flex-1 py-2 text-sm transition-colors ${formData.gender === g ? 'bg-[#0CAAFF] text-white' : 'text-[#808493] hover:bg-[#F4F6F8]'}`}>{g}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Address</label>
                <input type="text" placeholder="Full address" value={formData.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 text-[#2B324B] focus:ring-2 focus:ring-[#0CAAFF]/20 focus:border-[#0CAAFF] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Contact</label>
                <input type="text" placeholder="+88 123 456 789 11" value={formData.contact} onChange={(e) => handleChange('contact', e.target.value)} className="w-full border border-[#F4F6F8] rounded-xl px-4 py-2 text-[#2B324B] focus:ring-2 focus:ring-[#0CAAFF]/20 focus:border-[#0CAAFF] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Serial Number</label>
                <div className="flex border border-[#F4F6F8] rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#0CAAFF]/20 focus-within:border-[#0CAAFF] bg-white">
                  <input type="text" value={formData.serial} onChange={(e) => handleChange('serial', e.target.value)} className="flex-1 px-4 py-2 outline-none text-[#808493] bg-[#F4F6F8] cursor-not-allowed" readOnly />
                  <button type="button" onClick={() => handleChange('serial', generateSerialNumber())} className="px-3 border-l border-[#F4F6F8] bg-[#F4F6F8] text-[#808493] text-sm flex items-center gap-1 hover:bg-gray-200 transition-colors">Auto <RotateCcw size={12} /></button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#2B324B] mb-1">Blood Group</label>
                <div className="flex flex-wrap gap-2">
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((bg) => (
                    <button type="button" key={bg} onClick={() => handleChange('bloodGroup', bg)} className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${formData.bloodGroup === bg ? 'bg-[#0CAAFF] text-white border-[#0CAAFF]' : 'bg-white text-[#808493] border-[#F4F6F8] hover:border-[#0CAAFF]/50'}`}>{bg}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tags section inside Edit Modal */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#2B324B] mb-2">Medical Tags</label>
              <TagEditor tags={formData.tags || []} colors={formData.tagColors || {}} onChange={(newTags, newColors) => setFormData(prev => ({ ...prev, tags: newTags, tagColors: newColors || prev.tagColors }))} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#F4F6F8] bg-white">
          <button type="button" onClick={() => { onSave(formData); onClose(); }} className="w-full bg-[#0CAAFF] hover:bg-[#4264D0] text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#0CAAFF]/20">
            <Plus size={20} /> {initialData ? 'Update Patient Information' : 'Save Patient Information'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// PRESCRIPTION PRINT PREVIEW
// ==========================================
const PrescriptionPreviewModal = ({ isOpen, onClose, onSave, patient, chiefComplaints, diagnosis, generalExaminations, investigations, ancPncNotes, rxList, adviceList, followUps, mode = 'new' }) => {
  if (!isOpen) return null;
  const filterValid = (items) => (items || []).filter(item => {
    if (typeof item === 'string') return item.trim();
    return Object.values(item || {}).some(value => typeof value === 'string' && value.trim());
  });
  const validComplaints = filterValid(chiefComplaints);
  const validDiagnosis = filterValid(diagnosis);
  const validExaminations = filterValid(generalExaminations);
  const validInvestigations = filterValid(investigations);
  const validAncPnc = filterValid(ancPncNotes);
  const validRx = (rxList || []).filter(rx => rx.medicine && rx.medicine.trim());
  const validAdvice = filterValid(adviceList);
  const validFollowUps = filterValid(followUps);
  const formatRx = (rx) => [rxName(rx), rx.dosage, rx.duration, rx.instruction].filter(Boolean).join('  —  ');

  const filterTermRows = (rows) => (rows || []).filter(r => (r.term && r.term.trim()) || (r.value && r.value.trim()));
  const validOnExam = filterTermRows(patient?.onExamination);
  const validHealthScreening = filterTermRows(patient?.healthScreening);
  const validSystemicExam = filterTermRows(patient?.systemicExamination);
  const validInvResults = filterTermRows(patient?.investigationResults);

  const renderTermRow = (hs) => <TermChip key={hs.id} row={hs} />;

  return (
    <div className="fixed inset-0 bg-[#2B324B]/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-[#F4F6F8] rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-[#E8EBF0] shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#2B324B]">{mode === 'view' ? 'Previous Prescription' : 'Prescription Print Preview'}</h2>
            <p className="text-xs text-[#808493]">Preview of the prescription as a printed copy.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-[#E0565F]/10 text-[#E0565F] rounded-full hover:bg-[#E0565F]/20 transition-colors"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          <div id="print-area" className="print-prescription bg-white mx-auto w-full max-w-[794px] min-h-[1123px] shadow-md border border-[#E2E5EA] px-10 py-8 text-[#2B324B]">
            <div className="text-center border-b-2 border-[#2B324B] pb-3 mb-4">
              <h1 className="text-3xl font-bold text-[#2B324B]">Dr. Tanim Moontasir</h1>
              <p className="text-sm text-[#2B324B] mt-1">MBBS, FCPS (Medicine), MD (Pulmonology)</p>
              <p className="text-xs text-[#4264D0] font-semibold mt-1">Consultant - Internal Medicine & Pulmonology</p>
              <p className="text-xs text-[#808493] mt-1">Ibn Sina Hospital, Dhanmondi, Dhaka | Chamber: 5 PM - 9 PM (Closed Friday)</p>
              <p className="text-xs text-[#808493]">Mobile: +880 1711-000000 | BMDC Reg No: A-12345</p>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2 text-sm border-b border-[#DDE1E7] pb-3 mb-4">
              <p><span className="font-semibold">Name:</span> {patient?.name || '—'}</p>
              <p><span className="font-semibold">Age:</span> {patient?.dob ? calculateAge(patient.dob) : '—'}</p>
              <p><span className="font-semibold">Gender:</span> {patient?.gender || '—'}</p>
              <p><span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-GB')}</p>
              <p><span className="font-semibold">Serial:</span> {patient?.serial || '—'}</p>
            </div>

            {validOnExam.length > 0 && (
              <div className="mb-3 pb-2 border-b border-dashed border-[#DDE1E7]">
                <h3 className="font-bold text-sm mb-1">On Examination:</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">{validOnExam.map(renderTermRow)}</div>
              </div>
            )}

            {validHealthScreening.length > 0 && (
              <div className="mb-3 pb-2 border-b border-dashed border-[#DDE1E7]">
                <h3 className="font-bold text-sm mb-1">Health Screening:</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">{validHealthScreening.map(renderTermRow)}</div>
              </div>
            )}

            {validSystemicExam.length > 0 && (
              <div className="mb-3 pb-2 border-b border-dashed border-[#DDE1E7]">
                <h3 className="font-bold text-sm mb-1">Systemic Examination:</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">{validSystemicExam.map(renderTermRow)}</div>
              </div>
            )}

            {validInvResults.length > 0 && (
              <div className="mb-4 pb-3 border-b border-dashed border-[#DDE1E7]">
                <h3 className="font-bold text-sm mb-1">Investigation Results:</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">{validInvResults.map(renderTermRow)}</div>
              </div>
            )}

            <div className="flex gap-6 min-h-[580px]">
              <div className="w-1/3 space-y-4 pr-4 border-r border-dashed border-[#DDE1E7]">
                <section>
                  <h3 className="font-bold text-base mb-1">C/C:</h3>
                  {validComplaints.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">{validComplaints.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-1">O/E:</h3>
                  {validExaminations.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">{validExaminations.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-1">Diagnosis:</h3>
                  {validDiagnosis.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">{validDiagnosis.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-1">Investigation:</h3>
                  {validInvestigations.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">{validInvestigations.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-1">ANC/PNC Notes:</h3>
                  {validAncPnc.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-1 text-sm">{validAncPnc.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
              </div>

              <div className="w-2/3 space-y-6">
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl font-serif font-bold text-[#2B324B]">℞</span>
                    <h3 className="font-bold text-base">Medications</h3>
                  </div>
                  {validRx.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ol className="space-y-3 text-sm">
                      {validRx.map((rx, index) => (
                        <li key={rx.id} className="flex gap-3"><span className="font-semibold w-5">{index + 1}.</span><span className="flex-1">{formatRx(rx)}</span></li>
                      ))}
                    </ol>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-2 border-b border-[#DDE1E7] pb-1">Advice:</h3>
                  {validAdvice.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-2 text-sm">{validAdvice.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
                <section>
                  <h3 className="font-bold text-base mb-2 border-b border-[#DDE1E7] pb-1">Follow-up:</h3>
                  {validFollowUps.length === 0 ? <span className="text-[#808493] text-sm italic">N/A</span> : (
                    <ul className="list-disc pl-5 space-y-2 text-sm">{validFollowUps.map((item, i) => <li key={item.id || i}>{item.text}</li>)}</ul>
                  )}
                </section>
              </div>
            </div>

            <div className="mt-12 pt-4 border-t border-[#DDE1E7] flex justify-end">
              <div className="text-center min-w-[200px]"><div className="border-t border-[#2B324B] pt-1 text-xs">Doctor's Signature</div></div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 bg-white border-t border-[#E8EBF0] flex justify-end gap-3 shrink-0">
          <button type="button" onClick={onClose} className="px-6 py-2.5 bg-[#F4F6F8] text-[#2B324B] rounded-full font-medium hover:bg-[#E8EBF0] transition-colors">Close</button>
          {mode === 'new' && (
            <button type="button" onClick={() => { onSave(); }} className="px-6 py-2.5 bg-[#0CAAFF] text-white rounded-full font-medium hover:bg-[#4264D0] transition-colors flex items-center gap-2"><Save size={16} /> Save & Print</button>
          )}
          <button type="button" onClick={() => window.print()} className="px-6 py-2.5 bg-[#4264D0] text-white rounded-full font-medium hover:bg-[#3251B5] transition-colors flex items-center gap-2"><Printer size={16} /> Print</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// VISIT SUMMARY MODAL
// ==========================================
const VisitSummaryModal = ({ isOpen, onClose, visit, patient }) => {
  if (!isOpen || !visit) return null;
  const filterValid = (items) => (items || []).filter(item => {
    if (typeof item === 'string') return item.trim();
    return Object.values(item || {}).some(value => typeof value === 'string' && value.trim());
  });
  const validComplaints = filterValid(visit.chiefComplaints);
  const validDiagnosis = filterValid(visit.diagnosis);
  const validExaminations = filterValid(visit.generalExaminations);
  const validInvestigations = filterValid(visit.investigations);
  const validAncPnc = filterValid(visit.ancPncNotes);
  const validRx = (visit.rxList || []).filter(rx => rx.medicine && rx.medicine.trim());
  const validAdvice = filterValid(visit.adviceList);
  const validFollowUps = filterValid(visit.followUps);

  const filterTermRows = (rows) => (rows || []).filter(r => (r.term && r.term.trim()) || (r.value && r.value.trim()));
  const validOnExam = filterTermRows(visit.onExamination);
  const validHealthScreening = filterTermRows(visit.healthScreening);
  const validSystemicExam = filterTermRows(visit.systemicExamination);
  const validInvResults = filterTermRows(visit.investigationResults);

  const renderTermRow = (hs) => <TermChip key={hs.id} row={hs} />;

  return (
    <div className="fixed inset-0 bg-[#2B324B]/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F6F8] bg-[#F4F6F8]/50">
          <div>
            <h2 className="text-lg font-bold text-[#2B324B]">Visit Summary</h2>
            <p className="text-xs text-[#808493]">{visit.date}</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-[#E0565F]/10 text-[#E0565F] rounded-full hover:bg-[#E0565F]/20 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar bg-white flex-1">
          <div className="mb-6 p-4 bg-[#0CAAFF]/5 rounded-2xl border border-[#0CAAFF]/10">
            <p className="text-xs text-[#808493] mb-1">Patient</p>
            <h3 className="text-lg font-bold text-[#2B324B]">{patient?.name}</h3>
            <p className="text-xs text-[#808493] mt-1">ID: {patient?.serial} • Age: {calculateAge(patient?.dob)} • Gender: {patient?.gender}</p>
          </div>

          {validOnExam.length > 0 && (
            <div className="bg-[#F4F6F8] p-4 rounded-2xl mb-3">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">On Examination</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2B324B]">{validOnExam.map(renderTermRow)}</div>
            </div>
          )}

          {validHealthScreening.length > 0 && (
            <div className="bg-[#F4F6F8] p-4 rounded-2xl mb-3">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Health Screening</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2B324B]">{validHealthScreening.map(renderTermRow)}</div>
            </div>
          )}

          {validSystemicExam.length > 0 && (
            <div className="bg-[#F4F6F8] p-4 rounded-2xl mb-3">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Systemic Examination</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2B324B]">{validSystemicExam.map(renderTermRow)}</div>
            </div>
          )}

          {validInvResults.length > 0 && (
            <div className="bg-[#F4F6F8] p-4 rounded-2xl mb-3">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Investigation Results</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2B324B]">{validInvResults.map(renderTermRow)}</div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Chief Complaint</h4>
              {validComplaints.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validComplaints.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">On Examination (O/E)</h4>
              {validExaminations.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validExaminations.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Diagnosis</h4>
              {validDiagnosis.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validDiagnosis.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Investigation</h4>
              {validInvestigations.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validInvestigations.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl md:col-span-2">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">ANC/PNC Notes</h4>
              {validAncPnc.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validAncPnc.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl md:col-span-2">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Medications (Rx)</h4>
              {validRx.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-2 text-sm text-[#2B324B]">
                  {validRx.map((rx, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-semibold">{i + 1}.</span>
                      <span>{[rxName(rx), rx.dosage, rx.duration, rx.instruction].filter(Boolean).join(' — ')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Advice</h4>
              {validAdvice.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validAdvice.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
            <div className="bg-[#F4F6F8] p-4 rounded-2xl">
              <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">Follow-up</h4>
              {validFollowUps.length === 0 ? <p className="text-sm text-[#808493] italic">N/A</p> : (
                <ul className="space-y-1 text-sm text-[#2B324B]">{validFollowUps.map((item, i) => <li key={i}>• {item.text}</li>)}</ul>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[#F4F6F8] bg-white text-right shrink-0">
          <button type="button" onClick={onClose} className="px-8 py-2.5 bg-[#0CAAFF] text-white rounded-full font-medium hover:bg-[#4264D0] transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CLINICAL EXAMINATION SUMMARY MODAL
// ==========================================
const getBmiCategory = (bmi, patient) => {
  const value = parseFloat(bmi);
  const age = parseInt(calculateAge(patient?.dob), 10);
  // Adult WHO cut-offs only; paediatric BMI needs age/sex percentiles, so no label is shown.
  if (!value || isNaN(age) || age < 18) return null;
  if (value < 18.5) return 'Underweight';
  if (value < 25) return 'Normal';
  if (value < 30) return 'Overweight';
  return 'Obese';
};

const SummaryStat = ({ label, value, sub }) => (
  <div className="bg-[#F4F6F8] rounded-2xl px-4 py-3">
    <p className="text-[10px] uppercase tracking-wider text-[#808493] font-semibold">{label}</p>
    <p className="text-base font-bold text-[#2B324B]">{value}</p>
    {sub && <p className="text-[10px] text-[#808493]">{sub}</p>}
  </div>
);
const ClinicalExamSummaryModal = ({ isOpen, onClose, patient }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !patient) return null;

  const filledRows = (rows) => (rows || []).filter(r => r.term && r.term.trim() && ((r.value && String(r.value).trim()) || r.file));
  const groups = [
    { title: 'On Examination', rows: filledRows(patient.onExamination) },
    { title: 'Health Screening', rows: filledRows(patient.healthScreening) },
    { title: 'Systemic Examination', rows: filledRows(patient.systemicExamination) },
    { title: 'Investigation Results', rows: filledRows(patient.investigationResults) },
  ];

  const hasHeight = patient.heightFeet || patient.heightInch;
  const bmiValid = parseFloat(patient.bmi) > 0;
  const bsaValid = parseFloat(patient.bsa) > 0;
  const bmiCategory = bmiValid ? getBmiCategory(patient.bmi, patient) : null;
  const hasAnything = hasHeight || patient.weight || groups.some(g => g.rows.length) || patient.referredBy || patient.referredTo;

  return (
    <div className="fixed inset-0 bg-[#2B324B]/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F4F6F8] bg-[#F4F6F8]/50">
          <div className="flex items-center gap-3">
            <Activity className="text-[#0CAAFF]" size={20} />
            <div>
              <h2 className="text-lg font-bold text-[#2B324B]">Clinical Examination Summary</h2>
              <p className="text-xs text-[#808493]">{patient.name} • {patient.serial} • {calculateAge(patient.dob)}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 bg-[#E0565F]/10 text-[#E0565F] rounded-full hover:bg-[#E0565F]/20 transition-colors"><X size={18} /></button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {!hasAnything ? (
            <p className="text-sm text-[#808493] italic text-center py-6">No clinical examination data was entered for this visit.</p>
          ) : (
            <>
              {(hasHeight || patient.weight || bmiValid || bsaValid) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <SummaryStat label="Height" value={hasHeight ? `${patient.heightFeet || 0}′ ${patient.heightInch || 0}″` : '—'} />
                  <SummaryStat label="Weight" value={patient.weight ? `${patient.weight} kg` : '—'} />
                  <SummaryStat label="BMI" value={bmiValid ? patient.bmi : '—'} sub={bmiCategory} />
                  <SummaryStat label="BSA" value={bsaValid ? `${patient.bsa} m²` : '—'} />
                </div>
              )}

              {groups.filter(g => g.rows.length > 0).map(g => (
                <div key={g.title} className="bg-[#F4F6F8] p-4 rounded-2xl">
                  <h4 className="text-xs font-bold text-[#0CAAFF] uppercase tracking-wider mb-2">{g.title}</h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#2B324B]">
                    {g.rows.map(r => <TermChip key={r.id} row={r} />)}
                  </div>
                </div>
              ))}

              {(patient.referredBy || patient.referredTo) && (
                <div className="grid grid-cols-2 gap-3">
                  <SummaryStat label="Referred By" value={patient.referredBy || '—'} />
                  <SummaryStat label="Referred To" value={patient.referredTo || '—'} />
                </div>
              )}
              {bmiCategory && <p className="text-[10px] text-[#808493]">BMI category uses standard adult WHO cut-offs (&lt;18.5, 18.5–24.9, 25–29.9, ≥30); some South Asian guidelines use lower thresholds.</p>}
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#F4F6F8] bg-white text-right shrink-0">
          <button type="button" onClick={onClose} className="px-8 py-2 bg-[#0CAAFF] text-white rounded-full font-medium hover:bg-[#4264D0] transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SIDEBAR
// ==========================================
const Sidebar = ({ onNavigateHome }) => (
  <div className="w-20 bg-white rounded-3xl flex flex-col items-center py-6 shadow-sm border border-[#F4F6F8] shrink-0 h-full">
    <div className="mb-8">
      <div className="w-10 h-10 bg-[#0CAAFF] text-white rounded-lg flex items-center justify-center font-bold text-xl">dr+</div>
    </div>
    <div className="flex-1 flex flex-col gap-6">
      {[Home, Calendar, FileText, User].map((Icon, idx) => (
        <button type="button" key={idx} onClick={idx === 2 ? onNavigateHome : undefined} className={`p-3 rounded-2xl transition-all duration-200 ${idx === 2 ? 'bg-[#0CAAFF] text-white shadow-md' : 'text-[#808493] hover:text-[#0CAAFF] hover:bg-[#0CAAFF]/10'}`}>
          <Icon size={20} />
        </button>
      ))}
    </div>
    <div className="flex flex-col gap-6 mt-auto">
      <button type="button" className="p-3 text-[#808493] hover:text-[#0CAAFF]"><Settings size={20} /></button>
      <button type="button" className="p-3 text-[#808493] hover:text-[#E0565F]"><LogOut size={20} /></button>
    </div>
  </div>
);

// ==========================================
// TOP NAVBAR
// ==========================================
const TopNav = () => (
  <header className="flex items-center justify-between bg-white rounded-3xl px-6 py-4 shadow-sm border border-[#F4F6F8] shrink-0">
    <div className="flex-1 max-w-xl relative">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#808493]" size={18} />
      <input type="text" placeholder="Search for appointment, patient, medicine etc..." className="w-full bg-[#F4F6F8] border border-transparent rounded-full py-2.5 pl-12 pr-4 text-sm text-[#2B324B] focus:border-[#0CAAFF] focus:bg-white outline-none transition-colors" />
    </div>
    <div className="flex items-center gap-6 ml-6">
      <button type="button" className="relative p-2 text-[#808493] hover:text-[#0CAAFF]"><Bell size={20} /></button>
      <div className="flex items-center gap-3 border-l pl-6 border-[#F4F6F8]">
        <img src="https://i.pravatar.cc/150?img=68" alt="Doctor" className="w-10 h-10 rounded-full object-cover" />
        <div className="hidden md:block">
          <h4 className="text-sm font-semibold text-[#2B324B]">Dr. Russell Micheal</h4>
          <p className="text-xs text-[#808493]">micheal.dr@gmail.com</p>
        </div>
      </div>
    </div>
  </header>
);

// ==========================================
// DASHBOARD
// ==========================================
const DashboardPage = ({ onAddNew, onFindPatient }) => (
  <div className="flex-1 flex items-center justify-center gap-12">
    <div className="flex flex-col rounded-3xl overflow-hidden shadow-sm border border-[#F4F6F8] w-80 bg-white">
      <div className="bg-[#0CAAFF]/10 h-48 relative flex items-center justify-center">
        <div className="relative">
          <FolderHeart size={80} className="text-[#0CAAFF] opacity-20 absolute -top-4 -left-6" />
          <FileText size={100} className="text-[#0CAAFF] relative z-10" />
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-[#2B324B] mb-2">Add New Patient</h3>
        <p className="text-xs text-[#808493] mb-6">Create a new patient profile and start a prescription.</p>
        <button type="button" onClick={onAddNew} className="bg-[#0CAAFF] hover:bg-[#4264D0] text-white px-8 py-2.5 rounded-full font-medium text-sm transition-colors shadow-md shadow-[#0CAAFF]/20">Add Patient</button>
      </div>
    </div>
    <div className="flex flex-col rounded-3xl overflow-hidden shadow-sm border border-[#F4F6F8] w-80 bg-white">
      <div className="bg-[#0CAAFF]/10 h-48 relative flex items-center justify-center">
        <div className="relative">
          <FileText size={80} className="text-[#0CAAFF]/40 absolute -top-4 -left-10 rotate-12" />
          <FileText size={80} className="text-[#0CAAFF]/40 absolute -bottom-4 -right-10 -rotate-12" />
          <SearchIcon size={100} className="text-[#0CAAFF] relative z-10" />
        </div>
      </div>
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-[#2B324B] mb-2">Find Patient</h3>
        <p className="text-xs text-[#808493] mb-6">Search existing records by name, serial number, or contact.</p>
        <button type="button" onClick={onFindPatient} className="bg-[#0CAAFF] hover:bg-[#4264D0] text-white px-8 py-2.5 rounded-full font-medium text-sm transition-colors shadow-md shadow-[#0CAAFF]/20">Find Patient</button>
      </div>
    </div>
  </div>
);

// ==========================================
// PATIENT LIST & INFO PAGE
// ==========================================
const PatientListPage = ({ patients, selectedPatient, onSelectPatient, onAddNew, onDelete, onEdit, onAddPrescription, onUpdateTags, onViewVisitPrescription, onViewVisitSummary }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.serial.includes(searchTerm)
  );

  return (
    <div className="flex flex-1 gap-4 overflow-hidden h-full">
      <div className="w-1/3 bg-white rounded-3xl shadow-sm border border-[#F4F6F8] flex flex-col overflow-hidden">
        <div className="p-5 border-b border-[#F4F6F8] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#0CAAFF]">Patient List</h2>
            <div className="flex gap-2">
              <button type="button" onClick={onAddNew} className="w-8 h-8 rounded-full bg-[#0CAAFF]/10 text-[#0CAAFF] flex items-center justify-center hover:bg-[#0CAAFF]/20 transition-colors"><Plus size={16} /></button>
              <button type="button" className="w-8 h-8 rounded-full bg-[#0CAAFF]/10 text-[#0CAAFF] flex items-center justify-center hover:bg-[#0CAAFF]/20 transition-colors"><RotateCcw size={16} /></button>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input type="text" placeholder="Search for patient" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#F4F6F8] rounded-xl pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0CAAFF]/20" />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-[#808493]" size={16} />
            </div>
            <button type="button" className="w-10 h-10 rounded-xl bg-[#F4F6F8] flex items-center justify-center text-[#808493] hover:bg-gray-200 transition-colors"><Settings size={18} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredPatients.map((patient) => {
            const isSelected = selectedPatient?.id === patient.id;
            return (
              <div key={patient.id} onClick={() => onSelectPatient(patient)} className={`p-4 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-[#0CAAFF] text-white border-[#0CAAFF] shadow-md shadow-[#0CAAFF]/20' : 'bg-white hover:bg-[#F4F6F8] border-transparent'}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-semibold ${isSelected ? 'text-white' : 'text-[#2B324B]'}`}>Name: {patient.name}</h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-[#808493] text-white'}`}>Visits: {patient.visits || 0}</span>
                </div>
                <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#808493]'}`}>ID: {patient.serial}</p>
                <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-[#808493]'}`}>Age: {calculateAge(patient.dob)}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-[#F4F6F8] flex flex-col overflow-hidden">
        {selectedPatient ? (
          <>
            <div className="p-6 pb-0 shrink-0">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-5">
                  <img src={`https://i.pravatar.cc/150?u=${selectedPatient.id}`} alt="Patient" className="w-20 h-20 rounded-full object-cover" />
                  <div>
                    <h2 className="text-xl font-bold text-[#2B324B] mb-1">{selectedPatient.name}</h2>
                    <p className="text-sm text-[#808493] mb-0.5">ID: {selectedPatient.serial}</p>
                    <p className="text-sm text-[#808493]">Gender: {selectedPatient.gender} • Age: {calculateAge(selectedPatient.dob)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => onAddPrescription(selectedPatient)} className="bg-[#0CAAFF] text-white px-5 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-[#4264D0] transition-colors shadow-md shadow-[#0CAAFF]/20">
                    <Plus size={16} /> Add Prescription
                  </button>
                  <button type="button" onClick={() => onEdit(selectedPatient)} className="w-10 h-10 rounded-full bg-[#0CAAFF]/10 text-[#0CAAFF] flex items-center justify-center hover:bg-[#0CAAFF]/20 transition-colors" title="Edit Patient Info">
                    <Edit2 size={18} />
                  </button>
                  <button type="button" onClick={() => onDelete(selectedPatient)} className="w-10 h-10 rounded-full bg-[#E0565F]/10 text-[#E0565F] flex items-center justify-center hover:bg-[#E0565F]/20 transition-colors" title="Delete Patient">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Editable Tags */}
              <TagEditor
                tags={selectedPatient.tags || []}
                colors={selectedPatient.tagColors || {}}
                onChange={(newTags, newColors) => onUpdateTags(selectedPatient, newTags, newColors)}
              />
            </div>

            <div className="px-6 shrink-0">
              <div className="flex bg-[#F4F6F8] rounded-xl p-1">
                <button type="button" onClick={() => setActiveTab('info')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'info' ? 'bg-white text-[#0CAAFF] shadow-sm' : 'text-[#808493] hover:text-[#2B324B]'}`}>Patient Information</button>
                <button type="button" onClick={() => setActiveTab('history')} className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'history' ? 'bg-white text-[#0CAAFF] shadow-sm' : 'text-[#808493] hover:text-[#2B324B]'}`}>Visit History ({selectedPatient.visits || 0})</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pt-4">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#2B324B] mb-3">General Information</h3>
                    <div className="border-t border-[#F4F6F8]">
                      {[
                        { label: 'Date Of Birth', value: formatDobForDisplay(selectedPatient.dob) },
                        { label: 'Age', value: calculateAge(selectedPatient.dob) },
                        { label: 'Gender', value: selectedPatient.gender },
                        { label: 'Address', value: selectedPatient.address },
                        { label: 'Contact', value: selectedPatient.contact },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-[#F4F6F8] text-sm">
                          <span className="text-[#808493]">{row.label}</span>
                          <span className="text-[#2B324B] font-medium text-right">{row.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#2B324B] mb-3">Medical Information</h3>
                    <div className="border-t border-[#F4F6F8]">
                      {[
                        { label: 'Blood Group', value: selectedPatient.bloodGroup },
                        { label: 'Allergies', value: 'None reported' },
                        { label: 'Chronic Conditions', value: selectedPatient.tags?.filter(t => t.toLowerCase().includes('diabetic') || t.toLowerCase().includes('pressure')).join(', ') || 'None' },
                      ].map((row, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-[#F4F6F8] text-sm">
                          <span className="text-[#808493]">{row.label}</span>
                          <span className="text-[#2B324B] font-medium text-right">{row.value || '—'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6">
                  {(!selectedPatient.visitHistory || selectedPatient.visitHistory.length === 0) ? (
                    <div className="text-center py-10 text-[#808493]">
                      <ClipboardList size={48} className="mx-auto mb-3 opacity-20" />
                      <p className="text-sm">No visit history available for this patient.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center mb-4">
                        <div className="w-3 h-3 rounded-full bg-[#808493] border-2 border-white shadow-sm -ml-1.5 mr-3"></div>
                        <div className="bg-[#808493] text-white text-xs font-medium px-4 py-1.5 rounded-lg flex-1">Year: {new Date().getFullYear()}</div>
                      </div>
                      <div className="pl-6 space-y-4">
                        {selectedPatient.visitHistory.map((visit, index) => (
                          <div key={visit.id} className="bg-[#E8F4FF] rounded-2xl p-4 border border-[#0CAAFF]/10">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-bold text-[#2B324B]">Visit: {index + 1}</h4>
                              <div className="flex gap-2">
                                <button type="button" onClick={() => onViewVisitPrescription(visit)} className="bg-white text-[#2B324B] text-xs px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors">View Prescription</button>
                                <button type="button" onClick={() => onViewVisitSummary(visit)} className="bg-white text-[#2B324B] text-xs px-3 py-1.5 rounded-full shadow-sm hover:bg-gray-50 transition-colors">View Summary</button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">Chief Complaint ({visit.chiefComplaints?.length || 0})</span>
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">Diagnosis ({visit.diagnosis?.length || 0})</span>
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">Investigation ({visit.generalExaminations?.length || 0})</span>
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">ANC/PNC ({visit.ancPncNotes?.length || 0})</span>
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">Rx ({visit.rxList?.length || 0})</span>
                              <span className="bg-white border-l-2 border-[#0CAAFF] text-[#2B324B] text-xs px-3 py-1.5 rounded-lg shadow-sm">Advice ({visit.adviceList?.length || 0})</span>
                            </div>
                            <p className="text-xs text-[#808493] text-right mt-2">{visit.date}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
            <User size={64} className="text-[#F4F6F8] mb-4" />
            <h3 className="text-lg font-bold text-[#2B324B] mb-2">No Patient Selected</h3>
            <p className="text-sm text-[#808493] mb-6">Select a patient from the list on the left to view details, or add a new one.</p>
            <button type="button" onClick={onAddNew} className="bg-[#0CAAFF] text-white px-6 py-2.5 rounded-full font-medium flex items-center gap-2 hover:bg-[#4264D0] transition-colors"><Plus size={16} /> Add New Patient</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// MAIN APP
// ==========================================
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddPrescriptionModalOpen, setIsAddPrescriptionModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isVisitPrescriptionOpen, setIsVisitPrescriptionOpen] = useState(false);
  const [isVisitSummaryOpen, setIsVisitSummaryOpen] = useState(false);
  const [isExamSummaryOpen, setIsExamSummaryOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [activePatient, setActivePatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, patient: null });
  const [completedSections, setCompletedSections] = useState([]);
  const [currentVisitId, setCurrentVisitId] = useState(null);

  const [patientsList, setPatientsList] = useState(() => {
    const savedVersion = localStorage.getItem('appDataVersion');
    const saved = localStorage.getItem('patientsList');
    if (savedVersion !== APP_DATA_VERSION || !saved) {
      localStorage.setItem('appDataVersion', APP_DATA_VERSION);
      localStorage.setItem('patientsList', JSON.stringify(INITIAL_PATIENTS));
      return INITIAL_PATIENTS;
    }
    // Demo safety net: stale saved data (e.g. after hot-reload) gets the synthetic visits back.
    return JSON.parse(saved).map(pt => (SAMPLE_VISITS[pt.id] && (!pt.visitHistory || pt.visitHistory.length === 0)) ? { ...pt, visitHistory: SAMPLE_VISITS[pt.id], visits: Math.max(pt.visits || 0, SAMPLE_VISITS[pt.id].length) } : pt);
  });

  useEffect(() => {
    try { localStorage.setItem('patientsList', JSON.stringify(patientsList)); } catch (err) { console.warn('Could not persist patients (storage full?)', err); }
    localStorage.setItem('appDataVersion', APP_DATA_VERSION);
  }, [patientsList]);

  const [chiefComplaints, setChiefComplaints] = useState([{ id: 1, text: '' }]);
  const [diagnosis, setDiagnosis] = useState([{ id: 1, text: '' }]);
  const [generalExaminations, setGeneralExaminations] = useState([{ id: 1, text: '' }]);
  const [investigations, setInvestigations] = useState([{ id: 1, text: '' }]);
  const [ancPncNotes, setAncPncNotes] = useState([{ id: 1, text: '' }]);
  const [rxList, setRxList] = useState([{ id: 1, medicine: '', dosage: '', duration: '', instruction: '' }]);
  const [adviceList, setAdviceList] = useState([{ id: 1, text: '' }]);
  const [followUps, setFollowUps] = useState([{ id: 1, text: '' }]);

  const handleNavigateHome = () => {
    setCurrentPage('dashboard');
    setActivePatient(null);
    setSelectedPatient(null);
  };

  const handleNavigateToPatients = () => {
    setCurrentPage('patients');
    if (patientsList.length > 0) setSelectedPatient(patientsList[0]);
  };

  const handleAddPatient = (formData) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const newPatient = { ...formData, id: Date.now(), lastVisit: formattedDate, visits: 0, visitHistory: [], tags: formData.tags || [], dob: formData.dob || '' };
    setPatientsList(prev => [...prev, newPatient]);
    setSelectedPatient(newPatient);
    setIsAddModalOpen(false);
  };

  const handleEditPatient = (formData) => {
    const existing = patientsList.find(p => p.id === formData.id);
    const updatedPatient = { ...existing, ...formData, visits: existing?.visits || 0, visitHistory: existing?.visitHistory || [], tags: formData.tags || existing?.tags || [], dob: formData.dob || existing?.dob || '' };
    setPatientsList(prev => prev.map(p => p.id === formData.id ? updatedPatient : p));
    setSelectedPatient(updatedPatient);
    setIsEditModalOpen(false);
  };

  const handleDeletePatient = () => {
    if (deleteModal.patient) {
      setPatientsList(prev => prev.filter(p => p.id !== deleteModal.patient.id));
      if (selectedPatient?.id === deleteModal.patient.id) setSelectedPatient(null);
      setDeleteModal({ isOpen: false, patient: null });
    }
  };

  // Update patient's tags in the patients list
  const handleUpdateTags = (patient, newTags, newColors) => {
    const updated = { ...patient, tags: newTags, tagColors: newColors || patient.tagColors || {} };
    setPatientsList(prev => prev.map(p => p.id === patient.id ? updated : p));
    setSelectedPatient(updated);
  };

  const handleOpenAddPrescription = (patient) => {
    setSelectedPatient(patient);
    setIsAddPrescriptionModalOpen(true);
  };

  const handleContinueToWriter = (clinicalData) => {
    const newVisitId = Date.now();
    setCurrentVisitId(newVisitId);
    setCompletedSections([]);
    setActivePatient({ ...selectedPatient, ...clinicalData });
    setChiefComplaints([{ id: 1, text: '' }]);
    setDiagnosis([{ id: 1, text: '' }]);
    setGeneralExaminations([{ id: 1, text: '' }]);
    setInvestigations([{ id: 1, text: '' }]);
    setAncPncNotes([{ id: 1, text: '' }]);
    setRxList([{ id: 1, medicine: '', dosage: '', duration: '', instruction: '' }]);
    setAdviceList([{ id: 1, text: '' }]);
    setFollowUps([{ id: 1, text: '' }]);
    setCurrentPage('prescription');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('patients');
    setActivePatient(null);
    setCompletedSections([]);
    setCurrentVisitId(null);
  };

  const handleAdd = (setter, list, isRx = false) => {
    if (isRx) setter([...list, { id: Date.now(), medicine: '', dosage: '', duration: '', instruction: '' }]);
    else setter([...list, { id: Date.now(), text: '' }]);
  };

  const handleDelete = (setter, list, id) => setter(list.filter(item => item.id !== id));

  const handleChange = (setter, list, id, field, value) => {
    setter(list.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const getSectionData = (key) => {
    switch (key) {
      case 'chiefComplaints': return chiefComplaints;
      case 'diagnosis': return diagnosis;
      case 'investigations': return generalExaminations;
      case 'ancPnc': return ancPncNotes;
      case 'rx': return rxList;
      case 'advice': return adviceList;
      case 'followUps': return followUps;
      default: return [];
    }
  };

  const getSectionSetter = (key) => {
    switch (key) {
      case 'chiefComplaints': return setChiefComplaints;
      case 'diagnosis': return setDiagnosis;
      case 'investigations': return setGeneralExaminations;
      case 'ancPnc': return setAncPncNotes;
      case 'rx': return setRxList;
      case 'advice': return setAdviceList;
      case 'followUps': return setFollowUps;
      default: return null;
    }
  };

  const handleCompleteSection = async (sectionKey) => {
    const rawData = getSectionData(sectionKey);
    const finalData = fillNA(sectionKey, rawData);
    const setter = getSectionSetter(sectionKey);
    if (setter) setter(finalData);
    await saveSectionToBackend(activePatient.id, currentVisitId, sectionKey, finalData);
    setCompletedSections(prev => [...prev, sectionKey]);
  };

  const handleReopenSection = (sectionKey) => {
    const idx = SECTION_ORDER.indexOf(sectionKey);
    const toRemove = SECTION_ORDER.slice(idx);
    setCompletedSections(prev => prev.filter(k => !toRemove.includes(k)));
  };

  const getActiveSection = () => {
    for (const key of SECTION_ORDER) {
      if (!completedSections.includes(key)) return key;
    }
    return null;
  };

  const activeSection = getActiveSection();
  const allComplete = activeSection === null;

  const handleSavePrescription = () => {
    const visitRecord = {
      id: currentVisitId || Date.now(),
      date: new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      chiefComplaints, diagnosis, generalExaminations, investigations, ancPncNotes, rxList, adviceList, followUps,
      heightFeet: activePatient.heightFeet, heightInch: activePatient.heightInch, weight: activePatient.weight,
      bmi: activePatient.bmi, bsa: activePatient.bsa,
      onExamination: activePatient.onExamination,
      healthScreening: activePatient.healthScreening,
      systemicExamination: activePatient.systemicExamination,
      investigationResults: activePatient.investigationResults,
      referredBy: activePatient.referredBy, referredTo: activePatient.referredTo,
    };

    setPatientsList(prev => prev.map(p => {
      if (p.id === activePatient.id) {
        const existingHistory = p.visitHistory || [];
        return { ...p, visits: (p.visits || 0) + 1, lastVisit: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), visitHistory: [...existingHistory, visitRecord] };
      }
      return p;
    }));

    if (selectedPatient && selectedPatient.id === activePatient.id) {
      const existingHistory = selectedPatient.visitHistory || [];
      setSelectedPatient(prev => ({ ...prev, visits: (prev.visits || 0) + 1, visitHistory: [...existingHistory, visitRecord] }));
    }

    const dataToSave = { timestamp: new Date().toISOString(), patient: activePatient, chiefComplaints, diagnosis, generalExaminations, investigations, ancPncNotes, rxList, adviceList, followUps };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prescription_${activePatient?.name.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => window.print(), 500);
    setIsPreviewModalOpen(false);
  };

  const handleViewVisitPrescription = (visit) => { setSelectedVisit(visit); setIsVisitPrescriptionOpen(true); };
  const handleViewVisitSummary = (visit) => { setSelectedVisit(visit); setIsVisitSummaryOpen(true); };

  return (
    <div className="font-gilroy min-h-screen bg-[#F4F6F8] p-4 text-[#2B324B] flex gap-4 overflow-hidden">
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://api.fontshare.com/v2/css?f[]=gilroy@400,500,600,700,800&display=swap');
        .font-gilroy { font-family: 'Gilroy', 'Inter', sans-serif; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #808493; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2B324B; }
        
        @media print {
          body * { visibility: hidden !important; }
          .print-prescription, .print-prescription * { visibility: visible !important; }
          .print-prescription { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; padding: 0 !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
          @page { margin: 1cm; }
        }
      `}} />

      <Sidebar onNavigateHome={handleNavigateToPatients} />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <TopNav />

        <main className="flex-1 overflow-hidden mt-4 pr-2 flex flex-col">
          {currentPage === 'dashboard' && (
            <DashboardPage onAddNew={() => { setIsAddModalOpen(true); setCurrentPage('patients'); }} onFindPatient={handleNavigateToPatients} />
          )}

          {currentPage === 'patients' && (
            <PatientListPage
              patients={patientsList}
              selectedPatient={selectedPatient}
              onSelectPatient={setSelectedPatient}
              onAddNew={() => setIsAddModalOpen(true)}
              onEdit={(patient) => { setSelectedPatient(patient); setIsEditModalOpen(true); }}
              onDelete={(patient) => setDeleteModal({ isOpen: true, patient })}
              onAddPrescription={handleOpenAddPrescription}
              onUpdateTags={handleUpdateTags}
              onViewVisitPrescription={handleViewVisitPrescription}
              onViewVisitSummary={handleViewVisitSummary}
            />
          )}

          {currentPage === 'prescription' && activePatient && (
            <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-4">
                <button type="button" onClick={handleBackToDashboard} className="text-sm text-[#0CAAFF] font-medium flex items-center gap-1 hover:underline">← Back to Patient List</button>
                <div className="flex items-center gap-2 text-xs text-[#808493]">
                  <span>Progress: {completedSections.length} / {SECTION_ORDER.length} sections complete</span>
                </div>
              </div>

              <div className="flex rounded-3xl overflow-hidden shadow-sm border border-[#F4F6F8] mb-4 shrink-0 h-28">
                <div className="w-1/2 bg-[#0CAAFF]/10 h-full relative">
                  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Medical Background" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#4264D0]/40 to-transparent"></div>
                </div>
                <div className="w-1/2 bg-[#0CAAFF]/5 px-4 py-3 flex flex-col justify-center">
                  <h2 className="text-base font-bold text-[#2B324B] mb-1">Dr. Tanim Moontasir</h2>
                  <p className="text-xs text-[#808493]"><span className="font-semibold text-[#2B324B]">Degrees:</span> MCPS (UK), FCPS (IND), FRCP (UK), MBBS (BD), MD (Pulmonology)</p>
                  <p className="text-xs text-[#808493]"><span className="font-semibold text-[#2B324B]">Speciality:</span> Internal Medicine & General Surgery</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white rounded-full px-6 py-3 shadow-sm border border-[#F4F6F8] mb-6 shrink-0">
                <div className="flex items-center gap-8 text-sm text-[#808493]">
                  <p>Name: <span className="font-semibold text-[#2B324B]">{activePatient.name}</span></p>
                  <p>Age: <span className="font-semibold text-[#2B324B]">{activePatient.dob ? calculateAge(activePatient.dob) : '—'}</span></p>
                  <p>Gender: <span className="font-semibold text-[#2B324B]">{activePatient.gender}</span></p>
                  <p>Date: <span className="font-semibold text-[#2B324B]">{new Date().toLocaleDateString()}</span></p>
                </div>
                <button type="button" onClick={() => setIsExamSummaryOpen(true)} title="View clinical examination summary" className="flex items-center gap-1.5 text-xs font-medium text-[#0CAAFF] bg-[#0CAAFF]/10 hover:bg-[#0CAAFF]/20 px-3 py-1.5 rounded-full transition-colors">
                  <ClipboardList size={14} /> Summary
                </button>
              </div>

              <div className="flex gap-8 flex-1">
                <div className="w-1/2">
                  <SequentialSection title="Chief Complaint" sectionKey="chiefComplaints" items={chiefComplaints} isActive={activeSection === 'chiefComplaints'} isCompleted={completedSections.includes('chiefComplaints')} onAdd={() => handleAdd(setChiefComplaints, chiefComplaints)} onChange={(id, field, value) => handleChange(setChiefComplaints, chiefComplaints, id, field, value)} onDelete={(id) => handleDelete(setChiefComplaints, chiefComplaints, id)} onComplete={() => handleCompleteSection('chiefComplaints')} onEdit={() => handleReopenSection('chiefComplaints')} />

                  <SequentialSection title="Diagnosis" sectionKey="diagnosis" items={diagnosis} isActive={activeSection === 'diagnosis'} isCompleted={completedSections.includes('diagnosis')} onAdd={() => handleAdd(setDiagnosis, diagnosis)} onChange={(id, field, value) => handleChange(setDiagnosis, diagnosis, id, field, value)} onDelete={(id) => handleDelete(setDiagnosis, diagnosis, id)} onComplete={() => handleCompleteSection('diagnosis')} onEdit={() => handleReopenSection('diagnosis')} />

                  <SequentialSection title="Investigation" sectionKey="investigations" items={generalExaminations} isActive={activeSection === 'investigations'} isCompleted={completedSections.includes('investigations')} onAdd={() => handleAdd(setGeneralExaminations, generalExaminations)} onChange={(id, field, value) => handleChange(setGeneralExaminations, generalExaminations, id, field, value)} onDelete={(id) => handleDelete(setGeneralExaminations, generalExaminations, id)} onComplete={() => handleCompleteSection('investigations')} onEdit={() => handleReopenSection('investigations')} />

                  <SequentialSection title="ANC/PNC Notes" sectionKey="ancPnc" items={ancPncNotes} isActive={activeSection === 'ancPnc'} isCompleted={completedSections.includes('ancPnc')} onAdd={() => handleAdd(setAncPncNotes, ancPncNotes)} onChange={(id, field, value) => handleChange(setAncPncNotes, ancPncNotes, id, field, value)} onDelete={(id) => handleDelete(setAncPncNotes, ancPncNotes, id)} onComplete={() => handleCompleteSection('ancPnc')} onEdit={() => handleReopenSection('ancPnc')} />
                </div>

                <div className="w-px bg-[#F4F6F8] my-4 mx-2"></div>

                <div className="w-1/2">
                  <SequentialSection title="Rx" sectionKey="rx" items={rxList} isActive={activeSection === 'rx'} isCompleted={completedSections.includes('rx')} isRx={true} onPatch={(id, patch) => setRxList(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r))} onAdd={() => handleAdd(setRxList, rxList, true)} onChange={(id, field, value) => handleChange(setRxList, rxList, id, field, value)} onDelete={(id) => handleDelete(setRxList, rxList, id)} onComplete={() => handleCompleteSection('rx')} onEdit={() => handleReopenSection('rx')} />

                  <SequentialSection title="Advice" sectionKey="advice" items={adviceList} isActive={activeSection === 'advice'} isCompleted={completedSections.includes('advice')} onAdd={() => handleAdd(setAdviceList, adviceList)} onChange={(id, field, value) => handleChange(setAdviceList, adviceList, id, field, value)} onDelete={(id) => handleDelete(setAdviceList, adviceList, id)} onComplete={() => handleCompleteSection('advice')} onEdit={() => handleReopenSection('advice')} />

                  <SequentialSection title="Follow-up" sectionKey="followUps" items={followUps} isActive={activeSection === 'followUps'} isCompleted={completedSections.includes('followUps')} onAdd={() => handleAdd(setFollowUps, followUps)} onChange={(id, field, value) => handleChange(setFollowUps, followUps, id, field, value)} onDelete={(id) => handleDelete(setFollowUps, followUps, id)} onComplete={() => handleCompleteSection('followUps')} onEdit={() => handleReopenSection('followUps')} />
                </div>
              </div>

              {allComplete && (
                <div className="bg-[#28CD85]/10 border-2 border-[#28CD85]/30 rounded-2xl p-4 text-center mt-6 max-w-3xl">
                  <Check size={32} className="text-[#28CD85] mx-auto mb-2" strokeWidth={3} />
                  <h3 className="font-bold text-[#28CD85] text-sm">All sections complete!</h3>
                  <p className="text-xs text-[#808493] mt-1">You can now preview and print the prescription.</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8 shrink-0 pb-8">
                <button type="button" className="p-3 bg-[#0CAAFF]/10 text-[#0CAAFF] rounded-full hover:bg-[#0CAAFF]/20 transition-colors"><RotateCcw size={20} /></button>
                <button type="button" onClick={() => setIsPreviewModalOpen(true)} disabled={!allComplete} className={`px-6 py-2 rounded-full font-medium flex items-center gap-2 transition-colors ${allComplete ? 'bg-[#4264D0] text-white hover:bg-[#3251b5]' : 'bg-[#F4F6F8] text-[#808493] cursor-not-allowed'}`}><Printer size={18} /> Preview</button>
                <button type="button" onClick={handleSavePrescription} disabled={!allComplete} className={`px-8 py-2 rounded-full font-medium flex items-center gap-2 transition-colors ${allComplete ? 'bg-[#0CAAFF] hover:bg-[#4264D0] text-white shadow-md shadow-[#0CAAFF]/20' : 'bg-[#F4F6F8] text-[#808493] cursor-not-allowed'}`}><Save size={18} /> Save & Print</button>
              </div>
            </div>
          )}
        </main>
      </div>

      <EditPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddPatient} initialData={null} />
      <EditPatientModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleEditPatient} initialData={selectedPatient} />
      <AddPrescriptionModal isOpen={isAddPrescriptionModalOpen} onClose={() => setIsAddPrescriptionModalOpen(false)} onSave={handleContinueToWriter} patient={selectedPatient} />
      <DeleteConfirmationModal isOpen={deleteModal.isOpen} onClose={() => setDeleteModal({ isOpen: false, patient: null })} onConfirm={handleDeletePatient} patientName={deleteModal.patient?.name} />

      <PrescriptionPreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} onSave={handleSavePrescription} patient={activePatient} chiefComplaints={chiefComplaints} diagnosis={diagnosis} generalExaminations={generalExaminations} investigations={investigations} ancPncNotes={ancPncNotes} rxList={rxList} adviceList={adviceList} followUps={followUps} />

      <PrescriptionPreviewModal isOpen={isVisitPrescriptionOpen} onClose={() => setIsVisitPrescriptionOpen(false)} onSave={() => { }} mode="view" patient={selectedPatient} chiefComplaints={selectedVisit?.chiefComplaints || []} diagnosis={selectedVisit?.diagnosis || []} generalExaminations={selectedVisit?.generalExaminations || []} investigations={selectedVisit?.investigations || []} ancPncNotes={selectedVisit?.ancPncNotes || []} rxList={selectedVisit?.rxList || []} adviceList={selectedVisit?.adviceList || []} followUps={selectedVisit?.followUps || []} />

      <ClinicalExamSummaryModal isOpen={isExamSummaryOpen} onClose={() => setIsExamSummaryOpen(false)} patient={activePatient} />

      <VisitSummaryModal isOpen={isVisitSummaryOpen} onClose={() => setIsVisitSummaryOpen(false)} visit={selectedVisit} patient={selectedPatient} />
    </div>
  );
}