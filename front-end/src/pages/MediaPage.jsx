import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { Play, Maximize2 } from 'lucide-react';

const MediaPage = () => {
  const { setActiveLightboxMedia } = useLead();
  const { mediaItems, mediaLoading, companyData } = useData();

  const [selectedCat, setSelectedCat] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const PAGE_SIZE = 6;

  const categories = ['All', ...(companyData.mediaCategories && companyData.mediaCategories.length > 0 ? companyData.mediaCategories : ['Project Images', 'Videos', 'Events', 'Company Activities', 'News & Press'])];

  const filteredMedia = selectedCat === 'All' 
    ? mediaItems 
    : mediaItems.filter((item) => item.category === selectedCat);

  const visibleMedia = filteredMedia.slice(0, visibleCount);
  const hasMoreMedia = visibleCount < filteredMedia.length;

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [selectedCat]);

  return (
    <div className="page-inner">
      
      {/* Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Media & Press Gallery</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Gurukripa <span className="text-animated-gold">Visuals & Announcements</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Explore walkthrough videos, architectural photography, event coverage, and corporate releases.
        </p>
      </section>

      {/* Categories Filter */}
      <section className="container-custom">
        <div className="flex flex-wrap gap-3 border-b border-accent/25 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border ${
                selectedCat === cat
                  ? 'bg-accent text-[var(--text-inverse)] border-accent shadow-md'
                  : 'bg-surface text-ink-secondary hover:text-ink border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Loading State */}
      {mediaLoading && (
        <section className="container-custom">
          <div className="flex items-center justify-center py-16 gap-4 text-ink-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-base">Loading media gallery from database...</span>
          </div>
        </section>
      )}

      {/* Media Grid */}
      {!mediaLoading && (
        <section className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {visibleMedia.map((item) => (
              <div
                key={item.id || item._id}
                onClick={() => setActiveLightboxMedia(item)}
                className="glass-card overflow-hidden cursor-pointer group flex flex-col justify-between border border-accent/20 hover:border-accent/60 bg-surface"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {item.type === 'video' ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-accent text-[var(--text-inverse)] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-current ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-black/60 p-2.5 rounded-full text-white backdrop-blur-sm">
                      <Maximize2 className="w-4 h-4 text-accent" />
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="badge-gold text-xs">{item.category}</span>
                  </div>
                </div>

                <div className="p-7 space-y-2.5">
                  <div className="text-xs text-ink-muted">{item.date}</div>
                  <h3 className="font-heading text-xl font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2">{item.caption}</p>
                </div>
              </div>
            ))}

            {filteredMedia.length === 0 && (
              <div className="col-span-3 text-center py-16 text-ink-muted">
                No media items in this category.
              </div>
            )}

            {hasMoreMedia && (
              <div className="col-span-full flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredMedia.length))}
                  className="btn-gold px-7 py-3 text-sm font-bold"
                >
                  Load More Media
                </button>
              </div>
            )}

            {!hasMoreMedia && filteredMedia.length > 0 && (
              <div className="col-span-full text-center text-sm text-ink-muted pt-2">
                All media loaded.
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
};

export default MediaPage;
