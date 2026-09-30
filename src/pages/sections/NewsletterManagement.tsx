import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Table, Pagination } from '../../components/admin/ui';

const SUBSCRIBERS = [
  { id: '1', email: 'o.adeyemi@invest.ng', name: 'Olusegun Adeyemi', date: '15 Jan 2026', status: 'active' },
  { id: '2', email: 'a.kofi@ecowas.int', name: 'Dr. Amina Kofi', date: '20 Feb 2026', status: 'active' },
  { id: '3', email: 'k.boateng@africanews.com', name: 'Kwame Boateng', date: '3 Mar 2026', status: 'active' },
  { id: '4', email: 'f.ouedraogo@undp.org', name: 'Fatima Ouédraogo', date: '10 Apr 2026', status: 'active' },
  { id: '5', email: 'e.asante@student.ac.gh', name: 'Emmanuel Asante', date: '25 May 2026', status: 'unsubscribed' },
  { id: '6', email: 'ngozi.okafor@uba.com', name: 'Ngozi Okafor', date: '1 Jun 2026', status: 'active' },
  { id: '7', email: 'diallo.ibrahim@au.int', name: 'Ibrahim Diallo', date: '14 Jun 2026', status: 'active' },
  { id: '8', email: 'mwangi.w@kenyagov.ke', name: 'Wanjiru Mwangi', date: '22 Jul 2026', status: 'active' },
  { id: '9', email: 'yinka.balogun@fidelitybank.ng', name: 'Yinka Balogun', date: '5 Aug 2026', status: 'active' },
  { id: '10', email: 'a.ibrahim@african-union.org', name: 'Abubakar Ibrahim', date: '19 Sep 2026', status: 'active' },
];

export default function NewsletterManagement() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = SUBSCRIBERS.filter(s =>
    (filter === 'all' || s.status === filter) &&
    (s.email.toLowerCase().includes(search.toLowerCase()) || (s.name || '').toLowerCase().includes(search.toLowerCase()))
  );

  const activeCount = SUBSCRIBERS.filter(s => s.status === 'active').length;
  const unsubCount = SUBSCRIBERS.filter(s => s.status === 'unsubscribed').length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Newsletter Subscribers"
        subtitle="Manage email newsletter subscribers and mailing list."
        actions={<Btn variant="outline" icon={<DownloadIcon />} onClick={() => showToast('Subscriber list exported to CSV.')}>Export CSV</Btn>}
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'Total Subscribers', value: SUBSCRIBERS.length, color: '#0a1628' },
          { label: 'Active', value: activeCount, color: '#16a34a' },
          { label: 'Unsubscribed', value: unsubCount, color: '#6b7280' },
        ].map(stat => (
          <Card key={stat.label} className="p-5 text-center">
            <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{stat.label}</p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search subscribers…" />
          <div className="flex gap-1">
            {['all', 'active', 'unsubscribed'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className="px-3 py-1.5 text-xs rounded-md capitalize font-medium transition-colors"
                style={{ background: filter === f ? '#0a1628' : '#f0f2f5', color: filter === f ? '#fff' : '#6b7280' }}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} subscribers</span>
        </div>

        <Table
          columns={[
            { key: 'email', label: 'Email Address' },
            { key: 'name', label: 'Name', width: '160px' },
            { key: 'date', label: 'Subscribed', width: '110px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'actions', label: 'Actions', width: '100px' },
          ]}
          rows={filtered.map(s => ({
            email: <span className="font-medium text-sm" style={{ color: '#0a1628' }}>{s.email}</span>,
            name: <span className="text-sm" style={{ color: '#6b7280' }}>{s.name || '—'}</span>,
            date: <span className="text-sm" style={{ color: '#6b7280' }}>{s.date}</span>,
            status: <Badge label={s.status} variant={s.status === 'active' ? 'success' : 'muted'} />,
            actions: (
              <button
                onClick={() => { setConfirm(s.id); }}
                className="text-xs hover:opacity-70 font-medium"
                style={{ color: '#dc2626' }}
              >
                Remove
              </button>
            ),
          }))}
        />
        <div className="px-5 py-3">
          <Pagination page={page} total={filtered.length} perPage={10} onChange={setPage} />
        </div>
      </Card>

      {/* Import box */}
      <Card className="mt-5 p-5">
        <p className="text-sm font-semibold mb-1" style={{ color: '#374151' }}>Import Subscribers</p>
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>Upload a CSV file with columns: Email, Name (optional)</p>
        <div className="border-2 border-dashed rounded-xl p-6 text-center" style={{ borderColor: '#e2e4e9' }}>
          <svg className="mx-auto mb-2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <p className="text-xs" style={{ color: '#9ca3af' }}>Click to upload CSV or drag and drop</p>
        </div>
      </Card>

      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <Card className="p-6 max-w-sm w-full">
            <h3 className="font-semibold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>Remove Subscriber</h3>
            <p className="text-sm mb-5" style={{ color: '#374151' }}>Remove this subscriber from the mailing list? They will no longer receive ASGC newsletters.</p>
            <div className="flex gap-2 justify-end">
              <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
              <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Subscriber removed.'); }}>Remove</Btn>
            </div>
          </Card>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function DownloadIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>; }
