import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import { updateCompanyInfo } from '../api/companyApi';
import { createBlogApi, updateBlogApi, deleteBlogApi } from '../api/blogApi';
import { createMediaApi, updateMediaApi, deleteMediaApi } from '../api/mediaApi';
import http from '../api/http';
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  FileText,
  Settings,
  Search,
  Plus,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  X,
  ChevronRight,
  Download,
  BellRing,
  UserCheck,
  Building,
  DollarSign,
  PieChart,
  Edit,
  Trash2,
  RotateCcw,
  Upload,
  LogOut,
  MessageSquareQuote
} from 'lucide-react';

const AdminDashboardPage = ({ initialTab = 'overview', isEmbedded = true }) => {
  const { leads, updateLeadStatus, submitLead, showToast } = useLead();
  const { projects, addProject, updateProject, deleteProject, resetProjects } = useProjects();
  const { user, logout } = useAuth();
  const adminUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem('northstar_user') || sessionStorage.getItem('northstar_user') || '{}');
    } catch {
      return {};
    }
  })();
  const { blogs, setBlogs, companyData, setCompanyData, mediaItems, setMediaItems } = useData();
  const [activeTab, setActiveTab] = useState(initialTab);

  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Real Estate Trends',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    readTime: '5 min read',
    author: 'Gurukripa Editorial Team',
    authorRole: 'Senior Analyst',
    featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    excerpt: '',
    content: '',
    tags: 'Real Estate, Investment',
    relatedProjects: ''
  });
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [deletingBlogId, setDeletingBlogId] = useState(null);

  const [testimonialForm, setTestimonialForm] = useState({
    quote: '',
    name: '',
    detail: ''
  });
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [deletingTestimonialIndex, setDeletingTestimonialIndex] = useState(null);

  const [mediaForm, setMediaForm] = useState({
    title: '',
    category: 'Project Images',
    type: 'image',
    url: '',
    videoUrl: '',
    caption: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  });
  const [editingMediaId, setEditingMediaId] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [deletingMediaId, setDeletingMediaId] = useState(null);

  // CRM Leads State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState(null);

  // New Lead Form State
  const [newLeadData, setNewLeadData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Project Enquiry',
    projectName: projects[0]?.name || 'Skyline Heights 1',
    message: ''
  });

  // Projects State & Modals
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('All');
  const [projectStatusFilter, setProjectStatusFilter] = useState('All');
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);
  const [projectCategoryForm, setProjectCategoryForm] = useState('');
  const [editingProjectCategoryIndex, setEditingProjectCategoryIndex] = useState(null);
  const [projectStatusForm, setProjectStatusForm] = useState('');
  const [editingProjectStatusIndex, setEditingProjectStatusIndex] = useState(null);
  const [blogCategoryForm, setBlogCategoryForm] = useState('');
  const [editingBlogCategoryIndex, setEditingBlogCategoryIndex] = useState(null);
  const [mediaCategoryForm, setMediaCategoryForm] = useState('');
  const [editingMediaCategoryIndex, setEditingMediaCategoryIndex] = useState(null);

  const defaultBlogCategories = ['Real Estate Trends', 'Legal & RERA', 'Investment Guides', 'Architecture & Design'];
  const defaultMediaCategories = ['Project Images', 'Videos', 'Events', 'Company Activities', 'News & Press'];
  const defaultProjectCategories = ['Premium Apartments', 'Affordable Housing', 'Luxury Villas', 'Premium Township', 'Commercial Complex', 'Residential Plots'];
  const defaultProjectStatuses = ['Ready to Move', 'Under Construction', 'Launching Soon'];
  const blogCategoryOptions = companyData.blogCategories?.length ? companyData.blogCategories : defaultBlogCategories;
  const mediaCategoryOptions = companyData.mediaCategories?.length ? companyData.mediaCategories : defaultMediaCategories;
  const projectCategoryOptions = companyData.projectCategories?.length ? companyData.projectCategories : defaultProjectCategories;
  const projectStatusOptions = companyData.projectStatuses?.length ? companyData.projectStatuses : defaultProjectStatuses;

  // Form State for Add / Edit Project Card
  const [projectForm, setProjectForm] = useState({
    name: '',
    category: 'Premium Apartments',
    status: 'Ready to Move',
    price: '₹35 Lakh - ₹70 Lakh',
    location: 'Vijay Nagar',
    city: 'Indore',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    shortDesc: '',
    totalUnits: '120',
    configurations: '2 & 3 BHK',
    possession: '2027'
  });

  // Site Visits State
  const [visitStatusFilter, setVisitStatusFilter] = useState('All');
  const [mockVisits, setMockVisits] = useState([
    { id: 'SV-901', name: 'Rajesh Sharma', phone: '+91 98260 11223', project: 'Skyline Heights 1', date: '2026-09-12', time: '11:00 AM', status: 'Confirmed', executive: 'Amit Varma', cabNeeded: true },
    { id: 'SV-902', name: 'Priya Verma', phone: '+91 97555 44332', project: 'Royal Courtyard 3', date: '2026-09-13', time: '03:30 PM', status: 'Pending', executive: 'Rohan Mehta', cabNeeded: false },
    { id: 'SV-903', name: 'Vikramaditya Singh', phone: '+91 94250 88991', project: 'Emerald Residency 7', date: '2026-09-14', time: '10:00 AM', status: 'Confirmed', executive: 'Sneha Patel', cabNeeded: true },
    { id: 'SV-904', name: 'Kavita Chawla', phone: '+91 99811 22334', project: 'Green Valley Homes 2', date: '2026-09-15', time: '04:00 PM', status: 'Completed', executive: 'Amit Varma', cabNeeded: false },
  ]);

  // Lead Status List & Classes
  const statuses = ['New', 'Contacted', 'Qualified', 'Site Visit Scheduled', 'Converted', 'Closed'];
  const leadTypes = ['All', 'Site Visit', 'Project Enquiry', 'Brochure Request', 'Contact Form', 'Career Application'];
  const LIST_PAGE_SIZE = 6;

  const [leadVisibleCount, setLeadVisibleCount] = useState(LIST_PAGE_SIZE);
  const [projectVisibleCount, setProjectVisibleCount] = useState(LIST_PAGE_SIZE);
  const [visitVisibleCount, setVisitVisibleCount] = useState(LIST_PAGE_SIZE);
  const [blogVisibleCount, setBlogVisibleCount] = useState(LIST_PAGE_SIZE);
  const [mediaVisibleCount, setMediaVisibleCount] = useState(LIST_PAGE_SIZE);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'Contacted': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'Qualified': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Site Visit Scheduled': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'Converted': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Closed': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    if (filterType !== 'All' && lead.type !== filterType) return false;
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = lead.name?.toLowerCase().includes(q);
      const matchEmail = lead.email?.toLowerCase().includes(q);
      const matchId = lead.id?.toLowerCase().includes(q);
      const matchPhone = lead.phone?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId && !matchPhone) return false;
    }
    return true;
  });

  const visibleLeads = filteredLeads.slice(0, leadVisibleCount);
  const hasMoreLeads = leadVisibleCount < filteredLeads.length;

  // Filtered Projects
  const filteredProjects = projects.filter((proj) => {
    if (projectCategoryFilter !== 'All' && proj.category !== projectCategoryFilter) return false;
    if (projectStatusFilter !== 'All' && proj.status !== projectStatusFilter) return false;
    return true;
  });

  const visibleProjects = filteredProjects.slice(0, projectVisibleCount);
  const hasMoreProjects = projectVisibleCount < filteredProjects.length;

  const visibleVisits = mockVisits
    .filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter)
    .slice(0, visitVisibleCount);
  const hasMoreVisits = visitVisibleCount < mockVisits.filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter).length;

  const visibleBlogs = blogs.slice(0, blogVisibleCount);
  const hasMoreBlogs = blogVisibleCount < blogs.length;

  const visibleMedia = mediaItems.slice(0, mediaVisibleCount);
  const hasMoreMedia = mediaVisibleCount < mediaItems.length;

  const brochureRequests = leads.filter((lead) => lead.type === 'Brochure Request');

  React.useEffect(() => {
    setLeadVisibleCount(LIST_PAGE_SIZE);
  }, [searchTerm, filterType, filterStatus]);

  React.useEffect(() => {
    setProjectVisibleCount(LIST_PAGE_SIZE);
  }, [projectCategoryFilter, projectStatusFilter]);

  React.useEffect(() => {
    setVisitVisibleCount(LIST_PAGE_SIZE);
  }, [visitStatusFilter]);

  React.useEffect(() => {
    setBlogVisibleCount(LIST_PAGE_SIZE);
  }, [blogs.length, activeTab]);

  React.useEffect(() => {
    setMediaVisibleCount(LIST_PAGE_SIZE);
  }, [mediaItems.length, activeTab]);

  const handleCreateLeadSubmit = async (e) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.phone) {
      showToast('Please enter prospect name and phone number', 'error');
      return;
    }

    if (editingLeadId) {
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === editingLeadId
            ? {
                ...lead,
                name: newLeadData.name,
                phone: newLeadData.phone,
                email: newLeadData.email,
                type: newLeadData.type,
                projectName: newLeadData.projectName,
                message: newLeadData.message,
                notes: newLeadData.message || lead.notes,
              }
            : lead
        )
      );
      showToast(`Lead #${editingLeadId} updated successfully.`, 'success');
      setEditingLeadId(null);
    } else {
      await submitLead(newLeadData);
    }

    setIsAddLeadModalOpen(false);
    setNewLeadData({ name: '', phone: '', email: '', type: 'Project Enquiry', projectName: projects[0]?.name || 'Skyline Heights 1', message: '' });
  };

  const handleEditLead = (lead) => {
    setEditingLeadId(lead.id);
    setNewLeadData({
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      type: lead.type || 'Project Enquiry',
      projectName: lead.projectName || projects[0]?.name || 'Skyline Heights 1',
      message: lead.message || lead.notes || ''
    });
    setIsAddLeadModalOpen(true);
  };

  const handleDeleteLead = (leadId) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== leadId));
    showToast(`Lead #${leadId} deleted successfully.`, 'info');
  };

  // Project CRUD Handlers
  const handleOpenAddProjectModal = () => {
    setEditingProject(null);
    setProjectForm({
      name: '',
      category: 'Premium Apartments',
      status: 'Ready to Move',
      price: '₹45 Lakh - ₹85 Lakh',
      location: 'Vijay Nagar',
      city: 'Indore',
      heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      shortDesc: 'Ultra-luxury residential project with state-of-the-art modern architectural amenities and lush green views.',
      totalUnits: '120 Units',
      configurations: '2 & 3 BHK Sky Residences',
      possession: '2026'
    });
    setIsAddProjectModalOpen(true);
  };

  const handleOpenEditProjectModal = (proj) => {
    setEditingProject(proj);
    setProjectForm({
      name: proj.name || '',
      category: proj.category || 'Premium Apartments',
      status: proj.status || 'Ready to Move',
      price: proj.price || '',
      location: proj.location || '',
      city: proj.city || 'Indore',
      heroImage: proj.heroImage || '',
      shortDesc: proj.shortDesc || '',
      totalUnits: proj.specifications?.totalUnits || '120 Units',
      configurations: proj.specifications?.configurations || '2 & 3 BHK',
      possession: proj.specifications?.possession || '2026'
    });
    setIsAddProjectModalOpen(true);
  };

  const handleSaveProjectSubmit = async (e) => {
    e.preventDefault();
    if (!projectForm.name || !projectForm.location) {
      showToast('Project Name and Location are required!', 'error');
      return;
    }

    const payload = {
      ...projectForm,
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      specifications: {
        totalUnits: projectForm.totalUnits,
        configurations: projectForm.configurations,
        possession: projectForm.possession
      }
    };

    if (editingProject) {
      await updateProject(editingProject.id, payload);
    } else {
      await addProject(payload);
    }

    setIsAddProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProjectConfirm = async (id) => {
    await deleteProject(id);
    setDeletingProjectId(null);
  };

  const handleSaveBlogCategory = async () => {
    const value = blogCategoryForm.trim();
    if (!value) {
      showToast('Blog category name is required.', 'error');
      return;
    }

    const nextCategories = [...blogCategoryOptions];
    if (editingBlogCategoryIndex !== null) {
      nextCategories[editingBlogCategoryIndex] = value;
    } else if (!nextCategories.includes(value)) {
      nextCategories.push(value);
    } else {
      showToast('This blog category already exists.', 'info');
      return;
    }

    try {
      const response = await updateCompanyInfo({ blogCategories: nextCategories });
      const nextValues = response?.blogCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, blogCategories: nextValues }));
      showToast(editingBlogCategoryIndex !== null ? 'Blog category updated.' : 'Blog category added.', 'success');
    } catch (error) {
      console.error('Failed to save blog category:', error);
      showToast('Unable to save blog category right now.', 'error');
      return;
    }

    setBlogCategoryForm('');
    setEditingBlogCategoryIndex(null);
  };

  const handleDeleteBlogCategory = async (itemToDelete) => {
    const nextCategories = blogCategoryOptions.filter((category) => category !== itemToDelete);
    try {
      const response = await updateCompanyInfo({ blogCategories: nextCategories });
      const nextValues = response?.blogCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, blogCategories: nextValues }));
      showToast('Blog category removed successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete blog category:', error);
      showToast('Unable to delete blog category right now.', 'error');
      return;
    }
  };

  const handleSaveMediaCategory = async () => {
    const value = mediaCategoryForm.trim();
    if (!value) {
      showToast('Media category name is required.', 'error');
      return;
    }

    const nextCategories = [...mediaCategoryOptions];
    if (editingMediaCategoryIndex !== null) {
      nextCategories[editingMediaCategoryIndex] = value;
    } else if (!nextCategories.includes(value)) {
      nextCategories.push(value);
    } else {
      showToast('This media category already exists.', 'info');
      return;
    }

    try {
      const response = await updateCompanyInfo({ mediaCategories: nextCategories });
      const nextValues = response?.mediaCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, mediaCategories: nextValues }));
      showToast(editingMediaCategoryIndex !== null ? 'Media category updated.' : 'Media category added.', 'success');
    } catch (error) {
      console.error('Failed to save media category:', error);
      showToast('Unable to save media category right now.', 'error');
      return;
    }

    setMediaCategoryForm('');
    setEditingMediaCategoryIndex(null);
  };

  const handleDeleteMediaCategory = async (itemToDelete) => {
    const nextCategories = mediaCategoryOptions.filter((category) => category !== itemToDelete);
    try {
      const response = await updateCompanyInfo({ mediaCategories: nextCategories });
      const nextValues = response?.mediaCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, mediaCategories: nextValues }));
      showToast('Media category removed successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete media category:', error);
      showToast('Unable to delete media category right now.', 'error');
      return;
    }
  };

  const handleSaveProjectCategory = async () => {
    const value = projectCategoryForm.trim();
    if (!value) {
      showToast('Category name is required.', 'error');
      return;
    }

    const nextCategories = [...projectCategoryOptions];
    if (editingProjectCategoryIndex !== null) {
      nextCategories[editingProjectCategoryIndex] = value;
    } else if (!nextCategories.includes(value)) {
      nextCategories.push(value);
    } else {
      showToast('This category already exists.', 'info');
      return;
    }

    try {
      const response = await updateCompanyInfo({ projectCategories: nextCategories });
      const nextValues = response?.projectCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, projectCategories: nextValues }));
      showToast(editingProjectCategoryIndex !== null ? 'Category updated.' : 'Category added.', 'success');
    } catch (error) {
      console.error('Failed to save category:', error);
      showToast('Unable to save category right now.', 'error');
      return;
    }

    setProjectCategoryForm('');
    setEditingProjectCategoryIndex(null);
  };

  const handleDeleteProjectCategory = async (itemToDelete) => {
    const nextCategories = projectCategoryOptions.filter((category) => category !== itemToDelete);
    try {
      const response = await updateCompanyInfo({ projectCategories: nextCategories });
      const nextValues = response?.projectCategories || nextCategories;
      setCompanyData((prev) => ({ ...prev, projectCategories: nextValues }));
      if (projectCategoryFilter === itemToDelete) setProjectCategoryFilter('All');
      showToast('Category removed successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete category:', error);
      showToast('Unable to delete category right now.', 'error');
      return;
    }
  };

  const handleSaveProjectStatus = async () => {
    const value = projectStatusForm.trim();
    if (!value) {
      showToast('Status name is required.', 'error');
      return;
    }

    const nextStatuses = [...projectStatusOptions];
    if (editingProjectStatusIndex !== null) {
      nextStatuses[editingProjectStatusIndex] = value;
    } else if (!nextStatuses.includes(value)) {
      nextStatuses.push(value);
    } else {
      showToast('This status already exists.', 'info');
      return;
    }

    try {
      const response = await updateCompanyInfo({ projectStatuses: nextStatuses });
      const nextValues = response?.projectStatuses || nextStatuses;
      setCompanyData((prev) => ({ ...prev, projectStatuses: nextValues }));
      showToast(editingProjectStatusIndex !== null ? 'Status updated.' : 'Status added.', 'success');
    } catch (error) {
      console.error('Failed to save status:', error);
      showToast('Unable to save status right now.', 'error');
      return;
    }

    setProjectStatusForm('');
    setEditingProjectStatusIndex(null);
  };

  const handleDeleteProjectStatus = async (itemToDelete) => {
    const nextStatuses = projectStatusOptions.filter((status) => status !== itemToDelete);
    try {
      const response = await updateCompanyInfo({ projectStatuses: nextStatuses });
      const nextValues = response?.projectStatuses || nextStatuses;
      setCompanyData((prev) => ({ ...prev, projectStatuses: nextValues }));
      if (projectStatusFilter === itemToDelete) setProjectStatusFilter('All');
      showToast('Status removed successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete status:', error);
      showToast('Unable to delete status right now.', 'error');
      return;
    }
  };

  const handleVisitStatusChange = (id, newStatus) => {
    setMockVisits((prev) => prev.map((v) => (v.id === id ? { ...v, status: newStatus } : v)));
    showToast(`Site visit ${id} status updated to ${newStatus}`, 'info');
  };

  const handleOpenAddTestimonialModal = () => {
    setEditingTestimonialIndex(null);
    setTestimonialForm({ quote: '', name: '', detail: '' });
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonialModal = (testimonial, index) => {
    setEditingTestimonialIndex(index);
    setTestimonialForm({
      quote: testimonial.quote || '',
      name: testimonial.name || '',
      detail: testimonial.detail || ''
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonialSubmit = async (e) => {
    e.preventDefault();

    if (!testimonialForm.quote.trim() || !testimonialForm.name.trim()) {
      showToast('Testimonial quote and author name are required.', 'error');
      return;
    }

    const updatedTestimonials = [...(companyData.testimonials || [])];
    const payload = {
      quote: testimonialForm.quote.trim(),
      name: testimonialForm.name.trim(),
      detail: testimonialForm.detail.trim()
    };

    if (editingTestimonialIndex !== null) {
      updatedTestimonials[editingTestimonialIndex] = payload;
    } else {
      updatedTestimonials.push(payload);
    }

    try {
      const response = await updateCompanyInfo({ testimonials: updatedTestimonials });
      const nextTestimonials = response?.testimonials || updatedTestimonials;
      setCompanyData((prev) => ({ ...prev, testimonials: nextTestimonials }));
      showToast(editingTestimonialIndex !== null ? 'Testimonial updated successfully.' : 'Testimonial added successfully.', 'success');
    } catch (error) {
      console.error('Failed to save testimonial:', error);
      showToast('Unable to save testimonial right now.', 'error');
      return;
    }

    setIsTestimonialModalOpen(false);
    setEditingTestimonialIndex(null);
    setTestimonialForm({ quote: '', name: '', detail: '' });
  };

  const handleDeleteTestimonialConfirm = async (index) => {
    const updatedTestimonials = (companyData.testimonials || []).filter((_, idx) => idx !== index);

    try {
      const response = await updateCompanyInfo({ testimonials: updatedTestimonials });
      const nextTestimonials = response?.testimonials || updatedTestimonials;
      setCompanyData((prev) => ({ ...prev, testimonials: nextTestimonials }));
      showToast('Testimonial deleted successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete testimonial:', error);
      showToast('Unable to delete testimonial right now.', 'error');
      return;
    }

    setDeletingTestimonialIndex(null);
  };

  const handleOpenAddBlogModal = () => {
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      category: 'Real Estate Trends',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: '5 min read',
      author: 'Gurukripa Editorial Team',
      authorRole: 'Senior Analyst',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      excerpt: '',
      content: '',
      tags: 'Real Estate, Investment',
      relatedProjects: ''
    });
    setIsBlogModalOpen(true);
  };

  const handleOpenEditBlogModal = (blog) => {
    setEditingBlogId(blog.id || blog._id);
    setBlogForm({
      title: blog.title || '',
      category: blog.category || 'Real Estate Trends',
      date: blog.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: blog.readTime || '5 min read',
      author: blog.author || 'Gurukripa Editorial Team',
      authorRole: blog.authorRole || 'Senior Analyst',
      featuredImage: blog.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : (blog.tags || 'Real Estate, Investment'),
      relatedProjects: Array.isArray(blog.relatedProjects) ? blog.relatedProjects.join(', ') : (blog.relatedProjects || '')
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogSubmit = async (e) => {
    e.preventDefault();

    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      showToast('Blog title and content are required.', 'error');
      return;
    }

    const payload = {
      title: blogForm.title.trim(),
      category: blogForm.category || 'Real Estate Trends',
      date: blogForm.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: blogForm.readTime || '5 min read',
      author: blogForm.author || 'Gurukripa Editorial Team',
      authorRole: blogForm.authorRole || 'Senior Analyst',
      featuredImage: blogForm.featuredImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      excerpt: blogForm.excerpt.trim() || blogForm.content.trim().slice(0, 160),
      content: blogForm.content.trim(),
      slug: (blogForm.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `insight-${Date.now()}`),
      tags: blogForm.tags ? blogForm.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
      relatedProjects: blogForm.relatedProjects ? blogForm.relatedProjects.split(',').map((project) => project.trim()).filter(Boolean) : []
    };

    try {
      if (editingBlogId) {
        const updatedBlog = await updateBlogApi(editingBlogId, payload);
        setBlogs((prev) => prev.map((blog) => (blog.id === editingBlogId || blog._id === editingBlogId ? updatedBlog : blog)));
        showToast('Insights article updated successfully.', 'success');
      } else {
        const newBlog = await createBlogApi(payload);
        setBlogs((prev) => [newBlog, ...prev]);
        showToast('Insights article published successfully.', 'success');
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      showToast('Unable to save the insights article right now.', 'error');
      return;
    }

    setIsBlogModalOpen(false);
    setEditingBlogId(null);
    setBlogForm({
      title: '',
      category: 'Real Estate Trends',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      readTime: '5 min read',
      author: 'Gurukripa Editorial Team',
      authorRole: 'Senior Analyst',
      featuredImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      excerpt: '',
      content: '',
      tags: 'Real Estate, Investment',
      relatedProjects: ''
    });
  };

  const handleDeleteBlogConfirm = async (id) => {
    try {
      await deleteBlogApi(id);
      setBlogs((prev) => prev.filter((blog) => (blog.id || blog._id) !== id));
      showToast('Insights article deleted successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete blog:', error);
      showToast('Unable to delete the insights article right now.', 'error');
      return;
    }

    setDeletingBlogId(null);
  };

  const handleOpenAddMediaModal = () => {
    setEditingMediaId(null);
    setMediaForm({
      title: '',
      category: 'Project Images',
      type: 'image',
      url: '',
      videoUrl: '',
      caption: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setIsMediaModalOpen(true);
  };

  const handleOpenEditMediaModal = (mediaItem) => {
    setEditingMediaId(mediaItem.id || mediaItem._id);
    setMediaForm({
      title: mediaItem.title || '',
      category: mediaItem.category || 'Project Images',
      type: mediaItem.type || 'image',
      url: mediaItem.url || '',
      videoUrl: mediaItem.videoUrl || '',
      caption: mediaItem.caption || '',
      date: mediaItem.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
    setIsMediaModalOpen(true);
  };

  const handleSaveMediaSubmit = async (e) => {
    e.preventDefault();

    if (!mediaForm.title.trim() || !mediaForm.url.trim()) {
      showToast('Media title and image URL are required.', 'error');
      return;
    }

    const payload = {
      title: mediaForm.title.trim(),
      category: mediaForm.category || 'Project Images',
      type: mediaForm.type || 'image',
      url: mediaForm.url.trim(),
      videoUrl: mediaForm.videoUrl?.trim() || '',
      caption: mediaForm.caption.trim(),
      date: mediaForm.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    try {
      if (editingMediaId) {
        const updatedMedia = await updateMediaApi(editingMediaId, payload);
        setMediaItems((prev) => prev.map((item) => (item.id === editingMediaId || item._id === editingMediaId ? updatedMedia : item)));
        showToast('Media item updated successfully.', 'success');
      } else {
        const newMedia = await createMediaApi({ ...payload, id: `media-${Date.now()}` });
        setMediaItems((prev) => [newMedia, ...prev]);
        showToast('Media item added successfully.', 'success');
      }
    } catch (error) {
      console.error('Failed to save media item:', error);
      showToast('Unable to save media item right now.', 'error');
      return;
    }

    setIsMediaModalOpen(false);
    setEditingMediaId(null);
    setMediaForm({
      title: '',
      category: 'Project Images',
      type: 'image',
      url: '',
      videoUrl: '',
      caption: '',
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  };

  const handleDeleteMediaConfirm = async (id) => {
    try {
      await deleteMediaApi(id);
      setMediaItems((prev) => prev.filter((item) => (item.id || item._id) !== id));
      showToast('Media item deleted successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete media item:', error);
      showToast('Unable to delete media item right now.', 'error');
      return;
    }

    setDeletingMediaId(null);
  };

  const handleDeleteRegisteredUser = async (userId) => {
    if (!userId) return;

    const target = registeredUsers.find((entry) => (entry.id || entry._id) === userId);
    if (!target) return;

    const confirmed = window.confirm(`Delete registered user ${target.name || target.email}? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await http.delete(`/auth/users/${userId}`);
      setRegisteredUsers((prev) => prev.filter((entry) => (entry.id || entry._id) !== userId));
      showToast('Registered user deleted successfully.', 'info');
    } catch (error) {
      console.error('Failed to delete registered user:', error);
      showToast(error.response?.data?.message || 'Unable to delete registered user right now.', 'error');
    }
  };

  const handleRoleUpgrade = async (userId, nextRole) => {
    if (!userId || !nextRole) return;

    try {
      const response = await http.patch(`/auth/users/${userId}/role`, { role: nextRole });
      const updatedUser = response.data?.user;

      setRegisteredUsers((prev) => prev.map((entry) => {
        const currentId = entry.id || entry._id;
        if (currentId !== userId) return entry;
        return { ...entry, role: updatedUser?.role || nextRole };
      }));

      showToast(updatedUser?.role === 'subadmin' ? 'User promoted to sub-admin.' : 'User role updated.', 'success');
    } catch (error) {
      console.error('Failed to update user role:', error);
      showToast(error.response?.data?.message || 'Unable to update user role right now.', 'error');
    }
  };

  // Metrics Data
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const convertedLeadsCount = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((convertedLeadsCount / totalLeads) * 100).toFixed(1) : '0.0';

  React.useEffect(() => {
    const loadRegisteredUsers = async () => {
      const currentRole = (adminUser?.role || '').toLowerCase();
      if (currentRole !== 'admin') return;

      try {
        const response = await http.get('/auth/users');
        setRegisteredUsers(response.data?.users || []);
      } catch (error) {
        console.error('Failed to load registered users:', error);
        setRegisteredUsers([]);
      }
    };

    loadRegisteredUsers();
  }, [user?.role]);

  return (
    <div className={`text-ink pb-24 ${isEmbedded ? 'pt-2' : 'min-h-screen bg-background'}`} style={isEmbedded ? {} : { paddingTop: '8.5rem' }}>
      <div className={isEmbedded ? 'w-full' : 'container-custom'}>

        {/* Top Header Banner */}
        {!isEmbedded && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/35 mb-8 shadow-2xl bg-surface/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent text-xs font-extrabold uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5 text-accent" />
              <span>Gurukripa Arcon — Admin Management Console</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-4xl font-bold text-ink">
              Executive Portal Dashboard
            </h1>
            <p className="text-ink-secondary text-xs sm:text-sm">
              Signed in as {user?.email}. Client signup accounts cannot reach this console.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="btn-gold text-xs px-4 py-2.5 flex items-center gap-2 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Prospect</span>
            </button>
            <button
              type="button"
              onClick={() => {
                logout();
                showToast('Admin session ended', 'info');
              }}
              className="btn-outline-gold text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
        )}

        {/* Layout Grid: Left Navigation Sidebar & Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation (3 cols) */}
          <aside className="lg:col-span-3 space-y-3">
            <div className="glass-panel p-4 rounded-3xl border border-accent/25 bg-surface/80 shadow-xl space-y-2 sticky top-32">
              <div className="px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-accent">
                Admin Controls
              </div>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Overview & Analytics</span>
              </button>

              <button
                onClick={() => setActiveTab('leads')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'leads'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>Lead CRM Portal</span>
                </div>
                {newLeadsCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold animate-pulse">
                    {newLeadsCount} New
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('registered-users')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'registered-users'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck className="w-4 h-4" />
                  <span>Registered Users</span>
                </div>
                <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow-sm animate-pulse">
                  {registeredUsers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'projects'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4" />
                  <span>Property Inventory</span>
                </div>
                <span className="text-[10px] text-ink-muted">{projects.length} Properties</span>
              </button>

              <button
                onClick={() => setActiveTab('visits')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'visits'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4" />
                  <span>Site Visits Manager</span>
                </div>
                <span className="bg-red-500 text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold shadow-sm animate-pulse">
                  {mockVisits.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('testimonials')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'testimonials'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Testimonials</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'insights'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Insights / Trends</span>
              </button>

              <button
                onClick={() => setActiveTab('media')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'media'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Media Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab('brochures')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'brochures'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Brochure Requests</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'settings'
                    ? 'bg-accent text-white shadow-md font-bold'
                    : 'text-ink-secondary hover:text-ink hover:bg-muted'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>System Settings</span>
              </button>
            </div>
          </aside>

          {/* Main Content Dashboard Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">

            {/* TAB: Registered Users */}
            {activeTab === 'registered-users' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                      <h3 className="font-heading text-xl font-bold text-ink">Registered Users</h3>
                      <p className="text-xs text-ink-muted mt-1">Name, email and submitted KYC for all public signups.</p>
                    </div>
                    <span className="badge-gold text-[10px]">{registeredUsers.length} Users</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-border text-ink-muted">
                          <th className="pb-3 pr-4 font-semibold">Name</th>
                          <th className="pb-3 pr-4 font-semibold">Email</th>
                          <th className="pb-3 pr-4 font-semibold">KYC Type</th>
                          <th className="pb-3 pr-4 font-semibold">KYC Number</th>
                          <th className="pb-3 text-right font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registeredUsers.length ? (
                          registeredUsers.map((entry) => (
                            <tr key={entry.id || entry.email} className="border-b border-border/80 align-top">
                              <td className="py-3 pr-4 text-ink font-medium">{entry.name}</td>
                              <td className="py-3 pr-4 text-ink-secondary">{entry.email}</td>
                              <td className="py-3 pr-4 text-ink-secondary">{entry.kycType || '—'}</td>
                              <td className="py-3 pr-4 text-ink-secondary">{entry.kycNumber || '—'}</td>
                              <td className="py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleRoleUpgrade(entry.id || entry._id, 'subadmin')}
                                    className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 transition hover:bg-emerald-500 hover:text-white"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Make Sub-admin
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteRegisteredUser(entry.id || entry._id)}
                                    className="inline-flex items-center gap-1 rounded-xl border border-rose-500/40 bg-rose-500/10 px-2.5 py-1.5 text-[11px] font-bold text-rose-400 transition hover:bg-rose-500 hover:text-white"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="py-6 text-center text-ink-muted">
                              No public users have signed up yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 1: OVERVIEW & ANALYTICS */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                  <div className="glass-panel p-5 rounded-3xl border border-accent/30 bg-surface shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">Total Leads</span>
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-3xl font-bold text-ink">{totalLeads}</div>
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Live inquiries capture active</span>
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/30 bg-surface shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">Total Users</span>
                      <UserCheck className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-3xl font-bold text-ink">{registeredUsers.length}</div>
                    <div className="text-[11px] text-red-400 font-medium">
                      Public signups registered
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/30 bg-surface shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">Active Properties</span>
                      <Building className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="text-3xl font-bold text-ink">{projects.length}</div>
                    <div className="text-[11px] text-ink-secondary font-medium">
                      Across 8 prime locations
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/30 bg-surface shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">Scheduled Visits</span>
                      <Calendar className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="text-3xl font-bold text-ink">{mockVisits.length}</div>
                    <div className="text-[11px] text-indigo-300 font-medium">
                      Upcoming this week
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/30 bg-surface shadow-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-ink-muted">Conversion Rate</span>
                      <PieChart className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-emerald-400">{conversionRate}%</div>
                    <div className="text-[11px] text-emerald-400 font-medium">
                      {convertedLeadsCount} deals closed successfully
                    </div>
                  </div>
                </div>

                {/* Status Distribution Bars & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Status Breakdown Bar */}
                  <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl space-y-5">
                    <h3 className="font-heading text-lg font-bold text-ink flex items-center justify-between">
                      <span>Lead Status Breakdown</span>
                      <span className="text-xs font-mono text-accent">Total: {totalLeads}</span>
                    </h3>
                    <div className="space-y-4">
                      {statuses.map((status) => {
                        const count = leads.filter(l => l.status === status).length;
                        const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
                        return (
                          <div key={status} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-ink-secondary">{status}</span>
                              <span className="text-ink font-mono">{count} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent transition-all duration-500 rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity List */}
                  <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl space-y-5">
                    <h3 className="font-heading text-lg font-bold text-ink">Recent Lead Submissions</h3>
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div key={lead.id} className="p-3.5 rounded-2xl bg-muted/60 border border-accent/15 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <div className="font-bold text-ink flex items-center gap-2">
                              <span>{lead.name}</span>
                              <span className="text-[10px] font-mono text-accent">{lead.id}</span>
                            </div>
                            <div className="text-ink-secondary text-[11px]">{lead.projectName} • {lead.type}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full font-bold border ${getStatusBadgeClass(lead.status)} text-[10px]`}>
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* TAB 2: LEAD CRM MANAGEMENT */}
            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Search & Filters */}
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <h2 className="font-heading text-xl font-bold text-ink">Lead CRM Records</h2>
                    <div className="text-xs text-ink-muted">Showing {filteredLeads.length} of {leads.length} leads</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-accent absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search name, email, ticket..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input text-xs pl-10 py-2.5"
                      />
                    </div>

                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="form-select text-xs"
                    >
                      {leadTypes.map((t) => (
                        <option key={t} value={t}>Type: {t}</option>
                      ))}
                    </select>

                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="form-select text-xs"
                    >
                      <option value="All">All Statuses</option>
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Leads Table */}
                <div className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted text-accent font-extrabold uppercase border-b border-accent/30 tracking-wider text-[11px]">
                        <th className="p-4">ID</th>
                        <th className="p-4">Prospect</th>
                        <th className="p-4">Contact Details</th>
                        <th className="p-4">Inquiry Category</th>
                        <th className="p-4">Project</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/15">
                      {filteredLeads.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-ink-muted">
                            No lead records match your search or filter options.
                          </td>
                        </tr>
                      ) : (
                        visibleLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-muted/70 transition-colors">
                            <td className="p-4 font-mono font-bold text-accent">{lead.id}</td>
                            <td className="p-4 font-bold text-ink">{lead.name}</td>
                            <td className="p-4 space-y-1 text-ink-secondary">
                              <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-accent" />{lead.phone}</div>
                              <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-accent" />{lead.email}</div>
                            </td>
                            <td className="p-4">
                              <span className="badge-gold text-[10px]">{lead.type}</span>
                            </td>
                            <td className="p-4 font-medium text-ink-secondary">{lead.projectName}</td>
                            <td className="p-3">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`w-[118px] min-w-[118px] border rounded-lg px-1.5 py-1 text-[10px] font-bold text-center cursor-pointer shadow-sm focus:outline-none ${getStatusBadgeClass(lead.status)}`}
                              >
                                {statuses.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5 whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedLeadModal(lead)}
                                  className="flex items-center justify-center w-7 h-7 rounded-md bg-accent/15 text-accent hover:bg-accent hover:text-white transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleEditLead(lead)}
                                  className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white px-1.5 py-1 rounded-md text-[9px] font-bold transition-all leading-none"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white px-1.5 py-1 rounded-md text-[9px] font-bold transition-all leading-none"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {hasMoreLeads && (
                    <div className="flex justify-center p-4 border-t border-accent/20">
                      <button
                        type="button"
                        onClick={() => setLeadVisibleCount((prev) => Math.min(prev + LIST_PAGE_SIZE, filteredLeads.length))}
                        className="btn-gold px-6 py-2 text-[11px] font-bold"
                      >
                        Load More Leads
                      </button>
                    </div>
                  )}

                  {!hasMoreLeads && filteredLeads.length > 0 && (
                    <div className="text-center text-[11px] text-ink-muted pb-4">
                      All leads loaded.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB 3: PROPERTY INVENTORY */}
            {activeTab === 'projects' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Project Filters & Add Action */}
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink">Property Portfolio</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Manage real-time luxury property cards, pricing, and live inventory.</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <select
                      value={projectCategoryFilter}
                      onChange={(e) => setProjectCategoryFilter(e.target.value)}
                      className="form-select text-xs py-2"
                    >
                      <option value="All">All Categories</option>
                      {projectCategoryOptions.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>

                    <select
                      value={projectStatusFilter}
                      onChange={(e) => setProjectStatusFilter(e.target.value)}
                      className="form-select text-xs py-2"
                    >
                      <option value="All">All Property Statuses</option>
                      {projectStatusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>

                    <button
                      onClick={handleOpenAddProjectModal}
                      className="btn-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Property Card</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <div className="glass-panel p-5 rounded-3xl border border-accent/35 bg-surface shadow-lg">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="font-heading text-lg font-bold text-ink">Manage Blog Categories</h3>
                    </div>
                    <div className="space-y-3">
                      {blogCategoryOptions.map((category, index) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 rounded-xl border border-accent/25 bg-muted text-sm text-ink">{category}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setBlogCategoryForm(category);
                              setEditingBlogCategoryIndex(index);
                            }}
                            className="btn-secondary text-[10px] px-2.5 py-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlogCategory(category)}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl px-2.5 py-2 text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        value={blogCategoryForm}
                        onChange={(e) => setBlogCategoryForm(e.target.value)}
                        placeholder="Add or edit blog category"
                        className="form-input text-xs py-2.5 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleSaveBlogCategory}
                        className="btn-gold text-[10px] px-3 py-2"
                      >
                        {editingBlogCategoryIndex !== null ? 'Save' : 'Add'}
                      </button>
                      {editingBlogCategoryIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setBlogCategoryForm('');
                            setEditingBlogCategoryIndex(null);
                          }}
                          className="btn-secondary text-[10px] px-3 py-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/35 bg-surface shadow-lg">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="font-heading text-lg font-bold text-ink">Manage Media Categories</h3>
                    </div>
                    <div className="space-y-3">
                      {mediaCategoryOptions.map((category, index) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 rounded-xl border border-accent/25 bg-muted text-sm text-ink">{category}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setMediaCategoryForm(category);
                              setEditingMediaCategoryIndex(index);
                            }}
                            className="btn-secondary text-[10px] px-2.5 py-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMediaCategory(category)}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl px-2.5 py-2 text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        value={mediaCategoryForm}
                        onChange={(e) => setMediaCategoryForm(e.target.value)}
                        placeholder="Add or edit media category"
                        className="form-input text-xs py-2.5 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleSaveMediaCategory}
                        className="btn-gold text-[10px] px-3 py-2"
                      >
                        {editingMediaCategoryIndex !== null ? 'Save' : 'Add'}
                      </button>
                      {editingMediaCategoryIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setMediaCategoryForm('');
                            setEditingMediaCategoryIndex(null);
                          }}
                          className="btn-secondary text-[10px] px-3 py-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/35 bg-surface shadow-lg">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="font-heading text-lg font-bold text-ink">Manage Project Categories</h3>
                    </div>
                    <div className="space-y-3">
                      {projectCategoryOptions.map((category, index) => (
                        <div key={category} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 rounded-xl border border-accent/25 bg-muted text-sm text-ink">{category}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectCategoryForm(category);
                              setEditingProjectCategoryIndex(index);
                            }}
                            className="btn-secondary text-[10px] px-2.5 py-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProjectCategory(category)}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl px-2.5 py-2 text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        value={projectCategoryForm}
                        onChange={(e) => setProjectCategoryForm(e.target.value)}
                        placeholder="Add or edit category"
                        className="form-input text-xs py-2.5 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleSaveProjectCategory}
                        className="btn-gold text-[10px] px-3 py-2"
                      >
                        {editingProjectCategoryIndex !== null ? 'Save' : 'Add'}
                      </button>
                      {editingProjectCategoryIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setProjectCategoryForm('');
                            setEditingProjectCategoryIndex(null);
                          }}
                          className="btn-secondary text-[10px] px-3 py-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass-panel p-5 rounded-3xl border border-accent/35 bg-surface shadow-lg">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <h3 className="font-heading text-lg font-bold text-ink">Manage Statuses</h3>
                    </div>
                    <div className="space-y-3">
                      {projectStatusOptions.map((status, index) => (
                        <div key={status} className="flex items-center gap-2">
                          <span className="flex-1 px-3 py-2 rounded-xl border border-accent/25 bg-muted text-sm text-ink">{status}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setProjectStatusForm(status);
                              setEditingProjectStatusIndex(index);
                            }}
                            className="btn-secondary text-[10px] px-2.5 py-2"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProjectStatus(status)}
                            className="bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-xl px-2.5 py-2 text-[10px] font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <input
                        value={projectStatusForm}
                        onChange={(e) => setProjectStatusForm(e.target.value)}
                        placeholder="Add or edit status"
                        className="form-input text-xs py-2.5 flex-1"
                      />
                      <button
                        type="button"
                        onClick={handleSaveProjectStatus}
                        className="btn-gold text-[10px] px-3 py-2"
                      >
                        {editingProjectStatusIndex !== null ? 'Save' : 'Add'}
                      </button>
                      {editingProjectStatusIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setProjectStatusForm('');
                            setEditingProjectStatusIndex(null);
                          }}
                          className="btn-secondary text-[10px] px-3 py-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Project Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProjects.length === 0 ? (
                    <div className="col-span-full card-panel p-12 text-center rounded-3xl space-y-4 border border-dashed border-border">
                      <Building2 className="w-12 h-12 text-accent mx-auto opacity-60" />
                      <h3 className="font-heading text-xl font-bold text-ink">No Properties Found</h3>
                      <p className="text-xs text-ink-muted">Add a new property card or adjust your filter parameters.</p>
                      <button onClick={handleOpenAddProjectModal} className="btn-gold text-xs px-5 py-2.5 font-bold">
                        <Plus className="w-4 h-4" />
                        <span>Add Property Card</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      {visibleProjects.map((project) => (
                        <div key={project.id} className="glass-panel rounded-3xl border border-accent/35 overflow-hidden bg-surface shadow-lg flex flex-col justify-between group hover:border-accent transition-all">
                          <div>
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={project.heroImage}
                                alt={project.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent opacity-80" />

                              <span className="absolute top-3 right-3 bg-background/90 text-accent border border-accent/40 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md backdrop-blur-md">
                                {project.status}
                              </span>

                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                                <span className="badge-gold text-[10px]">{project.category}</span>
                              </div>
                            </div>

                            <div className="p-5 space-y-3">
                              <div className="space-y-1">
                                <h3 className="font-heading text-lg font-bold text-ink group-hover:text-accent transition-colors">{project.name}</h3>
                                <p className="text-ink-secondary text-xs flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                                  <span>{project.location}, {project.city}</span>
                                </p>
                              </div>

                              <div className="bg-muted/70 p-3 rounded-2xl border border-accent/15 space-y-1.5 text-xs">
                                <div className="flex justify-between font-medium">
                                  <span className="text-ink-muted">Total Units:</span>
                                  <span className="font-bold text-ink">{project.specifications?.totalUnits || '120'}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span className="text-ink-muted">Configurations:</span>
                                  <span className="font-bold text-ink">{project.specifications?.configurations || '2 & 3 BHK'}</span>
                                </div>
                                <div className="flex justify-between font-medium">
                                  <span className="text-ink-muted">Pricing Band:</span>
                                  <span className="font-extrabold text-accent">{project.price}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="p-5 pt-0 space-y-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSelectedProjectModal(project)}
                                className="btn-secondary flex-1 text-xs py-2 text-center font-semibold"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleOpenEditProjectModal(project)}
                                className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Edit Property"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => setDeletingProjectId(project.id)}
                                className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                title="Delete Property"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {hasMoreProjects && (
                        <div className="col-span-full flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() => setProjectVisibleCount((prev) => Math.min(prev + LIST_PAGE_SIZE, filteredProjects.length))}
                            className="btn-gold px-6 py-2 text-[11px] font-bold"
                          >
                            Load More Projects
                          </button>
                        </div>
                      )}

                      {!hasMoreProjects && filteredProjects.length > 0 && (
                        <div className="col-span-full text-center text-[11px] text-ink-muted pt-2">
                          All projects loaded.
                        </div>
                      )}
                    </>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB 4: SITE VISITS MANAGER */}
            {activeTab === 'visits' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink">Scheduled Property Site Visits</h2>
                    <p className="text-xs text-ink-muted">Manage client site visits and assigned relationship executives.</p>
                  </div>

                  <select
                    value={visitStatusFilter}
                    onChange={(e) => setVisitStatusFilter(e.target.value)}
                    className="form-select text-xs py-2"
                  >
                    <option value="All">All Visit Statuses</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted text-accent font-extrabold uppercase border-b border-accent/30 tracking-wider text-[11px]">
                        <th className="p-4">Visit ID</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Target Property</th>
                        <th className="p-4">Date & Time</th>
                        <th className="p-4">Pickup Vehicle</th>
                        <th className="p-4">Executive</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/15">
                      {visibleVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-muted/70 transition-colors">
                          <td className="p-4 font-mono font-bold text-accent">{visit.id}</td>
                          <td className="p-4 font-bold text-ink">{visit.name}</td>
                          <td className="p-4 font-medium text-ink-secondary">{visit.project}</td>
                          <td className="p-4 text-ink-secondary font-mono">{visit.date} ({visit.time})</td>
                          <td className="p-4">
                            {visit.cabNeeded ? (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold">Cab Requested</span>
                            ) : (
                              <span className="text-ink-muted">Self Driving</span>
                            )}
                          </td>
                          <td className="p-4 font-semibold text-accent">{visit.executive}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full font-bold border text-[10px] ${
                              visit.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              visit.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                              'bg-gray-500/20 text-gray-300 border-gray-500/30'
                            }`}>
                              {visit.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={visit.status}
                              onChange={(e) => handleVisitStatusChange(visit.id, e.target.value)}
                              className="bg-muted border border-accent/30 text-accent font-bold rounded-xl px-2 py-1 text-[11px] focus:outline-none cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {hasMoreVisits && (
                    <div className="flex justify-center p-4 border-t border-accent/20">
                      <button
                        type="button"
                        onClick={() => setVisitVisibleCount((prev) => Math.min(prev + LIST_PAGE_SIZE, mockVisits.filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter).length))}
                        className="btn-gold px-6 py-2 text-[11px] font-bold"
                      >
                        Load More Visits
                      </button>
                    </div>
                  )}

                  {!hasMoreVisits && mockVisits.filter(v => visitStatusFilter === 'All' || v.status === visitStatusFilter).length > 0 && (
                    <div className="text-center text-[11px] text-ink-muted pb-4">
                      All visits loaded.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* TAB 5: TESTIMONIALS */}
            {activeTab === 'testimonials' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink">Client Testimonials</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Update, add, and remove testimonials shown on the homepage.</p>
                  </div>

                  <button onClick={handleOpenAddTestimonialModal} className="btn-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md">
                    <Plus className="w-4 h-4" />
                    <span>Add Testimonial</span>
                  </button>
                </div>

                <div className="grid gap-5">
                  {(companyData.testimonials || []).length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl border border-dashed border-border text-center">
                      <MessageSquareQuote className="w-12 h-12 text-accent mx-auto opacity-60" />
                      <h3 className="font-heading text-xl font-bold text-ink mt-4">No testimonials available</h3>
                      <p className="text-xs text-ink-muted mt-2">Create the first client testimonial to showcase social proof on the website.</p>
                    </div>
                  ) : (
                    (companyData.testimonials || []).map((testimonial, index) => (
                      <div key={`${testimonial.name}-${index}`} className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl p-5 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-2 flex-1">
                            <p className="text-sm font-medium text-ink italic leading-relaxed">“{testimonial.quote || 'No quote provided'}”</p>
                            <div>
                              <div className="font-bold text-ink">{testimonial.name || 'Anonymous'}</div>
                              {testimonial.detail && <div className="text-[11px] text-ink-muted uppercase tracking-wide">{testimonial.detail}</div>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleOpenEditTestimonialModal(testimonial, index)}
                              className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              title="Edit testimonial"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => setDeletingTestimonialIndex(index)}
                              className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                              title="Delete testimonial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 6: INSIGHTS / REAL ESTATE TRENDS */}
            {activeTab === 'insights' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink">Insights & Real Estate Trends</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Publish, edit, and remove market insight articles from the homepage and blog feed.</p>
                  </div>

                  <button onClick={handleOpenAddBlogModal} className="btn-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md">
                    <Plus className="w-4 h-4" />
                    <span>New Insight</span>
                  </button>
                </div>

                <div className="grid gap-5">
                  {blogs.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl border border-dashed border-border text-center">
                      <FileText className="w-12 h-12 text-accent mx-auto opacity-60" />
                      <h3 className="font-heading text-xl font-bold text-ink mt-4">No insights published yet</h3>
                      <p className="text-xs text-ink-muted mt-2">Create the first real estate trend article to appear on the homepage.</p>
                    </div>
                  ) : (
                    <>
                      {visibleBlogs.map((blog) => (
                        <div key={blog.id || blog._id} className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl overflow-hidden">
                          <div className="md:flex">
                            <img src={blog.featuredImage} alt={blog.title} className="w-full md:w-64 h-52 md:h-auto object-cover" />
                            <div className="flex-1 p-5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="badge-gold text-[10px]">{blog.category || 'Real Estate Trends'}</span>
                                  <h3 className="font-heading text-xl font-bold text-ink">{blog.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenEditBlogModal(blog)}
                                    className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    title="Edit insight"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => setDeletingBlogId(blog.id || blog._id)}
                                    className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    title="Delete insight"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted font-mono uppercase tracking-wide">
                                <span>{blog.date}</span>
                                <span>•</span>
                                <span>{blog.readTime}</span>
                                <span>•</span>
                                <span>{blog.author}</span>
                              </div>

                              <p className="text-sm text-ink-secondary leading-relaxed">{blog.excerpt || blog.content?.slice(0, 180)}</p>

                              <div className="flex flex-wrap gap-2">
                                {(blog.tags || []).slice(0, 4).map((tag) => (
                                  <span key={tag} className="px-2 py-1 rounded-full bg-muted text-ink-secondary text-[10px] font-semibold border border-accent/20">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                      {hasMoreBlogs && (
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() => setBlogVisibleCount((prev) => Math.min(prev + LIST_PAGE_SIZE, blogs.length))}
                            className="btn-gold px-6 py-2 text-[11px] font-bold"
                          >
                            Load More Insights
                          </button>
                        </div>
                      )}

                      {!hasMoreBlogs && blogs.length > 0 && (
                        <div className="text-center text-[11px] text-ink-muted pt-2">
                          All insights loaded.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 7: MEDIA GALLERY */}
            {activeTab === 'media' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-ink">Media Gallery</h2>
                    <p className="text-xs text-ink-muted mt-0.5">Add, edit, and remove project images, videos, and media announcements.</p>
                  </div>

                  <button onClick={handleOpenAddMediaModal} className="btn-gold text-xs py-2 px-4 font-bold flex items-center gap-1.5 shadow-md">
                    <Plus className="w-4 h-4" />
                    <span>New Media Item</span>
                  </button>
                </div>

                <div className="grid gap-5">
                  {mediaItems.length === 0 ? (
                    <div className="glass-panel p-12 rounded-3xl border border-dashed border-border text-center">
                      <Building2 className="w-12 h-12 text-accent mx-auto opacity-60" />
                      <h3 className="font-heading text-xl font-bold text-ink mt-4">No media items yet</h3>
                      <p className="text-xs text-ink-muted mt-2">Upload the first visual or video to populate the gallery.</p>
                    </div>
                  ) : (
                    <>
                      {visibleMedia.map((item) => (
                        <div key={item.id || item._id} className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl overflow-hidden">
                          <div className="md:flex">
                            <img src={item.url} alt={item.title} className="w-full md:w-64 h-52 md:h-auto object-cover" />
                            <div className="flex-1 p-5 space-y-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="space-y-1">
                                  <span className="badge-gold text-[10px]">{item.category || 'Project Images'}</span>
                                  <h3 className="font-heading text-xl font-bold text-ink">{item.title}</h3>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleOpenEditMediaModal(item)}
                                    className="bg-accent/15 text-accent border border-accent/30 hover:bg-accent hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    title="Edit media"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>
                                  <button
                                    onClick={() => setDeletingMediaId(item.id || item._id)}
                                    className="bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                                    title="Delete media"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-muted font-mono uppercase tracking-wide">
                                <span>{item.date}</span>
                                <span>•</span>
                                <span>{item.type === 'video' ? 'Video' : 'Image'}</span>
                              </div>

                              <p className="text-sm text-ink-secondary leading-relaxed">{item.caption || 'No caption provided yet.'}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {hasMoreMedia && (
                        <div className="flex justify-center pt-2">
                          <button
                            type="button"
                            onClick={() => setMediaVisibleCount((prev) => Math.min(prev + LIST_PAGE_SIZE, mediaItems.length))}
                            className="btn-gold px-6 py-2 text-[11px] font-bold"
                          >
                            Load More Media
                          </button>
                        </div>
                      )}

                      {!hasMoreMedia && mediaItems.length > 0 && (
                        <div className="text-center text-[11px] text-ink-muted pt-2">
                          All media loaded.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 8: BROCHURE REQUESTS */}
            {activeTab === 'brochures' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl space-y-2">
                  <h2 className="font-heading text-xl font-bold text-ink">Brochure & Floor Plan Downloads</h2>
                  <p className="text-xs text-ink-muted">Prospects who requested digital brochures and investment decks.</p>
                </div>

                <div className="glass-panel rounded-3xl border border-accent/35 bg-surface shadow-xl p-6">
                  <div className="space-y-4">
                    {brochureRequests.length === 0 ? (
                      <div className="p-8 rounded-2xl border border-dashed border-accent/25 bg-muted/40 text-center text-ink-muted text-xs">
                        No brochure requests yet. Prospects who request e-brochures will appear here automatically.
                      </div>
                    ) : (
                      brochureRequests.map((b) => (
                        <div key={b.id} className="p-4 rounded-2xl bg-muted/60 border border-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                          <div className="space-y-1">
                            <div className="font-bold text-ink flex items-center gap-2 flex-wrap">
                              <span>{b.name}</span>
                              <span className="text-accent font-mono">({b.email || 'No email'})</span>
                            </div>
                            <div className="text-ink-secondary">
                              Requested brochure for <strong>{b.projectName}</strong>
                              {b.phone ? ` • ${b.phone}` : ''}
                            </div>
                          </div>
                          <button
                            onClick={() => showToast(`Resent brochure link to ${b.email || 'the prospect'}`, 'success')}
                            className="btn-gold text-[10px] py-1.5 px-3 flex items-center gap-1.5 self-start sm:self-auto"
                          >
                            <Download className="w-3 h-3" />
                            <span>Resend Email</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 8: SETTINGS */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="glass-panel p-6 rounded-3xl border border-accent/35 bg-surface shadow-xl space-y-6">
                  <h2 className="font-heading text-xl font-bold text-ink">System & Data Preferences</h2>
                  
                  <div className="space-y-4 text-xs">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-accent/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-ink">Instant Email Alerts for New Leads</div>
                        <div className="text-ink-muted">Send notification email to sales manager whenever a lead is captured.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/50 border border-accent/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-ink">Auto Lead Round-Robin Assignment</div>
                        <div className="text-ink-muted">Automatically cycle incoming leads to online relationship managers.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/50 border border-accent/20 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-ink">SMS Site Visit Reminder</div>
                        <div className="text-ink-muted">Dispatch automatic SMS to client 2 hours before site visit schedule.</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
                    </div>

                    {/* Data Reset Action */}
                    <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="font-bold text-rose-400 text-sm flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          <span>Reset Property Portfolio to Default Seed Data</span>
                        </div>
                        <div className="text-ink-muted text-xs mt-0.5">
                          Restore initial sample luxury towers if project list is cleared or corrupted.
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          await resetProjects();
                          showToast('Property portfolio reset to default seed data!', 'info');
                        }}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors shrink-0"
                      >
                        Reset Properties
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </main>
        </div>

      </div>

      {/* MODAL 1: ADD NEW LEAD */}
      <AnimatePresence>
        {isAddLeadModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-lg space-y-5"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <h3 className="font-heading text-lg font-bold text-ink">
                  {editingLeadId ? 'Edit Prospect Lead' : 'Log New Prospect Lead'}
                </h3>
                <button onClick={() => {
                  setIsAddLeadModalOpen(false);
                  setEditingLeadId(null);
                  setNewLeadData({ name: '', phone: '', email: '', type: 'Project Enquiry', projectName: projects[0]?.name || 'Skyline Heights 1', message: '' });
                }} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLeadSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Prospect Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+91 98260 00000"
                      value={newLeadData.phone}
                      onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Email Address</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={newLeadData.email}
                      onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Lead Classification</label>
                    <select
                      value={newLeadData.type}
                      onChange={(e) => setNewLeadData({ ...newLeadData, type: e.target.value })}
                      className="form-select text-xs"
                    >
                      <option value="Project Enquiry">Project Enquiry</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Brochure Request">Brochure Request</option>
                      <option value="Contact Form">Contact Form</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Associated Project</label>
                    <select
                      value={newLeadData.projectName}
                      onChange={(e) => setNewLeadData({ ...newLeadData, projectName: e.target.value })}
                      className="form-select text-xs"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Inquiry Notes / Remarks</label>
                  <textarea
                    rows="3"
                    placeholder="Enter any customer preference or budget notes..."
                    value={newLeadData.message}
                    onChange={(e) => setNewLeadData({ ...newLeadData, message: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsAddLeadModalOpen(false)} className="btn-outline-gold text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs py-2 px-5">
                    {editingLeadId ? 'Update Prospect Lead' : 'Save Prospect Lead'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: LEAD DETAILS */}
      <AnimatePresence>
        {selectedLeadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-md space-y-5"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-3">
                <span className="font-mono font-bold text-accent text-sm">{selectedLeadModal.id}</span>
                <button onClick={() => setSelectedLeadModal(null)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="text-base font-bold font-heading text-ink">{selectedLeadModal.name}</h3>
                  <div className="text-ink-secondary">{selectedLeadModal.projectName} • {selectedLeadModal.type}</div>
                </div>

                <div className="bg-muted p-4 rounded-2xl border border-accent/20 space-y-2">
                  <div><strong>Phone:</strong> {selectedLeadModal.phone}</div>
                  <div><strong>Email:</strong> {selectedLeadModal.email}</div>
                  <div><strong>Status:</strong> {selectedLeadModal.status}</div>
                  {selectedLeadModal.preferredDate && <div><strong>Preferred Date:</strong> {selectedLeadModal.preferredDate}</div>}
                  {selectedLeadModal.notes && <div><strong>Notes:</strong> {selectedLeadModal.notes}</div>}
                </div>
              </div>

              <button onClick={() => setSelectedLeadModal(null)} className="btn-gold w-full text-xs py-2">
                Close View
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 3: PROJECT DETAILS */}
      <AnimatePresence>
        {selectedProjectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-lg space-y-4"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-3">
                <h3 className="font-heading text-lg font-bold text-ink">{selectedProjectModal.name}</h3>
                <button onClick={() => setSelectedProjectModal(null)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <img src={selectedProjectModal.heroImage} alt="" className="w-full h-40 object-cover rounded-2xl" />
                <div><strong>Category:</strong> {selectedProjectModal.category}</div>
                <div><strong>Location:</strong> {selectedProjectModal.location}, {selectedProjectModal.city}</div>
                <div><strong>Price Range:</strong> {selectedProjectModal.price}</div>
                <div><strong>RERA Number:</strong> {selectedProjectModal.reraNumber || 'PRM/IND/2026/109'}</div>
                <div><strong>Description:</strong> {selectedProjectModal.shortDesc}</div>
              </div>

              <button onClick={() => setSelectedProjectModal(null)} className="btn-gold w-full text-xs py-2">
                Close Inventory Detail
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 4: ADD / EDIT MEDIA ITEM */}
      <AnimatePresence>
        {isMediaModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-xl space-y-5 my-auto"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <h3 className="font-heading text-xl font-bold text-ink">
                  {editingMediaId ? 'Edit Media Item' : 'Add Media Item'}
                </h3>
                <button onClick={() => setIsMediaModalOpen(false)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMediaSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Title *</label>
                  <input
                    type="text"
                    required
                    value={mediaForm.title}
                    onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Category</label>
                    <select
                      value={mediaForm.category}
                      onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                      className="form-select text-xs"
                    >
                      {['Project Images', 'Videos', 'Events', 'Company Activities', 'News & Press'].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Type</label>
                    <select
                      value={mediaForm.type}
                      onChange={(e) => setMediaForm({ ...mediaForm, type: e.target.value })}
                      className="form-select text-xs"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Image URL *</label>
                  <input
                    type="url"
                    required
                    value={mediaForm.url}
                    onChange={(e) => setMediaForm({ ...mediaForm, url: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                {mediaForm.type === 'video' && (
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Video URL</label>
                    <input
                      type="url"
                      value={mediaForm.videoUrl}
                      onChange={(e) => setMediaForm({ ...mediaForm, videoUrl: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-ink">Caption</label>
                  <textarea
                    rows="3"
                    value={mediaForm.caption}
                    onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Date</label>
                  <input
                    type="text"
                    value={mediaForm.date}
                    onChange={(e) => setMediaForm({ ...mediaForm, date: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsMediaModalOpen(false)} className="btn-outline-gold text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs py-2 px-5">
                    {editingMediaId ? 'Save Changes' : 'Add Media'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm modal for media item */}
      <AnimatePresence>
        {deletingMediaId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-md space-y-5"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-3">
                <h3 className="font-heading text-lg font-bold text-ink">Delete Media Item</h3>
                <button onClick={() => setDeletingMediaId(null)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-ink-secondary">This media item will be removed from the public gallery. Continue?</p>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setDeletingMediaId(null)} className="btn-outline-gold text-xs py-2 px-4">
                  Cancel
                </button>
                <button type="button" onClick={() => handleDeleteMediaConfirm(deletingMediaId)} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 5: ADD / EDIT PROPERTY CARD */}
      <AnimatePresence>
        {isAddProjectModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <h3 className="font-heading text-xl font-bold text-ink">
                  {editingProject ? 'Edit Property Card' : 'Add New Property Card'}
                </h3>
                <button onClick={() => setIsAddProjectModalOpen(false)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProjectSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Property Title / Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurukripa Grand Horizon"
                      value={projectForm.name}
                      onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Category *</label>
                    <select
                      value={projectForm.category}
                      onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="form-select text-xs"
                    >
                      {projectCategoryOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Development Stage *</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="form-select text-xs"
                    >
                      {projectStatusOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Price Range *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹55 Lakh - ₹95 Lakh"
                      value={projectForm.price}
                      onChange={(e) => setProjectForm({ ...projectForm, price: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Location / Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Super Corridor"
                      value={projectForm.location}
                      onChange={(e) => setProjectForm({ ...projectForm, location: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="Indore"
                      value={projectForm.city}
                      onChange={(e) => setProjectForm({ ...projectForm, city: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Hero Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={projectForm.heroImage}
                    onChange={(e) => setProjectForm({ ...projectForm, heroImage: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Total Units</label>
                    <input
                      type="text"
                      placeholder="150 Units"
                      value={projectForm.totalUnits}
                      onChange={(e) => setProjectForm({ ...projectForm, totalUnits: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Configurations</label>
                    <input
                      type="text"
                      placeholder="2, 3 & 4 BHK"
                      value={projectForm.configurations}
                      onChange={(e) => setProjectForm({ ...projectForm, configurations: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Possession Year</label>
                    <input
                      type="text"
                      placeholder="2027"
                      value={projectForm.possession}
                      onChange={(e) => setProjectForm({ ...projectForm, possession: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Short Description</label>
                  <textarea
                    rows="3"
                    placeholder="Brief highlights about amenities, architecture, and luxury features..."
                    value={projectForm.shortDesc}
                    onChange={(e) => setProjectForm({ ...projectForm, shortDesc: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button type="button" onClick={() => setIsAddProjectModalOpen(false)} className="btn-outline-gold text-xs py-2 px-5">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs py-2 px-6 font-bold">
                    {editingProject ? 'Save Changes' : 'Publish Property Card'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 5: TESTIMONIAL FORM */}
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-panel p-6 sm:p-8 rounded-3xl border border-accent/40 bg-surface shadow-2xl w-full max-w-xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-4">
                <h3 className="font-heading text-lg font-bold text-ink">
                  {editingTestimonialIndex !== null ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h3>
                <button onClick={() => setIsTestimonialModalOpen(false)} className="text-ink-muted hover:text-ink">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTestimonialSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Quote *</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write the customer feedback here..."
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-ink">Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Aarav Mehta"
                      value={testimonialForm.name}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-ink">Detail / Title</label>
                    <input
                      type="text"
                      placeholder="Homeowner, Gurukripa Heights"
                      value={testimonialForm.detail}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, detail: e.target.value })}
                      className="form-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="btn-outline-gold text-xs py-2 px-4">
                    Cancel
                  </button>
                  <button type="submit" className="btn-gold text-xs py-2 px-5">
                    {editingTestimonialIndex !== null ? 'Save Changes' : 'Add Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 6: DELETE TESTIMONIAL CONFIRMATION */}
      <AnimatePresence>
        {deletingTestimonialIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-panel p-6 rounded-3xl border border-rose-500/40 bg-surface shadow-2xl w-full max-w-sm text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">Delete Testimonial?</h3>
              <p className="text-xs text-ink-muted">
                This testimonial will be removed from the homepage immediately.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => setDeletingTestimonialIndex(null)} className="btn-outline-gold text-xs py-2 px-4 font-semibold">
                  Cancel
                </button>
                <button onClick={() => handleDeleteTestimonialConfirm(deletingTestimonialIndex)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-colors">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 7: DELETE CONFIRMATION */}
      <AnimatePresence>
        {deletingProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="glass-panel p-6 rounded-3xl border border-rose-500/40 bg-surface shadow-2xl w-full max-w-sm text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">Delete Property Card?</h3>
              <p className="text-xs text-ink-muted">
                Are you sure you want to remove this property card? It will immediately update all live visitor pages.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button onClick={() => setDeletingProjectId(null)} className="btn-outline-gold text-xs py-2 px-4 font-semibold">
                  Cancel
                </button>
                <button onClick={() => handleDeleteProjectConfirm(deletingProjectId)} className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-colors">
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboardPage;
