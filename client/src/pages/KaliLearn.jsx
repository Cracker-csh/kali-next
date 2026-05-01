import React, { useState, useMemo } from 'react';
import { Play, Clock, Search, ChevronRight, Layers, User } from 'lucide-react';
import kaliData from '../data/kaliLearn.json';

// Helper: convert youtube watch URL to embed URL
function toEmbedUrl(url) {
  try {
    const u = new URL(url);
    const id = u.searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : url;
  } catch {
    return url;
  }
}

// Flatten all videos with category info attached
function getAllVideos(categories) {
  return categories.flatMap(cat =>
    cat.videos.map(v => ({ ...v, category: cat.name, categoryId: cat.id }))
  );
}

const LEVEL_COLORS = {
  Beginner: { text: 'text-green-600', border: 'border-green-600/20', bg: 'bg-green-50' },
  Intermediate: { text: 'text-amber-600', border: 'border-amber-600/20', bg: 'bg-amber-50' },
  Advanced: { text: 'text-red-600', border: 'border-red-600/20', bg: 'bg-red-50' },
};

export default function KaliLearn() {
  const categories = kaliData.categories;
  const allVideos = useMemo(() => getAllVideos(categories), [categories]);

  const [activeVideo, setActiveVideo] = useState(allVideos[0]);
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(null); // null = show all categories

  // Filtered category list for sidebar
  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const q = search.toLowerCase();
    return categories
      .map(cat => ({
        ...cat,
        videos: cat.videos.filter(
          v =>
            v.title.toLowerCase().includes(q) ||
            v.channel_name.toLowerCase().includes(q) ||
            v.level.toLowerCase().includes(q)
        ),
      }))
      .filter(cat => cat.videos.length > 0);
  }, [categories, search]);

  const levelStyle = LEVEL_COLORS[activeVideo?.level] || LEVEL_COLORS.Beginner;

  return (
    <div className="h-full flex flex-col md:flex-row gap-6">
      {/* ─── Video Player Area ─── */}
      <div className="w-full md:w-2/3 flex flex-col gap-4">
        {/* Player */}
        <div className="card overflow-hidden aspect-video bg-black flex items-center justify-center relative shadow-sm border-gray-200">
          {activeVideo ? (
            <iframe
              key={activeVideo.id}
              width="100%"
              height="100%"
              src={toEmbedUrl(activeVideo.youtube_url)}
              title={activeVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Play className="w-16 h-16 mb-4 opacity-50" />
              <p className="text-sm font-medium">Video Unavailable</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        {activeVideo && (
          <div className="card p-6 rounded-xl">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-md text-xs font-medium">
                {activeVideo.category}
              </span>
              <span className={`px-2.5 py-1 border rounded-md text-xs font-medium ${levelStyle.text} ${levelStyle.border} ${levelStyle.bg}`}>
                {activeVideo.level}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{activeVideo.title}</h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-600 text-sm mt-4 border-t border-gray-200 pt-4">
              <span className="flex items-center gap-2">
                <User size={16} /> {activeVideo.channel_name}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {activeVideo.duration}
              </span>
              <a 
                href={`https://www.youtube.com/watch?v=${activeVideo.video_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-border text-gray-900 border border-gray-200 rounded-lg text-xs font-medium transition-colors"
              >
                <Play size={14} /> Open on YouTube
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ─── Sidebar ─── */}
      <div className="w-full md:w-1/3 flex flex-col gap-4">
        {/* Header + Search */}
        <div className="card p-4 flex flex-col gap-4">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Layers className="text-blue-600 w-4 h-4" /> {activeCategoryId ? 'Videos' : 'Categories'}
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-9 pr-4 text-gray-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-sm transition-all"
            />
          </div>

          {/* Back button when inside a category */}
          {activeCategoryId && (
            <button
              onClick={() => setActiveCategoryId(null)}
              className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline self-start"
            >
              ← Back to Categories
            </button>
          )}
        </div>

        {/* Category / Video List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-2">
          {!activeCategoryId ? (
            /* ── Category Cards ── */
            filteredCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => { setActiveCategoryId(cat.id); setSearch(''); }}
                className="p-4 rounded-xl border border-gray-200 bg-white cursor-pointer transition-all hover:border-blue-600 hover:shadow-sm group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.icon}</span>
                    <div>
                      <h3 className="text-gray-900 font-semibold text-sm group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">{cat.videos.length} videos</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))
          ) : (
            /* ── Video Cards for selected category ── */
            (() => {
              const cat = categories.find(c => c.id === activeCategoryId);
              if (!cat) return null;
              const videos = search
                ? cat.videos.filter(v =>
                    v.title.toLowerCase().includes(search.toLowerCase()) ||
                    v.channel_name.toLowerCase().includes(search.toLowerCase())
                  )
                : cat.videos;

              return (
                <>
                  {/* Category Header */}
                  <div className="px-3 py-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="text-gray-900 font-bold text-sm">{cat.name}</span>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">{cat.description}</p>
                  </div>

                  {videos.map(video => {
                    const vLevel = LEVEL_COLORS[video.level] || LEVEL_COLORS.Beginner;
                    const isActive = activeVideo?.id === video.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => setActiveVideo({ ...video, category: cat.name, categoryId: cat.id })}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex gap-3 ${
                          isActive
                            ? 'bg-blue-600-light border-blue-600 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-24 h-16 bg-gray-50 flex-shrink-0 rounded-lg overflow-hidden relative border border-gray-200">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover opacity-90"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/20 transition-colors">
                            <Play
                              className={`w-6 h-6 ${isActive ? 'text-white' : 'text-white/80'}`}
                              fill="currentColor"
                            />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex flex-col justify-between flex-1 py-0.5 min-w-0">
                          <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-blue-600' : 'text-gray-900'}`}>
                            {video.title}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-400 truncate">{video.channel_name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${vLevel.text} ${vLevel.bg}`}>
                                {video.level}
                              </span>
                              <span className="text-[10px] text-gray-600 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">
                                {video.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              );
            })()
          )}
        </div>

        {/* Disclaimer */}
        <div className="card p-3 text-center border-gray-200">
          <p className="text-[10px] text-gray-400 leading-relaxed">
            ⚠ For educational purposes only. Do not use tools on unauthorized targets.
          </p>
        </div>
      </div>
    </div>
  );
}
