import { useMemo, useState } from 'react'

const Icons = {
  WhatsApp: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  Search: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Send: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Zap: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>,
  Image: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>,
  Mic: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>,
  Palette: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>,
  MessageCircle: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>,
  Tv: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg>,
  ShoppingCart: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>,
  GraduationCap: <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
}

const tools = [
  { name: 'WhatsApp Automation', description: 'Auto-reply, bulk WhatsApp messaging, and smart conversation flows.', icon: Icons.WhatsApp, tone: 'green' },
  { name: 'Lead Scraping', description: 'Automatically scrape targeted leads from the web and import them to CRM.', icon: Icons.Search, tone: 'blue' },
  { name: 'Bulk Messaging', description: 'Send personalized messages to thousands of contacts in one click.', icon: Icons.Send, tone: 'purple' },
  { name: 'Template Generator', description: 'Generate AI-powered professional email templates in seconds.', icon: Icons.Zap, tone: 'amber' },
  { name: 'AI Post Generator', description: 'Generate engaging social media posts and creatives with AI.', icon: Icons.Image, tone: 'pink' },
  { name: 'Voice Agent', description: 'AI voice agent that automatically calls and qualifies leads.', icon: Icons.Mic, tone: 'teal' },
  { name: 'Poster Creation AI', description: 'Create campaign and offer posters with AI in seconds.', icon: Icons.Palette, tone: 'violet' },
  { name: 'Social Media Reply Automation', description: 'Set up auto replies for comments and messages.', icon: Icons.MessageCircle, tone: 'blue' },
  { name: 'Sales Pitch Creation AI', description: 'Create personalized sales pitches for every property lead.', icon: Icons.Tv, tone: 'red' },
  { name: 'Order & Sales CRM', description: 'Order tracking, complaint management and customer data handling.', icon: Icons.ShoppingCart, tone: 'teal' },
  { name: 'Sales Training AI Agent', description: 'AI-based sales training with voice interaction.', icon: Icons.GraduationCap, tone: 'violet' },
]

function AIToolsPage() {
  const [query, setQuery] = useState('')
  const [selectedTool, setSelectedTool] = useState(null)
  const visibleTools = useMemo(() => tools.filter((tool) => !query.trim() || `${tool.name} ${tool.description}`.toLowerCase().includes(query.trim().toLowerCase())), [query])

  return (
    <section className="crm-ai-tools-page">
      <div className="crm-ai-tools-heading"><div><span className="crm-section-kicker">CRM Workspace / Tools</span><h2>AI Tools</h2><p>Automate lead generation, communication and sales workflows.</p></div><div className="crm-ai-tools-count">{visibleTools.length} tools available</div></div>
      <div className="crm-ai-tools-toolbar"><label><span>Search tools</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search AI tools..." /></label><span className="crm-ai-tools-live"><i /> All tools active</span></div>
      <div className="crm-ai-tools-grid">{visibleTools.map((tool) => <article className={`crm-ai-tool-card ${tool.tone}`} key={tool.name}><div className="crm-ai-tool-top"><span className="crm-ai-tool-icon">{tool.icon}</span><span className="crm-ai-tool-status"><i /> ACTIVE</span></div><h3>{tool.name}</h3><p>{tool.description}</p><button type="button" className="crm-ai-tool-open" onClick={() => setSelectedTool(tool)}>Available <span>Click to open <b>→</b></span></button></article>)}</div>
      {!visibleTools.length && <div className="crm-empty-state">No AI tools match your search.</div>}
      {selectedTool && <div className="crm-ai-tool-modal-backdrop" role="presentation" onClick={() => setSelectedTool(null)}><div className="crm-ai-tool-modal" role="dialog" aria-modal="true" aria-labelledby="ai-tool-title" onClick={(event) => event.stopPropagation()}><button type="button" className="crm-ai-modal-close" onClick={() => setSelectedTool(null)} aria-label="Close">×</button><span className={`crm-ai-tool-icon ${selectedTool.tone}`}>{selectedTool.icon}</span><h3 id="ai-tool-title">{selectedTool.name}</h3><p>{selectedTool.description}</p><button type="button" className="crm-create-button" onClick={() => setSelectedTool(null)}>Open tool</button></div></div>}
    </section>
  )
}

export default AIToolsPage
