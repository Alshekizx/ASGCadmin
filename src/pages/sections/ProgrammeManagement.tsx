import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Table, Modal, FormField, Input, Textarea, Select, UploadBox } from '../../components/admin/ui';

const PROGRAMMES = [
  { id: '1', title: 'Africa Trade Facilitation Initiative', category: 'Trade', status: 'active', startDate: '1 Jan 2026', endDate: '31 Dec 2026', beneficiaries: 'SMEs across 12 African nations' },
  { id: '2', title: 'Responsible Investment Framework', category: 'Investment', status: 'active', startDate: '1 Mar 2026', endDate: '28 Feb 2027', beneficiaries: 'Development finance institutions' },
  { id: '3', title: 'Policy Dialogue Series', category: 'Policy', status: 'active', startDate: '1 Jun 2026', endDate: '30 Nov 2026', beneficiaries: 'Government ministries, policy makers' },
  { id: '4', title: 'Youth Entrepreneurship in Africa', category: 'Capacity Building', status: 'draft', startDate: '1 Feb 2027', endDate: '31 Jan 2028', beneficiaries: 'Young entrepreneurs aged 18–35' },
  { id: '5', title: 'African Women in Business', category: 'Gender & Development', status: 'completed', startDate: '1 Jan 2025', endDate: '31 Dec 2025', beneficiaries: 'Women-led enterprises across Africa' },
];

export default function ProgrammeManagement() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = PROGRAMMES.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (editing || isNew) {
    return <ProgrammeEditor programmeId={editing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={msg => { setEditing(null); setIsNew(false); showToast(msg); }} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Programmes"
        subtitle="Create and manage ASGC programmes and initiatives."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Add New Programme</Btn>}
      />

      <Card>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search programmes…" />
          <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} programmes</span>
        </div>

        <Table
          columns={[
            { key: 'title', label: 'Programme Title' },
            { key: 'category', label: 'Category', width: '160px' },
            { key: 'startDate', label: 'Start Date', width: '110px' },
            { key: 'endDate', label: 'End Date', width: '110px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'actions', label: 'Actions', width: '130px' },
          ]}
          rows={filtered.map(p => ({
            title: (
              <div>
                <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{p.beneficiaries}</p>
              </div>
            ),
            category: <Badge label={p.category} variant="default" />,
            startDate: <span className="text-sm" style={{ color: '#6b7280' }}>{p.startDate}</span>,
            endDate: <span className="text-sm" style={{ color: '#6b7280' }}>{p.endDate}</span>,
            status: <Badge label={p.status} variant={p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'muted'} />,
            actions: (
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(p.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                <button onClick={() => setConfirm(p.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            ),
          }))}
        />
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Programme"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Programme deleted.'); }}>Delete</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this programme? This action cannot be undone.</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function ProgrammeEditor({ programmeId, onBack, onSave }: { programmeId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const [title, setTitle] = useState(programmeId ? 'Africa Trade Facilitation Initiative' : '');
  const [category, setCategory] = useState(programmeId ? 'trade' : '');
  const [overview, setOverview] = useState(programmeId ? 'The Africa Trade Facilitation Initiative aims to reduce barriers to intra-African trade and strengthen regional supply chains through policy advocacy and capacity building.' : '');
  const [objectives, setObjectives] = useState(programmeId ? 'Reduce trade barriers across 12 African nations; Support SME integration into regional value chains; Facilitate policy harmonisation.' : '');

  const cats = [
    { value: 'trade', label: 'Trade' },
    { value: 'investment', label: 'Investment' },
    { value: 'policy', label: 'Policy' },
    { value: 'capacity-building', label: 'Capacity Building' },
    { value: 'gender', label: 'Gender & Development' },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Programmes</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{programmeId ? 'Edit Programme' : 'New Programme'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{programmeId ? 'Edit Programme' : 'New Programme'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Save Draft</Btn>
          <Btn variant="ghost" size="sm">Preview</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Programme published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Programme Title" required>
              <Input value={title} onChange={setTitle} placeholder="Enter programme title…" />
            </FormField>
            <FormField label="Overview" required>
              <Textarea value={overview} onChange={setOverview} rows={4} placeholder="Programme overview and background…" />
            </FormField>
            <FormField label="Objectives">
              <Textarea value={objectives} onChange={setObjectives} rows={3} placeholder="List key objectives…" />
            </FormField>
            <FormField label="Activities">
              <Textarea rows={3} placeholder="Key activities and interventions…" />
            </FormField>
            <FormField label="Beneficiaries">
              <Input placeholder="Who does this programme benefit?" defaultValue={programmeId ? 'SMEs across 12 African nations' : ''} />
            </FormField>
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Documents & Gallery</p>
            <UploadBox label="Upload programme documents" accept=".pdf,.doc,.docx" hint="PDF, Word documents accepted" />
            <UploadBox label="Upload gallery images" accept="image/*" hint="Multiple images allowed" />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Category" required>
              <Select value={category} onChange={setCategory} options={cats} placeholder="Select category…" />
            </FormField>
            <FormField label="Status">
              <Select options={[{ value: 'draft', label: 'Draft' }, { value: 'active', label: 'Active' }, { value: 'completed', label: 'Completed' }]} value="active" />
            </FormField>
            <FormField label="Start Date">
              <Input type="date" value="2026-01-01" />
            </FormField>
            <FormField label="End Date">
              <Input type="date" value="2026-12-31" />
            </FormField>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Featured Image</p>
            <UploadBox accept="image/*" hint="Recommended: 1200×800px" />
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Partners & Contact</p>
            <FormField label="Partners">
              <Textarea rows={2} placeholder="List partner organisations…" />
            </FormField>
            <FormField label="Contact Details">
              <Input placeholder="Contact person or email…" />
            </FormField>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
