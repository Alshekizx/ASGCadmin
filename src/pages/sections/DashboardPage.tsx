import { useState } from 'react';
import type { AdminPage } from '../../types/admin';
import { Card, StatCard, Btn } from '../../components/admin/ui';

interface Props { setSection: (s: AdminPage) => void; }

const STATS = [
  { label: 'Published Articles', value: 24, icon: <NewsIcon />, color: '#0a1628' },
  { label: 'Upcoming Events', value: 6, icon: <EventIcon />, color: '#c9a84c' },
  { label: 'Active Programmes', value: 8, icon: <ProgramIcon />, color: '#6366f1' },
  { label: 'Publications', value: 31, icon: <DocIcon />, color: '#16a34a' },
  { label: 'New Messages', value: 4, icon: <MailIcon />, color: '#dc2626' },
  { label: 'Registrations', value: 142, icon: <UserIcon />, color: '#0891b2' },
];

const QUICK_ACTIONS: { label: string; icon: React.ReactNode; section: AdminPage }[] = [
  { label: 'Create Article', icon: <NewsIcon />, section: 'news' },
  { label: 'Add Event', icon: <EventIcon />, section: 'events' },
  { label: 'Upload Publication', icon: <DocIcon />, section: 'publications' },
  { label: 'Add Gallery', icon: <MediaIcon />, section: 'media' },
  { label: 'Quick Upload', icon: <UploadIcon />, section: 'media' },
];

const RECENT_ACTIVITY = [
  { type: 'published', text: 'Article "Africa Investment Outlook 2026" published', time: '10 min ago', color: '#16a34a' },
  { type: 'draft', text: 'Event "ASGC Policy Dialogue Forum" saved as draft', time: '45 min ago', color: '#d97706' },
  { type: 'message', text: 'New contact message from Olusegun Adeyemi', time: '1h ago', color: '#c9a84c' },
  { type: 'upload', text: 'Publication "ASGC Annual Report 2025" uploaded', time: '2h ago', color: '#6366f1' },
  { type: 'registration', text: '12 new registrations for Africa Summit 2026', time: '3h ago', color: '#0891b2' },
  { type: 'user', text: 'New content manager account created for Amara Diallo', time: '5h ago', color: '#0a1628' },
];

export default function DashboardPage({ setSection }: Props) {
  const [toast, setToast] = useState<string | null>(null);

  const handleQuickAction = (section: AdminPage, label: string) => {
    setSection(section);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a1628 0%, #132040 60%, #1e3657 100%)' }}>
        <div className="px-8 py-6 relative">
          <div className="absolute right-0 top-0 h-full w-64 opacity-10" style={{ background: 'linear-gradient(to left, #c9a84c, transparent)' }} />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: '#c9a84c' }}>Good morning</p>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>Welcome back, Administrator</h2>
              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Tuesday, 29 September 2026 · ASGC Content Management System</p>
            </div>
            <div className="hidden md:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white opacity-70">System Online</span>
              </div>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Last login: Today, 08:14</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STATS.map(stat => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} icon={stat.icon} color={stat.color} />
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f0f2f5' }}>
          <h3 className="font-semibold" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>Quick Actions</h3>
        </div>
        <div className="p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map(action => (
            <button
              key={action.label}
              onClick={() => handleQuickAction(action.section, action.label)}
              className="flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-150 group"
              style={{ borderColor: '#e2e4e9' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a84c'; (e.currentTarget as HTMLButtonElement).style.background = '#fffbeb'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e4e9'; (e.currentTarget as HTMLButtonElement).style.background = ''; }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f0f2f5', color: '#0a1628' }}>
                {action.icon}
              </div>
              <span className="text-xs font-medium text-center" style={{ color: '#374151' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Activity + Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity feed */}
        <Card className="lg:col-span-2">
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0f2f5' }}>
            <h3 className="font-semibold" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>Recent Activity</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#f0f2f5' }}>
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-4">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: '#374151' }}>{item.text}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Content Status */}
        <Card>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#f0f2f5' }}>
            <h3 className="font-semibold" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>Content Overview</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Published', count: 24, total: 31, color: '#16a34a' },
              { label: 'Draft', count: 5, total: 31, color: '#d97706' },
              { label: 'Archived', count: 2, total: 31, color: '#6b7280' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#6b7280' }}>{item.label}</span>
                  <span className="font-medium" style={{ color: '#374151' }}>{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#f0f2f5' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(item.count / item.total) * 100}%`, background: item.color }} />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t" style={{ borderColor: '#f0f2f5' }}>
              <p className="text-xs font-semibold mb-3" style={{ color: '#374151' }}>Upcoming Events</p>
              {[
                { title: 'Africa Investment Summit 2026', date: '15 Oct 2026', reg: '88/150' },
                { title: 'ASGC Policy Dialogue Forum', date: '22 Oct 2026', reg: '34/80' },
                { title: 'Trade & Investment Symposium', date: '5 Nov 2026', reg: '12/100' },
              ].map((ev, i) => (
                <div key={i} className="py-2.5 border-b last:border-0" style={{ borderColor: '#f0f2f5' }}>
                  <p className="text-xs font-medium" style={{ color: '#0a1628' }}>{ev.title}</p>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{ev.date}</p>
                    <span className="text-xs font-medium" style={{ color: '#c9a84c' }}>{ev.reg} reg.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Draft autosave indicator */}
      <div className="flex items-center gap-2 text-xs" style={{ color: '#9ca3af' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        All changes saved automatically · Last saved 2 min ago
      </div>
    </div>
  );
}

function NewsIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>; }
function EventIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
function ProgramIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function DocIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function MailIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
function UserIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function MediaIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>; }
function UploadIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
