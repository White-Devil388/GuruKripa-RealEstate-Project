import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import PlaceholderBadge from '../common/PlaceholderBadge';
import { X, Briefcase, MapPin, CheckCircle2, Upload, Send, Sparkles } from 'lucide-react';

const JobDetailModal = () => {
  const { activeJobModal, setActiveJobModal, submitLead } = useLead();
  const [appForm, setAppForm] = useState({ name: '', email: '', phone: '', portfolio: '', cover: '' });
  const [submitted, setSubmitted] = useState(false);

  const job = activeJobModal;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!job) return;
    submitLead({
      name: appForm.name,
      email: appForm.email,
      phone: appForm.phone,
      type: 'Career Application',
      projectName: `Job: ${job.title}`,
      notes: `Applied for ${job.title} (${job.department}) | Portfolio: ${appForm.portfolio || 'None'} | Cover: ${appForm.cover || 'N/A'}`
    });
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {activeJobModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveJobModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-surface border border-accent/40 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-muted px-6 py-4.5 border-b border-accent/25 flex items-center justify-between shrink-0">
              <div>
                <span className="badge-gold text-[10px]">{job.department}</span>
                <h3 className="font-heading text-2xl font-bold text-ink mt-1">
                  {job.title}
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveJobModal(null)}
                className="p-1.5 text-ink-secondary hover:text-accent rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
              {/* Metadata Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted p-4 rounded-2xl border border-accent/20 text-xs">
                <div>
                  <div className="text-ink-muted font-semibold">Location</div>
                  <div className="font-bold text-ink">{job.location}</div>
                </div>
                <div>
                  <div className="text-ink-muted font-semibold">Employment Type</div>
                  <div className="font-bold text-ink">{job.type}</div>
                </div>
                <div>
                  <div className="text-ink-muted font-semibold">Required Experience</div>
                  <div className="font-bold text-ink">{job.experience}</div>
                </div>
                <div>
                  <div className="text-ink-muted font-semibold">Remuneration</div>
                  <div className="font-extrabold text-accent">
                    {job.salaryStipend?.startsWith('[') ? (
                      <PlaceholderBadge text={job.salaryStipend} size="small" />
                    ) : (
                      job.salaryStipend
                    )}
                  </div>
                </div>
              </div>

              {/* Job Summary & Responsibilities */}
              <div className="space-y-3">
                <h4 className="font-heading text-xl font-bold text-ink">About the Position</h4>
                <p className="text-sm text-ink-secondary leading-relaxed">{job.summary}</p>
              </div>

              <div className="space-y-3">
                <h4 className="font-heading text-xl font-bold text-ink">Key Responsibilities</h4>
                <ul className="space-y-2 text-sm text-ink-secondary">
                  {job.responsibilities?.map((res, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>{res}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Form */}
              <div className="border-t border-accent/20 pt-6">
                <h4 className="font-heading text-2xl font-bold text-ink mb-4">
                  Apply for this Position
                </h4>

                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-muted border border-[#22c55e]/40 p-6 rounded-2xl text-center space-y-3"
                  >
                    <CheckCircle2 className="w-10 h-10 text-[#4ade80] mx-auto" />
                    <h5 className="font-heading text-xl font-bold text-ink">Application Received!</h5>
                    <p className="text-xs text-ink-secondary">
                      Our Human Resources team has received your details for <span className="text-accent font-semibold">{job.title}</span>.
                    </p>
                    <button
                      onClick={() => setActiveJobModal(null)}
                      className="btn-gold text-xs px-6 py-2.5 font-bold cursor-pointer"
                    >
                      Close Window
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label text-xs font-bold text-ink">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={appForm.name}
                          onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                          className="form-input text-xs py-2.5"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label text-xs font-bold text-ink">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={appForm.email}
                          onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                          className="form-input text-xs py-2.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label className="form-label text-xs font-bold text-ink">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={appForm.phone}
                          onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                          className="form-input text-xs py-2.5"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label text-xs font-bold text-ink">Portfolio / LinkedIn Link</label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={appForm.portfolio}
                          onChange={(e) => setAppForm({ ...appForm, portfolio: e.target.value })}
                          className="form-input text-xs py-2.5"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Attach Resume / CV</label>
                      <div className="border border-dashed border-accent/40 rounded-2xl p-4 text-center bg-muted text-xs text-ink-secondary">
                        <Upload className="w-5 h-5 text-accent mx-auto mb-1" />
                        <span>Resume attached automatically upon submission</span>
                      </div>
                    </div>

                    <button type="submit" className="btn-gold w-full text-xs font-bold py-3.5 cursor-pointer">
                      <Sparkles className="w-4 h-4" />
                      <span>Submit Application</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobDetailModal;

