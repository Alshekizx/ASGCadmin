import { StatCard, Card, Button, Badge } from '../components/ui';
import type { AdminView } from '../types';
import { mockArticles, mockEvents, mockMessages, mockPublications, mockProgrammes, mockRegistrations } from '../data';

const RECENT_ACTIVITY = [
  { action: 'Article published', detail: 'ASGC Hosts Regional Investment Forum in Abuja', time: '2 hours ago', icon: '📰' },
  { action: 'Event registration', detail: 'Dr. Emeka Okafor registered for Annual Investment Symposium', time: '4 hours ago', icon: '📋' },
  { action: 'New message', detail: 'Partnership inquiry from Dr. Amara Diallo (ECOWAS)', time: '5 hours ago', icon: '✉️' },
  { action: 'Programme updated', detail: 'Trade & Investment Facilitation Programme — status updated', time: '1 day ago', icon: '🎯' },
  { action: 'Publication uploaded', detail: 'Africa Investment Outlook 2025 — published', time: '2 days ago', icon: '📚' },
  { action: 'User added', detail: 'Content Manager account created', time: '3 days ago', icon: '👤' },
];

export default function Dashboard({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const unreadMessages = mockMessages.filter(m => m.status === 'unread').length;
  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').length;
  const publishedArticles = mockArticles.filter(a => a.status === 'published').length;
  const publishedPubs = mockPublications.filter(p => p.status === 'published').length;

  return (
    <div>
      {/* Welcome bar */}
      <div className="bg-[#0B1F3A] rounded-xl p-6 mb-6 flex items-center justify-between">
        <div>
          <p className="text-[#C9A84C] text-xs font-semibold uppercase tracking-widest mb-1">Welcome back</p>
          <h2 className="text-white font-serif text-2xl">Good morning, Administrator</h2>
          <p className="text-white/50 text-sm mt-1">
            {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="text-white/40 text-xs">Last login</p>
            <p className="text-white/80 text-sm">Today, 08:42 AM</p>
          </div>
          <div className="w-10 h-10 bg-[#C9A84C]/20 rounded-full flex items-center justify-center border border-[#C9A84C]/30">
            <span className="text-[#C9A84C] font-bold text-sm">A</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Published Articles" value={publishedArticles} sub="2 drafts pending" />
        <StatCard label="Upcoming Events" value={upcomingEvents} sub={`${mockRegistrations.length} total registrations`} color="gold" />
        <StatCard label="Active Programmes" value={mockProgrammes.filter(p => p.status === 'active').length} sub="1 draft" />
        <StatCard label="Unread Messages" value={unreadMessages} sub="Needs attention" color={unreadMessages > 0 ? 'gold' : 'navy'} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Publications" value={publishedPubs} sub="1 draft in review" />
        <StatCard label="Event Registrations" value={mockRegistrations.filter(r => r.status === 'confirmed').length} sub="confirmed this month" />
        <StatCard label="Newsletter Subscribers" value={8} sub="7 active" />
        <StatCard label="Partner Organisations" value={5} sub="1 inactive" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-1">
          <Card>
            <h3 className="font-semibold text-[#0B1F3A] mb-4 text-sm uppercase tracking-wide">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              <QuickAction icon="📰" label="Create Article" onClick={() => onNavigate('news-editor')} />
              <QuickAction icon="📅" label="Add Event" onClick={() => onNavigate('event-editor')} />
              <QuickAction icon="📚" label="Upload Publication" onClick={() => onNavigate('publication-editor')} />
              <QuickAction icon="🖼️" label="Upload to Gallery" onClick={() => onNavigate('media')} />
              <QuickAction icon="🎯" label="New Programme" onClick={() => onNavigate('programme-editor')} />
              <QuickAction icon="👤" label="Add Leadership Profile" onClick={() => onNavigate('leadership-editor')} />
            </div>
          </Card>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0B1F3A] text-sm uppercase tracking-wide">Recent Activity</h3>
              <span className="text-xs text-gray-400">Last 7 days</span>
            </div>
            <div className="divide-y divide-gray-100">
              {RECENT_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <span className="text-base mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{a.action}</p>
                    <p className="text-sm text-[#0B1F3A] mt-0.5 truncate">{a.detail}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 mt-1">{a.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upcoming events */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0B1F3A] text-sm uppercase tracking-wide">Upcoming Events</h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('events')}>View All</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {mockEvents.filter(e => e.status === 'upcoming').map(event => (
                <div key={event.id} className="py-3 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#0B1F3A]/5 rounded-lg flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-[#0B1F3A]">{new Date(event.date).toLocaleDateString('en-GB', { day: '2-digit' })}</span>
                    <span className="text-[10px] text-[#C9A84C] font-semibold">{new Date(event.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0B1F3A] truncate">{event.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{event.venue}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-semibold text-[#0B1F3A]">{event.registered}/{event.capacity}</p>
                    <p className="text-xs text-gray-400">registered</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Pending messages */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0B1F3A] text-sm uppercase tracking-wide">Messages</h3>
              <Button variant="ghost" size="sm" onClick={() => onNavigate('messages')}>View All</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {mockMessages.filter(m => m.status === 'unread').slice(0, 3).map(msg => (
                <div key={msg.id} className="py-3 cursor-pointer hover:bg-gray-50 rounded -mx-1 px-1 transition-colors" onClick={() => onNavigate('messages')}>
                  <div className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-[#C9A84C] rounded-full mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#0B1F3A] truncate">{msg.name}</p>
                      <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{msg.date}</p>
                    </div>
                  </div>
                </div>
              ))}
              {unreadMessages === 0 && <p className="text-sm text-gray-400 py-4 text-center">No unread messages</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F4F5F7] transition-colors text-left group w-full"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium text-[#0B1F3A] group-hover:text-[#C9A84C] transition-colors">{label}</span>
      <span className="ml-auto text-gray-300 group-hover:text-[#C9A84C] text-sm">→</span>
    </button>
  );
}
