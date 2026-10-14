import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const whatsappNumber = '919876543210';
  const defaultMsg = encodeURIComponent('Hello Gurukripa Arcon India team, I would like to enquire about your luxury projects and schedule a site visit.');

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
      className="fixed bottom-4 right-4 z-40 flex items-center group md:bottom-6 md:right-6"
    >
      <div className="mr-3 hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-x-1 bg-dark text-[var(--text-inverse)] border border-white/15 text-xs px-4 py-2 shadow-lg whitespace-nowrap pointer-events-none">
        Chat on WhatsApp
      </div>

      <motion.a
        whileHover={{ scale: 1.12, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        href={`https://wa.me/${whatsappNumber}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative h-12 w-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl md:h-14 md:w-14"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping" />
        <MessageCircle className="relative z-10 w-7 h-7 fill-white text-[#25D366]" />
      </motion.a>
    </motion.div>
  );
};

export default WhatsAppButton;

