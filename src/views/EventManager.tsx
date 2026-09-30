import React, { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Table, Tr, Td, StatusDot, Pagination, ConfirmDialog, Alert, Breadcrumb, Card, Input, Textarea, Select, UploadArea, Tabs, Toggle } from '../components/ui';
import { mockEvents, mockRegistrations } from '../data';
import type { AdminView } from '../types';

function statusBadge(s: string) {
  const map: Record<string, React.ReactElement> = {
    upcoming: <Badge label="Upcoming" variant="info" />,
    ongoing: <Badge label="Ongoing" variant="gold" />,
    past: <Badge label="Past" variant="default" />,
    draft: <Badge label="Draft" variant="warning" />,
  };
  return map[s] ?? <Badge label={s} variant="default" />;
}

export function EventList({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [alert, setAlert] = useState('');

  const filtered = mockEvents
    .filter(e => filter === 'All' || e.status === filter.toLowerCase())
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
  const paged = filtered.slice((page - 1) * 5, page * 5);

  return (
    <div>
      <PageHeader
        title="Events"
        subtitle="Create and manage ASGC conferences, workshops and forums"
        actions={<Button onClick={() => onNavigate('event-editor')} icon="＋">Add New Event</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            {['All', 'Upcoming', 'Past', 'Draft'].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filter === f ? 'bg-[#0B1F3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search events…" />
        </div>
        <Table headers={['', 'Event', 'Date', 'Venue', 'Registrations', 'Status', 'Actions']}>
          {paged.map(event => {
            const regs = mockRegistrations.filter(r => r.eventId === event.id);
            return (
              <Tr key={event.id}>
                <Td><StatusDot status={event.status as any} /></Td>
                <Td>
                  <p className="font-medium text-[#0B1F3A]">{event.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{event.time}</p>
                </Td>
                <Td className="font-mono text-xs text-gray-500">{event.date}</Td>
                <Td className="text-gray-500 max-w-[200px] truncate">{event.venue}</Td>
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#0B1F3A]">{event.registered}/{event.capacity}</span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${Math.min(100, (event.registered / event.capacity) * 100)}%` }} />
                    </div>
                  </div>
                </Td>
                <Td>{statusBadge(event.status)}</Td>
                <Td>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('event-editor')}>Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => onNavigate('event-registrations')}>Registrations ({regs.length})</Button>
                  </div>
                </Td>
              </Tr>
            );
          })}
        </Table>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={5} onChange={setPage} />
        </div>
      </Card>
      {deleteTarget && (
        <ConfirmDialog title="Delete Event" message="Delete this event and all associated registrations? This cannot be undone."
          onConfirm={() => { setDeleteTarget(null); setAlert('Event deleted.'); }} onCancel={() => setDeleteTarget(null)} danger />
      )}
    </div>
  );
}

export function EventEditor({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [venue, setVenue] = useState('');
  const [capacity, setCapacity] = useState('');
  const [regOpen, setRegOpen] = useState(true);
  const [alert, setAlert] = useState('');
  const [saving, setSaving] = useState(false);
  const [speakers, setSpeakers] = useState('');
  const [agenda, setAgenda] = useState('');
  const [tab, setTab] = useState('Details');

  function handlePublish() {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAlert('Event published successfully.'); }, 600);
  }

  return (
    <div>
      <Breadcrumb items={['Events', title || 'New Event']} />
      <PageHeader
        title={title || 'New Event'}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('events')}>Cancel</Button>
            <Button variant="outline" onClick={() => setAlert('Draft saved.')}>Save Draft</Button>
            <Button onClick={handlePublish} disabled={saving}>
              {saving ? 'Publishing…' : 'Publish Event'}
            </Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Tabs tabs={['Details', 'Speakers & Agenda', 'Registration', 'Media & Attachments']} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {tab === 'Details' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Input label="Event Title" value={title} onChange={setTitle} placeholder="e.g. ASGC Annual Investment Symposium 2025" required />
                <Textarea label="Event Description" value={desc} onChange={setDesc} placeholder="Detailed description of the event, its purpose and expected outcomes" rows={5} required />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Event Date" type="date" value={date} onChange={setDate} required />
                  <Input label="Venue" value={venue} onChange={setVenue} placeholder="e.g. Transcorp Hilton, Abuja" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Start Time" type="time" value={startTime} onChange={setStartTime} required />
                  <Input label="End Time" type="time" value={endTime} onChange={setEndTime} />
                </div>
              </div>
            </Card>
          )}
          {tab === 'Speakers & Agenda' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Textarea label="Speakers" value={speakers} onChange={setSpeakers} placeholder="List of speakers, their names, titles and organisations (one per line)" rows={5} />
                <Textarea label="Programme / Agenda" value={agenda} onChange={setAgenda} placeholder="09:00 – Opening Remarks&#10;09:30 – Keynote Address&#10;10:30 – Panel Discussion&#10;..." rows={8} />
              </div>
            </Card>
          )}
          {tab === 'Registration' && (
            <Card>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-[#0B1F3A]">Registration Open</p>
                    <p className="text-xs text-gray-500">Allow visitors to register for this event</p>
                  </div>
                  <Toggle checked={regOpen} onChange={setRegOpen} />
                </div>
                <Input label="Registration Capacity" value={capacity} onChange={setCapacity} placeholder="Maximum number of attendees" type="number" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Registration Opening Date" type="date" value="" onChange={() => {}} />
                  <Input label="Registration Closing Date" type="date" value="" onChange={() => {}} />
                </div>
              </div>
            </Card>
          )}
          {tab === 'Media & Attachments' && (
            <Card>
              <UploadArea label="Upload Event Banner" accept="JPG, PNG, WebP" helper="Recommended: 1600 × 600px" />
              <div className="mt-4">
                <UploadArea label="Upload Attachments" accept="PDF, DOCX, PPTX" helper="Programme booklets, registration forms, background documents" />
              </div>
            </Card>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Event Status</h4>
            <Select label="" value="upcoming" onChange={() => {}} options={[
              { value: 'draft', label: 'Draft' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'ongoing', label: 'Ongoing' },
              { value: 'past', label: 'Past' },
            ]} />
            <div className="mt-4 flex flex-col gap-2">
              <Button className="w-full justify-center" onClick={handlePublish} disabled={saving}>Publish Event</Button>
              <Button variant="outline" className="w-full justify-center" onClick={() => setAlert('Draft saved.')}>Save Draft</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function EventRegistrations({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [search, setSearch] = useState('');

  const regs = mockRegistrations.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase()) ||
    r.organisation.toLowerCase().includes(search.toLowerCase())
  );

  function statusBadge(s: string) {
    if (s === 'confirmed') return <Badge label="Confirmed" variant="success" />;
    if (s === 'pending') return <Badge label="Pending" variant="warning" />;
    return <Badge label="Cancelled" variant="danger" />;
  }

  return (
    <div>
      <Breadcrumb items={['Events', 'ASGC Annual Investment Symposium 2025', 'Registrations']} />
      <PageHeader
        title="Event Registrations"
        subtitle="ASGC Annual Investment Symposium 2025 — 187 registered"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('events')}>← Back to Events</Button>
            <Button variant="secondary" onClick={() => {}}>Export CSV</Button>
          </div>
        }
      />
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <p className="text-xs text-gray-500 uppercase font-semibold">Confirmed</p>
          <p className="text-2xl font-bold text-green-600 mt-1">2</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-semibold">Pending</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">1</p>
        </Card>
        <Card>
          <p className="text-xs text-gray-500 uppercase font-semibold">Cancelled</p>
          <p className="text-2xl font-bold text-gray-500 mt-1">0</p>
        </Card>
      </div>
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <p className="text-sm font-medium text-[#0B1F3A]">All Registrations ({regs.length})</p>
          <SearchBar value={search} onChange={setSearch} placeholder="Search registrants…" />
        </div>
        <Table headers={['Name', 'Email', 'Phone', 'Organisation', 'Registration Date', 'Status', 'Actions']}>
          {regs.map(r => (
            <Tr key={r.id}>
              <Td className="font-medium text-[#0B1F3A]">{r.name}</Td>
              <Td className="text-gray-500">{r.email}</Td>
              <Td className="text-gray-500 font-mono text-xs">{r.phone}</Td>
              <Td className="text-gray-500">{r.organisation}</Td>
              <Td className="text-gray-500 font-mono text-xs">{r.date}</Td>
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
