import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import PlaceholderBadge from '../components/common/PlaceholderBadge';
import { Award, GraduationCap, HeartHandshake, Sparkles } from 'lucide-react';

const CareersPage = () => {
  const { setActiveJobModal } = useLead();
  const { careers, careersLoading } = useData();

  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', 'Engineering & Construction', 'Sales & Client Relations', 'Architecture & Design'];

  const filteredJobs = selectedDept === 'All'
    ? careers
    : careers.filter((j) => j.department === selectedDept);

  return (
    <div className="page-inner">
      
      {/* Careers Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Careers at Gurukripa</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Build the Future of <span className="text-animated-gold">Urban Architecture</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Join an elite team of structural engineers, architects, and real estate consultants driving benchmark developments across Northern India.
        </p>
      </section>

      {/* Why Work With Us */}
      <section className="container-custom grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
        <div className="glass-card p-8 space-y-4 border border-accent/20 bg-surface">
          <div className="w-13 h-13 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-ink">Excellence & Innovation</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Work with internationally acclaimed architects and structural software systems on iconic high-rise towers.
          </p>
        </div>

        <div className="glass-card p-8 space-y-4 border border-accent/20 bg-surface">
          <div className="w-13 h-13 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-ink">Mentorship & Growth</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Continuous leadership training programs, IGBC green building certifications, and clear career escalation pathways.
          </p>
        </div>

        <div className="glass-card p-8 space-y-4 border border-accent/20 bg-surface">
          <div className="w-13 h-13 rounded-2xl bg-accent/15 text-accent flex items-center justify-center border border-accent/30">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-ink">Bespoke Compensation</h3>
          <p className="text-sm text-ink-secondary leading-relaxed">
            Industry-leading salary structures, performance bonuses, comprehensive health insurance, and lease incentives.
          </p>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="container-custom space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-accent/25 pb-6">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">Open Positions</h2>
            <p className="text-sm text-ink-muted">Explore full-time career roles and internship opportunities</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border ${
                  selectedDept === dept
                    ? 'bg-accent text-[var(--text-inverse)] border-accent shadow-md'
                    : 'bg-surface text-ink-secondary border-white/10 hover:border-accent/40'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {careersLoading && (
          <div className="flex items-center justify-center py-16 gap-4 text-ink-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-base">Loading positions from database...</span>
          </div>
        )}

        {!careersLoading && (
          <div className="space-y-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id || job._id}
                onClick={() => setActiveJobModal(job)}
                className="glass-card p-8 rounded-3xl border border-accent/25 bg-surface flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group hover:border-accent transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="badge-gold text-xs">{job.department}</span>
                    <span className="text-xs sm:text-sm text-accent font-bold">{job.type}</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-ink group-hover:text-accent transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-5 text-xs sm:text-sm text-ink-muted">
                    <span>📍 {job.location}</span>
                    <span>•</span>
                    <span>Exp: {job.experience}</span>
                    <span>•</span>
                    <span className="text-accent font-bold">
                      {job.salaryStipend && job.salaryStipend.startsWith('[') ? (
                        <PlaceholderBadge text={job.salaryStipend} size="small" />
                      ) : (
                        job.salaryStipend
                      )}
                    </span>
                  </div>
                </div>

                <button className="btn-gold whitespace-nowrap text-xs sm:text-sm py-3.5 px-6 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>View & Apply</span>
                </button>
              </div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="text-center py-16 text-ink-muted">
                No open positions in this department currently.
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
};

export default CareersPage;
