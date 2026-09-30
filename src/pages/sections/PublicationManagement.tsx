import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Modal, FormField, Input, Textarea, Select, UploadBox } from '../../components/admin/ui';

const PUBLICATIONS = [
  { id: '1', title: 'ASGC Annual Report 2025', type: 'Annual Report', author: 'ASGC Research Unit', date: 'Jan 2026', category: 'Institutional', status: 'published', fileSize: '4.2 MB' },
  { id: '2', title: 'Africa Investment Landscape 2026', type: 'Research Paper', author: 'Dr. Emeka Okonkwo', date: 'Mar 2026', category: 'Research', status: 'published', fileSize: '2.8 MB' },
  { id: '3', title: 'Policy Brief: Trade Facilitation', type: 'Policy Brief', author: 'ASGC Policy Team', date: 'May 2026', category: 'Policy', status: 'published', fileSize: '1.1 MB' },
  { id: '4', title: 'Responsible Investment Guidelines', type: 'Guidelines', author: 'ASGC Editorial', date: 'Jul 2026', category: 'Investment', status: 'draft', fileSize: '3.4 MB' },
  { id: '5', title: 'African Women in Business Report', type: 'Research Paper', author: 'Dr. Aisha Kamara', date: 'Aug 2026', category: 'Gender', status: 'published', fileSize: '5.1 MB' },
];

export default function PublicationManagement() {
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = PUBLICATIONS.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.author.toLowerCase().includes(search.toLowerCase()));

  if (editing || isNew) {
    return <PublicationEditor pubId={editing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={msg => { setEditing(null); setIsNew(false); showToast(msg); }} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Publications"
        subtitle="Upload and manage ASGC publications, reports and policy documents."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Upload Publication</Btn>}
      />

      <Card>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search publications…" />
          <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} publications</span>
        </div>

        <div className="divide-y" style={{ borderColor: '#f0f2f5' }}>
          {filtered.map(pub => (
            <div key={pub.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
              <div className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fef2f2' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{pub.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{pub.author}</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>·</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{pub.date}</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>·</span>
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{pub.fileSize}</span>
                </div>
              </div>
              <Badge label={pub.type} variant="default" />
              <Badge label={pub.status} variant={pub.status === 'published' ? 'success' : 'warning'} />
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(pub.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                <button className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Replace File</button>
                <button onClick={() => showToast(pub.status === 'published' ? 'Publication unpublished.' : 'Publication published.')} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>{pub.status === 'published' ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => setConfirm(pub.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Drag-and-drop upload zone */}
      <Card className="mt-5 p-6">
        <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Bulk Upload</p>
        <UploadBox label="Drag and drop PDF or document files here" accept=".pdf,.doc,.docx" hint="PDF, Word, PowerPoint accepted · Files will be queued for metadata entry" />
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Publication"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Publication deleted.'); }}>Delete</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this publication? The file will be permanently removed.</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function PublicationEditor({ pubId, onBack, onSave }: { pubId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const types = [
    { value: 'annual-report', label: 'Annual Report' },
    { value: 'research-paper', label: 'Research Paper' },
    { value: 'policy-brief', label: 'Policy Brief' },
    { value: 'guidelines', label: 'Guidelines' },
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'case-study', label: 'Case Study' },
  ];
  const categories = [
    { value: 'institutional', label: 'Institutional' },
    { value: 'research', label: 'Research' },
    { value: 'policy', label: 'Policy' },
    { value: 'investment', label: 'Investment' },
    { value: 'gender', label: 'Gender & Development' },
    { value: 'trade', label: 'Trade' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Publications</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{pubId ? 'Edit Publication' : 'Upload Publication'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{pubId ? 'Edit Publication' : 'Upload New Publication'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Save Draft</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Publication published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Publication Title" required>
              <Input defaultValue={pubId ? 'ASGC Annual Report 2025' : ''} placeholder="Enter publication title…" />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Publication Type" required>
                <Select options={types} value={pubId ? 'annual-report' : ''} placeholder="Select type…" />
              </FormField>
              <FormField label="Category">
                <Select options={categories} value={pubId ? 'institutional' : ''} placeholder="Select category…" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Author / Editor">
                <Input defaultValue={pubId ? 'ASGC Research Unit' : ''} placeholder="Author or department…" />
              </FormField>
              <FormField label="Publication Date">
                <Input type="month" defaultValue={pubId ? '2026-01' : ''} />
              </FormField>
            </div>
            <FormField label="Description">
              <Textarea rows={3} placeholder="Brief description of the publication…" defaultValue={pubId ? 'A comprehensive review of ASGC\'s programmes, partnerships and impact across 2025.' : ''} />
            </FormField>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Downloadable File</p>
            <UploadBox label="Upload PDF or document file" accept=".pdf,.doc,.docx" hint="PDF format recommended · Max file size: 50MB" />
            {pubId && (
              <div className="mt-3 flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: '#f9fafb', border: '1px solid #e2e4e9' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium" style={{ color: '#374151' }}>ASGC-Annual-Report-2025.pdf</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>4.2 MB · Uploaded Jan 2026</p>
                </div>
                <button className="text-xs" style={{ color: '#c9a84c' }}>Replace</button>
              </div>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Cover Image</p>
            <UploadBox accept="image/*" hint="Publication cover · 800×1100px" />
          </Card>
          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Visibility</p>
            <Select options={[{ value: 'published', label: 'Published (Public)' }, { value: 'draft', label: 'Draft (Hidden)' }, { value: 'archived', label: 'Archived' }]} value="published" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
