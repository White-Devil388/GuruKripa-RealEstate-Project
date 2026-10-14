import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLead } from '../../context/LeadContext';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Menu, X, PhoneCall, ArrowRight, UserRound, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPage, setCurrentPage, openSiteVisitForProject, showToast } = useLead();
  const { user, isAdmin, openAuthModal, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = location.pathname === '/' || location.pathname === '';
  const isHeaderTransparent = isHomePage && !isScrolled;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'about', label: 'About', path: '/about' },
    { id: 'projects', label: 'Projects', path: '/projects' },
    { id: 'media', label: 'Media', path: '/media' },
    { id: 'blog', label: 'Blog', path: '/blog' },
    { id: 'careers', label: 'Careers', path: '/careers' },
    { id: 'contact', label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (pageId, path = `/${pageId === 'home' ? '' : pageId}`) => {
    setCurrentPage(pageId);
    navigate(path);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutClick = () => {
    logout();
    if (showToast) showToast('Logged out successfully', 'info');
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/97 backdrop-blur-md py-2 sm:py-2.5 shadow-md border-b border-border text-ink'
          : isHomePage
            ? 'bg-gradient-to-b from-black/80 via-black/35 to-transparent py-2.5 sm:py-3.5 border-b border-white/10 text-white'
            : 'bg-surface/90 backdrop-blur-md py-2.5 sm:py-3 border-b border-border/50 text-ink'
      }`}
    >
      <div className="container-custom flex items-center justify-between gap-2 lg:gap-6">
        {/* Logo — a drafted plan mark */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <svg width="29" height="29" viewBox="0 0 34 34" className="hidden sm:block shrink-0 group-hover:rotate-6 transition-transform duration-300" aria-hidden="true">
            <rect x="1" y="1" width="32" height="32" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M9 25V13L17 7L25 13V25" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="14" y1="25" x2="14" y2="17" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="20" y1="25" x2="20" y2="17" stroke="var(--accent)" strokeWidth="1.5" />
          </svg>
          <div className="text-left">
            <div className={`font-heading text-sm sm:text-base lg:text-lg font-semibold tracking-tight transition-colors leading-tight ${
              isHeaderTransparent ? 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]' : 'text-ink group-hover:text-animated-gold'
            }`}>
              Gurukripa Arcon
            </div>
            <div className={`hidden xs:block text-[8px] sm:text-[9px] tracking-[0.18em] uppercase font-medium font-mono transition-colors ${
              isHeaderTransparent ? 'text-white/80 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]' : 'text-ink-muted group-hover:text-accent'
            }`}>
              India Pvt. Ltd. — Est. 2007
            </div>
          </div>
        </motion.button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            if (item.id === 'projects') {
              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id, item.path)}
                    className={`relative text-[11px] xl:text-xs font-medium px-2 xl:px-2.5 py-1.5 transition-all whitespace-nowrap animated-underline ${
                      isActive ? 'text-ink font-semibold active' : 'text-ink-secondary hover:text-ink hover-text-expand'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="activeHeaderTab"
                        className="absolute left-2 right-2 xl:left-2.5 xl:right-2.5 -bottom-0.5 h-[2px] bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                  <div className="invisible absolute left-1/2 top-full z-50 w-48 -translate-x-1/2 translate-y-2 border border-border bg-surface py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <div className="relative group/ongoing">
                      <button type="button" className="flex w-full items-center justify-between px-4 py-2.5 text-left text-xs text-ink-secondary hover:bg-accent-subtle hover:text-accent transition-colors">
                        <span>Ongoing Projects</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <div className="invisible absolute left-full top-0 z-50 w-40 border border-border bg-surface py-2 opacity-0 shadow-lg transition-all group-hover/ongoing:visible group-hover/ongoing:opacity-100 group-focus-within/ongoing:visible group-focus-within/ongoing:opacity-100">
                        <button type="button" onClick={() => handleNavClick('projects', '/projects?status=ongoing&type=residential')} className="block w-full px-4 py-2.5 text-left text-xs text-ink-secondary hover:bg-accent-subtle hover:text-accent transition-colors">
                          Residential
                        </button>
                        <button type="button" onClick={() => handleNavClick('projects', '/projects?status=ongoing&type=commercial')} className="block w-full px-4 py-2.5 text-left text-xs text-ink-secondary hover:bg-accent-subtle hover:text-accent transition-colors">
                          Commercial
                        </button>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleNavClick('projects', '/projects?status=completed')} className="block w-full px-4 py-2.5 text-left text-xs text-ink-secondary hover:bg-accent-subtle hover:text-accent transition-colors">
                      Completed Projects
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id, item.path)}
                className={`relative text-[11px] xl:text-xs font-medium px-2 xl:px-2.5 py-1.5 transition-all whitespace-nowrap animated-underline ${
                  isActive ? 'text-ink font-semibold active' : 'text-ink-secondary hover:text-ink hover-text-expand'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="activeHeaderTab"
                    className="absolute left-2 right-2 xl:left-2.5 xl:right-2.5 -bottom-0.5 h-[2px] bg-accent"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => openSiteVisitForProject(null)}
            className="btn-gold text-[11px] xl:text-xs py-2 px-3 xl:py-2.5 xl:px-4 min-h-0 animate-pulse-glow"
          >
            <Calendar className="w-3.5 h-3.5 xl:w-4 xl:h-4" />
            <span>Book Site Visit</span>
          </motion.button>

          {user ? (
            <div className="flex items-center gap-1.5 border border-accent/40 bg-accent/10 p-1 pl-2.5 rounded-full">
              <button
                type="button"
                onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
                className="flex items-center gap-2 text-left hover:text-accent transition-colors"
                title={isAdmin ? 'Go to Admin Console' : 'Go to Dashboard'}
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[var(--text-inverse)] text-xs font-bold shadow-sm">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="text-xs font-bold text-ink max-w-[100px] truncate">
                  {user.name?.split(' ')[0]}
                </span>
              </button>

              <button
                type="button"
                onClick={handleLogoutClick}
                className="p-1.5 text-ink-muted hover:text-rose-500 hover:bg-rose-500/10 rounded-full transition-colors"
                title="Log Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="relative group/auth">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="group flex items-center gap-2 border border-accent/40 bg-accent/10 px-2.5 py-1.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:bg-accent/20 hover:shadow-[0_6px_18px_rgba(165,111,40,0.18)] cursor-pointer"
                title="Login to Portal"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[var(--text-inverse)] shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <UserRound className="h-3.5 w-3.5" />
                </span>
                <span className="hidden xl:flex xl:flex-col xl:leading-tight">
                  <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-accent">Portal</span>
                  <span className="text-[11px] font-semibold text-ink">Login / Sign In</span>
                </span>
              </button>

              <div className="invisible absolute right-0 top-full z-50 w-44 pt-1.5 opacity-0 transition-all group-hover/auth:visible group-hover/auth:opacity-100">
                <div className="border border-border bg-surface py-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium text-ink hover:bg-accent-subtle hover:text-accent transition-colors"
                  >
                    <span>Agent Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/admin-login')}
                    className="flex w-full items-center justify-between px-3.5 py-2 text-left text-xs font-medium text-ink hover:bg-accent-subtle hover:text-accent transition-colors border-t border-border/40"
                  >
                    <span>Admin Login</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => openSiteVisitForProject(null)}
            className="hidden sm:inline-flex btn-gold text-xs px-3 py-2 min-h-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Visit</span>
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 transition-colors cursor-pointer border rounded-lg ${
              isHeaderTransparent
                ? 'bg-black/35 backdrop-blur-md border-white/25 text-white hover:bg-black/55'
                : 'text-ink-secondary hover:text-accent bg-muted border-border'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden bg-surface border-b border-border px-5 py-4 overflow-hidden shadow-md"
          >
            <div className="flex flex-col">
              {navItems.map((item) => (
                <React.Fragment key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id, item.path)}
                    className={`text-left text-sm font-medium py-2.5 px-1 flex items-center justify-between transition-all border-b border-border ${
                      currentPage === item.id ? 'text-accent font-semibold' : 'text-ink'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 opacity-50" />
                  </button>
                  {item.id === 'projects' && (
                    <div className="grid grid-cols-2 gap-2 border-b border-border px-1 py-2">
                      <div className="col-span-2">
                        <div className="py-1 text-xs font-semibold text-ink">Ongoing Projects</div>
                        <div className="grid grid-cols-2 gap-2">
                          <button type="button" onClick={() => handleNavClick('projects', '/projects?status=ongoing&type=residential')} className="py-2 text-left text-xs text-ink-secondary hover:text-accent">
                            Residential
                          </button>
                          <button type="button" onClick={() => handleNavClick('projects', '/projects?status=ongoing&type=commercial')} className="py-2 text-left text-xs text-ink-secondary hover:text-accent">
                            Commercial
                          </button>
                        </div>
                      </div>
                      <button type="button" onClick={() => handleNavClick('projects', '/projects?status=completed')} className="py-2 text-left text-xs text-ink-secondary hover:text-accent">
                        Completed
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ))}

              <div className="pt-4 mt-1 flex flex-col gap-2">
                {user ? (
                  <div className="space-y-2 border border-accent/40 bg-accent/10 p-3 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[var(--text-inverse)] font-bold text-xs">
                          {user.name?.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-ink">{user.name}</div>
                          <div className="text-[10px] text-ink-muted">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            navigate('/admin');
                          }}
                          className="btn-gold col-span-2 py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Console</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/dashboard');
                        }}
                        className="btn-gold py-2 text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Dashboard</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleLogoutClick}
                        className="btn-outline-gold py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/login');
                      }}
                      className="group flex w-full items-center justify-between border border-accent/45 bg-accent/10 px-4 py-3 text-left transition-all hover:border-accent hover:bg-accent/20"
                    >
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-[var(--text-inverse)]">
                          <UserRound className="w-4 h-4" />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-accent">Agent Portal</span>
                          <span className="text-sm font-bold text-ink">Agent Login / Sign Up</span>
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/admin-login');
                      }}
                      className="group flex w-full items-center justify-between border border-border bg-surface px-4 py-2.5 text-left transition-all hover:border-accent hover:bg-accent/10"
                    >
                      <span className="flex items-center gap-2.5 text-xs font-semibold text-ink">
                        <ShieldCheck className="w-4 h-4 text-accent" />
                        <span>Admin Login</span>
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-ink-muted" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openSiteVisitForProject(null);
                  }}
                  className="btn-gold w-full py-3"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book a Site Visit</span>
                </button>
                <a
                  href="tel:+919589807388"
                  className="btn-outline-gold w-full py-3 text-center flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>+91 9589807388</span>
                </a>
                <ThemeToggle showLabel />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
