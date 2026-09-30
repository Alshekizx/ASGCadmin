import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Table, Modal, FormField, Input, Select } from '../../components/admin/ui';

const USERS = [
  { id: '1', name: 'System Administrator', email: 'admin@asgc.org', role: 'super-admin' as const, status: 'active' as const, lastLogin: 'Today, 08:14' },
  { id: '2', name: 'Chidi Nwachukwu', email: 'c.nwachukwu@asgc.org', role: 'admin' as const, status: 'active' as const, lastLogin: '28 Sep 2026' },
  { id: '3', name: 'Amara Diallo', email: 'a.diallo@asgc.org', role: 'content-manager' as const, status: 'active' as const, lastLogin: '29 Sep 2026' },
  { id: '4', name: 'Yemi Ogundimu', email: 'y.ogundimu@asgc.org', role: 'content-manager' as const, status: 'active' as const, lastLogin: '27 Sep 2026' },
  { id: '5', name: 'Sarah Mensah', email: 's.mensah@asgc.org', role: 'admin' as const, status: 'inactive' as const, lastLogin: '10 Aug 2026' },
];

const ROLES = [
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'content-manager', label: 'Content Manager' },
];

const ROLE_LABELS: Record<string, string> = {
  'super-admin': 'Super Admin',
  'admin': 'Admin',
  'content-manager': 'Content Manager',
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  'super-admin': 'Full access: can manage all content, users, roles and website settings',
  'admin': 'Can manage all website content including news, events, programmes and media. Cannot change user permissions or system settings.',
  'content-manager': 'Can upload and edit assigned content types. Cannot access sensitive settings, user management or system configuration.',
};

export default function UserManagement() {
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<string | null>(null);
  const [resetUser, setResetUser] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ id: string; action: string } | null>(null);
  const [selectedRole, setSelectedRole] = useState('content-manager');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = USERS.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Users & Roles"
        subtitle="Manage administrator accounts and access permissions."
        actions={<Btn variant="secondary" onClick={() => setAddOpen(true)} icon={<PlusIcon />}>Add User</Btn>}
      />

      {/* Role explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {ROLES.map(role => (
          <Card key={role.value} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: role.value === 'super-admin' ? '#fffbeb' : role.value === 'admin' ? '#eff6ff' : '#f0fdf4' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={role.value === 'super-admin' ? '#c9a84c' : role.value === 'admin' ? '#3b82f6' : '#16a34a'} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <Badge
                label={role.label}
                variant={role.value === 'super-admin' ? 'gold' : role.value === 'admin' ? 'default' : 'success'}
              />
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{ROLE_DESCRIPTIONS[role.value]}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search users…" />
          <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} users</span>
        </div>

        <Table
          columns={[
            { key: 'user', label: 'User' },
            { key: 'role', label: 'Role', width: '140px' },
            { key: 'status', label: 'Status', width: '90px' },
            { key: 'lastLogin', label: 'Last Login', width: '140px' },
            { key: 'actions', label: 'Actions', width: '180px' },
          ]}
          rows={filtered.map(u => ({
            user: (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)', color: '#c9a84c' }}>
                  {u.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{u.name}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{u.email}</p>
                </div>
              </div>
            ),
            role: <Badge label={ROLE_LABELS[u.role]} variant={u.role === 'super-admin' ? 'gold' : 'default'} />,
            status: <Badge label={u.status} variant={u.status === 'active' ? 'success' : 'muted'} />,
            lastLogin: <span className="text-sm" style={{ color: '#6b7280' }}>{u.lastLogin}</span>,
            actions: (
              <div className="flex items-center gap-1 flex-wrap">
                <button onClick={() => setEditUser(u.id)} className="px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                <button onClick={() => setResetUser(u.id)} className="px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Reset PW</button>
                {u.role !== 'super-admin' && (
                  <button onClick={() => setConfirm({ id: u.id, action: u.status === 'active' ? 'deactivate' : 'activate' })} className="px-2 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: u.status === 'active' ? '#d97706' : '#16a34a' }}>
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                )}
              </div>
            ),
          }))}
        />
      </Card>

      {/* Add User Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New User"
        footer={<>
          <Btn variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { setAddOpen(false); showToast('User account created. An invitation has been sent.'); }}>Create User</Btn>
        </>}
      >
        <div className="space-y-4">
          <FormField label="Full Name" required>
            <Input placeholder="Enter full name…" />
          </FormField>
          <FormField label="Email Address" required>
            <Input type="email" placeholder="user@asgc.org…" />
          </FormField>
          <FormField label="Role" required>
            <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }}>
              {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </FormField>
          {selectedRole && (
            <div className="px-3 py-3 rounded-lg text-xs" style={{ background: '#f9fafb', color: '#6b7280' }}>
              {ROLE_DESCRIPTIONS[selectedRole]}
            </div>
          )}
          <p className="text-xs" style={{ color: '#9ca3af' }}>A welcome email with login instructions will be sent automatically.</p>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User"
        footer={<>
          <Btn variant="ghost" onClick={() => setEditUser(null)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { setEditUser(null); showToast('User updated successfully.'); }}>Save Changes</Btn>
        </>}
      >
        <div className="space-y-4">
          <FormField label="Full Name">
            <Input defaultValue={USERS.find(u => u.id === editUser)?.name || ''} />
          </FormField>
          <FormField label="Email Address">
            <Input type="email" defaultValue={USERS.find(u => u.id === editUser)?.email || ''} />
          </FormField>
          <FormField label="Role">
            <Select options={ROLES} value={USERS.find(u => u.id === editUser)?.role || ''} />
          </FormField>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal open={!!resetUser} onClose={() => setResetUser(null)} title="Reset Password"
        footer={<>
          <Btn variant="ghost" onClick={() => setResetUser(null)}>Cancel</Btn>
          <Btn variant="primary" onClick={() => { setResetUser(null); showToast('Password reset email sent.'); }}>Send Reset Email</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>
          A password reset link will be sent to <strong>{USERS.find(u => u.id === resetUser)?.email}</strong>. The link will expire after 24 hours.
        </p>
      </Modal>

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title={confirm?.action === 'deactivate' ? 'Deactivate User' : 'Activate User'}
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant={confirm?.action === 'deactivate' ? 'danger' : 'primary'} onClick={() => { setConfirm(null); showToast(`User ${confirm?.action}d successfully.`); }}>
            {confirm?.action === 'deactivate' ? 'Deactivate' : 'Activate'}
          </Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>
          {confirm?.action === 'deactivate'
            ? 'This user will no longer be able to log in. Their content will remain unchanged.'
            : 'This user will regain access to the admin portal with their previous permissions.'
          }
        </p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
