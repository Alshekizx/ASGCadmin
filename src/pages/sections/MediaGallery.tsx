import { useState } from 'react';
import { PageHeader, Card, Btn, Badge, SearchInput, Modal, FormField, Input, UploadBox, Tabs } from '../../components/admin/ui';

const ALBUMS = [
  { id: '1', title: 'Africa Investment Summit 2026', images: 24, cover: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop&auto=format', status: 'published', date: '15 Oct 2026' },
  { id: '2', title: 'Policy Dialogue Forum — Lagos', images: 18, cover: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop&auto=format', status: 'published', date: '22 Oct 2026' },
  { id: '3', title: 'Ambassador Sule at UNGA 2026', images: 12, cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format', status: 'published', date: '18 Sep 2026' },
  { id: '4', title: 'African Women in Business Forum', images: 31, cover: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=400&h=300&fit=crop&auto=format', status: 'draft', date: '5 Aug 2026' },
];

const LIBRARY_IMAGES = [
  'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1529119513315-c7c361862fc7?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&h=160&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=200&h=160&fit=crop&auto=format',
];

export default function MediaGallery() {
  const [tab, setTab] = useState('Albums');
  const [editingAlbum, setEditingAlbum] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  if (isNew || editingAlbum) {
    return <AlbumEditor albumId={editingAlbum} onBack={() => { setIsNew(false); setEditingAlbum(null); }} onSave={msg => { setIsNew(false); setEditingAlbum(null); showToast(msg); }} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Media / Gallery"
        subtitle="Manage albums, images and video content."
        actions={
          <>
            {tab === 'Albums' && <Btn variant="secondary" onClick={() => setIsNew(true)} icon={<PlusIcon />}>Create Album</Btn>}
            {tab === 'Media Library' && <Btn variant="secondary" icon={<UploadIco />}>Upload Files</Btn>}
          </>
        }
      />

      <div className="mb-5 w-fit">
        <Tabs tabs={['Albums', 'Media Library']} active={tab} onChange={setTab} />
      </div>

      {tab === 'Albums' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALBUMS.map(album => (
            <Card key={album.id} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
              <div className="relative" style={{ paddingBottom: '60%', background: '#f0f2f5' }}>
                <img src={album.cover} alt={album.title} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="absolute top-2 right-2">
                  <Badge label={album.status} variant={album.status === 'published' ? 'success' : 'warning'} />
                </div>
              </div>
              <div className="p-4">
                <p className="font-medium text-sm" style={{ color: '#0a1628' }}>{album.title}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{album.images} images · {album.date}</p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => setEditingAlbum(album.id)} className="text-xs font-medium hover:opacity-70" style={{ color: '#c9a84c' }}>Edit</button>
                  <span style={{ color: '#e2e4e9' }}>·</span>
                  <button onClick={() => showToast(album.status === 'published' ? 'Album unpublished.' : 'Album published successfully.')} className="text-xs hover:opacity-70" style={{ color: '#6b7280' }}>
                    {album.status === 'published' ? 'Unpublish' : 'Publish'}
                  </button>
                  <span style={{ color: '#e2e4e9' }}>·</span>
                  <button onClick={() => setConfirm(album.id)} className="text-xs hover:opacity-70" style={{ color: '#dc2626' }}>Delete</button>
                </div>
              </div>
            </Card>
          ))}

          {/* New album placeholder */}
          <button onClick={() => setIsNew(true)} className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors" style={{ borderColor: '#e2e4e9', minHeight: 200 }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#c9a84c')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#e2e4e9')}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f0f2f5' }}>
              <PlusIcon />
            </div>
            <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Create Album</p>
          </button>
        </div>
      )}

      {tab === 'Media Library' && (
        <div>
          <Card className="mb-4 p-4">
            <UploadBox label="Upload images or videos to library" accept="image/*,video/*" hint="Drag and drop multiple files at once" />
          </Card>

          <Card>
            <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: '#f0f2f5' }}>
              <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>All Media ({LIBRARY_IMAGES.length})</p>
              {selectedImages.length > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-sm" style={{ color: '#6b7280' }}>{selectedImages.length} selected</span>
                  <Btn size="sm" variant="outline">Add to Album</Btn>
                  <Btn size="sm" variant="ghost">Delete</Btn>
                </div>
              )}
            </div>
            <div className="p-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {LIBRARY_IMAGES.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-lg overflow-hidden cursor-pointer group"
                  style={{ paddingBottom: '75%', background: '#f0f2f5' }}
                  onClick={() => setSelectedImages(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                >
                  <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 transition-opacity" style={{ background: selectedImages.includes(i) ? 'rgba(201,168,76,0.3)' : 'transparent' }} />
                  {selectedImages.includes(i) && (
                    <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#c9a84c' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal open={!!confirm} onClose={() => setConfirm(null)} title="Delete Album"
        footer={<>
          <Btn variant="ghost" onClick={() => setConfirm(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={() => { setConfirm(null); showToast('Album deleted.'); }}>Delete Album</Btn>
        </>}
      >
        <p className="text-sm" style={{ color: '#374151' }}>Are you sure you want to delete this album and all its images? This cannot be undone.</p>
      </Modal>

      {toast && <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl" style={{ background: '#0a1628', color: '#fff', minWidth: 280 }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2.5"><polyline points="20,6 9,17 4,12"/></svg><span className="text-sm">{toast}</span></div>}
    </div>
  );
}

function AlbumEditor({ albumId, onBack, onSave }: { albumId: string | null; onBack: () => void; onSave: (msg: string) => void }) {
  const [title, setTitle] = useState(albumId ? 'Africa Investment Summit 2026' : '');

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#6b7280' }}>
        <button onClick={onBack} className="hover:underline" style={{ color: '#c9a84c' }}>Media / Gallery</button>
        <span>/</span>
        <span style={{ color: '#0a1628' }}>{albumId ? 'Edit Album' : 'New Album'}</span>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)', color: '#0a1628' }}>{albumId ? 'Edit Album' : 'Create Album'}</h2>
        <div className="flex gap-2">
          <Btn variant="outline" size="sm">Save Draft</Btn>
          <Btn variant="secondary" size="sm" onClick={() => onSave('Album published successfully.')}>Publish</Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 space-y-4">
            <FormField label="Album Title" required>
              <Input value={title} onChange={setTitle} placeholder="Enter album title…" />
            </FormField>
            <FormField label="Description">
              <textarea rows={2} placeholder="Brief description of this album…" className="w-full px-3 py-2 text-sm rounded-lg border resize-none" style={{ borderColor: '#e2e4e9', outline: 'none' }} onFocus={e => (e.target.style.borderColor = '#c9a84c')} onBlur={e => (e.target.style.borderColor = '#e2e4e9')} />
            </FormField>
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: '#374151' }}>Images</p>
              <p className="text-xs" style={{ color: '#9ca3af' }}>Drag to reorder · Click image to set cover</p>
            </div>
            <UploadBox label="Upload multiple images" accept="image/*" hint="JPG, PNG, WebP · You can select multiple files at once" />
            {albumId && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['https://images.unsplash.com/photo-1511578314322-379afb476865?w=160&h=120&fit=crop&auto=format', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=160&h=120&fit=crop&auto=format', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=160&h=120&fit=crop&auto=format', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=160&h=120&fit=crop&auto=format'].map((src, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden group" style={{ paddingBottom: '75%', background: '#f0f2f5' }}>
                    <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    {i === 0 && <div className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: '#c9a84c', color: '#0a1628' }}>Cover</div>}
                    <button className="absolute top-1 right-1 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center" style={{ background: '#dc2626', color: '#fff' }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <p className="text-sm font-semibold mb-3" style={{ color: '#374151' }}>Videos</p>
            <UploadBox label="Upload or attach videos" accept="video/*" hint="MP4 format recommended · Max 500MB" />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <p className="text-sm font-semibold" style={{ color: '#374151' }}>Settings</p>
            <FormField label="Event / Date">
              <Input type="date" defaultValue={albumId ? '2026-10-15' : ''} />
            </FormField>
            <FormField label="Visibility">
              <select className="w-full px-3 py-2 text-sm rounded-lg border" style={{ borderColor: '#e2e4e9', outline: 'none' }}>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </FormField>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
function UploadIco() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>; }
