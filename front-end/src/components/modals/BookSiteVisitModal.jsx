import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { useProjects } from '../../context/ProjectContext';
import { X, Calendar, Clock, Users, Car, CheckCircle2, Shield, Sparkles } from 'lucide-react';

const BookSiteVisitModal = () => {
  const { projects } = useProjects();
  const { 
    isSiteVisitModalOpen, 
    setIsSiteVisitModalOpen, 
    siteVisitSelectedProject, 
    submitLead 
  } = useLead();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: '',
    preferredDate: '',
    preferredTime: '11:00 AM',
    visitors: '2',
    pickupRequired: false,
    message: '',
    consent: true
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTicket, setCreatedTicket] = useState('');

  useEffect(() => {
    if (siteVisitSelectedProject) {
      setFormData((prev) => ({ ...prev, projectId: siteVisitSelectedProject.id }));
    } else if (projects.length > 0) {
      setFormData((prev) => ({ ...prev, projectId: projects[0].id }));
    }
  }, [siteVisitSelectedProject, projects]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedProjObj = projects.find((p) => p.id === formData.projectId);
    const projName = selectedProjObj ? selectedProjObj.name : 'General Site Inspection';

    submitLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      type: 'Site Visit',
      projectName: projName,
      preferredDate: formData.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: formData.preferredTime,
      notes: `Visitors: ${formData.visitors} | Pickup: ${formData.pickupRequired ? 'Yes' : 'No'} | Message: ${formData.message || 'N/A'}`
    });

    const ticketId = `GA-VISIT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedTicket(ticketId);
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setIsSiteVisitModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isSiteVisitModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-surface border border-accent/40 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-muted px-6 py-4.5 border-b border-accent/25 flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-accent">
                <Calendar className="w-5 h-5" />
                <h3 className="font-heading text-xl font-bold text-ink">
                  Book a Private Site Visit
                </h3>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-1.5 text-ink-secondary hover:text-accent rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#22c55e]/15 text-[#4ade80] flex items-center justify-center mx-auto border border-[#22c55e]/30">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-heading text-2xl font-bold text-ink">
                    Site Visit Request Confirmed!
                  </h4>
                  <p className="text-sm text-ink-secondary max-w-md mx-auto">
                    Thank you, <span className="text-ink font-semibold">{formData.name}</span>. Your site visit pass has been dispatched to our sales concierge team.
                  </p>
                  
                  <div className="bg-muted border border-accent/30 p-5 rounded-2xl inline-block text-left text-xs space-y-1.5 text-ink">
                    <div><span className="text-ink-muted">Pass Ticket Code:</span> <span className="font-bold text-accent">{createdTicket}</span></div>
                    <div><span className="text-ink-muted">Scheduled Date:</span> {formData.preferredDate || 'Upcoming Date'} ({formData.preferredTime})</div>
                    <div><span className="text-ink-muted">Concierge Desk:</span> +91 98765 43210</div>
                  </div>

                  <div className="pt-4">
                    <button onClick={handleClose} className="btn-gold px-8 py-3 text-xs font-bold">
                      Done & Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Select Project */}
                  <div className="form-group">
                    <label className="form-label text-xs font-bold text-ink">Select Project *</label>
                    <select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      className="form-select text-xs py-3"
                      required
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.location}, {p.city})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Preferred Date *</label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="form-input text-xs py-2.5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Preferred Slot *</label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="form-select text-xs py-3"
                      >
                        <option value="10:00 AM">Morning Slot (10:00 AM)</option>
                        <option value="01:00 PM">Afternoon Slot (01:00 PM)</option>
                        <option value="04:00 PM">Evening Slot (04:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {/* Visitors & Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Number of Visitors</label>
                      <select
                        value={formData.visitors}
                        onChange={(e) => setFormData({ ...formData, visitors: e.target.value })}
                        className="form-select text-xs py-3"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 - 4 Family Members</option>
                        <option value="5+">5+ Group / Investors</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="form-input text-xs py-2.5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 00000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input text-xs py-2.5"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label text-xs font-bold text-ink">Email Address *</label>
                      <input
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input text-xs py-2.5"
                        required
                      />
                    </div>
                  </div>

                  {/* Pick-up Assistance Checkbox */}
                  <div className="flex items-center gap-2.5 bg-muted p-3.5 rounded-2xl border border-accent/20">
                    <input
                      type="checkbox"
                      id="pickup"
                      checked={formData.pickupRequired}
                      onChange={(e) => setFormData({ ...formData, pickupRequired: e.target.checked })}
                      className="accent-accent w-4 h-4"
                    />
                    <label htmlFor="pickup" className="text-xs text-ink cursor-pointer flex items-center gap-2 font-medium">
                      <Car className="w-4 h-4 text-accent" />
                      <span>Request Chauffeur Pickup Assistance from NCR Metro</span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn-gold w-full text-sm font-bold py-3.5 mt-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Reserve Site Visit</span>
                  </button>

                  <div className="text-[10px] text-center text-ink-muted flex items-center justify-center gap-1">
                    <Shield className="w-3 h-3 text-accent" />
                    <span>Your information is encrypted & zero spam protected.</span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookSiteVisitModal;

