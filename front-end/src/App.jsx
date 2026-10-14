import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { LeadProvider } from './context/LeadContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import WhatsAppButton from './components/common/WhatsAppButton';
import Toast from './components/common/Toast';
import Lightbox from './components/common/Lightbox';

import ProjectDetailModal from './components/modals/ProjectDetailModal';
import BookSiteVisitModal from './components/modals/BookSiteVisitModal';
import JobDetailModal from './components/modals/JobDetailModal';
import BlogDetailModal from './components/modals/BlogDetailModal';
import BrochureModal from './components/modals/BrochureModal';

// Import portal styles for Agent & Admin dashboards
import './styles/portal.css';

const AppContent = () => {
  const location = useLocation();

  // Detect whether the current route belongs to the Agent/Admin portal
  const isPortal = location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/agent-') ||
    location.pathname === '/login' ||
    location.pathname === '/admin-login' ||
    location.pathname === '/signup' ||
    location.pathname === '/forgot-password';

  if (isPortal) {
    return (
      <div className="app-root">
        <AppRoutes />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <Header />
      <main className="flex-grow">
        <AppRoutes />
      </main>
      <Footer />

      <WhatsAppButton />
      <Toast />
      <Lightbox />

      <ProjectDetailModal />
      <BookSiteVisitModal />
      <JobDetailModal />
      <BlogDetailModal />
      <BrochureModal />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <LeadProvider>
            <ProjectProvider>
              <DataProvider>
                <AppContent />
              </DataProvider>
            </ProjectProvider>
          </LeadProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
