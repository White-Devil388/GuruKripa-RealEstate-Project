import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { X, Calendar, Clock, User, Share2, Tag, ArrowRight } from 'lucide-react';

const BlogDetailModal = () => {
  const { activeBlogModal, setActiveBlogModal, openSiteVisitForProject, showToast } = useLead();

  const post = activeBlogModal;

  const handleShare = () => {
    showToast(`Article link copied to clipboard!`, 'info');
  };

  return (
    <AnimatePresence>
      {activeBlogModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveBlogModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-surface border border-accent/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-muted px-6 py-4.5 border-b border-accent/25 flex items-center justify-between shrink-0">
              <span className="badge-gold text-xs">{post.category}</span>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveBlogModal(null)}
                className="p-1.5 text-ink-secondary hover:text-accent rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              <div>
                <h1 className="font-heading text-3xl font-bold text-ink">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-muted mt-3 pb-4 border-b border-accent/20">
                  <div className="flex items-center gap-1.5 text-accent">
                    <User className="w-3.5 h-3.5" />
                    <span className="font-semibold">{post.author} ({post.authorRole || 'Expert Contributor'})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="ml-auto text-accent hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share Article
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-accent/20 h-64 sm:h-80">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="prose prose-invert max-w-none text-ink-secondary text-sm leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags & Related */}
              <div className="pt-4 border-t border-accent/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-accent" />
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.map((t, i) => (
                      <span key={i} className="text-[11px] bg-muted text-ink-secondary px-3 py-1 rounded-full border border-accent/20">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveBlogModal(null);
                    openSiteVisitForProject(null);
                  }}
                  className="btn-gold text-xs py-3 px-5 font-bold cursor-pointer"
                >
                  <span>Explore Gurukripa Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlogDetailModal;

