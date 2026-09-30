import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput } from '../../components/admin/ui';

const MESSAGES = [
  { id: '1', name: 'Olusegun Adeyemi', email: 'o.adeyemi@invest.ng', subject: 'Partnership enquiry — Nigerian Investment Promotion Commission', date: '29 Sep 2026', status: 'unread', body: 'Dear ASGC Team,\n\nI am reaching out on behalf of the Nigerian Investment Promotion Commission to explore potential partnership opportunities with your esteemed organisation. We believe there is significant alignment between ASGC\'s mandate and NIPC\'s strategic objectives for attracting sustainable foreign direct investment to Nigeria.\n\nI would be grateful for the opportunity to discuss this further at your earliest convenience.\n\nKind regards,\nOlusegun Adeyemi\nDirector, International Partnerships\nNigerian Investment Promotion Commission' },
  { id: '2', name: 'Dr. Amina Kofi', email: 'a.kofi@ecowas.int', subject: 'Request for ASGC participation — ECOWAS Trade Forum 2026', date: '28 Sep 2026', status: 'unread', body: 'Dear ASGC,\n\nI write on behalf of the ECOWAS Commission to formally invite ASGC to participate in the upcoming ECOWAS Trade Forum 2026 scheduled for November 2026 in Abuja.\n\nWe would be delighted to have Ambassador Sule address the forum on Africa\'s strategic investment landscape.\n\nBest regards,\nDr. Amina Kofi\nHead of Trade Facilitation, ECOWAS' },
  { id: '3', name: 'Kwame Boateng', email: 'k.boateng@private.gh', subject: 'Media enquiry — Interview request', date: '27 Sep 2026', status: 'read', body: 'Good day,\n\nI am a journalist with The Africa Business Review and am working on a feature about ASGC\'s work in advancing responsible investment frameworks. I would welcome the opportunity to interview Ambassador Sule.\n\nPlease advise on your media contact process.\n\nKind regards,\nKwame Boateng' },
  { id: '4', name: 'Fatima Ouédraogo', email: 'f.ouedraogo@undp.org', subject: 'UNDP–ASGC collaboration proposal', date: '25 Sep 2026', status: 'read', body: 'Dear ASGC,\n\nThe UNDP Africa team would like to explore areas of collaboration with ASGC on our Sustainable Development Goals acceleration programmes. Could we arrange a call in the coming weeks?\n\nWith warm regards,\nFatima Ouédraogo\nUNDP Africa Partnerships' },
  { id: '5', name: 'Emmanuel Asante', email: 'e.asante@student.ac.gh', subject: 'Research assistance request', date: '22 Sep 2026', status: 'archived', body: 'Dear Sir/Madam,\n\nI am a postgraduate student at the University of Ghana conducting research on African trade facilitation. I write to request access to ASGC\'s published research materials and to enquire whether internship opportunities are available.\n\nThank you for your time.\n\nEmmanuel Asante' },
];

export default function MessagesInbox() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = MESSAGES.filter(m =>
    (filter === 'all' || m.status === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()))
  );

  const selectedMsg = MESSAGES.find(m => m.id === selected);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Messages"
        subtitle="Contact messages received through the ASGC website."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-sm px-2.5 py-1 rounded-full font-medium" style={{ background: '#fef3c7', color: '#d97706' }}>
              {MESSAGES.filter(m => m.status === 'unread').length} unread
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 h-[calc(100vh-220px)] min-h-[500px]">
        {/* Message list */}
        <div className="lg:col-span-2 flex flex-col">
          <Card className="flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-3 border-b space-y-2 flex-shrink-0" style={{ borderColor: '#f0f2f5' }}>
              <SearchInput value={search} onChange={setSearch} placeholder="Search messages…" />
              <div className="flex gap-1">
                {['all', 'unread', 'read', 'archived'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className="px-2.5 py-1 text-xs rounded-md capitalize font-medium transition-colors"
                    style={{ background: filter === f ? '#0a1628' : 'transparent', color: filter === f ? '#fff' : '#6b7280' }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: '#f0f2f5' }}>
              {filtered.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelected(msg.id)}
                  className="w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors"
                  style={{ background: selected === msg.id ? '#fffbeb' : msg.status === 'unread' ? '#f8faff' : 'transparent' }}
                >
                  <div className="flex items-start gap-2.5">
                    {msg.status === 'unread' && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#c9a84c' }} />}
                    <div className="flex-1 min-w-0" style={{ paddingLeft: msg.status !== 'unread' ? '14px' : '0' }}>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: '#0a1628' }}>{msg.name}</p>
                        <p className="text-xs flex-shrink-0" style={{ color: '#9ca3af' }}>{msg.date.split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                      <p className="text-xs font-medium mt-0.5 truncate" style={{ color: '#374151' }}>{msg.subject}</p>
                      <p className="text-xs mt-1 line-clamp-1" style={{ color: '#9ca3af' }}>{msg.body.split('\n\n')[1] || msg.body.slice(0, 80)}</p>
                    </div>
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12" style={{ color: '#9ca3af' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <p className="text-sm mt-2">No messages found</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 flex flex-col">
          {selectedMsg ? (
            <Card className="flex flex-col flex-1 overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#f0f2f5' }}>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="font-semibold text-base" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>{selectedMsg.subject}</h3>
                  <Badge label={selectedMsg.status} variant={selectedMsg.status === 'unread' ? 'warning' : selectedMsg.status === 'archived' ? 'muted' : 'success'} />
                </div>
                <div className="flex items-center gap-4 text-xs" style={{ color: '#6b7280' }}>
                  <span><strong style={{ color: '#374151' }}>From:</strong> {selectedMsg.name} &lt;{selectedMsg.email}&gt;</span>
                  <span><strong style={{ color: '#374151' }}>Date:</strong> {selectedMsg.date}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <Btn size="sm" variant="outline" onClick={() => showToast('Marked as read.')}>Mark Read</Btn>
                  <Btn size="sm" variant="outline" onClick={() => showToast('Message archived.')}>Archive</Btn>
                  <Btn size="sm" variant="ghost" onClick={() => showToast('Message deleted.')}>Delete</Btn>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5">
                <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#374151' }}>{selectedMsg.body}</div>
              </div>

              {/* Reply area */}
              <div className="px-5 py-4 border-t flex-shrink-0" style={{ borderColor: '#f0f2f5' }}>
                <p className="text-xs font-medium mb-2" style={{ color: '#374151' }}>Reply (sent via your email client)</p>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`Reply to ${selectedMsg.name}…`}
                  className="w-full px-3 py-2 text-sm rounded-lg border resize-none"
                  style={{ borderColor: '#e2e4e9', outline: 'none' }}
                  onFocus={e => (e.target.style.borderColor = '#c9a84c')}
                  onBlur={e => (e.target.style.borderColor = '#e2e4e9')}
                />
                <div className="flex justify-end mt-2">
                  <Btn variant="primary" size="sm" onClick={() => { showToast('Reply sent via email.'); setReplyText(''); }}>Send Reply</Btn>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0f2f5' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <p className="text-sm font-medium" style={{ color: '#374151' }}>Select a message to read</p>
                <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Choose from the list on the left</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}
