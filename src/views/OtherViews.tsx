import { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Table, Tr, Td, Alert, Card, Input, Textarea, Select, UploadArea, Toggle, Modal, Tabs } from '../components/ui';
import { mockPartners, mockSubscribers, mockUsers, mockRegistrations } from '../data';
import type { AdminView } from '../types';

// --- Partners ---
export function PartnersManager() {
  const [partners, setPartners] = useState(mockPartners);
  const [alert, setAlert] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newWebsite, setNewWebsite] = useState('');
  const [newCategory, setNewCategory] = useState('Development Finance');

  function toggleStatus(id: string) {
    setPartners(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
  }

  function handleAdd() {
    if (!newName.trim()) return;
    setAlert(`Partner "${newName}" added successfully.`);
    setShowAdd(false);
    setNewName(''); setNewWebsite(''); setNewCategory('Development Finance');
  }

  return (
    <div>
      <PageHeader
        title="Partners"
        subtitle="Manage partner organisations and logo display"
        actions={<Button onClick={() => setShowAdd(true)} icon="＋">Add Partner</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      {showAdd && (
        <Card className="mb-6">
          <h4 className="font-semibold text-[#0B1F3A] mb-4">Add New Partner</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input label="Partner Name" value={newName} onChange={setNewName} required placeholder="e.g. African Development Bank" />
            <Input label="Website URL" value={newWebsite} onChange={setNewWebsite} placeholder="https://example.org" />
            <Select label="Partnership Category" value={newCategory} onChange={setNewCategory} options={[
              { value: 'Development Finance', label: 'Development Finance' },
              { value: 'Regional Body', label: 'Regional Body' },
              { value: 'Continental Body', label: 'Continental Body' },
              { value: 'UN Agency', label: 'UN Agency' },
              { value: 'Government', label: 'Government' },
              { value: 'Private Sector', label: 'Private Sector' },
            ]} />
          </div>
          <div className="mb-4">
            <UploadArea label="Upload Partner Logo" accept="PNG, SVG" helper="Transparent background preferred — 200 × 80px" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>Add Partner</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}
      <Card padding={false}>
        <Table headers={['Order', 'Partner', 'Category', 'Website', 'Status', 'Actions']}>
          {partners.map(p => (
            <Tr key={p.id}>
              <Td className="font-mono text-xs text-gray-400 w-12">{p.order}</Td>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-8 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400 font-medium border border-gray-200">
                    {p.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </div>
                  <span className="font-medium text-[#0B1F3A]">{p.name}</span>
                </div>
              </Td>
              <Td><Badge label={p.category} variant="info" /></Td>
              <Td className="text-[#C9A84C] text-sm">
                <a href={p.website} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="hover:underline">{p.website}</a>
              </Td>
              <Td>
                <Toggle checked={p.status === 'active'} onChange={() => toggleStatus(p.id)} label={p.status === 'active' ? 'Visible' : 'Hidden'} />
              </Td>
              <Td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">↑</Button>
                  <Button variant="ghost" size="sm">↓</Button>
                  <Button variant="ghost" size="sm"><span className="text-red-400">Remove</span></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// --- Newsletter ---
export function NewsletterManager() {
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState('');

  const filtered = mockSubscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="Manage email subscribers"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setAlert('Subscriber list exported to CSV.')}>Export CSV</Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Total Subscribers</p><p className="text-2xl font-bold text-[#0B1F3A] mt-1">{mockSubscribers.length}</p></Card>
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Active</p><p className="text-2xl font-bold text-green-600 mt-1">{mockSubscribers.filter(s => s.status === 'active').length}</p></Card>
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Unsubscribed</p><p className="text-2xl font-bold text-gray-500 mt-1">{mockSubscribers.filter(s => s.status === 'unsubscribed').length}</p></Card>
      </div>
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium text-[#0B1F3A]">{filtered.length} subscribers</p>
          <SearchBar value={search} onChange={setSearch} placeholder="Search subscribers…" />
        </div>
        <Table headers={['Email', 'Subscription Date', 'Status', 'Actions']}>
          {filtered.map(s => (
            <Tr key={s.id}>
              <Td className="font-medium text-[#0B1F3A]">{s.email}</Td>
              <Td className="font-mono text-xs text-gray-500">{s.date}</Td>
              <Td>
                <Badge label={s.status === 'active' ? 'Active' : 'Unsubscribed'} variant={s.status === 'active' ? 'success' : 'default'} />
              </Td>
              <Td>
                <Button variant="ghost" size="sm"><span className="text-red-400">Remove</span></Button>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// --- Users ---
export function UsersManager() {
  const [users, setUsers] = useState(mockUsers);
  const [alert, setAlert] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'content-manager'>('admin');

  function roleBadge(role: string) {
    if (role === 'super-admin') return <Badge label="Super Admin" variant="danger" />;
    if (role === 'admin') return <Badge label="Admin" variant="gold" />;
    return <Badge label="Content Manager" variant="info" />;
  }

  function toggleActive(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  }

  function handleAddUser() {
    if (!newUserEmail.trim()) return;
    setAlert(`User ${newUserName} added and invitation sent to ${newUserEmail}.`);
    setShowAddUser(false);
    setNewUserName(''); setNewUserEmail('');
  }

  return (
    <div>
      <PageHeader
        title="Users & Roles"
        subtitle="Manage administrator accounts and permissions"
        actions={<Button onClick={() => setShowAddUser(true)} icon="＋">Add User</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}

      {/* Role descriptions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { role: 'Super Admin', color: 'border-red-200 bg-red-50', desc: 'Full access to all settings, content and user management.' },
          { role: 'Admin', color: 'border-amber-200 bg-amber-50', desc: 'Can manage all content types. Cannot change system settings or user roles.' },
          { role: 'Content Manager', color: 'border-blue-200 bg-blue-50', desc: 'Can upload and edit assigned content. Cannot change settings or manage users.' },
        ].map(r => (
          <div key={r.role} className={`border rounded-lg p-3 ${r.color}`}>
            <p className="text-sm font-semibold text-[#0B1F3A]">{r.role}</p>
            <p className="text-xs text-gray-600 mt-1">{r.desc}</p>
          </div>
        ))}
      </div>

      {showAddUser && (
        <Card className="mb-6">
          <h4 className="font-semibold text-[#0B1F3A] mb-4">Add New User</h4>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Input label="Full Name" value={newUserName} onChange={setNewUserName} required placeholder="Full name" />
            <Input label="Email Address" type="email" value={newUserEmail} onChange={setNewUserEmail} required placeholder="user@asgc.org" />
            <Select label="Role" value={newUserRole} onChange={v => setNewUserRole(v as any)} options={[
              { value: 'admin', label: 'Admin' },
              { value: 'content-manager', label: 'Content Manager' },
            ]} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAddUser}>Send Invitation</Button>
            <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <Card padding={false}>
        <Table headers={['User', 'Email', 'Role', 'Last Login', 'Status', 'Actions']}>
          {users.map(u => (
            <Tr key={u.id}>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0B1F3A]/10 flex items-center justify-center text-xs font-bold text-[#0B1F3A]">
                    {u.name.charAt(0)}
                  </div>
                  <span className="font-medium text-[#0B1F3A]">{u.name}</span>
                </div>
              </Td>
              <Td className="text-gray-500">{u.email}</Td>
              <Td>{roleBadge(u.role)}</Td>
              <Td className="font-mono text-xs text-gray-500">{u.lastLogin}</Td>
              <Td>
                <Toggle checked={u.status === 'active'} onChange={() => toggleActive(u.id)} label={u.status === 'active' ? 'Active' : 'Inactive'} />
              </Td>
              <Td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">Edit</Button>
                  <Button variant="ghost" size="sm">Reset Password</Button>
                  {u.role !== 'super-admin' && <Button variant="ghost" size="sm"><span className="text-red-400">Remove</span></Button>}
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// --- Registrations ---
export function RegistrationsManager({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState('');

  const filtered = mockRegistrations.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    r.organisation.toLowerCase().includes(search.toLowerCase())
  );

  function statusBadge(s: string) {
    if (s === 'confirmed') return <Badge label="Confirmed" variant="success" />;
    if (s === 'pending') return <Badge label="Pending" variant="warning" />;
    return <Badge label="Cancelled" variant="danger" />;
  }

  return (
    <div>
      <PageHeader
        title="Registrations"
        subtitle="All event registrations across the website"
        actions={
          <Button variant="secondary" onClick={() => setAlert('Registrations exported to CSV.')}>Export CSV</Button>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Total Registrations</p><p className="text-2xl font-bold text-[#0B1F3A] mt-1">{mockRegistrations.length}</p></Card>
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Confirmed</p><p className="text-2xl font-bold text-green-600 mt-1">{mockRegistrations.filter(r => r.status === 'confirmed').length}</p></Card>
        <Card><p className="text-xs text-gray-500 uppercase font-semibold">Pending</p><p className="text-2xl font-bold text-amber-600 mt-1">{mockRegistrations.filter(r => r.status === 'pending').length}</p></Card>
      </div>
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium text-[#0B1F3A]">{filtered.length} registrations</p>
          <SearchBar value={search} onChange={setSearch} placeholder="Search registrations…" />
        </div>
        <Table headers={['Name', 'Email', 'Organisation', 'Event', 'Date', 'Status', 'Actions']}>
          {filtered.map(r => (
            <Tr key={r.id}>
              <Td className="font-medium text-[#0B1F3A]">{r.name}</Td>
              <Td className="text-gray-500">{r.email}</Td>
              <Td className="text-gray-500">{r.organisation}</Td>
              <Td className="text-[#0B1F3A] max-w-[200px] truncate">{r.eventTitle}</Td>
              <Td className="font-mono text-xs text-gray-500">{r.date}</Td>
              <Td>{statusBadge(r.status)}</Td>
              <Td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">Confirm</Button>
                  <Button variant="ghost" size="sm"><span className="text-red-400">Cancel</span></Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}

// --- Settings ---
export function WebsiteSettings() {
  const [tab, setTab] = useState('Branding');
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);

  const [orgName, setOrgName] = useState('Ahmed Sule Global Centre');
  const [tagline, setTagline] = useState('Empowering Africa\'s Economic Future');
  const [email, setEmail] = useState('info@asgc.us.com');
  const [phone, setPhone] = useState('+234 805 757 6575');
  const [address, setAddress] = useState('Plot 123, Adetokunbo Ademola Crescent, Wuse II, Abuja, Nigeria');
  const [twitter, setTwitter] = useState('@ASGCofficial');
  const [linkedin, setLinkedin] = useState('asgc-org');
  const [facebook, setFacebook] = useState('ASGCofficial');
  const [seoTitle, setSeoTitle] = useState('ASGC');
  const [seoDesc, setSeoDesc] = useState('Ahmed Sule Global Centre (ASGC) is a leading institution championing responsible investment and economic development across Africa.');
  const [footerText, setFooterText] = useState('© 2025 Ahmed Sule Global Centre. All rights reserved.');

  function handleSave() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAlert('Settings saved successfully.'); }, 600);
  }

  return (
    <div>
      <PageHeader
        title="Website Settings"
        subtitle="Configure global website settings, branding and SEO"
        actions={<Button onClick={handleSave} disabled={saving} icon="✓">{saving ? 'Saving…' : 'Save Changes'}</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Tabs tabs={['Branding', 'Organisation', 'Social Media', 'SEO', 'Footer']} active={tab} onChange={setTab} />
      <div className="max-w-2xl">
        {tab === 'Branding' && (
          <Card>
            <div className="flex flex-col gap-5">
              <div>
                <p className="text-sm font-medium text-[#0B1F3A] mb-2">Organisation Logo</p>
                <div className="flex items-center gap-4 p-4 bg-[#0B1F3A] rounded-lg mb-3">
                  <img src="/ASGC_White_Logo.png" alt="ASGC" className="w-10 h-10 object-contain flex-shrink-0" />
                  <p className="text-white font-bold">Ahmed Sule Global Centre</p>
                </div>
                <UploadArea label="Upload New Logo" accept="PNG, SVG" helper="White/transparent version for dark backgrounds — 200 × 60px minimum" />
              </div>
              <Input label="Tagline" value={tagline} onChange={setTagline} helper="Shown beneath the logo and in key positions on the website" />
              <div>
                <p className="text-sm font-medium text-[#0B1F3A] mb-2">Brand Colours</p>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border border-gray-200" style={{ background: '#0B1F3A' }} />
                    <div><p className="text-xs font-medium text-[#0B1F3A]">Navy</p><p className="text-xs text-gray-400 font-mono">#0B1F3A</p></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded border border-gray-200" style={{ background: '#C9A84C' }} />
                    <div><p className="text-xs font-medium text-[#0B1F3A]">Gold</p><p className="text-xs text-gray-400 font-mono">#C9A84C</p></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        {tab === 'Organisation' && (
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Organisation Name" value={orgName} onChange={setOrgName} required />
              <Input label="Primary Email Address" type="email" value={email} onChange={setEmail} />
              <Input label="CEO Email" type="email" value="ceo@asgc.us.com" onChange={() => {}} />
              <Input label="Phone Number" value={phone} onChange={setPhone} />
              <Textarea label="Physical Address" value={address} onChange={setAddress} rows={3} />
              <Input label="Contact Form Email (Recipient)" type="email" value="info@asgc.us.com" onChange={() => {}} helper="Messages from the contact form will be sent to this address" />
            </div>
          </Card>
        )}
        {tab === 'Social Media' && (
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Twitter / X Handle" value={twitter} onChange={setTwitter} placeholder="@handle" />
              <Input label="LinkedIn Page" value={linkedin} onChange={setLinkedin} placeholder="company/page-name" />
              <Input label="Facebook Page" value={facebook} onChange={setFacebook} placeholder="PageName" />
              <Input label="YouTube Channel" value="" onChange={() => {}} placeholder="@channel or URL" />
              <Input label="Instagram Handle" value="" onChange={() => {}} placeholder="@handle" />
            </div>
          </Card>
        )}
        {tab === 'SEO' && (
          <Card>
            <div className="flex flex-col gap-4">
              <Input label="Default SEO Title" value={seoTitle} onChange={setSeoTitle} helper="Used on pages that don't have their own SEO title" />
              <Textarea label="Default SEO Description" value={seoDesc} onChange={setSeoDesc} rows={3} helper="Used on pages that don't have their own meta description" />
              <Input label="Google Analytics ID" value="" onChange={() => {}} placeholder="G-XXXXXXXXXX" />
              <Input label="Facebook Pixel ID" value="" onChange={() => {}} placeholder="Optional" />
            </div>
          </Card>
        )}
        {tab === 'Footer' && (
          <Card>
            <div className="flex flex-col gap-4">
              <Textarea label="Footer Text" value={footerText} onChange={setFooterText} rows={2} />
              <Textarea label="Footer About Text" value="Ahmed Sule Global Centre (ASGC) is dedicated to facilitating responsible investment and sustainable economic development across Africa." onChange={() => {}} rows={3} />
              <Input label="Footer Contact Email" type="email" value={email} onChange={setEmail} />
            </div>
          </Card>
        )}
        <div className="mt-4">
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</Button>
        </div>
      </div>
    </div>
  );
}

// --- Pages Manager ---
export function PagesManager() {
  const [alert, setAlert] = useState('');

  const pages = [
    { id: '1', name: 'Home', slug: '/', sections: ['Hero', 'Introduction', 'Vision & Mission', 'Featured Programmes', 'Partnerships', 'Contact CTA'], status: 'published' },
    { id: '2', name: 'About ASGC', slug: '/about', sections: ['Hero', 'Mandate', 'History', 'Vision & Mission', 'Founder', 'Team'], status: 'published' },
    { id: '3', name: 'Programmes', slug: '/programmes', sections: ['Hero', 'Programme Listing', 'Apply CTA'], status: 'published' },
    { id: '4', name: 'News & Insights', slug: '/news', sections: ['Hero', 'Article Listing', 'Category Filter'], status: 'published' },
    { id: '5', name: 'Publications', slug: '/publications', sections: ['Hero', 'Publication Listing', 'Filter & Search'], status: 'published' },
    { id: '6', name: 'Events', slug: '/events', sections: ['Hero', 'Upcoming Events', 'Past Events'], status: 'published' },
    { id: '7', name: 'Contact', slug: '/contact', sections: ['Contact Form', 'Address & Map', 'Social Links'], status: 'published' },
  ];

  return (
    <div>
      <PageHeader
        title="Website Pages"
        subtitle="Edit page content and sections without coding"
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-1 gap-4">
        {pages.map(page => (
          <Card key={page.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-[#0B1F3A]">{page.name}</h3>
                  <Badge label="Published" variant="success" />
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">asgc.org{page.slug}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {page.sections.map(s => (
                    <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <Button variant="outline" size="sm" onClick={() => setAlert(`Editing ${page.name}. Changes auto-save every 30 seconds.`)}>Edit Page</Button>
                <Button variant="ghost" size="sm" onClick={() => {}}>Preview</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
