import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useProjects } from '../context/ProjectContext';
import { Calendar, Clock, Car, Shield, CheckCircle2, Building2, Sparkles } from 'lucide-react';

const SiteVisitPage = () => {
  const { projects } = useProjects();
  const { submitLead } = useLead();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectId: projects[0]?.id || '',
    preferredDate: '',
    preferredTime: '11:00 AM',
    visitors: '2',
    pickupRequired: true,
    message: ''
  });

  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const projObj = projects.find((p) => p.id === form.projectId);
    const projName = projObj ? projObj.name : 'General Site Inspection';

    const ticketId = `GA-VISIT-${Math.floor(1000 + Math.random() * 9000)}`;

    submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      type: 'Site Visit',
      projectName: projName,
      preferredDate: form.preferredDate || new Date().toISOString().split('T')[0],
      preferredTime: form.preferredTime,
      notes: `Ticket #${ticketId} | Visitors: ${form.visitors} | Pickup Requested: ${form.pickupRequired ? 'Yes' : 'No'} | ${form.message}`
    });

    setSubmittedTicket({
      id: ticketId,
      name: form.name,
      projectName: projName,
      date: form.preferredDate || 'Upcoming Date',
      time: form.preferredTime
    });
  };

  return (
    <div className="page-inner">
      
      {/* Site Visit Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Bespoke Concierge Inspection</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Book a Private <span className="text-gold-gradient">Site Inspection</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Experience our architectural construction quality firsthand with executive chauffeur pickup assistance, private sample apartment walk-throughs, and confidential pricing disclosures.
        </p>
      </section>

      {/* Booking Form Card */}
      <section className="container-custom max-w-3xl mx-auto">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-accent/40 shadow-2xl space-y-8 bg-surface/85 backdrop-blur-2xl">
          
          {submittedTicket ? (
            <div className="text-center py-10 space-y-8 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-[#22c55e]/15 text-[#4ade80] flex items-center justify-center mx-auto border border-[#22c55e]/40">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="font-heading text-3xl sm:text-4xl font-bold text-ink">
                Site Visit Pass Generated!
              </h3>
              <p className="text-base text-ink-secondary">
                Your VIP Site Visit Pass for <span className="text-accent font-semibold">{submittedTicket.projectName}</span> has been dispatched to our sales concierge.
              </p>

              <div className="bg-muted p-8 rounded-3xl border border-accent/30 text-left max-w-md mx-auto space-y-3 text-sm text-ink">
                <div><span className="text-ink-muted">Ticket Code:</span> <span className="font-bold text-accent">{submittedTicket.id}</span></div>
                <div><span className="text-ink-muted">Visitor Name:</span> {submittedTicket.name}</div>
                <div><span className="text-ink-muted">Scheduled Date:</span> {submittedTicket.date} ({submittedTicket.time})</div>
                <div><span className="text-ink-muted">Concierge Desk:</span> +91 98765 43210</div>
              </div>

              <button onClick={() => setSubmittedTicket(null)} className="btn-gold text-sm px-8 py-4 font-bold">
                Book Another Visit
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">Select Gurukripa Project *</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="form-select"
                  required
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.location}, {p.city}) - {p.category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time Slot *</label>
                  <select
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="form-select"
                  >
                    <option value="10:00 AM">Morning Slot (10:00 AM)</option>
                    <option value="01:00 PM">Afternoon Slot (01:00 PM)</option>
                    <option value="04:00 PM">Evening Slot (04:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 00000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Number of Visitors</label>
                  <select
                    value={form.visitors}
                    onChange={(e) => setForm({ ...form, visitors: e.target.value })}
                    className="form-select"
                  >
                    <option value="1">1 Visitor</option>
                    <option value="2">2 Visitors</option>
                    <option value="3">3 - 4 Family Members</option>
                    <option value="5+">5+ Investor Group</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-muted p-4 rounded-2xl border border-accent/30">
                <input
                  type="checkbox"
                  id="pickup-page"
                  checked={form.pickupRequired}
                  onChange={(e) => setForm({ ...form, pickupRequired: e.target.checked })}
                  className="accent-accent w-5 h-5"
                />
                <label htmlFor="pickup-page" className="text-sm text-ink cursor-pointer flex items-center gap-2 font-medium">
                  <Car className="w-5 h-5 text-accent" />
                  <span>Include Complimentary Executive Chauffeur Pickup Assistance</span>
                </label>
              </div>

              <button type="submit" className="btn-gold w-full text-sm font-bold py-4">
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Request Site Pass</span>
              </button>
            </form>
          )}

        </div>
      </section>

    </div>
  );
};

export default SiteVisitPage;
