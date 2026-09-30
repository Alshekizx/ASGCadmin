import type { AdminView } from '../types';

const TITLES: Partial<Record<AdminView | string, string>> = {
  dashboard: 'Dashboard',
  pages: 'Website Pages',
  news: 'News & Insights',
  'news-editor': 'Article Editor',
  programmes: 'Programmes',
  'programme-editor': 'Programme Editor',
  events: 'Events',
  'event-editor': 'Event Editor',
  'event-registrations': 'Event Registrations',
  publications: 'Publications',
  'publication-editor': 'Publication Editor',
  media: 'Media & Gallery',
  leadership: 'Leadership',
  'leadership-editor': 'Leadership Profile',
  partners: 'Partners',
  messages: 'Messages',
  'message-detail': 'Message',
  registrations: 'Registrations',
  newsletter: 'Newsletter',
  users: 'Users & Roles',
  settings: 'Website Settings',
};

export default function TopBar({ view }: { view: AdminView }) {
  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-white border-b border-gray-200 z-20 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold text-[#0B1F3A]">{TITLES[view] ?? view}</h2>
        <span className="h-4 w-px bg-gray-200" />
        <span className="text-xs text-gray-400">ASGC Content Management System</span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="#"
          className="text-xs text-[#C9A84C] hover:text-[#A8872C] font-medium flex items-center gap-1"
          onClick={e => e.preventDefault()}
        >
          <span>🌐</span>
          <span>View Public Site</span>
        </a>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-400 rounded-full"></span>
          <span>All systems operational</span>
        </div>
      </div>
    </header>
  );
}
