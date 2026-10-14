import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { X } from 'lucide-react';

const Lightbox = () => {
  const { activeLightboxMedia, setActiveLightboxMedia } = useLead();

  return (
    <AnimatePresence>
      {activeLightboxMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setActiveLightboxMedia(null)}
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveLightboxMedia(null)}
            className="absolute top-6 right-6 p-3 text-white hover:text-accent-light bg-dark/80 rounded-full border border-white/20 transition-colors z-10 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </motion.button>

          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {activeLightboxMedia.type === 'video' ? (
              <div className="w-full aspect-video rounded-xl overflow-hidden shadow-2xl border border-accent/30 bg-black">
                <iframe
                  src={activeLightboxMedia.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
                  title={activeLightboxMedia.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <img
                src={activeLightboxMedia.url || activeLightboxMedia}
                alt={activeLightboxMedia.title || 'Gurukripa Media Showcase'}
                className="max-h-[70vh] w-auto object-contain rounded-lg border border-accent/30 shadow-2xl"
              />
            )}

            {activeLightboxMedia.title && (
              <div className="mt-4 text-center">
                <h3 className="font-heading text-xl text-[var(--text-inverse)] font-semibold">
                  {activeLightboxMedia.title}
                </h3>
                {activeLightboxMedia.caption && (
                  <p className="text-sm text-white/60 mt-1">
                    {activeLightboxMedia.caption}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;

