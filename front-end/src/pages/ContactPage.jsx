import React, { useState } from 'react';
import { useLead } from '../context/LeadContext';
import { useData } from '../context/DataContext';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ChevronDown, Sparkles } from 'lucide-react';

const ContactPage = () => {
  const { submitLead, openSiteVisitForProject } = useLead();
  const { companyData } = useData();
  const FAQ_ITEMS = companyData.faqItems || [];

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    property: 'General Enquiry',
    requirements: '',
    callTime: 'Anytime',
    message: '',
    consent: true
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLead({
      name: form.name,
      phone: form.phone,
      email: form.email,
      projectName: form.property,
      type: 'Contact Form',
      preferredTime: form.callTime,
      notes: `Requirements: ${form.requirements} | Message: ${form.message}`
    });
    setSubmitted(true);
  };

  return (
    <div className="page-inner">
      
      {/* Contact Hero */}
      <section className="container-custom space-y-4">
        <span className="badge-gold">Get in Touch</span>
        <h1 className="font-heading text-4xl sm:text-6xl font-bold text-ink">
          Connect with <span className="text-animated-gold">Gurukripa Executive Advisory</span>
        </h1>
        <p className="text-base sm:text-lg text-ink-secondary max-w-3xl leading-relaxed">
          Visit our corporate headquarters, schedule a private project consultation, or send us your direct requirement.
        </p>
      </section>

      {/* Main Grid: Direct Desk & Interactive Form */}
      <section className="container-custom grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Column: Office Info */}
        <div className="lg:col-span-5 space-y-6 sm:space-y-8">
          <div className="contact-card bg-surface p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-accent/35 space-y-6 sm:space-y-8 shadow-2xl">
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-ink border-b border-accent/25 pb-4 pl-1">
              Corporate Headquarters
            </h3>

            <div className="space-y-5 sm:space-y-6 text-sm">
              <div className="contact-info-row flex items-start gap-3.5 sm:gap-4 pl-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/1 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-ink text-base">Gurukripa Tower</div>
                  <div className="text-ink-secondary mt-1 leading-relaxed text-xs sm:text-sm">Sector 44, Golf Course Road Corridor, Gurugram, Haryana - 122003</div>
                </div>
              </div>

              <div className="contact-info-row flex items-center gap-3.5 sm:gap-4 pl-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/1 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-ink text-base">Sales & Advisory Desk</div>
                  <a href="tel:+919876543210" className="text-accent hover:underline font-extrabold text-xs sm:text-sm">+91 98765 43210 / +91 124 498 0000</a>
                </div>
              </div>

              <div className="contact-info-row flex items-center gap-3.5 sm:gap-4 pl-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/1 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-ink text-base">Email Enquiries</div>
                  <a href="mailto:info@gurukripaarcon.com" className="text-accent hover:underline text-xs sm:text-sm">info@gurukripaarcon.com</a>
                </div>
              </div>

              <div className="contact-info-row flex items-center gap-3.5 sm:gap-4 pl-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-accent/1 text-accent flex items-center justify-center shrink-0 border border-accent/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-ink text-base">Working Hours</div>
                  <div className="text-ink-secondary text-xs sm:text-sm">Monday - Sunday: 09:30 AM - 07:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-accent/35 space-y-4 sm:space-y-5 shadow-2xl">
            <h4 className="font-heading text-xl sm:text-2xl font-bold text-ink">Experience Centers</h4>
            <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed">
              Visit our state-of-the-art interactive experience suites at Golf Course Road Ext. and Noida Sector 150.
            </p>
            <button onClick={() => openSiteVisitForProject(null)} className="btn-gold w-full text-xs sm:text-sm py-3.5 font-bold justify-center">
              <Sparkles className="w-4 h-4" />
              <span>Book Experience Suite Tour</span>
            </button>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <div className="contact-panel glass-panel p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-accent/40 space-y-6 shadow-2xl bg-surface/85 backdrop-blur-2xl">
            <div className="space-y-3 border-b border-accent/35 pb-5">
              <span className="text-xs uppercase text-accent font-extrabold tracking-wider">Direct Connect</span>
              <h3 className="font-heading text-3xl font-bold text-ink">Send Us a Message</h3>
              <p className="text-sm text-ink-secondary">Our advisory desk responds within 30 minutes during working hours.</p>
            </div>

            {submitted ? (
              <div className="bg-surface border border-[#22c55e]/40 p-10 rounded-3xl text-center space-y-4 shadow-xl">
                <CheckCircle2 className="w-14 h-14 text-[#4ade80] mx-auto" />
                <h4 className="font-heading text-3xl font-bold text-ink">Message Delivered!</h4>
                <p className="text-base text-ink-secondary">
                  Thank you <span className="text-accent font-semibold">{form.name}</span>. An executive consultant has been assigned to your request.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn-gold text-xs sm:text-sm px-8 py-3.5 font-bold">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group contact-form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group contact-form-group">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group contact-form-group">
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

                  <div className="form-group contact-form-group">
                    <label className="form-label">Interested Property</label>
                    <select
                      value={form.property}
                      onChange={(e) => setForm({ ...form, property: e.target.value })}
                      className="form-select"
                    >
                      <option value="General Enquiry">General / Unspecified</option>
                      <option value="Gurukripa Grand Residences">Gurukripa Grand Residences</option>
                      <option value="Gurukripa Eco Enclave">Gurukripa Eco Enclave</option>
                      <option value="Gurukripa Capital Square">Gurukripa Capital Square</option>
                      <option value="Gurukripa Boulevard Estates">Gurukripa Boulevard Estates</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group contact-form-group">
                    <label className="form-label">Specific Requirements</label>
                    <input
                      type="text"
                      placeholder="e.g. 3BHK Penthouse, High-Rise, Commercial Floor"
                      value={form.requirements}
                      onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group contact-form-group">
                    <label className="form-label">Preferred Call Time</label>
                    <select
                      value={form.callTime}
                      onChange={(e) => setForm({ ...form, callTime: e.target.value })}
                      className="form-select"
                    >
                      <option value="Morning (10 AM - 1 PM)">Morning (10 AM - 1 PM)</option>
                      <option value="Afternoon (1 PM - 5 PM)">Afternoon (1 PM - 5 PM)</option>
                      <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group contact-form-group">
                  <label className="form-label">Message / Additional Details</label>
                  <textarea
                    rows={4}
                    placeholder="Enter your message..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn-gold w-full text-sm font-bold py-3.5 mt-1">
                  <Send className="w-4 h-4" />
                  <span>Submit Contact Form</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map & Directions Section */}
      <section className="container-custom space-y-8">
        <div className="space-y-2">
          <span className="badge-gold">Location & Accessibility</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">Google Maps & Directions</h2>
        </div>

        <div className="bg-surface rounded-3xl border border-accent/35 overflow-hidden h-96 relative flex items-center justify-center p-8 shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#A67C52_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 text-center space-y-5 max-w-lg bg-muted/90 p-8 rounded-3xl border border-accent/35 shadow-2xl backdrop-blur-md">
            <MapPin className="w-12 h-12 text-accent mx-auto animate-bounce" />
            <h4 className="font-heading text-2xl font-bold text-ink">Gurukripa Tower HQ</h4>
            <p className="text-sm text-ink-secondary">Sector 44, Golf Course Extension Corridor, Gurugram, Haryana</p>
            <a
              href="https://maps.app.goo.gl/bnFtWb3jQdQmPMR6A"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-xs sm:text-sm py-3.5 px-6 inline-flex font-bold"
            >
              Get Turn-by-Turn Directions
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="faq-section container-custom max-w-4xl mx-auto">
        <div className="text-center space-y-2 mt-3">
          <span className="badge-gold">Common Queries</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-ink">Frequently Asked Questions</h2>
        </div>

        <div className="faq-list mt-5 space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className="faq-item bg-surface rounded-2xl border border-accent/25 overflow-hidden shadow-md pl-2">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full px-5 py-4 text-left font-heading text-lg font-bold text-ink flex items-center justify-between gap-5 hover:text-accent transition-colors"
                >
                  <span className="faq-question-text flex-1 ml-2">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-accent shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-ink-secondary leading-relaxed border-t border-accent/15 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default ContactPage;
