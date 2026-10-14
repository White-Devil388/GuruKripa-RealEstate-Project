import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserRound,
  Calendar,
  Heart,
  LogOut,
  MapPin,
  Search,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Star,
  Sparkles,
  Download,
  Bell,
  Lock,
  Eye,
  Building2,
  UserCheck,
  ArrowRight,
  Filter,
  Edit3,
  Check,
  Share2,
  Trash2,
  Headphones,
  Award
} from 'lucide-react';
import { useLead } from '../context/LeadContext';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';

const UserDashboardPage = () => {
  const { projects } = useProjects();
  const navigate = useNavigate();
  const { openSiteVisitForProject, setActiveProjectModal, leads, showToast } = useLead();
  const { user, openAuthModal, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'enquiries' | 'saved' | 'profile' | 'documents'

  // Saved properties state
  const [savedProjectIds, setSavedProjectIds] = useState(() => {
    try {
      const stored = localStorage.getItem('teca-saved-projects');
      if (stored) return JSON.parse(stored);
      // Default initial saved projects for rich demo presentation
      return [projects[0]?.id, projects[2]?.id].filter(Boolean);
    } catch {
      return [];
    }
  });

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    preferredCity: user?.preferredCity || 'Indore',
    preferredBudget: user?.preferredBudget || '₹45 Lakh - ₹75 Lakh',
    preferredConfig: user?.preferredConfig || '3 BHK Luxury Apartment',
    whatsappAlerts: true,
    emailAlerts: true
  });

  useEffect(() => {
    if (user) {
      setProfileForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user]);

  // Search filter inside Enquiries tab
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('All');

  // Callback modal mock state
  const [isCallbackRequested, setIsCallbackRequested] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('teca-saved-projects', JSON.stringify(savedProjectIds));
    } catch (e) {
      console.error('Failed to sync saved projects:', e);
    }
  }, [savedProjectIds]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
  };

  const toggleSaveProject = (projectId, projectName) => {
    setSavedProjectIds((prev) => {
      const isSaved = prev.includes(projectId);
      let updated;
      if (isSaved) {
        updated = prev.filter((id) => id !== projectId);
        showToast(`Removed "${projectName}" from saved properties.`, 'info');
      } else {
        updated = [...prev, projectId];
        showToast(`Saved "${projectName}" to your private collection!`, 'success');
      }
      return updated;
    });
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...profileForm };
    localStorage.setItem('teca-user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    showToast('Profile preferences updated successfully!', 'success');
  };

  const handleRequestCallback = () => {
    setIsCallbackRequested(true);
    showToast('Priority callback request logged! Your advisory lead will call within 15 minutes.', 'success');
    setTimeout(() => setIsCallbackRequested(false), 5000);
  };

  // Time of day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const userLeads = user
    ? leads.filter((lead) => lead.email?.toLowerCase() === user.email?.toLowerCase())
    : [];

  const savedProjectsList = projects.filter((p) => savedProjectIds.includes(p.id));

  const filteredLeads = userLeads.filter((lead) => {
    const matchesSearch =
      lead.id?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      lead.projectName?.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      lead.type?.toLowerCase().includes(enquirySearch.toLowerCase());
    const matchesStatus =
      enquiryStatusFilter === 'All' || lead.status?.toLowerCase() === enquiryStatusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Unauthenticated view
  if (!user) {
    return (
      <div className="page-inner min-h-[75vh] flex items-center justify-center px-4">
        <div className="card-panel max-w-lg w-full p-8 sm:p-10 text-center space-y-6 relative overflow-hidden rounded-3xl border border-accent/40 shadow-2xl bg-surface/90 backdrop-blur-xl">
          <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />

          <div className="w-16 h-16 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto text-accent shadow-inner">
            <UserRound className="w-8 h-8 animate-pulse-glow" />
          </div>

          <div className="space-y-2">
            <span className="badge-gold text-[10px]">Private Client Access</span>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
              Welcome to <span className="text-animated-gold">Gurukripa Client Portal</span>
            </h1>
            <p className="text-sm text-ink-secondary leading-relaxed max-w-md mx-auto">
              Please sign in to view your saved luxury residences, manage scheduled site visits, and track property advisory tickets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left border-y border-border py-5 my-2">
            <div className="flex items-center gap-2.5 text-xs text-ink-secondary font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Track Site Visits</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-ink-secondary font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Saved Properties</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-ink-secondary font-medium">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <span>Direct Advisor Desk</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="btn-gold flex-1 py-3 font-bold text-xs"
            >
              Sign In / Register
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1 py-3 font-semibold text-xs"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-inner space-y-10">
      
      {/* Dynamic Luxury Header Banner */}
      <section className="container-custom">
        <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-dark p-7 sm:p-10 shadow-2xl text-[var(--text-inverse)]">
          {/* Blueprint & Ambient Backdrop */}
          <div className="absolute inset-0 blueprint-grid opacity-25" />
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[var(--brass)]/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[var(--brass)]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            
            {/* User Info & Identity */}
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--brass)] bg-[var(--brass)]/10 px-3 py-1 rounded-full border border-[var(--brass)]/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Verified Private Client
                </span>
                <span className="text-xs text-white/60 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[var(--brass)]" /> RERA Verified Account
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-widest block">
                  {getGreeting()},
                </span>
                <h1 className="font-heading text-3xl sm:text-5xl font-bold leading-tight mt-1">
                  {user.name}
                </h1>
                <p className="text-sm sm:text-base text-white/75 mt-2 font-light leading-relaxed">
                  Manage your luxury property holdings, track active site visits, and coordinate with your dedicated Gurukripa Relationship Manager.
                </p>
              </div>

              {/* Quick Contact & Badges */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 pt-1">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Mail className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <Phone className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>{profileForm.phone}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-[var(--brass)]" />
                  <span>{profileForm.preferredCity} Corridor</span>
                </div>
              </div>
            </div>

            {/* Profile Avatar & Actions */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-5 border-t lg:border-t-0 lg:border-l border-white/15 pt-6 lg:pt-0 lg:pl-8">
              
              <div className="flex items-center gap-4 bg-white/5 border border-white/15 p-3.5 rounded-2xl backdrop-blur-md">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--brass)] to-[var(--accent-dark)] text-dark font-extrabold text-2xl flex items-center justify-center shadow-lg border border-white/20">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    {user.name}
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xs text-[var(--brass)] font-medium">VIP Portfolio Pass</div>
                  <div className="text-[11px] text-white/50 mt-0.5">Member since 2026</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openSiteVisitForProject(null)}
                  className="btn-gold py-2.5 px-4 text-xs font-bold shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Site Visit</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-outline-gold py-2.5 px-4 text-xs font-semibold text-white border-white/30 hover:border-[var(--brass)] hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Quick KPI Stat Cards */}
      <section className="container-custom grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setActiveTab('enquiries')}
          className="card-panel card-hover-animated p-6 rounded-2xl border-l-4 border-l-accent cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-2xl font-extrabold text-accent">{userLeads.length}</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Total Enquiries</div>
            <div className="text-sm font-semibold text-ink mt-0.5 group-hover:text-accent transition-colors">
              {userLeads.length > 0 ? `${userLeads.length} Requests Submitted` : 'No active requests'}
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('saved')}
          className="card-panel card-hover-animated p-6 rounded-2xl border-l-4 border-l-accent cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-accent/20" />
            </div>
            <span className="text-2xl font-extrabold text-accent">{savedProjectIds.length}</span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Saved Properties</div>
            <div className="text-sm font-semibold text-ink mt-0.5 group-hover:text-accent transition-colors">
              {savedProjectIds.length} Shortlisted Towers
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('profile')}
          className="card-panel card-hover-animated p-6 rounded-2xl border-l-4 border-l-accent cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserRound className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Verified
            </span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Preferences</div>
            <div className="text-sm font-semibold text-ink mt-0.5 truncate group-hover:text-accent transition-colors">
              {profileForm.preferredConfig}
            </div>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('documents')}
          className="card-panel card-hover-animated p-6 rounded-2xl border-l-4 border-l-accent cursor-pointer group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
              4 Ready
            </span>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-ink-muted">Client Vault</div>
            <div className="text-sm font-semibold text-ink mt-0.5 group-hover:text-accent transition-colors">
              Brochures & RERA Docs
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Navigation Bar */}
      <section className="container-custom">
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-accent text-[var(--text-inverse)] shadow-lg scale-105'
                : 'text-ink-secondary hover:text-ink hover:bg-muted'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('enquiries')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'enquiries'
                ? 'bg-accent text-[var(--text-inverse)] shadow-lg scale-105'
                : 'text-ink-secondary hover:text-ink hover:bg-muted'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>My Enquiries ({userLeads.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'saved'
                ? 'bg-accent text-[var(--text-inverse)] shadow-lg scale-105'
                : 'text-ink-secondary hover:text-ink hover:bg-muted'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Properties ({savedProjectIds.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'profile'
                ? 'bg-accent text-[var(--text-inverse)] shadow-lg scale-105'
                : 'text-ink-secondary hover:text-ink hover:bg-muted'
            }`}
          >
            <UserRound className="w-4 h-4" />
            <span>Profile & Preferences</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all ${
              activeTab === 'documents'
                ? 'bg-accent text-[var(--text-inverse)] shadow-lg scale-105'
                : 'text-ink-secondary hover:text-ink hover:bg-muted'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Vault & Downloads</span>
          </button>
        </div>
      </section>

      {/* Tab Content Sections */}
      <div className="container-custom">
        
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            
            {/* Top Grid: Recent Activity & Relationship Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column (2/3): Recent Enquiries & Quick Actions */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Recent Enquiries Preview */}
                <div className="card-panel p-7 rounded-3xl space-y-5 border border-accent/20">
                  <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Real-Time Status</span>
                      <h2 className="font-heading text-2xl font-bold text-ink mt-0.5">Recent Enquiries & Visits</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      View All ({userLeads.length}) <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {userLeads.length === 0 ? (
                    <div className="text-center py-10 space-y-4 bg-muted/50 rounded-2xl p-6 border border-dashed border-border">
                      <Calendar className="w-10 h-10 text-accent mx-auto" />
                      <div>
                        <h3 className="font-heading text-lg font-bold text-ink">No Active Enquiries Yet</h3>
                        <p className="text-xs text-ink-muted max-w-sm mx-auto mt-1">
                          Book a site visit or inquire about floor plans to monitor your requests here in real time.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openSiteVisitForProject(null)}
                        className="btn-gold py-2.5 px-5 text-xs font-bold"
                      >
                        Book First Site Visit
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {userLeads.slice(0, 3).map((lead) => (
                        <div
                          key={lead.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-muted/40 border border-border hover:border-accent/40 transition-colors"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded">
                                #{lead.id}
                              </span>
                              <span className="text-xs font-bold text-ink">{lead.type}</span>
                            </div>
                            <div className="text-sm font-semibold text-ink-secondary">{lead.projectName}</div>
                            <div className="text-[11px] text-ink-muted flex items-center gap-2">
                              <Clock className="w-3 h-3 text-accent" /> Submitted: {lead.dateSubmitted || 'Recent'}
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="badge-gold text-[10px] py-1 px-2.5 rounded-full">
                              {lead.status || 'Received'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recommended Luxury Residences */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Bespoke Suggestions</span>
                      <h2 className="font-heading text-2xl font-bold text-ink">Recommended for You</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/projects')}
                      className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                    >
                      Explore All Projects <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {projects.slice(0, 2).map((project) => (
                      <div
                        key={project.id}
                        className="glass-card rounded-2xl overflow-hidden border border-accent/20 flex flex-col bg-surface"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={project.heroImage}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white font-semibold">
                            <span className="badge-gold text-[10px]">{project.category}</span>
                            <span className="text-[11px] bg-dark/70 px-2.5 py-1 rounded-full border border-white/20">
                              {project.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="font-heading text-lg font-bold text-ink">{project.name}</h3>
                            <div className="text-xs text-ink-muted flex items-center gap-1 mt-1">
                              <MapPin className="w-3.5 h-3.5 text-accent" /> {project.location}, {project.city}
                            </div>
                            <div className="text-sm font-extrabold text-accent mt-2">{project.price}</div>
                          </div>

                          <div className="flex gap-2 pt-2 border-t border-border">
                            <button
                              type="button"
                              onClick={() => setActiveProjectModal(project)}
                              className="btn-secondary flex-1 py-2 text-xs font-semibold"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => openSiteVisitForProject(project)}
                              className="btn-gold flex-1 py-2 text-xs font-bold"
                            >
                              Book Visit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column (1/3): Dedicated Relationship Manager & Concierge */}
              <div className="space-y-6">
                
                {/* Dedicated Advisor Card */}
                <div className="card-panel p-7 rounded-3xl space-y-5 border border-accent/40 bg-surface/90 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-bl-full pointer-events-none" />

                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Dedicated Advisor Desk</span>
                  </div>

                  <div className="flex items-center gap-4 bg-muted/60 p-4 rounded-2xl border border-accent/20">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-dark text-white font-bold text-xl flex items-center justify-center shadow-md">
                      VS
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-ink">Vikramaditya Sharma</h4>
                      <div className="text-xs text-accent font-semibold">Senior Real Estate Advisor</div>
                      <div className="text-[11px] text-ink-muted flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> 4.98 Rating (140+ Handovers)
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-ink-secondary leading-relaxed">
                    <p>
                      Your personal relationship officer is ready to assist with custom pricing, RERA disclosures, NRI documentation, and luxury site pickups.
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <a
                      href="tel:+919876543210"
                      className="btn-gold w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call Advisor Direct (+91 98765 43210)</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleRequestCallback}
                      disabled={isCallbackRequested}
                      className="btn-outline-gold w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
                    >
                      <Headphones className="w-4 h-4" />
                      <span>{isCallbackRequested ? 'Callback Scheduled ✓' : 'Request Priority Callback'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Client Benefits Card */}
                <div className="glass-panel p-6 rounded-3xl space-y-4 border border-accent/20">
                  <h3 className="font-heading text-lg font-bold text-ink flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span>Private Client Privileges</span>
                  </h3>
                  <ul className="space-y-2.5 text-xs text-ink-secondary">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>Priority preview of newly launched luxury sky residences.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>Complimentary chauffeur pickup for all scheduled site visits.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span>Bespoke floor plan customization session with chief architect.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 2. MY ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Activity Log</span>
                <h2 className="font-heading text-3xl font-bold text-ink mt-0.5">My Enquiries & Site Visits</h2>
              </div>
              <button
                type="button"
                onClick={() => openSiteVisitForProject(null)}
                className="btn-gold py-2.5 px-5 text-xs font-bold self-start sm:self-auto"
              >
                <Calendar className="w-4 h-4" />
                <span>Book New Site Visit</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-surface p-4 rounded-2xl border border-border">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-accent absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search by ticket ID, project name or enquiry type..."
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  className="form-input text-xs pl-10 py-2.5"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs text-ink-muted shrink-0 font-medium">Filter Status:</span>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="form-select text-xs py-2.5 px-3 min-w-[140px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New / Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Contacted">Contacted</option>
                </select>
              </div>
            </div>

            {/* Table / Cards List */}
            {filteredLeads.length === 0 ? (
              <div className="card-panel p-12 text-center rounded-3xl space-y-4 border border-dashed border-border">
                <Calendar className="w-12 h-12 text-accent mx-auto opacity-70" />
                <h3 className="font-heading text-2xl font-bold text-ink">No Enquiries Found</h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  {enquirySearch || enquiryStatusFilter !== 'All'
                    ? 'No matching tickets fit your search filters. Try resetting search criteria.'
                    : 'You have not submitted any property enquiries or booked site visits yet.'}
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  {(enquirySearch || enquiryStatusFilter !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setEnquirySearch('');
                        setEnquiryStatusFilter('All');
                      }}
                      className="btn-secondary text-xs py-2.5 px-4 font-semibold"
                    >
                      Reset Filters
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openSiteVisitForProject(null)}
                    className="btn-gold text-xs py-2.5 px-5 font-bold"
                  >
                    Schedule a Visit Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-muted text-[11px] uppercase tracking-wider text-ink-muted border-b border-border">
                    <tr>
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Project</th>
                      <th className="p-4">Date Submitted</th>
                      <th className="p-4">Preferred Slot</th>
                      <th className="p-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="text-ink hover:bg-muted/40 transition-colors">
                        <td className="p-4 font-mono text-xs font-bold text-accent">{lead.id}</td>
                        <td className="p-4 font-semibold">{lead.type}</td>
                        <td className="p-4 text-ink-secondary">{lead.projectName}</td>
                        <td className="p-4 text-xs text-ink-muted">{lead.dateSubmitted || 'Recent'}</td>
                        <td className="p-4 text-xs text-ink-muted">
                          {lead.preferredDate ? `${lead.preferredDate} (${lead.preferredTime || 'Anytime'})` : 'Flexible'}
                        </td>
                        <td className="p-4 text-right">
                          <span className="badge-gold text-[10px] py-1 px-3 rounded-full">
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* 3. SAVED PROPERTIES TAB */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Shortlisted Portfolio</span>
                <h2 className="font-heading text-3xl font-bold text-ink mt-0.5">My Saved Properties ({savedProjectsList.length})</h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="btn-gold py-2.5 px-5 text-xs font-bold self-start sm:self-auto"
              >
                <Search className="w-4 h-4" />
                <span>Browse More Projects</span>
              </button>
            </div>

            {savedProjectsList.length === 0 ? (
              <div className="card-panel p-12 text-center rounded-3xl space-y-4 border border-dashed border-border">
                <Heart className="w-12 h-12 text-accent mx-auto opacity-70" />
                <h3 className="font-heading text-2xl font-bold text-ink">No Saved Properties</h3>
                <p className="text-xs text-ink-muted max-w-md mx-auto">
                  Click the heart icon on any luxury tower card across our projects gallery to bookmark it in your private client collection.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/projects')}
                  className="btn-gold text-xs py-2.5 px-6 font-bold"
                >
                  Explore All Properties
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProjectsList.map((project) => (
                  <div
                    key={project.id}
                    className="glass-card rounded-3xl overflow-hidden border border-accent/30 bg-surface flex flex-col justify-between group shadow-lg hover:shadow-2xl transition-all"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={project.heroImage}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className="badge-gold text-xs">{project.category}</span>
                        <button
                          type="button"
                          onClick={() => toggleSaveProject(project.id, project.name)}
                          className="w-9 h-9 rounded-full bg-dark/70 text-rose-400 hover:text-rose-500 border border-white/20 flex items-center justify-center transition-transform hover:scale-110 shadow-md"
                          title="Remove from saved"
                        >
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-4 text-xs text-white font-semibold flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--brass)]" />
                        <span>{project.location}, {project.city}</span>
                      </div>
                    </div>

                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h3 className="font-heading text-xl font-bold text-ink group-hover:text-accent transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-ink-secondary line-clamp-2 leading-relaxed">
                          {project.shortDesc}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Investment</span>
                          <span className="text-sm font-extrabold text-accent">{project.price}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveProjectModal(project)}
                            className="btn-secondary flex-1 py-2.5 text-xs font-semibold"
                          >
                            View Specs
                          </button>
                          <button
                            type="button"
                            onClick={() => openSiteVisitForProject(project)}
                            className="btn-gold flex-1 py-2.5 text-xs font-bold"
                          >
                            <Calendar className="w-3.5 h-3.5" /> Book Visit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* 4. PROFILE & PREFERENCES TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (2/3): Edit Personal Profile Form */}
            <div className="lg:col-span-2 card-panel p-8 rounded-3xl space-y-6 border border-accent/30 bg-surface">
              <div className="border-b border-border pb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Account Management</span>
                <h2 className="font-heading text-2xl font-bold text-ink mt-0.5">Private Profile & Property Preferences</h2>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  <div className="form-group mb-0">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                      className="form-input text-xs py-3"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                      className="form-input text-xs py-3 bg-muted/40 cursor-not-allowed"
                      readOnly
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                      className="form-input text-xs py-3"
                    />
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Preferred Location / City</label>
                    <select
                      value={profileForm.preferredCity}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredCity: e.target.value })}
                      className="form-select text-xs py-3"
                    >
                      <option value="Indore">Indore (AB Road / Super Corridor)</option>
                      <option value="Bhopal">Bhopal Corridor</option>
                      <option value="NCR">Delhi NCR</option>
                    </select>
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Investment Budget</label>
                    <select
                      value={profileForm.preferredBudget}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredBudget: e.target.value })}
                      className="form-select text-xs py-3"
                    >
                      <option value="₹30 Lakh - ₹45 Lakh">₹30 Lakh - ₹45 Lakh</option>
                      <option value="₹45 Lakh - ₹75 Lakh">₹45 Lakh - ₹75 Lakh</option>
                      <option value="₹75 Lakh - ₹1.5 Cr">₹75 Lakh - ₹1.5 Cr</option>
                      <option value="₹1.5 Cr+">₹1.5 Cr+ Luxury Penthouse</option>
                    </select>
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Property Configuration</label>
                    <select
                      value={profileForm.preferredConfig}
                      onChange={(e) => setProfileForm({ ...profileForm, preferredConfig: e.target.value })}
                      className="form-select text-xs py-3"
                    >
                      <option value="2 BHK Luxury Apartment">2 BHK Luxury Apartment</option>
                      <option value="3 BHK Premium Residence">3 BHK Premium Residence</option>
                      <option value="4 BHK Sky Villa / Penthouse">4 BHK Sky Villa / Penthouse</option>
                      <option value="Independent Luxury Villa">Independent Luxury Villa</option>
                    </select>
                  </div>

                </div>

                {/* Communication Notifications */}
                <div className="border-t border-border pt-5 space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-accent">Notification Preferences</div>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer text-xs text-ink-secondary">
                      <input
                        type="checkbox"
                        checked={profileForm.whatsappAlerts}
                        onChange={(e) => setProfileForm({ ...profileForm, whatsappAlerts: e.target.checked })}
                        className="rounded accent-[var(--accent)] w-4 h-4"
                      />
                      <span>Receive WhatsApp site visit reminders & RERA construction updates</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer text-xs text-ink-secondary">
                      <input
                        type="checkbox"
                        checked={profileForm.emailAlerts}
                        onChange={(e) => setProfileForm({ ...profileForm, emailAlerts: e.target.checked })}
                        className="rounded accent-[var(--accent)] w-4 h-4"
                      />
                      <span>Receive quarterly project progress reports & price drop alerts</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" className="btn-gold text-xs py-3 px-8 font-bold">
                    Save Profile Preferences
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (1/3): Security & Pass status */}
            <div className="space-y-6">
              
              <div className="card-panel p-6 rounded-3xl space-y-4 border border-accent/20 bg-surface">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-lg font-bold text-ink">Account Security</h3>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Your client session is encrypted with token-based security. Passwords are never stored in plain text.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                    <span className="text-ink-muted">Token Status</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border">
                    <span className="text-ink-muted">Role Pass</span>
                    <span className="font-bold text-accent">VIP Client</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Password reset link sent to your registered email.', 'info')}
                  className="btn-secondary w-full py-2.5 text-xs font-semibold mt-2"
                >
                  Request Password Reset
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl space-y-3 border border-accent/30 bg-surface">
                <h3 className="font-heading text-lg font-bold text-ink">Need Account Help?</h3>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Contact our compliance team to update primary registered email or legal title ownership details.
                </p>
                <a
                  href="mailto:support@gurukripaarcon.com"
                  className="btn-outline-gold w-full py-2 text-xs font-bold block text-center"
                >
                  Contact Desk
                </a>
              </div>

            </div>

          </div>
        )}

        {/* 5. DOCUMENTS & DOWNLOADS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            
            <div className="border-b border-border pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Client Document Vault</span>
              <h2 className="font-heading text-3xl font-bold text-ink mt-0.5">Brochures, Compliance & Guides</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="card-panel p-6 rounded-3xl border border-accent/30 flex items-start gap-4 hover:border-accent transition-colors bg-surface">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Download className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-ink">Gurukripa Master Corporate Brochure</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Complete 24-page PDF featuring engineering standards, biophilic architecture, and upcoming township maps.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Downloading Gurukripa Master Brochure PDF...', 'success');
                    }}
                    className="btn-gold inline-flex py-2 px-4 text-xs font-bold mt-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF (12.4 MB)
                  </a>
                </div>
              </div>

              <div className="card-panel p-6 rounded-3xl border border-accent/30 flex items-start gap-4 hover:border-accent transition-colors bg-surface">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-ink">RERA Compliance & Title Disclosure Guide</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Comprehensive legal handbook explaining home buyer rights, title verification, and escrow account protections.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Downloading RERA Compliance Handbook...', 'success');
                    }}
                    className="btn-secondary inline-flex py-2 px-4 text-xs font-semibold mt-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Guide (4.2 MB)
                  </a>
                </div>
              </div>

              <div className="card-panel p-6 rounded-3xl border border-accent/30 flex items-start gap-4 hover:border-accent transition-colors bg-surface">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-ink">Home Loan & Tax Benefit Schedule 2026</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Pre-approved bank partners directory (HDFC, SBI, ICICI) with special low-interest slab breakdowns.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Downloading Financial Advisory Guide...', 'success');
                    }}
                    className="btn-secondary inline-flex py-2 px-4 text-xs font-semibold mt-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Guide (3.1 MB)
                  </a>
                </div>
              </div>

              <div className="card-panel p-6 rounded-3xl border border-accent/30 flex items-start gap-4 hover:border-accent transition-colors bg-surface">
                <div className="w-12 h-12 rounded-2xl bg-accent/15 text-accent flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-heading text-lg font-bold text-ink">Sample Allotment Agreement Draft</h3>
                  <p className="text-xs text-ink-secondary leading-relaxed">
                    Standardized legal template for buyer-developer agreements according to state regulatory standards.
                  </p>
                  <a
                    href="#download"
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Downloading Sample Draft Agreement...', 'success');
                    }}
                    className="btn-secondary inline-flex py-2 px-4 text-xs font-semibold mt-2"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Draft (2.8 MB)
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default UserDashboardPage;
