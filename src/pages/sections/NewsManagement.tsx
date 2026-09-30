import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Table, Pagination, Modal, FormField, Input, Textarea, Select, UploadBox } from '../../components/admin/ui';

const ARTICLES = [
  { id: '1', title: 'Africa Investment Outlook 2026', category: 'Research', author: 'ASGC Editorial', date: '29 Sep 2026', status: 'published' },
  { id: '2', title: 'ASGC at the African Union Summit', category: 'News', author: 'Amara Diallo', date: '25 Sep 2026', status: 'published' },
  { id: '3', title: 'New Trade Corridors Initiative Launched', category: 'Programmes', author: 'ASGC Editorial', date: '20 Sep 2026', status: 'draft' },
  { id: '4', title: 'Ambassador Sule Speaks at UNGA 2026', category: 'Leadership', author: 'Chidi Nwachukwu', date: '18 Sep 2026', status: 'published' },
  { id: '5', title: 'Responsible Investment Framework', category: 'Research', author: 'ASGC Editorial', date: '12 Sep 2026', status: 'archived' },
  { id: '6', title: 'Africa–Europe Partnership Forum Outcomes', category: 'Partnerships', author: 'Amara Diallo', date: '5 Sep 2026', status: 'published' },
];

const CATEGORIES = [
  { value: 'news', label: 'News' },
  { value: 'research', label: 'Research' },
  { value: 'programmes', label: 'Programmes' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'partnerships', label: 'Partnerships' },
  { value: 'events', label: 'Events' },
];

export default function NewsManagement() {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = ARTICLES.filter(a =>
    (filterStatus === 'all' || a.status === filterStatus) &&
    (filterCategory === 'all' || a.category.toLowerCase() === filterCategory) &&
    (a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()))
  );

  if (editing || isNew) {
    return <ArticleEditor
      articleId={editing}
      onBack={() => { setEditing(null); setIsNew(false); }}
      onSave={(msg) => { setEditing(null); setIsNew(false); showToast(msg); }}
    />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="News & Insights"
        subtitle="Manage all news articles, research and editorial content."
        actions={<Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Add New Article</Btn>}
      />

      <Card>
        {/* Filters */}
        <div className="px-5 py-4 border-b flex flex-wrap items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search articles…" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }}>
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <span className="text-xs ml-auto" style={{ color: '#9ca3af' }}>{filtered.length} articles</span>
        </div>

        <Table
          columns={[
            { key: 'title', label: 'Article Title' },
            { key: 'category', label: 'Category', width: '120px' },
            { key: 'author', label: 'Author', width: '140px' },
            { key: 'date', label: 'Date', width: '110px' },
            { key: 'status', label: 'Status', width: '100px' },
            { key: 'actions', label: 'Actions', width: '140px' },
          ]}
          rows={filtered.map(a => ({
            title: <span className="font-medium" style={{ color: '#0a1628' }}>{a.title}</span>,
            category: <Badge label={a.category} variant="default" />,
            author: <span style={{ color: '#6b7280' }}>{a.author}</span>,
            date: <span style={{ color: '#6b7280' }}>{a.date}</span>,
            status: <Badge label={a.status} variant={a.status === 'published' ? 'success' : a.status === 'draft' ? 'warning' : 'muted'} />,
            actions: (
              <div className="flex items-center gap-1">
                <button onClick={() => setEditing(a.id)} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>Edit</button>
                <button onClick={() => showToast(a.status === 'published' ? 'Article unpublished.' : 'Article published successfully.')} className="px-2.5 py-1.5 text-xs rounded-md hover:bg-gray-100 font-medium" style={{ color: '#374151' }}>
                  {a.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => setConfirmDelete(a.id)} className="p-1.5 rounded-md hover:bg-red-50" style={{ color: '#dc2626' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
              </div>
            ),
          }))}
        />
        <div className="px-5 py-3">
          <Pagination page={page} total={filtered.length} perPage={10} onChange={setPage} />
        </div>
      </Card>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Article"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirmDelete(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirmDelete(null); showToast('Article deleted.'); }}>Delete Article</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this article? This action cannot be undone.</p>
      </Modal>

      {toast && <ToastMsg msg={toast} />}
    </div>
  );
}

function ArticleEditor({ articleId, onBack, onSave }: { articleId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const [tab, setTab] = useState('Content');
  const [headline, setHeadline] = useState(articleId ? 'Africa Investment Outlook 2026' : '');
  const [summary, setSummary] = useState(articleId ? 'An in-depth review of investment trends and opportunities across African markets in 2026.' : '');
  const [category, setCategory] = useState(articleId ? 'research' : '');
  const [author, setAuthor] = useState(articleId ? 'ASGC Editorial' : '');
  const [tags, setTags] = useState(articleId ? 'investment, africa, 2026, trade' : '');
  const [autosaved, setAutosaved] = useState('Autosaved 2 min ago');

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>News & Insights</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{articleId ? 'Edit Article' : 'New Article'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{articleId ? 'Edit Article' : 'New Article'}</h2>
          <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>{autosaved}</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="outline" size="sm" onClick={() => onSave('Draft saved successfully.')}>Save Draft</Btn>
          <Btn variant="ghost" size="sm">Preview</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Article published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Article Headline" required>
              <input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Enter article headline…" className="w-full px-3 py-2.5 text-base rounded-lg border font-medium" style={{ borderColor: '#e2e4e9', outline: 'none', color: '#0a1628' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} />
            </FormField>
            <FormField label="Short Summary" required>
              <Textarea value={summary} onChange={setSummary} placeholder="Enter a brief summary (displayed in article listings)…" rows={2} />
            </FormField>
          </Card>

          {/* Rich text content area */}
          <Card>
            <div className="px-4 py-3 border-b flex items-center gap-2 flex-wrap" style={{ borderColor: '#f0f2f5' }}>
              {['B', 'I', 'U', 'H1', 'H2', '¶', '"', '—', '🔗', '📷', '≡', '·'].map(t => (
                <button key={t} className="w-7 h-7 text-xs font-mono flex items-center justify-center rounded hover:bg-gray-100" style={{ color: '#374151' }}>{t}</button>
              ))}
            </div>
            <div className="p-5 min-h-64 text-sm leading-relaxed" style={{ color: '#374151' }} contentEditable data-placeholder="Start writing your article content here…">
              {articleId && <p>The African continent continues to attract significant investment interest in 2026, driven by demographic growth, expanding middle classes, and improving governance frameworks. The Africa Strategic Growth Council's latest analysis reveals a 23% increase in foreign direct investment flows to Sub-Saharan Africa in the first half of 2026...</p>}
            </div>
          </Card>

          {/* Additional images */}
          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Additional Images</p>
            <UploadBox label="Upload additional images" accept="image/*" hint="Supports JPG, PNG, WebP up to 5MB each" />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Category" required>
              <Select value={category} onChange={setCategory} options={CATEGORIES} placeholder="Select category…" />
            </FormField>
            <FormField label="Author">
              <Input value={author} onChange={setAuthor} placeholder="Author name…" />
            </FormField>
            <FormField label="Publication Date">
              <Input type="date" value="2026-09-29" />
            </FormField>
            <FormField label="Tags" hint="Separate tags with commas">
              <Input value={tags} onChange={setTags} placeholder="africa, investment, trade…" />
            </FormField>
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Featured Image</p>
            <UploadBox label="Upload featured image" accept="image/*" hint="Recommended: 1200×630px" />
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>SEO</p>
            <FormField label="SEO Title">
              <Input placeholder="Custom SEO title…" />
            </FormField>
            <FormField label="SEO Description">
              <Textarea placeholder="Brief description for search engines…" rows={2} />
            </FormField>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function ToastMsg({ msg }: { msg: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg>
      <span className="text-sm">{msg}</span>
    </div>
  );
}
