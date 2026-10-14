import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

const BlogPage = () => {
  const { setActiveBlogModal, showToast } = useLead();
  const { blogs, blogsLoading, companyData } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const PAGE_SIZE = 6;

  const categories = ['All', ...(companyData.blogCategories && companyData.blogCategories.length > 0 ? companyData.blogCategories : ['Real Estate Trends', 'Legal & RERA', 'Investment Guides', 'Architecture & Design'])];

  const filteredPosts = blogs.filter((post) => {
    if (searchTerm && !post.title.toLowerCase().includes(searchTerm.toLowerCase()) && !post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedCat !== 'All' && post.category !== selectedCat) {
      return false;
    }
    return true;
  });

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = visibleCount < filteredPosts.length;

  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedCat]);

  const featuredPost = blogs.find((p) => p.featured) || blogs[0];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Subscribed ${newsletterEmail} to Gurukripa Real Estate Digest`, 'success');
    setNewsletterEmail('');
  };

  return (
    <div className="pt-36 sm:pt-40 pb-28 space-y-20">
      
      {/* Blog Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Gurukripa Real Estate Journal</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Market Insights & <span className="text-animated-gold">Architectural Analysis</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Expert analysis on NCR real estate growth corridors, biophilic design, RERA laws, and high-yield property investment strategies.
        </p>
      </section>

      {/* Loading State */}
      {blogsLoading && (
        <section className="container-custom">
          <div className="flex items-center justify-center py-16 gap-4 text-ink-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-base">Loading latest articles from database...</span>
          </div>
        </section>
      )}

      {/* Featured Article Banner */}
      {!blogsLoading && featuredPost && (
        <section className="container-custom">
          <div 
            onClick={() => setActiveBlogModal(featuredPost)}
            className="glass-panel p-8 sm:p-10 rounded-3xl border border-accent/40 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center cursor-pointer group shadow-2xl bg-surface/90 backdrop-blur-2xl"
          >
            <div className="lg:col-span-7 space-y-5">
              <span className="badge-gold">Featured Insight</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                {featuredPost.title}
              </h2>
              <p className="text-base text-ink-secondary leading-relaxed">
                {featuredPost.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-ink-muted pt-2">
                <span className="text-accent font-bold">{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
                <span>•</span>
                <span>{featuredPost.readTime}</span>
              </div>
            </div>

            <div className="lg:col-span-5 h-72 sm:h-96 rounded-2xl overflow-hidden border border-accent/25 relative">
              <img
                src={featuredPost.featuredImage}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          </div>
        </section>
      )}

      {/* Search & Categories Bar */}
      {!blogsLoading && (
        <section className="container-custom space-y-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-accent/25 pb-6">
            <div className="flex flex-wrap gap-3">
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

            <div className="relative w-full lg:w-80">
              <Search className="w-5 h-5 text-accent absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-sm pl-12 py-3"
              />
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {visiblePosts.map((post) => (
              <div
                key={post.id || post._id}
                onClick={() => setActiveBlogModal(post)}
                className="glass-card p-6 cursor-pointer flex flex-col justify-between group space-y-5 border border-accent/20 hover:border-accent/60 bg-surface"
              >
                <div className="space-y-4">
                  <div className="h-52 rounded-2xl overflow-hidden border border-accent/20 relative">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-muted">
                    <span className="text-accent font-bold uppercase tracking-wider">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed line-clamp-2">{post.excerpt}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-accent font-bold pt-4 border-t border-accent/20">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="col-span-3 text-center py-16 text-ink-muted">
                No articles found matching your search.
              </div>
            )}

            {hasMorePosts && (
              <div className="col-span-full flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredPosts.length))}
                  className="btn-gold px-7 py-3 text-sm font-bold"
                >
                  Load More Articles
                </button>
              </div>
            )}

            {!hasMorePosts && filteredPosts.length > 0 && (
              <div className="col-span-full text-center text-sm text-ink-muted pt-2">
                All articles loaded.
              </div>
            )}
          </div>
        </section>
      )}

      {/* Newsletter Signup */}
      <section className="container-custom">
        <div className="bg-surface p-10 sm:p-14 rounded-3xl border border-accent/35 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
          <h3 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
            Subscribe to Weekly Real Estate Intelligence
          </h3>
          <p className="text-sm text-ink-secondary max-w-xl mx-auto leading-relaxed">
            Receive curated market reports, newly launched project alerts, and RERA updates directly in your inbox.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="form-input text-sm py-3.5 w-full"
            />
            <button type="submit" className="btn-gold whitespace-nowrap text-sm py-3.5 px-8 font-bold w-full sm:w-auto">
              <Sparkles className="w-4 h-4" />
              <span>Subscribe</span>
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default BlogPage;
