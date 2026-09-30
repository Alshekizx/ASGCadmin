import { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Table, Tr, Td, StatusDot, Alert, Breadcrumb, Card, Input, Textarea, Select, UploadArea, Tabs } from '../components/ui';
import { mockProgrammes } from '../data';
import type { AdminView } from '../types';

export function ProgrammeList({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState('');

  const filtered = mockProgrammes.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Programmes"
        subtitle="Manage ASGC's strategic programmes and initiatives"
        actions={<Button onClick={() => onNavigate('programme-editor')} icon="＋">Add Programme</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium text-[#0B1F3A]">{filtered.length} programmes</p>
          <SearchBar value={search} onChange={setSearch} placeholder="Search programmes…" />
        </div>
        <Table headers={['', 'Programme', 'Category', 'Beneficiaries', 'Duration', 'Status', 'Actions']}>
          {filtered.map(p => (
            <Tr key={p.id}>
              <Td><StatusDot status={p.status as any} /></Td>
              <Td>
                <p className="font-medium text-[#0B1F3A]">{p.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{p.overview.slice(0, 80)}…</p>
              </Td>
              <Td><Badge label={p.category} variant="info" /></Td>
              <Td className="text-gray-500 max-w-[180px] truncate">{p.beneficiaries}</Td>
              <Td className="text-xs text-gray-500 font-mono whitespace-nowrap">{p.startDate} – {p.endDate}</Td>
              <Td>
                <Badge label={p.status === 'active' ? 'Active' : p.status === 'draft' ? 'Draft' : 'Completed'} variant={p.status === 'active' ? 'success' : p.status === 'draft' ? 'warning' : 'default'} />
              </Td>
              <Td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('programme-editor')}>Edit</Button>
                  <Button variant="ghost" size="sm"><span className="text-red-400">Archive</span></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

export function ProgrammeEditor({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [tab, setTab] = useState('Overview');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Capacity Building');
  const [overview, setOverview] = useState('');
  const [objectives, setObjectives] = useState('');
  const [activities, setActivities] = useState('');
  const [beneficiaries, setBeneficiaries] = useState('');
  const [partners, setPartners] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [contact, setContact] = useState('');
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);

  function handlePublish() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAlert('Programme published successfully.'); }, 600);
  }

  return (
    <div>
      <Breadcrumb items={['Programmes', title || 'New Programme']} />
      <PageHeader
        title={title || 'New Programme'}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('programmes')}>Cancel</Button>
            <Button variant="outline" onClick={() => setAlert('Draft saved.')}>Save Draft</Button>
            <Button onClick={handlePublish} disabled={saving}>{saving ? 'Publishing…' : 'Publish'}</Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Tabs tabs={['Overview', 'Activities & Outcomes', 'Partners & Documents', 'Contact']} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {tab === 'Overview' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Input label="Programme Title" value={title} onChange={setTitle} placeholder="e.g. ASGC Leadership Academy" required />
                <Select label="Category" value={category} onChange={setCategory} options={[
                  { value: 'Capacity Building', label: 'Capacity Building' },
                  { value: 'Economic Development', label: 'Economic Development' },
                  { value: 'Policy', label: 'Policy' },
                  { value: 'Research', label: 'Research' },
                  { value: 'Trade', label: 'Trade' },
                ]} />
                <Textarea label="Programme Overview" value={overview} onChange={setOverview} placeholder="Comprehensive description of the programme, its purpose and significance" rows={6} required />
                <Textarea label="Target Beneficiaries" value={beneficiaries} onChange={setBeneficiaries} placeholder="Who is this programme designed for?" rows={3} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Date" type="date" value={startDate} onChange={setStartDate} />
                  <Input label="End Date" type="date" value={endDate} onChange={setEndDate} />
                </div>
              </div>
            </Card>
          )}
          {tab === 'Activities & Outcomes' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Textarea label="Objectives" value={objectives} onChange={setObjectives} placeholder="List the key objectives of this programme (one per line)" rows={5} />
                <Textarea label="Activities" value={activities} onChange={setActivities} placeholder="Describe the main activities, workshops, and interventions" rows={6} />
              </div>
            </Card>
          )}
          {tab === 'Partners & Documents' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Textarea label="Partners" value={partners} onChange={setPartners} placeholder="List implementing and funding partners" rows={4} />
                <UploadArea label="Upload Documents" accept="PDF, DOCX" helper="Programme framework, results matrix, reports" />
                <UploadArea label="Upload Gallery Images" accept="JPG, PNG" helper="Programme photos and documentation" />
              </div>
            </Card>
          )}
          {tab === 'Contact' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Textarea label="Contact & Participation Details" value={contact} onChange={setContact} placeholder="How can interested parties get in touch or participate?" rows={5} />
                <Input label="Contact Email" value="" onChange={() => {}} placeholder="programmes@asgc.org" type="email" />
              </div>
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Featured Image</h4>
            <UploadArea label="Upload Image" accept="JPG, PNG" helper="1200 × 675px recommended" />
          </Card>
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Status</h4>
            <Select label="" value="draft" onChange={() => {}} options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
            ]} />
            <div className="mt-4 flex flex-col gap-2">
              <Button className="w-full justify-center" onClick={handlePublish} disabled={saving}>Publish Programme</Button>
              <Button variant="outline" className="w-full justify-center">Save Draft</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
