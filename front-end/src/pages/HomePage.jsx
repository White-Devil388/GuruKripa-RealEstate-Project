import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../context/LeadContext';
import { useProjects } from '../context/ProjectContext';
import { useData } from '../context/DataContext';
import {
  MapPin, Search, Calendar, ArrowRight, ShieldCheck,
  Compass, Send, Calculator, Quote, PhoneCall, X,
  FileText, Leaf, Users
} from 'lucide-react';
import EMICAL from '../components/common/EMICAL';
import CounterNumber from '../components/common/CounterNumber';

const VALUE_ICONS = {
  ShieldCheck: <ShieldCheck className="w-6 h-6 text-accent" />,
  FileText: <FileText className="w-6 h-6 text-accent" />,
  Leaf: <Leaf className="w-6 h-6 text-accent" />,
  Users: <Users className="w-6 h-6 text-accent" />,
};

const CORE_VALUE_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', // Architectural Integrity - Modern High-Rise
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', // Transparent Governance - Master-Planned Estate
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', // Biophilic Innovation - Sustainable Green Residences
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80', // Customer First Culture - Luxury Interior & Welcoming Living
];

const DEFAULT_CORE_VALUES = [
  {
    title: 'Architectural Integrity',
    desc: 'Uncompromising engineering standards, seismic safety compliance, and premium structural material sourcing.',
    icon: 'ShieldCheck',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Transparent Governance',
    desc: 'Complete RERA compliance, zero hidden fees, and upfront title disclosures for every project.',
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Biophilic Innovation',
    desc: 'Designing sustainable urban developments with 80% open greens, solar grids, and zero liquid discharge systems.',
    icon: 'Leaf',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Customer First Culture',
    desc: 'Bespoke client hand-holding from project site visit, financing advisory, to key handover and post-possession care.',
    icon: 'Users',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
  },
];

const DEFAULT_COMPANY_STATS = [
  { label: 'Delivered Sq. Ft.', value: '3.5M+', sub: 'Premium urban architecture' },
  { label: 'Active Sites', value: '12+', sub: 'Under active development' },
  { label: 'Happy Families', value: '4,200+', sub: 'Across prime corridors' },
  { label: 'RERA Compliance', value: '100%', sub: 'Complete legal governance' },
];

const DEFAULT_ACHIEVEMENTS = [
  {
    value: '18+',
    title: 'Legacy of trust',
    desc: 'A long-term commitment to thoughtful real estate across prime corridors.',
  },
  {
    value: '35+',
    title: 'Successful projects',
    desc: 'Residential, township, and commercial developments shaped with care.',
  },
  {
    value: '3.5M+',
    title: 'Sq. ft. developed',
    desc: 'Considered spaces designed around families, work, and everyday life.',
  },
  {
    value: '100%',
    title: 'Transparent delivery',
    desc: 'Clear documentation and disciplined milestones from blueprint to handover.',
  },
];

const DEFAULT_ACHIEVEMENT_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85',
];

const DEFAULT_TESTIMONIALS = [
  {
    quote: 'The entire process felt clear and well managed. The team helped us compare layouts, understand the payment plan, and settle into our new home with confidence.',
    name: 'Aarav Mehta',
    detail: 'Homeowner, Gurukripa Heights',
  },
  {
    quote: 'What stood out was the attention to detail. From the first site visit to handover, every commitment was documented and delivered on time.',
    name: 'Neha Kapoor',
    detail: 'Resident, Greenview Township',
  },
  {
    quote: 'Gurukripa gave us the confidence to invest from another city. Their advisors were responsive, transparent, and genuinely focused on our priorities.',
    name: 'Rohan Bhatia',
    detail: 'Investor, Arcon Business Park',
  },
];

const HomePage = () => {
  const { projects } = useProjects();
  const { blogs, companyData } = useData();
  const [isOpen, setIsOpen] = useState(false);
  const [isCallbackModalOpen, setIsCallbackModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    setCurrentPage, setActiveProjectModal, openSiteVisitForProject,
    setActiveBlogModal, submitLead,
  } = useLead();

  const COMPANY_STATS = (companyData.stats && companyData.stats.length > 0)
    ? companyData.stats
    : DEFAULT_COMPANY_STATS;
  const ACHIEVEMENTS = (companyData.achievements && companyData.achievements.length > 0)
    ? companyData.achievements
    : DEFAULT_ACHIEVEMENTS;
  const ACHIEVEMENT_IMAGES = (companyData.achievementImages && companyData.achievementImages.length > 0)
    ? companyData.achievementImages
    : DEFAULT_ACHIEVEMENT_IMAGES;
  const CORE_VALUES = (companyData.coreValues && companyData.coreValues.length > 0)
    ? companyData.coreValues
    : DEFAULT_CORE_VALUES;
  const TESTIMONIALS = (companyData.testimonials && companyData.testimonials.length > 0)
    ? companyData.testimonials
    : DEFAULT_TESTIMONIALS;

  const [searchLocation, setSearchLocation] = useState('All');
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchStatus, setSearchStatus] = useState('All');
  const [heroForm, setHeroForm] = useState({ name: '', phone: '', email: '', project: '' });
  const [showcaseTab, setShowcaseTab] = useState('All');
  const [showEMICalculator, setShowEMICalculator] = useState(false);

  useEffect(() => {
    if (showEMICalculator) {
      document.getElementById('emi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showEMICalculator]);

  const locationOptions = ['All', ...new Set(projects.map((p) => p.city).filter(Boolean))];
  const categoryOptions = ['All', ...new Set(projects.map((p) => p.category).filter(Boolean))];
  const statusOptions = ['All', ...new Set(projects.map((p) => p.status).filter(Boolean))];

  const filteredProjects = projects.filter((p) => {
    if (searchLocation !== 'All') {
      const loc = searchLocation.toLowerCase();
      if (!p.city.toLowerCase().includes(loc) && !p.location.toLowerCase().includes(loc)) return false;
    }
    if (searchCategory !== 'All' && p.category !== searchCategory) return false;
    if (searchStatus !== 'All' && p.status !== searchStatus) return false;
    return true;
  });

  const showcaseProjects = showcaseTab === 'All'
    ? projects
    : projects.filter((p) => p.category === showcaseTab);

  const goToProjects = () => {
    setCurrentPage('projects');

    const params = new URLSearchParams();
    if (searchLocation !== 'All') params.set('city', searchLocation);
    if (searchCategory !== 'All') params.set('category', searchCategory);
    if (searchStatus !== 'All') params.set('status', searchStatus);

    const queryString = params.toString();
    navigate(queryString ? `/projects?${queryString}` : '/projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroFormSubmit = (e) => {
    e.preventDefault();
    submitLead({
      name: heroForm.name,
      phone: heroForm.phone,
      email: heroForm.email,
      projectName: heroForm.project || 'Homepage Quick Enquiry',
      type: 'Project Enquiry',
      message: 'Quick Callback Request from Homepage Hero Modal',
    });
    setHeroForm({ name: '', phone: '', email: '', project: '' });
    setIsCallbackModalOpen(false);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="page-shell home-compact pb-10">

      {/* ── Hero ── */}
      <section className="relative flex flex-col justify-between min-h-[78vh] sm:min-h-[85vh] pt-20 sm:pt-36 pb-6 sm:pb-20 overflow-hidden bg-dark">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-95"
          >
            <source src="/16996624_1280_720_30fps.mp4" type="video/mp4" />
          </video>
          {/* Top and bottom subtle gradients so text is readable while the middle of the video remains completely open & vibrant */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-transparent to-black/80 sm:bg-gradient-to-r sm:from-black/85 sm:via-black/35 sm:to-transparent pointer-events-none" />
          <div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none" />
        </div>

        <div className="container-custom relative z-10 w-full flex-1 flex flex-col justify-between py-2 sm:py-0">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 flex flex-col justify-between"
          >
            {/* Top Text Content (Shifted to top on mobile) */}
            <div className="max-w-xl lg:max-w-2xl mr-auto space-y-2 sm:space-y-4 pt-1 sm:pt-0">
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--brass)] bg-black/40 backdrop-blur-md px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/10 w-fit">
                <span className="w-1.5 h-1.5 bg-[var(--brass)] rounded-full animate-pulse" />
                <span>Site Ref. NCR-2007 — Architectural Benchmark</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="hero-heading !text-2xl sm:!text-4xl lg:!text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)] !max-w-xl leading-tight">
                Buildings drafted for <span className="text-animated-light-gold font-normal">the way families actually live</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="hero-subtitle text-xs sm:text-base text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] !max-w-lg leading-relaxed">
                Ultra-luxury residences, green townships, and executive commercial hubs — built with structural integrity and transparent RERA governance.
              </motion.p>

              {/* Desktop Buttons */}
              <motion.div variants={fadeInUp} className="hidden sm:flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
                <button type="button" onClick={() => openSiteVisitForProject(null)} className="btn-gold py-2.5 px-4 sm:py-3 sm:px-6 text-xs sm:text-sm shadow-xl hover:shadow-2xl">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Book Site Visit</span>
                </button>
                <button type="button"
                  onClick={() => setIsOpen(true)}
                  className="btn-outline-gold py-2.5 px-3.5 sm:py-3 sm:px-5 text-xs sm:text-sm backdrop-blur-md bg-black/40 border-white/30 text-white hover:bg-black/60 hover:text-white hover:border-white/60">
                  <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>EMI Calculator</span>
                </button>
                <button type="button" onClick={() => setIsCallbackModalOpen(true)} className="btn-outline-gold py-2.5 px-3.5 sm:py-3 sm:px-5 text-xs sm:text-sm backdrop-blur-md bg-black/40 border-white/30 text-white hover:bg-black/60 hover:text-white hover:border-white/60">
                  <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                  <span>Request Callback</span>
                </button>
              </motion.div>
            </div>

            {/* Clear Video Viewing Window in the Middle (Mobile) */}
            <div className="flex-1 min-h-[120px] sm:min-h-0 sm:hidden" />

            {/* Bottom Milestone Stats (Shifted to bottom on mobile) */}
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-2 sm:gap-6 pt-3 sm:pt-5 border-t border-white/20 max-w-lg w-full sm:mt-6 bg-black/35 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-2.5 sm:p-0 rounded-2xl sm:rounded-none">
              {[
                { val: '3.5M+', label: 'Sq. Ft. Delivered' },
                { val: '18+', label: 'Years Track Record' },
                { val: '100%', label: 'RERA Compliant' },
              ].map((s) => (
                <div key={s.label} className="space-y-0.5 sm:space-y-1 text-center sm:text-left">
                  <CounterNumber value={s.val} className="index-numeral text-lg sm:text-2xl lg:text-3xl font-semibold text-animated-light-gold text-gold-glow block" />
                  <div className="text-[9px] sm:text-xs text-white/80 tracking-wide font-mono uppercase leading-tight">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Project Finder ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6 }}
        className="container-custom project-finder mt-4"
      >
        <div className="card-panel p-5 sm:p-8 lg:p-14 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-5 sm:pb-6">
            <div className="section-head !max-w-none">
              <h3 className="section-title text-2xl sm:text-3xl lg:text-4xl flex items-center gap-2.5 sm:gap-3">
                <Search className="w-6 h-6 lg:w-8 lg:h-8 text-accent shrink-0" />
                <span>Quick Project Finder</span>
              </h3>
              <p className="section-desc text-sm sm:text-base lg:text-lg">Filter by location, category, and development stage</p>
            </div>
            <button type="button" onClick={() => { setSearchLocation('All'); setSearchCategory('All'); setSearchStatus('All'); }}
              className="text-xs sm:text-sm text-accent font-semibold hover:underline cursor-pointer self-start sm:self-auto">
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: 'Location', value: searchLocation, setter: setSearchLocation, opts: locationOptions },
              { label: 'Category', value: searchCategory, setter: setSearchCategory, opts: categoryOptions },
              { label: 'Stage', value: searchStatus, setter: setSearchStatus, opts: statusOptions },
            ].map((f) => (
              <div key={f.label} className="form-group mb-0">
                <label className="form-label">{f.label}</label>
                <select value={f.value} onChange={(e) => f.setter(e.target.value)} className="form-select">
                  {f.opts.map((o) => (
                    <option key={o} value={o}>{o === 'All' ? `All ${f.label}s` : o}</option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex items-end">
              <button type="button" onClick={goToProjects} className="btn-gold w-full py-3.5 justify-center">
                <Search className="w-4 h-4" />
                <span>{filteredProjects.length} Projects</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {showEMICalculator && (
        <div id="emi-calculator" className="scroll-mt-24">
          <EMICAL />
        </div>
      )}

      {/* ── Stats ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="container-custom py-4 sm:py-6"
      >
        <div className="card-panel p-6 sm:p-10 lg:p-12 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {COMPANY_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1.5 sm:space-y-2 group border-l-2 border-accent/40 pl-3 sm:pl-4">
              <CounterNumber value={stat.value} className="index-numeral text-2xl sm:text-3xl lg:text-4xl font-bold text-animated-gold text-gold-glow group-hover:scale-105 transition-transform block" />
              <div className="text-xs sm:text-base font-bold text-ink group-hover:text-accent transition-colors leading-tight">{stat.label}</div>
              <div className="text-[11px] sm:text-sm font-medium text-ink-muted leading-tight">{stat.sub}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Achievements ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6 }}
        className="section-muted section-block"
      >
        <div className="container-custom space-y-10">
          <div className="section-head section-head-center max-w-3xl py-4 sm:py-6">
            <span className="badge-gold">Why choose us</span>
            <h2 className="section-title">Built on trust, <span className="text-animated-gold">proven by progress</span></h2>
            <p className="section-desc text-center">From first blueprint to final handover, our work is measured in lasting relationships and spaces that feel like home.</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
          >
            {[
              ACHIEVEMENTS[0],
              ACHIEVEMENT_IMAGES[0] ? { image: ACHIEVEMENT_IMAGES[0], alt: 'Modern residential architecture' } : null,
              ACHIEVEMENTS[1],
              ACHIEVEMENT_IMAGES[1] ? { image: ACHIEVEMENT_IMAGES[1], alt: 'Contemporary commercial architecture' } : null,
              ACHIEVEMENTS[2],
              ACHIEVEMENTS[3]
            ]
              .filter(Boolean)
              .map((item) => (
                item.image ? (
                  <motion.div
                    key={item.image}
                    variants={fadeInUp}
                    className="min-h-[260px] overflow-hidden border border-border bg-surface shadow-sm sm:min-h-[320px]"
                  >
                    <img src={item.image} alt={item.alt} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                  </motion.div>
                ) : (
                  <motion.article
                    key={item.title}
                    variants={fadeInUp}
                    whileHover={{ y: -4 }}
                    className="card-panel min-h-[260px] border border-border p-6 sm:min-h-[320px] sm:p-7 flex flex-col justify-between shadow-sm transition-all duration-300 hover:border-accent hover:shadow-lg"
                  >
                    <div className="space-y-4">
                      <div className="h-10 w-10 border border-accent/30 bg-accent-subtle" />
                      <h3 className="font-heading text-xl font-semibold text-ink">{item.title}</h3>
                      <p className="text-sm leading-relaxed text-ink-secondary">{item.desc}</p>
                    </div>
                    <div className="mt-6 border-t border-border pt-4">
                      <CounterNumber value={item.value} className="index-numeral text-3xl font-bold text-animated-gold text-gold-glow block" />
                      <div className="mt-1 text-xs uppercase tracking-[0.12em] text-ink-muted">Verified milestone</div>
                    </div>
                  </motion.article>
                )
              ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Featured Projects ── */}
      <section className="container-custom space-y-9">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 sm:py-6">
          <div className="section-head">
            <span className="badge-gold">Curated Portfolio</span>
            <h2 className="section-title">Featured <span className="text-animated-gold">developments</span></h2>
            <p className="section-desc">Luxury sky residences, green townships, and commercial spaces</p>
          </div>
          <button type="button" onClick={goToProjects} className="btn-outline-gold shrink-0">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-nowrap sm:flex-wrap">
          {['All', 'Residential', 'Commercial', 'Township'].map((tab) => (
            <button key={tab} type="button" onClick={() => setShowcaseTab(tab)}
              className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium transition-all border cursor-pointer shrink-0 ${showcaseTab === tab
                  ? 'bg-accent text-[var(--text-inverse)] border-accent'
                  : 'bg-transparent text-ink-secondary border-border hover:border-accent hover:text-accent'
                }`}>
              {tab === 'All' ? 'All' : tab}
            </button>
          ))}
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch"
        >
          {showcaseProjects.slice(0, 3).map((project) => (
            <motion.article
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              key={project.id}
              className="glass-card card-hover-animated h-full overflow-hidden flex flex-col group transition-all duration-300 shadow-md hover:shadow-xl border border-accent/20"
            >
              <div className="relative aspect-[4/3] overflow-hidden frame-corners">
                <img src={project.heroImage} alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2 z-[3]">
                  <span className="badge-gold bg-white/90">{project.category}</span>
                  <span className={`badge-status ${project.status === 'Ready to Move' ? 'status-ready' : 'status-ongoing'}`}>
                    {project.status}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 z-[3]">
                  <div className="flex items-center gap-1.5 text-xs text-white font-medium bg-dark/70 px-3 py-1.5 w-fit">
                    <MapPin className="w-3.5 h-3.5 text-[var(--brass)]" />
                    {project.location}, {project.city}
                  </div>
                </div>
              </div>

              <div className="p-7 flex-1 flex flex-col gap-5">
                <div className="space-y-2">
                  <h3 className="font-heading text-xl font-semibold text-ink card-title-hover transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    {project.shortDesc || 'Premium residential development designed for modern urban living and long-term value.'}
                  </p>
                </div>

                <div className="rounded-2xl bg-muted/70 border border-accent/15 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-ink-muted uppercase tracking-wide font-bold">Configurations</span>
                    <span className="font-extrabold text-ink text-right">
                      {project.specifications?.configurations || project.configurations || '2 & 3 BHK'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-ink-muted uppercase tracking-wide font-bold">Units</span>
                    <span className="font-semibold text-ink text-right">
                      {project.specifications?.totalUnits || project.totalUnits || '120 Units'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-ink-muted uppercase tracking-wide font-bold">Possession</span>
                    <span className="font-semibold text-ink text-right">
                      {project.specifications?.possession || project.possession || '2027'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-5 border-t border-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-ink-muted font-semibold tracking-wide font-mono">Starting from</span>
                    <span className="index-numeral text-base font-bold text-animated-gold">{project.price}</span>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setActiveProjectModal(project)} className="btn-secondary flex-1 text-sm py-2.5 cursor-pointer">
                      Details
                    </button>
                    <button type="button" onClick={() => openSiteVisitForProject(project)} className="btn-gold flex-1 text-sm py-2.5 cursor-pointer">
                      <Calendar className="w-3.5 h-3.5" /> Visit
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Core Values ── */}
      <section className="section-muted section-block">
        <div className="container-custom space-y-8">
          <div className="section-head section-head-center">
            <span className="badge-gold">Our Philosophy</span>
            <h2 className="section-title">The Gurukripa standard</h2>
            <p className="section-desc text-center">Four pillars defining every square foot of our architecture</p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {CORE_VALUES.map((val, i) => {
              const bgImage = val.image || CORE_VALUE_PROJECT_IMAGES[i % CORE_VALUE_PROJECT_IMAGES.length];
              const iconElement = VALUE_ICONS[val.icon] || <ShieldCheck className="w-6 h-6 text-accent" />;

              return (
                <motion.div
                  variants={fadeInUp}
                  whileHover={{ y: -6 }}
                  key={i}
                  className="card-panel relative overflow-hidden group h-full p-8 border-t-2 border-t-accent transition-all duration-300 shadow-sm hover:shadow-xl rounded-none border border-border flex flex-col justify-between min-h-[300px]"
                >
                  {/* Background Project Image Layer */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <img
                      src={bgImage}
                      alt={val.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-100 contrast-105"
                      loading="lazy"
                    />
                    {/* High-visibility overlay: crystal clear top, gentle readable base */}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/30 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
                    {/* Subtle hover accent shimmer */}
                    <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Foreground Content */}
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-accent shadow-sm">
                      {iconElement}
                    </div>
                    <h3 className="font-heading text-xl font-bold text-ink transition-colors duration-300 group-hover:text-accent drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                      {val.title}
                    </h3>
                    <p className="text-sm text-ink leading-relaxed font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                      {val.desc}
                    </p>
                  </div>

                  {/* Subtle pillar indicator at bottom */}
                  <div className="relative z-10 pt-6 flex items-center gap-2 opacity-75 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Pillar 0{i + 1}</span>
                    <div className="h-[1px] flex-1 bg-accent/30 group-hover:bg-accent/70 transition-colors" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="container-custom space-y-8">
        <div className="section-head section-head-center">
          <span className="badge-gold">Testimonials</span>
          <h2 className="section-title">A better address, by every measure</h2>
          <p className="section-desc text-center">What homeowners and investors say about the Gurukripa experience</p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.article
              variants={fadeInUp}
              whileHover={{ y: -4 }}
              key={testimonial.name}
              className="glass-card h-full p-6 sm:p-7 flex flex-col gap-5 border-t-2 border-t-accent transition-all duration-300"
            >
              <Quote className="w-7 h-7 text-accent" aria-hidden="true" />
              <blockquote className="font-heading text-lg leading-relaxed text-ink">
                {testimonial.quote}
              </blockquote>
              <footer className="mt-auto pt-4 border-t border-border">
                <div className="font-semibold text-ink">{testimonial.name}</div>
                <div className="mt-1 text-xs text-ink-muted font-mono uppercase tracking-wide">{testimonial.detail}</div>
              </footer>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Journey ── */}
      <section className="container-custom space-y-10">
        <div className="section-head section-head-center py-4 sm:py-6">
          <span className="badge-gold">Your Journey</span>
          <h2 className="section-title">Path to homeownership</h2>
          <p className="section-desc text-center">A transparent advisory experience from discovery to key handover</p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 lg:gap-6"
        >
          {[
            {
              step: '01',
              title: 'Discover',
              desc: 'Explore master catalog & 360° virtual tours',
              image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            },
            {
              step: '02',
              title: 'Shortlist',
              desc: 'Compare locations, configurations & budgets',
              image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
            },
            {
              step: '03',
              title: 'Site Visit',
              desc: 'Private guided walkthrough of model residences',
              image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
            },
            {
              step: '04',
              title: 'Advisory',
              desc: 'Review RERA compliances & payment milestones',
              image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
            },
            {
              step: '05',
              title: 'Booking',
              desc: 'Digital allotment, transparent legal disclosures',
              image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            },
            {
              step: '06',
              title: 'Handover',
              desc: 'Key handover ceremony, welcome kit & warranty',
              image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item) => (
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -6 }}
              key={item.step}
              className="card-panel relative overflow-hidden group h-full p-5 sm:p-6 border-t-2 border-t-accent hover:border-accent transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between min-h-[220px]"
            >
              {/* Background Project Image */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-100 contrast-105"
                  loading="lazy"
                />
                {/* High-visibility overlay: crystal clear top, gentle readable base */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface/85 via-surface/30 to-transparent transition-opacity duration-300 group-hover:opacity-75" />
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Foreground content */}
              <div className="relative z-10 space-y-2.5">
                <div className="index-numeral text-2xl sm:text-3xl font-extrabold text-accent transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  {item.step}
                </div>
                <div className="font-heading text-lg font-bold text-ink group-hover:text-accent transition-colors drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                  {item.title}
                </div>
                <div className="text-xs text-ink leading-relaxed font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                  {item.desc}
                </div>
              </div>

              {/* Subtle bottom indicator */}
              <div className="relative z-10 pt-4 flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] uppercase font-bold tracking-wider text-accent">Step {item.step}</span>
                <div className="h-[1px] flex-1 bg-accent/30 group-hover:bg-accent/70 transition-colors" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Blog ── */}
      <section className="container-custom space-y-9 pb-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 py-4 sm:py-6">
          <div className="section-head">
            <span className="badge-gold">Insights</span>
            <h2 className="section-title">Real estate trends</h2>
          </div>
          <button type="button" onClick={() => { setCurrentPage('blog'); navigate('/blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="btn-outline-gold shrink-0">
            Read All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogs.slice(0, 3).map((post) => (
            <motion.article
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              key={post.id || post._id}
              onClick={() => setActiveBlogModal(post)}
              className="glass-card h-full p-5 cursor-pointer group flex flex-col gap-4 transition-all duration-300"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.featuredImage} alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
              </div>
              <div className="flex items-center justify-between text-xs text-ink-muted font-mono">
                <span className="text-accent font-semibold uppercase tracking-wide">{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-heading text-xl font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                {post.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-accent font-semibold pt-2 border-t border-border">
                Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── Request a Callback Modal Popup ── */}
      <AnimatePresence>
        {isCallbackModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
            onClick={() => setIsCallbackModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-lg bg-surface border border-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsCallbackModalOpen(false)}
                className="absolute top-5 right-5 text-ink-muted hover:text-ink p-2 rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-2 border-b border-border pb-5">
                <span className="text-xs font-mono uppercase text-accent font-semibold tracking-widest">Priority Desk</span>
                <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">Request a callback</h3>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  Connect with our advisory team for verified pricing and unit availability.
                </p>
              </div>

              <form onSubmit={handleHeroFormSubmit} className="space-y-4">
                <div className="form-group mb-0">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={heroForm.name}
                    onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={heroForm.phone}
                      onChange={(e) => setHeroForm({ ...heroForm, phone: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={heroForm.email}
                      onChange={(e) => setHeroForm({ ...heroForm, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Project of Interest</label>
                  <select
                    value={heroForm.project}
                    onChange={(e) => setHeroForm({ ...heroForm, project: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.name}>{p.name} ({p.city})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="btn-gold w-full py-3.5 mt-2 cursor-pointer font-semibold">
                  <Send className="w-4 h-4" />
                  <span>Request Callback</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-surface border border-accent/40 rounded-3xl p-6 sm:p-8 shadow-2xl"
            style={{ scrollbarWidth: "none" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-600 hover:text-black text-2xl cursor-pointer"
            >
              ×
            </button>

            <EMICAL compact />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

