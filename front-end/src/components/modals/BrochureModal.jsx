import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { X, Download, CheckCircle2, FileText, Sparkles } from 'lucide-react';

const BrochureModal = () => {
  const { activeBrochureModal, setActiveBrochureModal, submitLead } = useLead();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  const project = activeBrochureModal;

  const handleDownload = (e) => {
    e.preventDefault();
    if (!project) return;
    submitLead({
      name: 'Brochure Requester',
      email,
      phone,
      type: 'Brochure Request',
      projectName: project.name,
      notes: `Requested official digital e-brochure & floor specifications for ${project.name}`
    });
    setDownloaded(true);
  };

  return (
    <AnimatePresence>
      {activeBrochureModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setActiveBrochureModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 25 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 25 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-surface border border-accent/40 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-muted px-6 py-4.5 border-b border-accent/25 flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Download className="w-5 h-5" />
                <h3 className="font-heading text-lg font-bold text-ink">
                  Download E-Brochure
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveBrochureModal(null)}
                className="p-1 text-ink-secondary hover:text-accent transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {downloaded ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 space-y-4"
                >
                  <div className="w-14 h-14 bg-[#22c55e]/15 text-[#4ade80] rounded-full flex items-center justify-center mx-auto border border-[#22c55e]/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading text-xl font-bold text-ink">Brochure Dispatched!</h4>
                  <p className="text-xs text-ink-secondary">
                    The complete architectural brochure and floor specs for <span className="text-accent font-semibold">{project?.name}</span> have been sent to your email.
                  </p>
                  <button
                    onClick={() => setActiveBrochureModal(null)}
                    className="btn-gold text-xs px-6 py-2.5 font-bold cursor-pointer"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleDownload} className="space-y-4">
                  <div className="bg-muted p-4 rounded-2xl border border-accent/20 flex items-center gap-3.5">
                    <FileText className="w-8 h-8 text-accent shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-ink">{project?.name}</div>
                      <div className="text-[11px] text-ink-muted">Official Master E-Brochure (PDF, 14 MB)</div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs font-bold text-ink">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input text-xs py-2.5"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label text-xs font-bold text-ink">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-input text-xs py-2.5"
                    />
                  </div>

                  <button type="submit" className="btn-gold w-full text-xs font-bold py-3.5 cursor-pointer">
                    <Sparkles className="w-4 h-4" />
                    <span>Instant Download Brochure</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrochureModal;

