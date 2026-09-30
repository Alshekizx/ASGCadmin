import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, Modal, FormField, Input, Textarea, Select, UploadBox } from '../../components/admin/ui';

const PARTNERS = [
  { id: '1', name: 'African Development Bank', category: 'Development Finance', website: 'https://afdb.org', status: 'active', order: 1 },
  { id: '2', name: 'African Union Commission', category: 'Intergovernmental', website: 'https://au.int', status: 'active', order: 2 },
  { id: '3', name: 'ECOWAS Commission', category: 'Regional Body', website: 'https://ecowas.int', status: 'active', order: 3 },
  { id: '4', name: 'United Nations Development Programme', category: 'UN Agency', website: 'https://undp.org', status: 'active', order: 4 },
  { id: '5', name: 'International Finance Corporation', category: 'Development Finance', website: 'https://ifc.org', status: 'active', order: 5 },
  { id: '6', name: 'African Export-Import Bank', category: 'Finance', website: 'https://afreximbank.com', status: 'inactive', order: 6 },
];

const CATEGORIES = [
  { value: 'development-finance', label: 'Development Finance' },
  { value: 'intergovernmental', label: 'Intergovernmental' },
  { value: 'regional-body', label: 'Regional Body' },
  { value: 'un-agency', label: 'UN Agency' },
  { value: 'finance', label: 'Finance' },
  { value: 'government', label: 'Government' },
  { value: 'private-sector', label: 'Private Sector' },
  { value: 'civil-society', label: 'Civil Society' },
];

export default function PartnerManagement() {
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (editing || isNew) {
    return <PartnerEditor partnerId={editing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={msg => { setEditing(null); setIsNew(false); showToast(msg); }} />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Partners"
        subtitle="Manage partner organisations and logos. Drag to reorder."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Add Partner</Btn>}
      />

      <Card>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#f0f2f5' }}>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Drag the ⠿ handle to reorder how partners appear on the website</p>
        </div>
        <div className="divide-y" style={{ borderColor: '#f0f2f5' }}>
          {PARTNERS.map(partner => (
            <div key={partner.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
              <div className="cursor-grab text-lg" style={{ color: '#d1d5db' }}>⠿</div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold" style={{ background: '#f0f2f5', color: '#374151' }}>
                {partner.name.split(' ').map(w => w[0]).slice(0, 3).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{partner.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge label={partner.category} variant="default" />
                  <span className="text-xs" style={{ color: '#9ca3af' }}>{partner.website}</span>
                </div>
              </div>
              <Badge label={partner.status} variant={partner.status === 'active' ? 'success' : 'muted'} />
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(partner.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                <button onClick={() => showToast(partner.status === 'active' ? 'Partner deactivated.' : 'Partner activated.')} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>
                  {partner.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => setConfirm(partner.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Remove Partner"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Partner removed.'); }}>Remove Partner</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Remove this partner from the website? Their logo and information will no longer appear publicly.</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function PartnerEditor({ partnerId, onBack, onSave }: { partnerId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const partner = PARTNERS.find(p => p.id === partnerId);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Partners</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{partnerId ? 'Edit Partner' : 'Add Partner'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{partnerId ? 'Edit Partner' : 'Add Partner'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Cancel</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Partner saved successfully.')}>Save Partner</Btn>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <FormField label="Organisation Name" required>
          <Input defaultValue={partner?.name || ''} placeholder="Full organisation name…" />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Partnership Category" required>
            <Select options={CATEGORIES} value={partner?.category.toLowerCase().replace(' ', '-') || ''} placeholder="Select category…" />
          </FormField>
          <FormField label="Website URL">
            <Input defaultValue={partner?.website || ''} placeholder="https://…" />
          </FormField>
        </div>
        <FormField label="Description">
          <Textarea rows={3} placeholder="Brief description of the partnership…" />
        </FormField>
        <FormField label="Partner Logo">
          <UploadBox accept="image/png,image/svg+xml" hint="PNG or SVG recommended · Transparent background preferred" />
        </FormField>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked={partner?.status === 'active'} style={{ accentColor: '#c9a84c' }} />
            <span className="text-sm" style={{ color: '#374151' }}>Visible on website</span>
          </label>
        </div>
      </Card>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
