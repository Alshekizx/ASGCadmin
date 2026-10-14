import type { AdminView } from '../types';

const NAV_ITEMS: { id: AdminView; label: string; icon: string; group?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊞', group: 'main' },
  { id: 'pages', label: 'Website Pages', icon: '📄', group: 'content' },
  { id: 'news', label: 'News & Insights', icon: '📰', group: 'content' },
  { id: 'programmes', label: 'Programmes', icon: '🎯', group: 'content' },
  { id: 'events', label: 'Events', icon: '📅', group: 'content' },
  { id: 'publications', label: 'Publications', icon: '📚', group: 'content' },
  { id: 'media', label: 'Media / Gallery', icon: '🖼️', group: 'content' },
  { id: 'leadership', label: 'Leadership', icon: '👤', group: 'content' },
  { id: 'partners', label: 'Partners', icon: '🤝', group: 'content' },
  { id: 'messages', label: 'Messages', icon: '✉️', group: 'engage', badge: 2 },
  { id: 'registrations', label: 'Registrations', icon: '📋', group: 'engage' },
  { id: 'newsletter', label: 'Newsletter', icon: '📨', group: 'engage' },
  { id: 'users', label: 'Users', icon: '👥', group: 'admin' },
  { id: 'settings', label: 'Website Settings', icon: '⚙️', group: 'admin' },
] as any;

const GROUPS = [
  { key: 'main', label: '' },
  { key: 'content', label: 'Content' },
  { key: 'engage', label: 'Engagement' },
  { key: 'admin', label: 'Administration' },
];

export default function Sidebar({ view, onNavigate }: {
  view: AdminView;
  onNavigate: (v: AdminView) => void;
}) {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[#0B1F3A] flex flex-col z-30 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
        <img src="/ASGC_White_Logo.png" alt="ASGC" className="w-10 h-10 object-contain flex-shrink-0" />
        <div>
          <p className="text-white font-bold text-sm leading-tight">ASGC</p>
          <p className="text-white/40 text-xs">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide py-4">
        {GROUPS.map(group => {
          const items = NAV_ITEMS.filter(i => i.group === group.key);
          return (
            <div key={group.key} className="mb-2">
              {group.label && (
                <p className="px-5 py-1 text-[10px] font-semibold text-white/30 uppercase tracking-widest">{group.label}</p>
              )}
              {items.map(item => {
                const isActive = view === item.id ||
                  (item.id === 'news' && (view === 'news-editor' as string)) ||
                  (item.id === 'programmes' && (view === 'programme-editor' as string)) ||
                  (item.id === 'events' && (view === 'event-editor' as string || view === 'event-registrations' as string)) ||
                  (item.id === 'publications' && (view === 'publication-editor' as string)) ||
                  (item.id === 'leadership' && (view === 'leadership-editor' as string)) ||
                  (item.id === 'messages' && (view === 'message-detail' as string));
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm transition-all group ${
                      isActive
                        ? 'bg-[#C9A84C]/20 text-[#C9A84C] border-r-2 border-[#C9A84C]'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span className="flex-1 text-left">{item.label}</span>
                    {(item as any).badge && (
                      <span className="bg-[#C9A84C] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {(item as any).badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-7 h-7 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#C9A84C] text-xs font-bold">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Administrator</p>
            <p className="text-white/40 text-xs">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <span>⎋</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
