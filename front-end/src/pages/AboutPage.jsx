import React from 'react';
import { useLead } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { Award, ShieldCheck, Target, Eye, Sparkles, FileText, Leaf, Users } from 'lucide-react';

const ICON_MAP = {
  ShieldCheck: <ShieldCheck className="w-8 h-8 text-accent shrink-0" />,
  FileText: <FileText className="w-8 h-8 text-accent shrink-0" />,
  Leaf: <Leaf className="w-8 h-8 text-accent shrink-0" />,
  Users: <Users className="w-8 h-8 text-accent shrink-0" />
};

const CORE_VALUE_PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80', // Architectural Integrity
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80', // Transparent Governance
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80', // Biophilic Innovation
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80', // Customer First Culture
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

const AboutPage = () => {
  const { openSiteVisitForProject } = useLead();
  const { companyData, companyLoading } = useData();

  const rawValues = companyData.coreValues || [];
  const coreValues = rawValues.length > 0 ? rawValues : DEFAULT_CORE_VALUES;
  const { leadershipTeam = [] } = companyData;

  return (
    <div className="page-inner">
      
      {/* About Hero */}
      <section className="container-custom">
        <div className="max-w-4xl space-y-6">
          <span className="badge-gold">About Gurukripa Arcon India</span>
          <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold text-ink leading-[1.12]">
            Pioneering <span className="text-animated-gold">Architectural Mastery</span> & Transparent Governance
          </h1>
          <p className="max-w-3xl text-base sm:text-xl text-ink-secondary leading-relaxed">
            Founded with an unyielding commitment to engineering excellence, Gurukripa Arcon India Pvt. Ltd. has shaped NCR's skyline through ultra-luxury residential towers, eco-conscious green townships, and Grade-A commercial hubs.
          </p>
        </div>
      </section>

      {/* Story & Promise Grid */}
      <section className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="space-y-6">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink border-b border-accent/25 pb-4">
            Our Legacy & <span className="text-animated-gold">Story</span>
          </h2>
          <p className="text-base text-ink-secondary leading-relaxed">
            Over the past 18 years, Gurukripa Arcon India has grown from a visionary engineering studio into one of NCR's most trusted real estate developers. Every blueprint is audited by senior structural engineers and certified to exceed IS 1893 seismic safety standards.
          </p>
          
          <div className="space-y-4 pt-2">
            <div className="bg-surface p-6 rounded-2xl border border-accent/30 flex items-center gap-5 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-accent shrink-0" />
              <div>
                <div className="font-bold text-ink text-base">100% Verified Legal Titles</div>
                <div className="text-xs sm:text-sm text-ink-muted">All projects approved by DTCP & RERA with public escrow tracking.</div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl border border-accent/30 flex items-center gap-5 shadow-lg">
              <Award className="w-10 h-10 text-accent shrink-0" />
              <div>
                <div className="font-bold text-ink text-base">IGBC Platinum Green Certification</div>
                <div className="text-xs sm:text-sm text-ink-muted">Sustainable zero-liquid discharge & solar energy integration.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-accent/40 h-[260px] sm:h-[380px] lg:h-[450px] shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
            alt="Gurukripa Structural Engineering"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-90" />
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="section-muted section-block">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="glass-card p-10 space-y-5 border-l-4 border-l-accent bg-muted/80">
            <div className="flex items-center gap-3.5 text-accent">
              <Eye className="w-8 h-8" />
              <h3 className="font-heading text-3xl font-bold text-ink">Our Vision</h3>
            </div>
            <p className="text-base text-ink-secondary leading-relaxed">
              To be recognized globally as the gold standard in luxury real estate, celebrated for architectural innovation, biophilic living spaces, and absolute transparency in client relationships.
            </p>
          </div>

          <div className="glass-card p-10 space-y-5 border-l-4 border-l-accent bg-muted/80">
            <div className="flex items-center gap-3.5 text-accent">
              <Target className="w-8 h-8" />
              <h3 className="font-heading text-3xl font-bold text-ink">Our Mission</h3>
            </div>
            <p className="text-base text-ink-secondary leading-relaxed">
              To construct benchmark residential and commercial communities that enrich lives, elevate urban standards, deliver consistent capital appreciation, and uphold environmental sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values — Dynamic from MongoDB with Fallback */}
      <section className="container-custom space-y-10">
        <div className="max-w-2xl space-y-4">
          <span className="badge-gold">Core Philosophy</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-ink">
            The Gurukripa Standard
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, i) => {
            const bgImage = val.image || CORE_VALUE_PROJECT_IMAGES[i % CORE_VALUE_PROJECT_IMAGES.length];
            return (
              <div
                key={i}
                className="card-panel relative overflow-hidden group h-full p-8 border-t-2 border-t-accent transition-all duration-300 shadow-sm hover:shadow-xl border border-border flex flex-col justify-between min-h-[300px]"
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
                  <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Foreground Content */}
                <div className="relative z-10 space-y-4">
                  <div className="w-12 h-12 bg-surface/90 backdrop-blur-md border border-accent/40 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-accent shadow-sm">
                    {ICON_MAP[val.icon] || <ShieldCheck className="w-6 h-6 text-accent" />}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-ink transition-colors duration-300 group-hover:text-accent drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]">
                    {val.title}
                  </h3>
                  <p className="text-sm text-ink leading-relaxed font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {val.desc}
                  </p>
                </div>

                  {/* Pillar Index */}
                  <div className="relative z-10 pt-6 flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Pillar 0{i + 1}</span>
                    <div className="h-[1px] flex-1 bg-accent/25 group-hover:bg-accent/60 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      {/* Leadership & Team — Dynamic from MongoDB */}
      <section className="container-custom space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <span className="badge-gold">Executive Steering Board</span>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-ink">
            Leadership & Visionaries
          </h2>
        </div>

        {companyLoading && (
          <div className="flex items-center justify-center py-16 gap-4 text-ink-secondary">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-base">Loading team info...</span>
          </div>
        )}

        {!companyLoading && leadershipTeam.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {leadershipTeam.map((leader, i) => (
              <div key={i} className="glass-card p-8 flex flex-col items-center text-center space-y-5 rounded-3xl border border-accent/30 bg-surface hover:border-accent transition-all">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-32 h-32 rounded-full object-cover border-2 border-accent shadow-xl"
                />
                <div className="space-y-1.5">
                  <h3 className="font-heading text-2xl font-bold text-ink">{leader.name}</h3>
                  <div className="text-xs sm:text-sm text-accent font-extrabold uppercase tracking-wider">{leader.role}</div>
                </div>
                <p className="text-sm leading-relaxed text-ink-secondary">{leader.bio}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connect CTA */}
      <section className="container-custom">
        <div className="bg-surface p-10 sm:p-14 rounded-3xl border border-accent/45 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
              Ready to Explore Gurukripa Properties?
            </h3>
            <p className="text-base text-ink-secondary">
              Schedule a personalized site visit or speak with our executive property consultants.
            </p>
          </div>

          <button onClick={() => openSiteVisitForProject(null)} className="btn-gold whitespace-nowrap py-4 px-8 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Book Site Visit Pass</span>
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
