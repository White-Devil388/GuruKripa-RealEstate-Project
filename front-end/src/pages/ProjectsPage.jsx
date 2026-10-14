import React, { useEffect, useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useProjects } from '../context/ProjectContext';
import { useData } from '../context/DataContext';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Grid, Map, Calendar, ArrowRight, SlidersHorizontal, Check } from 'lucide-react';

const normalizeProjectStatus = (value) => {
  if (typeof value !== 'string') return '';

  const normalized = value.trim().toLowerCase().replace(/[_-]+/g, ' ');

  if (!normalized) return '';
  if (['ongoing', 'in progress', 'under construction', 'launching soon', 'construction', 'development'].includes(normalized)) {
    return 'ongoing';
  }
  if (['completed', 'ready to move', 'move in ready', 'move-in ready', 'completed project'].includes(normalized)) {
    return 'completed';
  }

  return normalized;
};

const matchesProjectStatus = (projectStatus, selectedStatus) => {
  if (selectedStatus === 'All') return true;

  const projectStatusValue = normalizeProjectStatus(projectStatus);
  const selectedStatusValue = normalizeProjectStatus(selectedStatus);

  if (selectedStatusValue === 'ongoing') {
    return ['ongoing', 'under construction', 'launching soon', 'in progress', 'construction', 'development'].includes(projectStatusValue)
      || projectStatusValue.includes('construction')
      || projectStatusValue.includes('launch');
  }

  if (selectedStatusValue === 'completed') {
    return ['completed', 'ready to move', 'move in ready', 'move-in ready'].includes(projectStatusValue)
      || projectStatusValue.includes('ready')
      || projectStatusValue.includes('complete');
  }

  return projectStatusValue === selectedStatusValue || projectStatus === selectedStatus;
};

const getProjectStatusBadgeClass = (status) => {
  const normalizedStatus = normalizeProjectStatus(status);
  return normalizedStatus === 'completed' || normalizedStatus === 'ready to move' || status === 'Ready to Move' ? 'status-ready' : 'status-ongoing';
};

const ProjectsPage = () => {
  const { projects } = useProjects();
  const { companyData } = useData();
  const { setActiveProjectModal, openSiteVisitForProject } = useLead();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('city') || 'All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  const [visibleCount, setVisibleCount] = useState(6);
  const PAGE_SIZE = 6;

  useEffect(() => {
    const statusParam = searchParams.get('status');

    setSelectedLocation(searchParams.get('city') || 'All');
    setSelectedCategory(searchParams.get('category') || 'All');
    setSelectedStatus(statusParam && ['ongoing', 'completed'].includes(statusParam.toLowerCase()) ? statusParam.toLowerCase() : (statusParam || 'All'));
  }, [searchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedLocation, selectedCategory, selectedStatus]);

  const locationOptions = ['All', ...new Set(projects.map((project) => project.city).filter(Boolean))];
  const categoryOptions = ['All', ...(companyData.projectCategories && companyData.projectCategories.length > 0
    ? companyData.projectCategories
    : [...new Set(projects.map((project) => project.category).filter(Boolean))])];
  const statusOptions = ['All', ...(companyData.projectStatuses && companyData.projectStatuses.length > 0
    ? companyData.projectStatuses
    : [...new Set(projects.map((project) => project.status).filter(Boolean))])];

  const filteredProjects = projects.filter((project) => {
    const projectName = project?.name?.toLowerCase?.() || '';
    const projectLocation = project?.location?.toLowerCase?.() || '';

    if (searchTerm && !projectName.includes(searchTerm.toLowerCase()) && !projectLocation.includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedLocation !== 'All') {
      const selectedLocationValue = selectedLocation.toLowerCase();
      const matchesCity = (project.city || '').toLowerCase().includes(selectedLocationValue);
      const matchesLocation = projectLocation.includes(selectedLocationValue);

      if (!matchesCity && !matchesLocation) {
        return false;
      }
    }

    if (selectedCategory !== 'All' && project.category !== selectedCategory) {
      return false;
    }
    if (!matchesProjectStatus(project.status, selectedStatus)) {
      return false;
    }
    return true;
  });

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleCount < filteredProjects.length;

  return (
    <div className="page-inner">
      
      {/* Projects Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Central Project Discovery Platform</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Benchmark <span className="text-animated-gold">Real Estate Projects</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Filter through our verified ultra-luxury residential towers, biophilic townscapes, and Grade-A executive commercial developments across NCR.
        </p>
      </section>

      {/* Filter & View Switcher Bar */}
      <section className="container-custom">
        <div className="glass-panel p-4 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-accent/40 space-y-6 sm:space-y-8 shadow-2xl bg-surface/85 backdrop-blur-2xl">
          
          {/* Search Input & View Toggles */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 sm:gap-6">
            <div className="relative w-full lg:w-96">
              <Search className="w-5 h-5 text-accent absolute left-4 top-4" />
              <input
                type="text"
                placeholder="Search project name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-sm pl-12 py-3.5"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between lg:justify-end">
              <span className="text-xs sm:text-sm text-ink-muted">
                Showing <strong className="text-accent font-bold">{filteredProjects.length}</strong> Projects
              </span>

              {/* View Switcher */}
              <div className="bg-muted p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-accent/35 flex items-center gap-1 sm:gap-1.5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3.5 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all ${
                    viewMode === 'grid' ? 'bg-accent text-[var(--text-inverse)] shadow-md' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  <span>Grid</span>
                </button>

                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3.5 sm:px-5 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 transition-all ${
                    viewMode === 'map' ? 'bg-accent text-[var(--text-inverse)] shadow-md' : 'text-ink-secondary hover:text-ink'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span><span className="hidden sm:inline">Interactive </span>Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Filters (Location, Approved Category, Status) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-accent/25 pt-6">
            <div className="form-group mb-0">
              <label className="form-label">Location / Corridor</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-select"
              >
                {locationOptions.map((location) => (
                  <option key={location} value={location}>
                    {location === 'All' ? 'All Locations' : location}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Approved Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category === 'All' ? 'All Approved Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group mb-0">
              <label className="form-label">Development Stage</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="form-select"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Stages' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main View: Grid vs Interactive Map */}
      <section className="container-custom">
        {viewMode === 'map' ? (
          /* Interactive Simulated Map Pin View */
          <div className="bg-surface rounded-3xl border border-accent/35 p-8 min-h-[550px] relative overflow-hidden flex flex-col justify-between shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:24px_24px]" />

            <div className="relative z-10 flex items-center justify-between bg-muted/90 p-5 rounded-2xl border border-accent/30 backdrop-blur-md">
              <div className="text-sm text-ink font-bold flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-accent" />
                <span>Gurukripa NCR Interactive GIS Map Overview</span>
              </div>
              <span className="badge-gold">Real-Time Location Pins</span>
            </div>

            {/* Map Pins Grid */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-10">
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setActiveProjectModal(p)}
                  className="bg-muted p-6 rounded-2xl border border-accent/40 hover:border-accent cursor-pointer space-y-3 shadow-xl hover:scale-105 transition-all"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-accent font-bold">📍 {p.city}</span>
                    <span className={`badge-status ${getProjectStatusBadgeClass(p.status)} text-[10px]`}>{p.status}</span>
                  </div>
                  <h4 className="font-heading text-xl font-bold text-ink">{p.name}</h4>
                  <div className="text-xs text-ink-muted">{p.location}</div>
                  <div className="text-sm font-extrabold text-accent pt-1">{p.price}</div>
                </div>
              ))}
            </div>

            <div className="relative z-10 text-center text-xs text-ink-muted">
              Click any project pin above to load full RERA disclosures, floor plans, and site visit booking.
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-24 bg-surface rounded-3xl border border-accent/25 space-y-4">
                <Search className="w-12 h-12 text-accent mx-auto" />
                <h3 className="font-heading text-3xl font-bold text-ink">No Projects Found</h3>
                <p className="text-sm text-ink-muted">Try resetting your filter parameters to view all available listings.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedLocation('All');
                    setSelectedCategory('All');
                    setSelectedStatus('All');
                  }}
                  className="btn-gold text-xs px-6 py-3 font-bold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                {visibleProjects.map((project) => (
                  <div key={project.id} className="glass-card overflow-hidden flex flex-col group border border-accent/20 hover:border-accent/60 bg-surface">
                    <div className="relative h-72 overflow-hidden">
                      <img
                        src={project.heroImage}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/30 to-transparent opacity-90" />

                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="badge-gold text-xs">{project.category}</span>
                        <span className={`badge-status ${getProjectStatusBadgeClass(project.status)}`}>
                          {project.status}
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-ink font-semibold">
                        <div className="flex items-center gap-1.5 bg-muted/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-accent/30">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          <span>{project.location}, {project.city}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <h3 className="font-heading text-2xl font-bold text-ink group-hover:text-accent transition-colors leading-tight">
                          {project.name}
                        </h3>
                        <p className="text-sm text-ink-secondary leading-relaxed">
                          {project.shortDesc || 'Premium residential development designed for modern urban living and long-term value.'}
                        </p>
                      </div>

                      <div className="border-t border-accent/20 pt-5 space-y-4">
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

                        <div className="flex items-center justify-between">
                          <div className="text-xs uppercase text-ink-muted font-bold tracking-wider">Price Band</div>
                          <div className="text-base font-extrabold text-accent">{project.price}</div>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <button
                            onClick={() => setActiveProjectModal(project)}
                            className="btn-secondary flex-1 text-xs py-3 font-semibold"
                          >
                            <span>View Details</span>
                          </button>

                          <button
                            onClick={() => openSiteVisitForProject(project)}
                            className="btn-gold flex-1 text-xs py-3 font-bold"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book Visit</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {hasMoreProjects && (
                  <div className="col-span-full flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredProjects.length))}
                      className="btn-gold px-7 py-3 text-sm font-bold"
                    >
                      Load More Projects
                    </button>
                  </div>
                )}

                {!hasMoreProjects && filteredProjects.length > 0 && (
                  <div className="col-span-full text-center text-sm text-ink-muted pt-2">
                    All projects loaded.
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </section>

    </div>
  );
};

export default ProjectsPage;
