import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, Modal, Tabs } from '../../components/admin/ui';

const PAGES = [
  { id: 'home', title: 'Home', slug: '/', status: 'published', lastModified: '29 Sep 2026' },
  { id: 'about', title: 'About ASGC', slug: '/about', status: 'published', lastModified: '27 Sep 2026' },
  { id: 'programmes', title: 'Programmes', slug: '/programmes', status: 'published', lastModified: '25 Sep 2026' },
  { id: 'news', title: 'News & Insights', slug: '/news', status: 'published', lastModified: '28 Sep 2026' },
  { id: 'events', title: 'Events', slug: '/events', status: 'published', lastModified: '26 Sep 2026' },
  { id: 'publications', title: 'Publications', slug: '/publications', status: 'published', lastModified: '22 Sep 2026' },
  { id: 'leadership', title: 'Leadership', slug: '/leadership', status: 'draft', lastModified: '20 Sep 2026' },
  { id: 'partners', title: 'Partners', slug: '/partners', status: 'published', lastModified: '18 Sep 2026' },
  { id: 'contact', title: 'Contact', slug: '/contact', status: 'published', lastModified: '15 Sep 2026' },
];

const HOME_SECTIONS = [
  { id: 'hero', label: 'Hero Banner', description: 'Main headline, sub-text and call-to-action buttons' },
  { id: 'intro', label: 'Introduction', description: 'Organisation overview and mission statement' },
  { id: 'vision', label: 'Vision & Mission', description: 'Core vision and mission statements' },
  { id: 'mandate', label: 'Mandate', description: 'Key mandate areas and strategic focus' },
  { id: 'programmes', label: 'Featured Programmes', description: 'Highlighted active programmes' },
  { id: 'founder', label: 'Founder Profile', description: 'Ambassador Ahmed Sule featured section' },
  { id: 'partnerships', label: 'Partnerships', description: 'Partner logos and partnership statement' },
  { id: 'contact', label: 'Contact Section', description: 'Contact details and enquiry form' },
];

export default function WebsitePagesManager() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const page = PAGES.find(p => p.id === selectedPage);

  if (selectedPage && page) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: '#6b7280' }}>
          <button onClick={() => setSelectedPage(null)} className="hover:underline" style={{ color: '#c9a84c' }}>Website Pages</button>
          <span>/</span>
          <span style={{ color: '#0a1628' }}>{page.title}</span>
        </div>

        <PageHeader
          title={`Editing: ${page.title}`}
          subtitle={`Page URL: ${page.slug}`}
          actions={
            <>
              <Btn variant="outline" onClick={() => showToast('Draft saved.')}>Save Draft</Btn>
              <Btn variant="ghost">Preview</Btn>
              <Btn variant="secondary" onClick={() => showToast(`"${page.title}" published successfully.`)}>Publish</Btn>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Sections list */}
          <div className="md:col-span-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#9ca3af' }}>Page Sections</p>
            {HOME_SECTIONS.map(sec => (
              <button
                key={sec.id}
                onClick={() => setEditingSection(sec.id)}
                className="w-full text-left px-4 py-3 rounded-lg border transition-all"
                style={{
                  borderColor: editingSection === sec.id ? '#c9a84c' : '#e2e4e9',
                  background: editingSection === sec.id ? '#fffbeb' : '#fff',
                }}
              >
                <p className="text-sm font-medium" style={{ color: '#0a1628' }}>{sec.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{sec.description}</p>
              </button>
            ))}
          </div>

          {/* Section editor */}
          <div className="md:col-span-2">
            {editingSection ? (
              <Card>
                <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: '#f0f2f5' }}>
                  <h3 className="font-semibold" style={{ color: '#0a1628', fontFamily: 'var(--font-display)' }}>
                    {HOME_SECTIONS.find(s => s.id === editingSection)?.label}
                  </h3>
                  <Badge label="Editing" variant="warning" />
                </div>
                <div className="p-5 space-y-4">
                  <SectionEditor sectionId={editingSection} />
                  <div className="flex gap-2 pt-2">
                    <Btn variant="primary" onClick={() => showToast('Section saved successfully.')}>Save Section</Btn>
                    <Btn variant="ghost" onClick={() => setEditingSection(null)}>Cancel</Btn>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="flex items-center justify-center" style={{ minHeight: 300 }}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#f0f2f5' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#374151' }}>Select a section to edit</p>
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Click any section on the left to start editing its content</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
            <span className="text-sm">{toast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Website Pages"
        subtitle="Edit the content of your public website pages without coding."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAGES.map(p => (
          <Card key={p.id} className="p-5 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => setSelectedPage(p.id)}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#f0f2f5' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <Badge label={p.status} variant={p.status === 'published' ? 'success' : 'warning'} />
            </div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: '#0a1628' }}>{p.title}</h3>
            <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>{p.slug}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: '#9ca3af' }}>Modified {p.lastModified}</p>
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#c9a84c' }}>Edit →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SectionEditor({ sectionId }: { sectionId: string }) {
  const fields: Record<string, React.ReactNode> = {
    hero: (
      <div className="space-y-3">
        <FieldRow label="Main Headline"><input defaultValue="Advancing Africa's Strategic Growth and Global Partnerships" className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
        <FieldRow label="Subtitle"><input defaultValue="Championing sustainable investment, diplomatic engagement and economic development across Africa." className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
        <FieldRow label="Primary Button Text"><input defaultValue="Explore Our Work" className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
        <FieldRow label="Secondary Button Text"><input defaultValue="Contact Us" className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
        <FieldRow label="Hero Background Image">
          <div className="border-2 border-dashed rounded-lg p-4 text-center text-xs" style={{ borderColor: '#e2e4e9', color: '#9ca3af' }}>Click to upload image (recommended: 1920×1080px)</div>
        </FieldRow>
      </div>
    ),
    intro: (
      <div className="space-y-3">
        <FieldRow label="Section Title"><input defaultValue="About ASGC" className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
        <FieldRow label="Introduction Text"><textarea rows={4} defaultValue="The Africa Strategic Growth Council (ASGC) is a non-governmental organisation committed to championing sustainable economic growth, strategic partnerships, and responsible investment across Africa and the global south." className="w-full px-3 py-2 text-sm rounded-lg border resize-none" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
      </div>
    ),
  };

  return fields[sectionId] || (
    <div className="space-y-3">
      <FieldRow label="Section Title"><input defaultValue={`${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)} Section`} className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
      <FieldRow label="Content"><textarea rows={4} placeholder="Enter content for this section…" className="w-full px-3 py-2 text-sm rounded-lg border resize-none" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} /></FieldRow>
      <FieldRow label="Section Image"><div className="border-2 border-dashed rounded-lg p-4 text-center text-xs" style={{ borderColor: '#e2e4e9', color: '#9ca3af' }}>Click to upload image</div></FieldRow>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium mb-1" style={{ color: '#374151' }}>{label}</label>
      {children}
    </div>
  );
}
