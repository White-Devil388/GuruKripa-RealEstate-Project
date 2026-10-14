import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { ShieldCheck, Filter, Search, Phone, Mail, Calendar, Tag, CheckCircle2, Clock, Eye, Sparkles } from 'lucide-react';

const LeadAdminPage = () => {
  const { leads, updateLeadStatus } = useLead();
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);

  const statuses = [
    'New', 
    'Contacted', 
    'Follow-up', 
    'Qualified', 
    'Site Visit Scheduled', 
    'Converted', 
    'Closed'
  ];

  const leadTypes = ['All', 'Site Visit', 'Project Enquiry', 'Brochure Request', 'Contact Form', 'Career Application'];

  const filteredLeads = leads.filter((lead) => {
    if (filterType !== 'All' && lead.type !== filterType) return false;
    if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
    if (searchTerm && !lead.name.toLowerCase().includes(searchTerm.toLowerCase()) && !lead.email.toLowerCase().includes(searchTerm.toLowerCase()) && !lead.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Contacted': return 'bg-accent/20 text-accent border-accent/40';
      case 'Qualified': return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Site Visit Scheduled': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Converted': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Closed': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/40';
    }
  };

  return (
    <div className="pb-20 space-y-12" style={{ paddingTop: '12rem' }}>
      
      {/* Header */}
      <section className="container-custom flex flex-col md:flex-row md:items-center justify-between gap-7">
        <div>
          <div className="flex items-center gap-2.5 text-accent text-xs font-extrabold uppercase tracking-widest">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span>Internal CRM & Lead Management Portal</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-ink mt-2 leading-tight">
            Real-Time Submitted Leads Dashboard
          </h1>
        </div>

        <div className="bg-surface px-6 py-3.5 rounded-2xl border border-accent/35 text-sm text-ink shadow-xl">
          Total Captured Records: <strong className="text-accent text-lg font-bold ml-1">{leads.length}</strong>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="container-custom mt-2">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-accent/35 space-y-6 shadow-2xl bg-surface/85 backdrop-blur-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Search */}
            <div className="relative">
              <Search className="w-5 h-5 text-accent absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Search lead name, email, or Ticket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input text-sm pl-12 py-3"
              />
            </div>

            {/* Filter Lead Type */}
            <div className="form-group mb-0">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-select"
              >
                {leadTypes.map((t) => (
                  <option key={t} value={t}>Lead Classification: {t}</option>
                ))}
              </select>
            </div>

            {/* Filter Lead Status */}
            <div className="form-group mb-0">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                <option value="All">All Lead Statuses</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Leads Table */}
      <section className="container-custom mt-2">
        <div className="glass-panel rounded-3xl border border-accent/35 overflow-x-auto shadow-2xl bg-surface">
          <table className="w-full text-left border-collapse text-sm text-ink">
            <thead>
              <tr className="bg-muted text-accent uppercase border-b border-accent/35 font-extrabold tracking-wider text-xs">
                <th className="p-5">Ticket ID</th>
                <th className="p-5">Prospect Name</th>
                <th className="p-5">Contact Info</th>
                <th className="p-5">Lead Type</th>
                <th className="p-5">Associated Project</th>
                <th className="p-5">Current Status</th>
                <th className="p-5 text-center">Status Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/15">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-ink-muted text-sm">
                    No leads found matching current filter rules. Submit a site visit or contact form to test live capture!
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-muted transition-colors">
                    <td className="p-5 font-mono font-bold text-accent">{lead.id}</td>
                    <td className="p-5 font-bold text-ink">{lead.name}</td>
                    <td className="p-5 space-y-1 text-ink-secondary">
                      <div>📱 {lead.phone}</div>
                      <div>✉️ {lead.email}</div>
                    </td>
                    <td className="p-5">
                      <span className="badge-gold text-xs">{lead.type}</span>
                    </td>
                    <td className="p-5 text-ink-secondary font-medium">{lead.projectName}</td>
                    <td className="p-5">
                      <span className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-5 text-center">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        className="bg-muted border border-accent/40 rounded-xl px-3 py-2 text-xs text-accent font-bold focus:outline-none cursor-pointer"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};

export default LeadAdminPage;
