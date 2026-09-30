import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Table, Pagination, Modal, FormField, Input, Textarea, Select, UploadBox, Tabs } from '../../components/admin/ui';

const EVENTS = [
  { id: '1', title: 'Africa Investment Summit 2026', date: '15 Oct 2026', venue: 'Abuja International Conference Centre', status: 'upcoming', registrations: 88, capacity: 150 },
  { id: '2', title: 'ASGC Policy Dialogue Forum', date: '22 Oct 2026', venue: 'Lagos Business School', status: 'upcoming', registrations: 34, capacity: 80 },
  { id: '3', title: 'Trade & Investment Symposium', date: '5 Nov 2026', venue: 'Nairobi Convention Centre', status: 'upcoming', registrations: 12, capacity: 100 },
  { id: '4', title: 'African Economic Forum 2026', date: '12–14 Sep 2026', venue: 'Accra International Conference Centre', status: 'past', registrations: 210, capacity: 200 },
  { id: '5', title: 'Youth Entrepreneurship Roundtable', date: '28 Aug 2026', venue: 'Virtual / Zoom', status: 'past', registrations: 97, capacity: 150 },
];

const REGISTRATIONS = [
  { name: 'Olusegun Adeyemi', email: 'o.adeyemi@invest.ng', phone: '+234 803 456 7890', org: 'Nigerian Investment Promotion Commission', date: '20 Sep 2026', status: 'confirmed' },
  { name: 'Fatima Al-Hassan', email: 'f.hassan@trade.gh', phone: '+233 24 567 8901', org: 'Ghana Trade Commission', date: '21 Sep 2026', status: 'confirmed' },
  { name: 'Kwame Mensah', email: 'k.mensah@au.int', phone: '+251 911 234 567', org: 'African Union Commission', date: '22 Sep 2026', status: 'confirmed' },
  { name: 'Aisha Diallo', email: 'a.diallo@sengov.sn', phone: '+221 77 890 1234', org: 'Senegal Ministry of Finance', date: '23 Sep 2026', status: 'pending' },
  { name: 'Emmanuel Osei', email: 'e.osei@afdb.org', phone: '+225 27 20 26 79 00', org: 'African Development Bank', date: '24 Sep 2026', status: 'confirmed' },
  { name: 'Ngozi Okafor', email: 'n.okafor@uba.com', phone: '+234 700 222 5822', org: 'United Bank for Africa', date: '25 Sep 2026', status: 'cancelled' },
];

export default function EventManagement() {
  const [tab, setTab] = useState('Events');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (editing || isNew) {
    return <EventEditor eventId={editing} onBack={() => { setEditing(null); setIsNew(false); }} onSave={msg => { setEditing(null); setIsNew(false); showToast(msg); }} />;
  }

  if (selectedEvent) {
    return <RegistrationsTable eventTitle={EVENTS.find(e => e.id === selectedEvent)?.title || ''} onBack={() => setSelectedEvent(null)} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Events"
        subtitle="Manage events, registrations and attendee information."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Add New Event</Btn>}
      />

      <div className="mb-5 w-fit">
        <Tabs tabs={['Events', 'Registrations']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Events' && (
        <Card>
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
            <SearchInput value={search} onChange={setSearch} placeholder="Search events…" />
            <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{EVENTS.length} events</span>
          </div>

          <div className="divide-y" style={{ borderColor: '#f0f2f5' }}>
            {EVENTS.map(ev => (
              <div key={ev.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0a1628, #132040)' }}>
                  <span className="text-xs font-bold" style={{ color: '#c9a84c' }}>{ev.date.split(' ')[0]}</span>
                  <span className="text-xs text-white opacity-70">{ev.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{ev.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{ev.venue}</p>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>{ev.registrations}/{ev.capacity}</p>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>Registrations</p>
                  </div>
                  <div className="w-20">
                    <div className="h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                      <div className="h-full rounded-full" style={{ width: `${Math.min((ev.registrations / ev.capacity) * 100, 100)}%`, background: ev.registrations >= ev.capacity ? '#dc2626' : '#16a34a' }} />
                    </div>
                    <p className="text-xs mt-1 text-center" style={{ color: '#9ca3af' }}>{Math.round((ev.registrations / ev.capacity) * 100)}%</p>
                  </div>
                  <Badge label={ev.status} variant={ev.status === 'upcoming' ? 'success' : 'muted'} />
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditing(ev.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                    <button onClick={() => setSelectedEvent(ev.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Registrations</button>
                    <button onClick={() => setConfirm(ev.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab === 'Registrations' && (
        <RegistrationsTable eventTitle="All Events" onBack={() => {}} showBack={false} />
      )}

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Event"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Event deleted.'); }}>Delete Event</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this event? All associated registrations will also be deleted.</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function RegistrationsTable({ eventTitle, onBack, showBack = true }: { eventTitle: string; onBack: () => void; showBack?: boolean }) {
  const [search, setSearch] = useState('');
  const filtered = REGISTRATIONS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase()) || r.org.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showBack && (
        <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
          <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Events</button>
          <span>/</span>
          <span style={{ color: '#0a1628' }}>Registrations</span>
        </div>
      )}
      <PageHeader
        title={`Registrations: ${eventTitle}`}
        subtitle={`${REGISTRATIONS.length} total registrations`}
        actions={
          <Btn variant="outline" icon={<DownloadIcon />}>Export CSV</Btn>
        }
      />
      <Card>
        <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search registrants…" />
        </div>
        <Table
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'phone', label: 'Phone', width: '140px' },
            { key: 'org', label: 'Organisation' },
            { key: 'date', label: 'Registered', width: '110px' },
            { key: 'status', label: 'Status', width: '100px' },
          ]}
          rows={filtered.map(r => ({
            name: <span className="font-medium" style={{ color: '#0a1628' }}>{r.name}</span>,
            email: <span style={{ color: '#6b7280' }}>{r.email}</span>,
            phone: <span style={{ color: '#6b7280' }}>{r.phone}</span>,
            org: <span style={{ color: '#6b7280' }}>{r.org}</span>,
            date: <span style={{ color: '#6b7280' }}>{r.date}</span>,
            status: <Badge label={r.status} variant={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'warning' : 'danger'} />,
          }))}
        />
      </Card>
    </div>
  );
}

function EventEditor({ eventId, onBack, onSave }: { eventId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const [title, setTitle] = useState(eventId ? 'Africa Investment Summit 2026' : '');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Events</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{eventId ? 'Edit Event' : 'New Event'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{eventId ? 'Edit Event' : 'New Event'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Save Draft</Btn>
          <Btn variant="ghost" size="sm">Preview</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Event published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Event Title" required>
              <Input value={title} onChange={setTitle} placeholder="Enter event title…" />
            </FormField>
            <FormField label="Description" required>
              <Textarea rows={4} placeholder="Event description and overview…" defaultValue={eventId ? 'The Africa Investment Summit 2026 is ASGC\'s flagship annual event bringing together policymakers, investors, and development partners to accelerate sustainable investment across Africa.' : ''} />
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Event Date" required>
                <Input type="date" value={eventId ? '2026-10-15' : ''} />
              </FormField>
              <FormField label="Venue" required>
                <Input defaultValue={eventId ? 'Abuja International Conference Centre' : ''} placeholder="Event location…" />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Start Time">
                <Input type="time" defaultValue="09:00" />
              </FormField>
              <FormField label="End Time">
                <Input type="time" defaultValue="17:00" />
              </FormField>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Speakers & Agenda</p>
            <FormField label="Speakers" hint="Enter speaker names and titles">
              <Textarea rows={3} placeholder="Speaker 1: Name, Title, Organisation&#10;Speaker 2: Name, Title, Organisation" />
            </FormField>
            <FormField label="Programme / Agenda">
              <Textarea rows={4} placeholder="09:00 – Registration&#10;09:30 – Opening remarks&#10;10:00 – Panel discussion…" />
            </FormField>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Event Image & Attachments</p>
            <div className="grid grid-cols-2 gap-4">
              <UploadBox label="Upload event image" accept="image/*" hint="Recommended: 1200×630px" />
              <UploadBox label="Upload attachments" accept=".pdf,.doc" hint="Programme, agenda, etc." />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Registration Settings</p>
            <FormField label="Registration Status">
              <Select options={[{ value: 'open', label: 'Open' }, { value: 'closed', label: 'Closed' }, { value: 'waitlist', label: 'Waitlist Only' }]} value="open" />
            </FormField>
            <FormField label="Registration Capacity">
              <Input type="number" defaultValue={eventId ? '150' : ''} placeholder="Max attendees…" />
            </FormField>
            <FormField label="Registration Opens">
              <Input type="date" />
            </FormField>
            <FormField label="Registration Closes">
              <Input type="date" defaultValue={eventId ? '2026-10-10' : ''} />
            </FormField>
          </Card>

          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Status</p>
            <Select options={[{ value: 'draft', label: 'Draft' }, { value: 'upcoming', label: 'Upcoming' }, { value: 'ongoing', label: 'Ongoing' }, { value: 'past', label: 'Past' }]} value="upcoming" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
