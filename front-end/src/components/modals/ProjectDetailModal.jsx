import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import PlaceholderBadge from '../common/PlaceholderBadge';
import { 
  X, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  Download, 
  Check, 
  ChevronRight, 
  Layers, 
  Maximize2, 
  Video, 
  Compass, 
  FileText,
  PhoneCall,
  Send,
  Sparkles
} from 'lucide-react';

const ProjectDetailModal = () => {
  const { 
    activeProjectModal, 
    setActiveProjectModal, 
    openSiteVisitForProject, 
    setActiveBrochureModal,
    setActiveLightboxMedia,
    submitLead 
  } = useLead();

  const [activeFloorPlanTab, setActiveFloorPlanTab] = useState(0);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', phone: '', email: '', message: '' });

  const project = activeProjectModal;

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!project) return;
    submitLead({
      name: enquiryForm.name,
      phone: enquiryForm.phone,
      email: enquiryForm.email,
      projectName: project.name,
      type: 'Project Enquiry',
      message: enquiryForm.message || `Enquiry for ${project.name} (${project.location})`
    });
    setEnquiryForm({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <AnimatePresence>
      {activeProjectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={() => setActiveProjectModal(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-surface border border-accent/40 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Sticky Header */}
            <div className="bg-muted px-6 py-4 border-b border-accent/25 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="badge-gold">{project.category}</span>
                <span className={`badge-status ${
                  project.status === 'Ready to Move' ? 'status-ready' : 'status-ongoing'
                }`}>
                  {project.status}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setActiveProjectModal(null)}
                className="p-2 text-ink-secondary hover:text-accent rounded-full hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Modal Scrollable Content Body */}
            <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
              
              {/* Section 1: Hero Banner & Title */}
              <div className="relative rounded-2xl overflow-hidden min-h-[320px] flex items-end p-6 sm:p-8 border border-accent/30 group">
                <img
                  src={project.heroImage}
                  alt={project.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />

                <div className="relative z-10 space-y-2 w-full">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white">
                        {project.name}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-[var(--brass)] mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{project.location}, {project.city}, {project.state}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs uppercase text-white/70 font-bold">Price Structure</div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[var(--brass)]">
                        {project.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Quick Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted p-5 rounded-2xl border border-accent/25">
                <div>
                  <div className="text-xs text-ink-muted font-semibold">Development Size</div>
                  <div className="font-bold text-ink">{project.specifications?.projectArea || '14.5 Acres'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-muted font-semibold">Configurations</div>
                  <div className="font-bold text-ink">{project.specifications?.configurations || '3 & 4 BHK'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-muted font-semibold">Possession Date</div>
                  <div className="font-bold text-ink">{project.specifications?.possession || 'Q4 2026'}</div>
                </div>
                <div>
                  <div className="text-xs text-ink-muted font-semibold">RERA Compliance</div>
                  <div className="font-bold text-accent text-xs">
                    {project.reraNumber.startsWith('GGM') || project.reraNumber.startsWith('UP') ? (
                      <span>{project.reraNumber}</span>
                    ) : (
                      <PlaceholderBadge text={project.reraNumber} size="small" />
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Overview & Description */}
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-ink border-b border-accent/20 pb-2">
                  Project Overview
                </h3>
                <p className="text-base text-ink-secondary leading-relaxed">
                  {project.longDesc}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {project.highlights?.map((hl, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-muted px-4 py-3 rounded-xl border border-accent/20">
                      <Check className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-sm font-medium text-ink">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Interactive Floor Plans Switcher */}
              {project.floorPlans && (
                <div className="space-y-4">
                  <h3 className="font-heading text-2xl font-bold text-ink border-b border-accent/20 pb-2">
                    Floor Plans & Layouts
                  </h3>

                  {/* Tabs */}
                  <div className="flex flex-wrap gap-3">
                    {project.floorPlans.map((plan, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFloorPlanTab(idx)}
                        className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                          activeFloorPlanTab === idx
                            ? 'bg-accent text-[var(--text-inverse)] border-accent shadow-md'
                            : 'bg-muted text-ink-secondary hover:text-ink border-white/10'
                        }`}
                      >
                        {plan.type} ({plan.area})
                      </button>
                    ))}
                  </div>

                  {/* Active Plan Layout View */}
                  {project.floorPlans[activeFloorPlanTab] && (
                    <motion.div
                      key={activeFloorPlanTab}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-muted p-6 sm:p-8 rounded-2xl border border-accent/30 grid grid-cols-1 md:grid-cols-2 gap-6 items-center"
                    >
                      <div className="space-y-3">
                        <div className="text-xs uppercase text-accent font-extrabold tracking-wider">
                          Selected Configuration
                        </div>
                        <h4 className="font-heading text-2xl font-bold text-ink">
                          {project.floorPlans[activeFloorPlanTab].type}
                        </h4>
                        <div className="text-sm text-ink-secondary">
                          Super Built-up Area: <span className="text-ink font-semibold">{project.floorPlans[activeFloorPlanTab].area}</span>
                        </div>
                        <div className="text-lg font-extrabold text-accent">
                          Starting at {project.floorPlans[activeFloorPlanTab].price}
                        </div>
                        
                        <button
                          onClick={() => openSiteVisitForProject(project)}
                          className="btn-gold text-xs py-3 px-5 mt-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Book Floor Plan Site Inspection</span>
                        </button>
                      </div>

                      <div 
                        onClick={() => setActiveLightboxMedia({ url: project.floorPlans[activeFloorPlanTab].image, title: `${project.name} - ${project.floorPlans[activeFloorPlanTab].type}` })}
                        className="relative rounded-2xl overflow-hidden border border-accent/30 cursor-pointer group"
                      >
                        <img
                          src={project.floorPlans[activeFloorPlanTab].image}
                          alt={project.floorPlans[activeFloorPlanTab].type}
                          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-accent text-[var(--text-inverse)] text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xl">
                            <Maximize2 className="w-3.5 h-3.5" /> Expand Floor Plan
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Section 5: Key Amenities */}
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-ink border-b border-accent/20 pb-2">
                  Curated Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {project.amenities?.map((amenity, idx) => (
                    <motion.div
                      whileHover={{ y: -2 }}
                      key={idx}
                      className="bg-muted p-4 rounded-xl border border-accent/20 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/15 text-accent flex items-center justify-center font-bold text-xs">
                        ★
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-ink">{amenity.name}</div>
                        <div className="text-[10px] text-ink-muted uppercase font-bold">{amenity.category}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Section 6: Image Gallery */}
              <div className="space-y-4">
                <h3 className="font-heading text-2xl font-bold text-ink border-b border-accent/20 pb-2">
                  Architecture & Gallery
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {project.gallery?.map((imgUrl, idx) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      key={idx}
                      onClick={() => setActiveLightboxMedia({ url: imgUrl, title: `${project.name} Gallery ${idx + 1}` })}
                      className="rounded-xl overflow-hidden border border-accent/20 h-28 cursor-pointer group relative"
                    >
                      <img
                        src={imgUrl}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Section 7: Enquiry & Site Visit CTA Banner */}
              <div className="bg-muted p-6 sm:p-8 rounded-3xl border border-accent/40 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-3">
                  <span className="badge-gold">Verified Listing</span>
                  <h4 className="font-heading text-2xl font-bold text-ink">
                    Interested in {project.name}?
                  </h4>
                  <p className="text-xs text-ink-secondary">
                    Schedule a private site visit with dedicated chauffeur pickup or request confidential pricing breakdowns.
                  </p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={() => {
                        setActiveProjectModal(null);
                        openSiteVisitForProject(project);
                      }}
                      className="btn-gold text-xs py-3 px-5"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Book Site Visit</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveProjectModal(null);
                        setActiveBrochureModal(project);
                      }}
                      className="btn-outline-gold text-xs py-3 px-5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download E-Brochure</span>
                    </button>
                  </div>
                </div>

                {/* Instant Enquiry Form */}
                <form onSubmit={handleEnquirySubmit} className="bg-surface p-5 rounded-2xl border border-accent/30 space-y-3">
                  <div className="text-xs font-bold text-ink uppercase tracking-wider">
                    Instant Project Enquiry
                  </div>
                  <input
                    type="text"
                    placeholder="Your Full Name *"
                    value={enquiryForm.name}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                    className="form-input text-xs py-2.5"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    className="form-input text-xs py-2.5"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={enquiryForm.email}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                    className="form-input text-xs py-2.5"
                    required
                  />
                  <button
                    type="submit"
                    className="btn-gold w-full text-xs py-3 font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Enquiry</span>
                  </button>
                </form>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectDetailModal;

