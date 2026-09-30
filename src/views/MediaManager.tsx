import { useState } from 'react';
import { PageHeader, Button, Card, Alert, UploadArea, Input } from '../components/ui';

const ALBUMS = [
  { id: '1', title: 'ASGC Investment Forum 2025', count: 24, cover: 'photo-1573167243872-43c6433b9d40', date: '2025-09-15' },
  { id: '2', title: 'Leadership Academy Graduation', count: 18, cover: 'photo-1523050854058-8df90110c9f1', date: '2025-08-10' },
  { id: '3', title: 'West Africa Investment Roundtable', count: 12, cover: 'photo-1560472354-b33ff0c44a43', date: '2025-08-22' },
  { id: '4', title: 'Policy Dialogue Series Q3', count: 9, cover: 'photo-1542744094-3a31f272c490', date: '2025-07-30' },
];

const MEDIA_LIBRARY = [
  { id: '1', src: 'photo-1573167243872-43c6433b9d40', caption: 'Opening session — Investment Forum 2025', type: 'image' },
  { id: '2', src: 'photo-1560472354-b33ff0c44a43', caption: 'Roundtable discussion', type: 'image' },
  { id: '3', src: 'photo-1559136555-9303baea8ebd', caption: 'Keynote address', type: 'image' },
  { id: '4', src: 'photo-1542744094-3a31f272c490', caption: 'Panel discussion', type: 'image' },
  { id: '5', src: 'photo-1523050854058-8df90110c9f1', caption: 'Leadership Academy cohort', type: 'image' },
  { id: '6', src: 'photo-1507003211169-0a1dd7228f2d', caption: 'Ambassador Ahmed Sule', type: 'image' },
  { id: '7', src: 'photo-1580489944761-15a19d654956', caption: 'Communications Director', type: 'image' },
  { id: '8', src: 'photo-1472099645785-5658abf4ff4e', caption: 'Director portrait', type: 'image' },
];

export default function MediaManager() {
  const [activeTab, setActiveTab] = useState<'albums' | 'library'>('albums');
  const [alert, setAlert] = useState('');
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);

  function handleCreateAlbum() {
    if (!newAlbumTitle.trim()) return;
    setAlert(`Album "${newAlbumTitle}" created successfully.`);
    setShowNewAlbum(false);
    setNewAlbumTitle('');
  }

  return (
    <div>
      <PageHeader
        title="Media & Gallery"
        subtitle="Manage photo albums, videos and the media library"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowNewAlbum(true)}>Create Album</Button>
            <Button icon="↑">Upload Media</Button>
          </div>
        }
      />
      {alert && <div className="mb-4"><Alert message={alert} type="success" onClose={() => setAlert('')} /></div>}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['albums', 'library'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === t ? 'border-[#C9A84C] text-[#0B1F3A]' : 'border-transparent text-gray-500 hover:text-[#0B1F3A]'}`}>
            {t === 'albums' ? 'Photo Albums' : 'Media Library'}
          </button>
        ))}
      </div>

      {activeTab === 'albums' && (
        <>
          {showNewAlbum && (
            <Card className="mb-6">
              <h4 className="font-semibold text-[#0B1F3A] mb-4">Create New Album</h4>
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Input label="Album Title" value={newAlbumTitle} onChange={setNewAlbumTitle} placeholder="e.g. ASGC Forum 2025" />
                </div>
                <Button onClick={handleCreateAlbum}>Create Album</Button>
                <Button variant="outline" onClick={() => setShowNewAlbum(false)}>Cancel</Button>
              </div>
            </Card>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ALBUMS.map(album => (
              <Card key={album.id} padding={false} className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow">
                <div className="relative h-44 bg-gray-200 overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/${album.cover}?w=400&h=176&fit=crop&auto=format`}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-[#0B1F3A]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" onClick={() => setSelectedAlbum(album.id)}>Open</Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </div>
                  <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded">
                    {album.count} photos
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-[#0B1F3A] truncate">{album.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{album.date}</p>
                </div>
              </Card>
            ))}
          </div>

          {selectedAlbum && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#0B1F3A]">{ALBUMS.find(a => a.id === selectedAlbum)?.title}</h3>
                <div className="flex gap-2">
                  <Button size="sm" icon="↑">Add Photos</Button>
                  <Button size="sm" variant="outline" onClick={() => setSelectedAlbum(null)}>Close</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {MEDIA_LIBRARY.slice(0, 8).map((m, i) => (
                  <div key={m.id} className="relative aspect-square bg-gray-200 rounded overflow-hidden group cursor-pointer">
                    <img
                      src={`https://images.unsplash.com/${m.src}?w=200&h=200&fit=crop&auto=format`}
                      alt={m.caption}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-1">
                        <button className="text-white text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/40">★ Cover</button>
                        <button className="text-white text-xs bg-red-500/60 px-2 py-1 rounded hover:bg-red-500">✕</button>
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-[#C9A84C] text-white text-[10px] px-1.5 py-0.5 rounded font-medium">Cover</span>
                    )}
                  </div>
                ))}
                <div
                  className="aspect-square rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#C9A84C] hover:bg-amber-50 transition-colors"
                  onClick={() => setAlert('Upload dialog opened.')}
                >
                  <span className="text-2xl text-gray-300">+</span>
                  <span className="text-xs text-gray-400 mt-1">Add</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'library' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">{MEDIA_LIBRARY.length} files in library</p>
            <UploadArea label="Upload to Library" accept="JPG, PNG, MP4" helper="" onClick={() => setAlert('File uploaded to media library.')} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {MEDIA_LIBRARY.map(m => (
              <div key={m.id} className="group cursor-pointer">
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-1.5">
                  <img
                    src={`https://images.unsplash.com/${m.src}?w=250&h=250&fit=crop&auto=format`}
                    alt={m.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <p className="text-xs text-gray-600 truncate">{m.caption}</p>
                <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-xs text-[#C9A84C] hover:underline">Use</button>
                  <span className="text-gray-300">·</span>
                  <button className="text-xs text-gray-400 hover:text-red-500">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
