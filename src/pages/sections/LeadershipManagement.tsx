import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, Modal, FormField, Input, Textarea, UploadBox } from '../../components/admin/ui';

const LEADERS = [
  {
    id: '1',
    name: 'Ambassador Ahmed Sule',
    position: 'Founder & Chairman',
    order: 1,
    status: 'published',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
    bio: 'Ambassador Ahmed Sule is an internationally recognised diplomat, economist and development advocate with over three decades of experience in international relations, economic diplomacy and sustainable development across Africa and the global south.',
    featured: true,
  },
  {
    id: '2',
    name: 'Dr. Ngozi Adeyemi',
    position: 'Executive Director',
    order: 2,
    status: 'published',
    photo: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&h=200&fit=crop&auto=format',
    bio: 'Dr. Adeyemi leads ASGC\'s strategic programme delivery and operational excellence.',
    featured: false,
  },
  {
    id: '3',
    name: 'Prof. Kwame Mensah',
    position: 'Director of Research & Policy',
    order: 3,
    status: 'published',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&auto=format',
    bio: 'Professor Mensah oversees ASGC\'s research agenda and policy engagement initiatives.',
    featured: false,
  },
  {
    id: '4',
    name: 'Ms. Fatima Al-Hassan',
    position: 'Director of Partnerships',
    order: 4,
    status: 'draft',
    photo: '',
    bio: '',
    featured: false,
  },
];

export default function LeadershipManagement() {
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (editing || isNew) {
    return <ProfileEditor leaderId={editing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={msg => { setEditing(null); setIsNew(false); showToast(msg); }} />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Leadership"
        subtitle="Manage leadership profiles and display order."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Add Profile</Btn>}
      />

      {/* Ambassador Sule featured card */}
      <Card className="mb-5 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b" style={{ borderColor: '#f0f2f5', background: '#fffbeb' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a84c' }} />
          <p className="text-xs font-semibold" style={{ color: '#b8962f' }}>FEATURED PROFILE — FOUNDER</p>
        </div>
        <div className="flex gap-6 p-6">
          <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img src={LEADERS[0].photo} alt={LEADERS[0].name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{LEADERS[0].name}</h3>
                <p className="text-sm" style={{ color: '#c9a84c' }}>{LEADERS[0].position}</p>
                <p className="text-sm mt-2 leading-relaxed line-clamp-2" style={{ color: '#6b7280' }}>{LEADERS[0].bio}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge label="Featured" variant="gold" />
                <Badge label={LEADERS[0].status} variant="success" />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Btn variant="outline" size="sm" onClick={() => setEditing(LEADERS[0].id)}>Edit Profile</Btn>
              <Btn variant="ghost" size="sm">Preview</Btn>
            </div>
          </div>
        </div>
      </Card>

      {/* Other profiles */}
      <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>All Leadership Profiles</p>
      <div className="space-y-3">
        {LEADERS.map(leader => (
          <Card key={leader.id} className="flex items-center gap-4 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-2 text-xs font-mono px-2 cursor-grab" style={{ color: '#9ca3af' }}>
              ⠿ {leader.order}
            </div>
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: '#f0f2f5' }}>
              {leader.photo ? (
                <img src={leader.photo} alt={leader.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: '#9ca3af' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{leader.name}</p>
              <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{leader.position}</p>
            </div>
            {leader.featured && <Badge label="Featured" variant="gold" />}
            <Badge label={leader.status} variant={leader.status === 'published' ? 'success' : 'warning'} />
            <div className="flex items-center gap-1">
              <button onClick={() => setEditing(leader.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
              <button onClick={() => showToast(leader.status === 'published' ? 'Profile hidden.' : 'Profile published.')} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>
                {leader.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              {!leader.featured && (
                <button onClick={() => setConfirm(leader.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Profile"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Profile deleted.'); }}>Delete Profile</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this leadership profile?</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function ProfileEditor({ leaderId, onBack, onSave }: { leaderId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const isAmbassador = leaderId === '1';
  const [name, setName] = useState(isAmbassador ? 'Ambassador Ahmed Sule' : leaderId === '2' ? 'Dr. Ngozi Adeyemi' : '');
  const [position, setPosition] = useState(isAmbassador ? 'Founder & Chairman' : leaderId === '2' ? 'Executive Director' : '');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Leadership</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{leaderId ? 'Edit Profile' : 'New Profile'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{leaderId ? 'Edit Profile' : 'New Profile'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Save Draft</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Profile published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Full Name" required>
              <Input value={name} onChange={setName} placeholder="Full name with title…" />
            </FormField>
            <FormField label="Position / Title" required>
              <Input value={position} onChange={setPosition} placeholder="e.g. Executive Director…" />
            </FormField>
            <FormField label="Short Biography" required>
              <Textarea rows={4} placeholder="Brief professional biography…" defaultValue={isAmbassador ? 'Ambassador Ahmed Sule is an internationally recognised diplomat, economist and development advocate with over three decades of experience in international relations, economic diplomacy and sustainable development across Africa and the global south. He has served in senior advisory roles to multiple African governments and international organisations, and is a passionate advocate for sustainable economic transformation.' : ''} />
            </FormField>
            <FormField label="Professional History">
              <Textarea rows={4} placeholder="Previous roles, organisations, achievements…" defaultValue={isAmbassador ? 'Former Senior Adviser to the African Union Commission · Member, African Development Finance Committee · Senior Fellow, Institute for African Development Studies · Has represented African interests at the UN, WTO, G20 and numerous bilateral forums.' : ''} />
            </FormField>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Profile Photo</p>
            {isAmbassador && (
              <div className="mb-3 rounded-lg overflow-hidden" style={{ paddingBottom: '100%', position: 'relative', background: '#f0f2f5' }}>
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format" alt="" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            )}
            <UploadBox accept="image/*" hint="Square crop recommended · Min 400×400px" />
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Display Settings</p>
            <FormField label="Display Order" hint="Lower numbers appear first">
              <Input type="number" defaultValue={isAmbassador ? '1' : ''} placeholder="1, 2, 3…" />
            </FormField>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked={isAmbassador} style={{ accentColor: '#c9a84c' }} />
              <span className="text-sm" style={{ color: '#374151' }}>Feature on homepage</span>
            </label>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
