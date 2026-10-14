import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const { setCurrentPage, showToast } = useLead();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    showToast(`Thank you! ${newsletterEmail} subscribed to Gurukripa Insights.`, 'success');
    setNewsletterEmail('');
  };

  const handleNavClick = (pageId, path = `/${pageId === 'home' ? '' : pageId}`) => {
    setCurrentPage(pageId);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark text-[var(--text-inverse)] pt-12 pb-6 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-[var(--accent-light)]/30" />

      <div className="container-custom relative z-10">
        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-7 mb-10"
        >
          {/* Brand */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-4 space-y-4">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 cursor-pointer group text-left"
            >
              <svg width="28" height="28" viewBox="0 0 34 34" className="shrink-0 group-hover:rotate-6 transition-transform duration-300" aria-hidden="true">
                <rect x="1" y="1" width="32" height="32" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
                <path d="M9 25V13L17 7L25 13V25" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
                <line x1="14" y1="25" x2="14" y2="17" stroke="var(--brass)" strokeWidth="1.5" />
                <line x1="20" y1="25" x2="20" y2="17" stroke="var(--brass)" strokeWidth="1.5" />
              </svg>
              <div>
                <div className="font-heading text-lg font-semibold text-[var(--text-inverse)] group-hover:text-[var(--brass)] transition-colors">
                  Gurukripa Arcon
                </div>
                <div className="text-[10px] tracking-[0.16em] uppercase text-white/45 font-mono">
                  India Pvt. Ltd.
                </div>
              </div>
            </button>

            <p className="text-sm leading-relaxed text-white/55 max-w-sm">
              Benchmark real estate developer delivering luxury residences, green townships, and Grade-A commercial hubs across NCR.
            </p>

            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-xs bg-white/[0.04] px-2.5 py-1.5 border border-white/10 text-white/75 hover:border-[var(--brass)]/40 transition-colors">
                <ShieldCheck className="w-3 h-3 text-[var(--brass)]" />
                <span>RERA Approved</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-white/[0.04] px-2.5 py-1.5 border border-white/10 text-white/75 hover:border-[var(--brass)]/40 transition-colors">
                <CheckCircle2 className="w-3 h-3 text-[var(--brass)]" />
                <span>IGBC Certified</span>
              </div>
            </div>
          </motion.div>

          {/* Sitemap */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-lg font-semibold text-[var(--text-inverse)]">Explore</h4>
            <ul className="space-y-2 text-sm">
              {['home', 'about', 'projects', 'media', 'blog', 'careers', 'contact'].map((page) => (
                <li key={page}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(page)}
                    className="text-white/55 hover:text-[var(--brass)] transition-colors flex items-center gap-2 capitalize group"
                  >
                    <ArrowRight className="w-3 h-3 text-[var(--brass)] group-hover:translate-x-1 transition-transform" />
                    <span>{page === 'about' ? 'About Us' : page === 'contact' ? 'Contact' : page}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Projects */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-lg font-semibold text-[var(--text-inverse)]">Featured Projects</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: 'Gurukripa Grand Residences', loc: 'Golf Course Ext Rd, Gurugram' },
                { name: 'Gurukripa Eco Enclave', loc: 'Sector 150, Noida' },
                { name: 'Gurukripa Capital Square', loc: 'SPR, Gurugram' },
              ].map((proj) => (
                <li key={proj.name}>
                  <button
                    type="button"
                    onClick={() => handleNavClick('projects')}
                    className="text-left hover:text-[var(--brass)] transition-colors space-y-0.5 group"
                  >
                    <div className="font-medium text-white/85 group-hover:text-[var(--brass)]">{proj.name}</div>
                    <div className="text-sm text-white/40">{proj.loc}</div>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }} className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-lg font-semibold text-[var(--text-inverse)]">Contact</h4>
            <div className="space-y-2.5 text-sm text-white/55">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--brass)] shrink-0 mt-0.5" />
                <span>Gurukripa Tower, Sector 44, Golf Course Road, Gurugram, Haryana 122003</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-[var(--brass)] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[var(--brass)] transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-[var(--brass)] shrink-0" />
                <a href="mailto:info@gurukripaarcon.com" className="hover:text-[var(--brass)] transition-colors">info@gurukripaarcon.com</a>
              </div>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/45 font-mono">Newsletter</div>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/15 border-r-0 px-3 py-2 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-[var(--brass)] transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="bg-[var(--accent)] text-[var(--text-inverse)] px-3 py-2 hover:bg-[var(--accent-dark)] font-semibold text-sm transition-colors border border-[var(--accent)] cursor-pointer"
                >
                  Join
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Legal */}
        <div className="border-t border-white/10 pt-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {new Date().getFullYear()} Gurukripa Arcon India Pvt. Ltd. All rights reserved.</div>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            {['Privacy Policy', 'Terms & Conditions', 'Disclaimer', 'Cookie Policy'].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => showToast(`${label} — contact us for full details.`, 'info')}
                className="hover:text-[var(--brass)] transition-colors cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

