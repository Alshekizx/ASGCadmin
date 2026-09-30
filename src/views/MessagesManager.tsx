import { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Alert, Card, Breadcrumb } from '../components/ui';
import { mockMessages } from '../data';
import type { AdminView, Message } from '../types';

function statusBadge(s: Message['status']) {
  if (s === 'unread') return <Badge label="Unread" variant="gold" />;
  if (s === 'read') return <Badge label="Read" variant="default" />;
  if (s === 'replied') return <Badge label="Replied" variant="success" />;
  return <Badge label="Archived" variant="default" />;
}

export function MessagesList({ onNavigate, onSelectMessage }: { onNavigate: (v: AdminView) => void; onSelectMessage: (id: string) => void }) {
  const [messages, setMessages] = useState(mockMessages);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [alert, setAlert] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = messages
    .filter(m => filter === 'All' || m.status === filter.toLowerCase())
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));

  const selected = messages.find(m => m.id === selectedId);

  function markRead(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' as const } : m));
  }

  function archive(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'archived' as const } : m));
    setSelectedId(null);
    setAlert('Message archived.');
  }

  function handleSelect(id: string) {
    setSelectedId(id);
    markRead(id);
  }

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle="Enquiries and contact form submissions"
        actions={
          <div className="flex gap-2">
            <Badge label={`${messages.filter(m => m.status === 'unread').length} unread`} variant="gold" />
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[600px]">
        {/* Message list */}
        <div className="lg:col-span-2 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-3 border-b border-gray-100">
            <div className="flex gap-1 mb-2">
              {['All', 'Unread', 'Read', 'Replied', 'Archived'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${filter === f ? 'bg-[#0B1F3A] text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
                  {f}
                </button>
              ))}
            </div>
            <SearchBar value={search} onChange={setSearch} placeholder="Search messages…" />
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 scrollbar-thin">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
                <span className="text-2xl mb-2">📭</span>
                <span>No messages found</span>
              </div>
            )}
            {filtered.map(msg => (
              <div
                key={msg.id}
                onClick={() => handleSelect(msg.id)}
                className={`p-4 cursor-pointer transition-colors ${selectedId === msg.id ? 'bg-[#0B1F3A]/5 border-l-2 border-[#C9A84C]' : 'hover:bg-gray-50'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {msg.status === 'unread' && <span className="w-2 h-2 bg-[#C9A84C] rounded-full flex-shrink-0" />}
                    <p className={`text-sm truncate ${msg.status === 'unread' ? 'font-semibold text-[#0B1F3A]' : 'font-medium text-gray-700'}`}>{msg.name}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{msg.date}</span>
                </div>
                <p className="text-xs font-medium text-[#0B1F3A] mt-1 truncate">{msg.subject}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{msg.body.slice(0, 60)}…</p>
                {msg.organisation && <p className="text-xs text-[#C9A84C] mt-1">{msg.organisation}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
          {selected ? (
            <>
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[#0B1F3A] text-lg">{selected.subject}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">From <strong>{selected.name}</strong> — {selected.email}</p>
                      {selected.organisation && <span className="text-xs text-[#C9A84C]">{selected.organisation}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{selected.date}</p>
                  </div>
                  <div className="flex-shrink-0">{statusBadge(selected.status)}</div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => markRead(selected.id)}>Mark Read</Button>
                  <Button size="sm" variant="outline" onClick={() => archive(selected.id)}>Archive</Button>
                  <Button size="sm" variant="ghost" className="text-red-400">Delete</Button>
                </div>
              </div>
              <div className="flex-1 p-5 overflow-y-auto scrollbar-thin">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{selected.body}</pre>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2 font-medium">Reply externally via email client:</p>
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="inline-flex items-center gap-2 text-sm text-[#C9A84C] hover:text-[#A8872C] font-medium"
                >
                  <span>✉️</span>
                  <span>Reply to {selected.email}</span>
                </a>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <span className="text-4xl mb-3">✉️</span>
              <p className="text-sm font-medium">Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
