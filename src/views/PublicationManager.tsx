import { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Table, Tr, Td, StatusDot, Alert, Breadcrumb, Card, Input, Textarea, Select, UploadArea, Tabs, Pagination } from '../components/ui';
import { mockPublications } from '../data';
import type { AdminView } from '../types';

export function PublicationList({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = mockPublications.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase())
  );
  const paged = filtered.slice((page - 1) * 5, page * 5);

  function typeColor(t: string): 'info' | 'gold' | 'default' | 'success' {
    if (t === 'Report') return 'info';
    if (t === 'Annual Report') return 'success';
    if (t === 'Policy Brief') return 'gold';
    return 'default';
  }

  return (
    <div>
      <PageHeader
        title="Publications"
        subtitle="Manage reports, policy briefs, frameworks and research publications"
        actions={<Button onClick={() => onNavigate('publication-editor')} icon="＋">Upload Publication</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search publications…" />
        </div>
        <Table headers={['', 'Title', 'Type', 'Author', 'Date', 'Downloads', 'Status', 'Actions']}>
          {paged.map(p => (
            <Tr key={p.id}>
              <Td><StatusDot status={p.status as any} /></Td>
              <Td>
                <p className="font-medium text-[#0B1F3A]">{p.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
              </Td>
              <Td><Badge label={p.type} variant={typeColor(p.type)} /></Td>
              <Td className="text-gray-500">{p.author}</Td>
              <Td className="font-mono text-xs text-gray-500">{p.date}</Td>
              <Td className="font-mono text-xs text-[#0B1F3A] font-medium">{p.downloads.toLocaleString()}</Td>
              <Td>
                <Badge label={p.status === 'published' ? 'Published' : p.status === 'draft' ? 'Draft' : 'Archived'}
                  variant={p.status === 'published' ? 'success' : p.status === 'draft' ? 'warning' : 'default'} />
              </Td>
              <Td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('publication-editor')}>Edit</Button>
                  <Button variant="ghost" size="sm">Preview</Button>
                  <Button variant="ghost" size="sm"><span className="text-red-400">Delete</span></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={5} onChange={setPage} />
        </div>
      </Card>
    </div>
  );
}

export function PublicationEditor({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Report');
  const [author, setAuthor] = useState('');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Research');
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);

  function handlePublish() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAlert('Publication published successfully.'); }, 600);
  }

  return (
    <div>
      <Breadcrumb items={['Publications', title || 'New Publication']} />
      <PageHeader
        title={title || 'New Publication'}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('publications')}>Cancel</Button>
            <Button variant="outline" onClick={() => setAlert('Draft saved.')}>Save Draft</Button>
            <Button onClick={handlePublish} disabled={saving}>{saving ? 'Publishing…' : 'Publish'}</Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Publication Title" value={title} onChange={setTitle} placeholder="e.g. Africa Investment Outlook 2025" required />
              <div className="grid grid-cols-2 gap-4">
                <Select label="Publication Type" value={type} onChange={setType} options={[
                  { value: 'Report', label: 'Report' },
                  { value: 'Annual Report', label: 'Annual Report' },
                  { value: 'Policy Brief', label: 'Policy Brief' },
                  { value: 'Framework', label: 'Framework' },
                  { value: 'Compendium', label: 'Compendium' },
                  { value: 'Research Paper', label: 'Research Paper' },
                ]} required />
                <Select label="Category / Topic" value={category} onChange={setCategory} options={[
                  { value: 'Research', label: 'Research' },
                  { value: 'Investment', label: 'Investment' },
                  { value: 'Policy', label: 'Policy' },
                  { value: 'Trade', label: 'Trade' },
                  { value: 'Institutional', label: 'Institutional' },
                ]} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Author / Publisher" value={author} onChange={setAuthor} placeholder="ASGC Research Team" required />
                <Input label="Publication Date" type="date" value={date} onChange={setDate} required />
              </div>
              <Textarea label="Description" value={desc} onChange={setDesc} placeholder="Brief description of this publication, its findings and relevance" rows={5} required />
            </div>
          </Card>
          <Card>
            <h4 className="font-semibold text-[#0B1F3A] mb-4">Document File</h4>
            {!fileUploaded ? (
              <div onClick={() => setFileUploaded(true)}>
                <UploadArea label="Drag & drop your PDF or document here" accept="PDF, DOCX, XLSX" helper="Maximum file size: 50MB — this is the downloadable file" />
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <span className="text-2xl">📄</span>
                <div>
                  <p className="text-sm font-medium text-green-800">africa-investment-outlook-2025.pdf</p>
                  <p className="text-xs text-green-600">4.2 MB — PDF document</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFileUploaded(false)} className="ml-auto">Replace File</Button>
              </div>
            )}
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Cover Image</h4>
            <UploadArea label="Upload Cover Image" accept="JPG, PNG" helper="600 × 800px (portrait) recommended" />
          </Card>
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-4">Publish</h4>
            <div className="flex flex-col gap-2">
              <Button className="w-full justify-center" onClick={handlePublish} disabled={saving}>Publish</Button>
              <Button variant="outline" className="w-full justify-center">Save Draft</Button>
              <Button variant="ghost" className="w-full justify-center">Preview</Button>
              <Button variant="ghost" className="w-full justify-center text-red-400">Unpublish</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
