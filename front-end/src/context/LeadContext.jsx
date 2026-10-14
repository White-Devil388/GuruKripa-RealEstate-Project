import React, { createContext, useContext, useEffect, useState } from 'react';
import { getLeads, createLead, updateLeadStatus as updateLeadStatusApi } from '../api/leadApi';
import { useAuth } from './AuthContext';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [activeProjectModal, setActiveProjectModal] = useState(null);
  const [isSiteVisitModalOpen, setIsSiteVisitModalOpen] = useState(false);
  const [siteVisitSelectedProject, setSiteVisitSelectedProject] = useState(null);
  const [activeJobModal, setActiveJobModal] = useState(null);
  const [activeBlogModal, setActiveBlogModal] = useState(null);
  const [activeBrochureModal, setActiveBrochureModal] = useState(null);
  const [activeLightboxMedia, setActiveLightboxMedia] = useState(null);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const [leads, setLeads] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast({ visible: false, message: '', type: 'success' });
    }, 4500);
  };

  useEffect(() => {
    const fetchLeads = async () => {
      if (!isAdmin) {
        setLeads([]);
        return;
      }

      try {
        const data = await getLeads();
        setLeads(data || []);
      } catch (error) {
        console.error('Failed to load leads:', error);
        setLeads([]);
      }
    };

    fetchLeads();
  }, [isAdmin]);

  const submitLead = async (leadData) => {
    try {
      const payload = {
        id: `GA-LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
        name: leadData.name || 'Anonymous Visitor',
        phone: leadData.phone || 'Not Provided',
        email: leadData.email || 'Not Provided',
        type: leadData.type || 'General Enquiry',
        projectName: leadData.projectName || 'General / Unspecified',
        preferredDate: leadData.preferredDate || 'N/A',
        preferredTime: leadData.preferredTime || 'N/A',
        status: 'New',
        notes: leadData.notes || leadData.message || 'Submitted via website form',
        message: leadData.message || ''
      };

      const newLead = await createLead(payload);
      setLeads((prev) => [newLead, ...prev]);
      showToast(`Success! Lead Ticket #${newLead.id} created. Our advisory team will reach out shortly.`, 'success');
      return newLead;
    } catch (error) {
      console.error('Failed to submit lead:', error);
      showToast('Unexpected issue while submitting your request. Please try again.', 'error');
      return null;
    }
  };

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const updatedLead = await updateLeadStatusApi(id, newStatus);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: updatedLead.status } : lead))
      );
      showToast(`Lead #${id} status updated to '${newStatus}'`, 'info');
      return updatedLead;
    } catch (error) {
      console.error('Failed to update lead status:', error);
      showToast('Unable to update lead status right now.', 'error');
      return null;
    }
  };

  const openSiteVisitForProject = (project = null) => {
    setSiteVisitSelectedProject(project);
    setIsSiteVisitModalOpen(true);
  };

  return (
    <LeadContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        activeProjectModal,
        setActiveProjectModal,
        isSiteVisitModalOpen,
        setIsSiteVisitModalOpen,
        siteVisitSelectedProject,
        setSiteVisitSelectedProject,
        openSiteVisitForProject,
        activeJobModal,
        setActiveJobModal,
        activeBlogModal,
        setActiveBlogModal,
        activeBrochureModal,
        setActiveBrochureModal,
        activeLightboxMedia,
        setActiveLightboxMedia,
        leads,
        submitLead,
        updateLeadStatus,
        toast,
        showToast
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};

export const useLead = () => useContext(LeadContext);
