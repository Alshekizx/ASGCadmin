import { useState } from 'react';
import { PageHeader, SearchBar, Button, Badge, Table, Tr, Td, StatusDot, Pagination, ConfirmDialog, Alert, Breadcrumb, Card, Input, Textarea, Select, UploadArea, Tabs } from '../components/ui';
import { mockArticles } from '../data';
import type { Article, AdminView } from '../types';

function statusBadge(s: Article['status']) {
  if (s === 'published') return <Badge label="Published" variant="success" />;
  if (s === 'draft') return <Badge label="Draft" variant="warning" />;
  return <Badge label="Archived" variant="default" />;
}

export function NewsList({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [articles, setArticles] = useState(mockArticles);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [alert, setAlert] = useState('');
  const PER_PAGE = 5;

  const filtered = articles
    .filter(a => filter === 'All' || a.status === filter.toLowerCase() || a.category === filter)
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.author.toLowerCase().includes(search.toLowerCase()));

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleDelete() {
    if (!deleteTarget) return;
    setArticles(prev => prev.filter(a => a.id !== deleteTarget));
    setDeleteTarget(null);
    setAlert('Article deleted successfully.');
  }

  return (
    <div>
      <PageHeader
        title="News & Insights"
        subtitle="Manage articles, press releases and research publications"
        actions={<Button onClick={() => onNavigate('news-editor')} icon="＋">Add New Article</Button>}
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['All', 'Published', 'Draft', 'Archived', 'News', 'Research', 'Diplomacy', 'Partnerships', 'Programmes'].map(f => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filter === f ? 'bg-[#0B1F3A] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f}
              </button>
            ))}
          </div>
          <SearchBar value={search} onChange={v => { setSearch(v); setPage(1); }} placeholder="Search articles…" />
        </div>
        <Table headers={['', 'Title', 'Category', 'Author', 'Date', 'Status', 'Actions']}>
          {paged.map(a => (
            <Tr key={a.id}>
              <Td><StatusDot status={a.status} /></Td>
              <Td>
                <p className="font-medium text-[#0B1F3A] max-w-xs truncate">{a.title}</p>
                <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{a.summary}</p>
              </Td>
              <Td><Badge label={a.category} variant="info" /></Td>
              <Td className="text-gray-500">{a.author}</Td>
              <Td className="text-gray-500 font-mono text-xs">{a.date}</Td>
              <Td>{statusBadge(a.status)}</Td>
              <Td>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onNavigate('news-editor')}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(a.id)}>
                    <span className="text-red-400">Delete</span>
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
        <div className="px-4 pb-4">
          <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
        </div>
      </Card>
      {deleteTarget && (
        <ConfirmDialog
          title="Delete Article"
          message="Are you sure you want to delete this article? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}
    </div>
  );
}

export function ArticleEditor({ onNavigate }: { onNavigate: (v: AdminView) => void }) {
  const [tab, setTab] = useState('Content');
  const [headline, setHeadline] = useState('');
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState('News');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [pubDate, setPubDate] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [status, setStatus] = useState('draft');
  const [alert, setAlert] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'warning'>('success');
  const [saving, setSaving] = useState(false);

  function handleSave(action: 'draft' | 'publish') {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setStatus(action === 'publish' ? 'published' : 'draft');
      setAlertType('success');
      setAlert(action === 'publish' ? 'Article published successfully.' : 'Draft saved successfully.');
    }, 600);
  }

  return (
    <div>
      <Breadcrumb items={['News & Insights', headline || 'New Article']} />
      <PageHeader
        title={headline || 'New Article'}
        subtitle="Create and manage article content"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onNavigate('news')}>Cancel</Button>
            <Button variant="outline" onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
            <Button variant="ghost" onClick={() => {}}>Preview</Button>
            <Button onClick={() => handleSave('publish')} disabled={saving} icon="✓">Publish</Button>
          </div>
        }
      />
      {alert && (
        <div className="mb-4">
          <Alert message={alert} type={alertType} onClose={() => setAlert('')} />
        </div>
      )}
      {status === 'draft' && (
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-400 bg-amber-50 border border-amber-200 rounded px-3 py-2">
          <span>●</span> Draft — not yet published
        </div>
      )}
      <Tabs tabs={['Content', 'Media', 'SEO', 'Settings']} active={tab} onChange={setTab} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {tab === 'Content' && (
            <>
              <Card>
                <div className="flex flex-col gap-4">
                  <Input label="Headline" value={headline} onChange={setHeadline} placeholder="Enter article headline" required />
                  <Textarea label="Short Summary" value={summary} onChange={setSummary} placeholder="Brief description shown in listings (150–200 characters)" rows={3} required />
                  <div>
                    <label className="text-sm font-medium text-[#0B1F3A] block mb-1">Full Article Content <span className="text-red-500">*</span></label>
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <div className="bg-gray-50 border-b border-gray-200 px-3 py-2 flex gap-2 flex-wrap">
                        {['B', 'I', 'U', 'H2', 'H3', '¶', '• List', '1. List', '"Quote"', 'Link', 'Image'].map(t => (
                          <button key={t} className="text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 text-gray-600 font-mono">{t}</button>
                        ))}
                      </div>
                      <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={12}
                        className="w-full px-4 py-3 text-sm text-[#0B1F3A] focus:outline-none resize-y"
                        placeholder="Write the full article content here. Use the toolbar above for formatting."
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
          {tab === 'Media' && (
            <Card>
              <h4 className="font-semibold text-[#0B1F3A] mb-4 text-sm">Featured Image</h4>
              <UploadArea label="Upload Featured Image" accept="JPG, PNG, WebP" helper="Recommended: 1200 × 630px — used in article listings and social sharing" />
              <h4 className="font-semibold text-[#0B1F3A] mt-6 mb-4 text-sm">Additional Images</h4>
              <UploadArea label="Upload Additional Images" accept="JPG, PNG, WebP" helper="You can upload multiple images to use within the article body" />
            </Card>
          )}
          {tab === 'SEO' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Input label="SEO Title" value={seoTitle} onChange={setSeoTitle} placeholder="Override the page title for search engines" helper="Recommended: 50–60 characters" />
                <Textarea label="SEO Description" value={seoDesc} onChange={setSeoDesc} placeholder="Brief description for search engines and social sharing" rows={3} helper="Recommended: 150–160 characters" />
                <div className="bg-[#F4F5F7] rounded-lg p-4 mt-2">
                  <p className="text-xs text-gray-500 mb-2 font-semibold">Search Preview</p>
                  <p className="text-blue-600 text-sm font-medium">{seoTitle || headline || 'Article Title'}</p>
                  <p className="text-green-700 text-xs">asgc.org/news/article-slug</p>
                  <p className="text-gray-600 text-xs mt-1">{seoDesc || summary || 'Meta description will appear here.'}</p>
                </div>
              </div>
            </Card>
          )}
          {tab === 'Settings' && (
            <Card>
              <div className="flex flex-col gap-4">
                <Input label="Tags" value={tags} onChange={setTags} placeholder="investment, africa, trade (comma separated)" helper="Tags help categorise and filter content" />
                <Input label="Publication Date" type="date" value={pubDate} onChange={setPubDate} helper="Leave blank to publish immediately" />
                <Select label="Status" value={status} onChange={setStatus} options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'published', label: 'Published' },
                  { value: 'archived', label: 'Archived' },
                ]} />
              </div>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Article Details</h4>
            <div className="flex flex-col gap-3">
              <Select label="Category" value={category} onChange={setCategory} options={[
                { value: 'News', label: 'News' },
                { value: 'Research', label: 'Research' },
                { value: 'Diplomacy', label: 'Diplomacy' },
                { value: 'Partnerships', label: 'Partnerships' },
                { value: 'Programmes', label: 'Programmes' },
                { value: 'Events', label: 'Events' },
              ]} required />
              <Input label="Author" value={author} onChange={setAuthor} placeholder="Author name" required />
            </div>
          </Card>
          <Card>
            <h4 className="text-sm font-semibold text-[#0B1F3A] mb-3">Publish</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between py-1 text-sm">
                <span className="text-gray-500">Status</span>
                <Badge label={status === 'published' ? 'Published' : 'Draft'} variant={status === 'published' ? 'success' : 'warning'} />
              </div>
              <div className="flex items-center justify-between py-1 text-sm border-t border-gray-100">
                <span className="text-gray-500">Visibility</span>
                <span className="text-[#0B1F3A] font-medium">Public</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button className="w-full justify-center" onClick={() => handleSave('publish')} disabled={saving}>
                {saving ? 'Publishing…' : 'Publish Article'}
              </Button>
              <Button variant="outline" className="w-full justify-center" onClick={() => handleSave('draft')} disabled={saving}>
                Save Draft
              </Button>
              <Button variant="ghost" className="w-full justify-center text-red-500">
                Unpublish / Archive
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
