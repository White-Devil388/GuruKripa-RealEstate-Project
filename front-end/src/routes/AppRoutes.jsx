import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLead } from '../context/LeadContext';

// Import Public Website Pages
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ProjectsPage from '../pages/ProjectsPage';
import MediaPage from '../pages/MediaPage';
import BlogPage from '../pages/BlogPage';
import CareersPage from '../pages/CareersPage';
import ContactPage from '../pages/ContactPage';
import SiteVisitPage from '../pages/SiteVisitPage';
import UserDashboardPage from '../pages/UserDashboardPage';
import ProtectedRoutes from './protectedRoutes';

// Import Agent & Admin Portal Components & Shells
import LoginDashboard from '../components/auth/LoginDashboard';
import AdminLoginDashboard from '../components/auth/AdminLoginDashboard';
import SignupDashboard from '../components/auth/SignupDashboard';
import ForgotPasswordDashboard from '../components/auth/ForgotPasswordDashboard';
import { adminShell, beforeApprovalShell, afterApprovalShell } from './portalRoutes';

function AdminRouteGuard() {
  let adminUser = null;
  const userStr = localStorage.getItem('northstar_user') || sessionStorage.getItem('northstar_user');
  try {
    adminUser = JSON.parse(userStr || 'null');
  } catch {
    localStorage.removeItem('northstar_user');
    sessionStorage.removeItem('northstar_user');
  }
  const token = localStorage.getItem('northstar_token') || sessionStorage.getItem('northstar_token');
  const hasAdminSession = adminUser?.role?.toLowerCase() === 'admin' && token;

  return hasAdminSession ? adminShell : <Navigate to="/admin-login" replace />;
}

// Helper component to sync route path with LeadContext and scroll to top
const RouteChangeHandler = () => {
  const location = useLocation();
  const { setCurrentPage } = useLead();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const path = location.pathname.replace('/', '') || 'home';
    if (path === 'home' || path === '') setCurrentPage('home');
    else if (path === 'about') setCurrentPage('about');
    else if (path === 'projects') setCurrentPage('projects');
    else if (path === 'media') setCurrentPage('media');
    else if (path === 'blog') setCurrentPage('blog');
    else if (path === 'careers') setCurrentPage('careers');
    else if (path === 'contact') setCurrentPage('contact');
    else if (path === 'site-visit') setCurrentPage('site-visit');
    else if (path === 'dashboard') setCurrentPage('dashboard');
  }, [location, setCurrentPage]);

  return null;
};

const pageVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

const AnimatedPage = ({ children }) => (
  <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <RouteChangeHandler />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Website Routes */}
          <Route path="/" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/home" element={<AnimatedPage><HomePage /></AnimatedPage>} />
          <Route path="/about" element={<AnimatedPage><AboutPage /></AnimatedPage>} />
          <Route path="/projects" element={<AnimatedPage><ProjectsPage /></AnimatedPage>} />
          <Route path="/media" element={<AnimatedPage><MediaPage /></AnimatedPage>} />
          <Route path="/blog" element={<AnimatedPage><BlogPage /></AnimatedPage>} />
          <Route path="/careers" element={<AnimatedPage><CareersPage /></AnimatedPage>} />
          <Route path="/contact" element={<AnimatedPage><ContactPage /></AnimatedPage>} />
          <Route path="/site-visit" element={<AnimatedPage><SiteVisitPage /></AnimatedPage>} />
          <Route
            path="/dashboard"
            element={(
              <ProtectedRoutes>
                <AnimatedPage><UserDashboardPage /></AnimatedPage>
              </ProtectedRoutes>
            )}
          />

          {/* Agent & Admin Portal Auth Routes */}
          <Route path="/login" element={<LoginDashboard />} />
          <Route path="/admin-login" element={<AdminLoginDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          <Route path="/forgot-password" element={<ForgotPasswordDashboard />} />
          <Route path="/signup" element={<SignupDashboard />} />

          {/* Agent & Admin Portal App Shell Routes */}
          <Route path="/admin/*" element={<AdminRouteGuard />} />
          <Route path="/agent-before-approval/*" element={beforeApprovalShell} />
          <Route path="/agent-after-approval/*" element={afterApprovalShell} />

          {/* Fallback */}
          <Route path="*" element={<AnimatedPage><HomePage /></AnimatedPage>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default AppRoutes;
