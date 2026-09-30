import { useState } from 'react';
import { PageHeader, Button, Card, Alert, Breadcrumb, Input, Textarea, Select, UploadArea, Badge } from '../components/ui';
import { mockLeaders } from '../data';
import type { AdminView } from '../types';

export function LeadershipList({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [alert, setAlert] = useState('');

  return (
    <div>
      <PageHeader
        title="Leadership"
        subtitle="Manage leadership profiles and display order"
        actions={<Button onClick={() => onNavigate('leadership-editor')} icon="＋">Add Profile</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {mockLeaders.map(leader => (
          <Card key={leader.id} padding={false} className="overflow-hidden">
            <div className="h-48 bg-[#0B1F3A]/5 relative">
              <img
                src={`https://images.unsplash.com/${leader.image}?w=400&h=192&fit=crop&auto=format`}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge label={leader.status === 'active' ? 'Active' : 'Inactive'} variant={leader.status === 'active' ? 'success' : 'default'} />
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                Order: #{leader.order}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#0B1F3A]">{leader.name}</h3>
              <p className="text-sm text-[#C9A84C] font-medium mt-0.5">{leader.position}</p>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{leader.biography.slice(0, 120)}…</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => onNavigate('leadership-editor')}>Edit</Button>
                <Button variant="ghost" size="sm" className={leader.status === 'active' ? 'text-red-400' : 'text-green-600'}>
                  {leader.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function LeadershipEditor({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const ambassador = mockLeaders[0];
  const [name, setName] = useState(ambassador.name);
  const [position, setPosition] = useState(ambassador.position);
  const [bio, setBio] = useState(ambassador.biography);
  const [order, setOrder] = useState(String(ambassador.order));
  const [history, setHistory] = useState('');
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAlert('Profile updated successfully.'); }, 600);
  }

  return (
    <div>
      <Breadcrumb items={['Leadership', name]} />
      <PageHeader
        title="Edit Leadership Profile"
        subtitle={name}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('leadership')}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} icon="✓">{saving ? 'Saving…' : 'Save Changes'}</Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Full Name" value={name} onChange={setName} required />
              <Input label="Position / Title" value={position} onChange={setPosition} required placeholder="e.g. Founder & Director General" />
              <Textarea label="Biography" value={bio} onChange={setBio} rows={10} required placeholder="Full professional biography" />
              <Textarea label="Professional History" value={history} onChange={setHistory} rows={5} placeholder="Previous roles, appointments and career highlights" />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Profile Photograph</h4>
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-3">
              <img
                src={`https://images.unsplash.com/${ambassador.image}?w=300&h=192&fit=crop&auto=format`}
                alt={ambassador.name}
                className="w-full h-full object-cover"
              />
            </div>
            <UploadArea label="Replace Photo" accept="JPG, PNG" helper="Minimum 400 × 500px — portrait orientation" />
          </Card>
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Display Settings</h4>
            <div className="flex flex-col gap-3">
              <Input label="Display Order" value={order} onChange={setOrder} type="number" helper="Lower numbers appear first" />
              <Select label="Status" value="active" onChange={() => {}} options={[
                { value: 'active', label: 'Active — visible on website' },
                { value: 'inactive', label: 'Inactive — hidden from website' },
              ]} />
            </div>
            <Button className="w-full justify-center mt-4" onClick={handleSave} disabled={saving}>Save Changes</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
