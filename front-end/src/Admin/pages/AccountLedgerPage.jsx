import { useState, useMemo, useCallback } from 'react'
import { useDebounce } from '../../hooks'

function AccountLedgerPage() {
  const [period, setPeriod] = useState('This month')
  const [project, setProject] = useState('All projects')
  const [activeTab, setActiveTab] = useState('Overview')
  
  const debouncedPeriod = useDebounce(period, 300)
  const debouncedProject = useDebounce(project, 300)

  const tabs = useMemo(() => ['Overview', 'Collections', 'DP/EMIs', 'Receivables', 'Owner TDS'], [])
  
  const handleTabClick = useCallback((tab) => {
    setActiveTab(tab)
  }, [])

  return (
    <div className="account-ledger-page">
      <section className="ledger-filter-card">
        <label>Period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>This month</option><option>Last month</option><option>This quarter</option><option>This year</option></select></label>
        <label>Project<select value={project} onChange={(event) => setProject(event.target.value)}><option>All projects</option><option>The Crown City</option><option>Green Valley</option></select></label>
        <button type="button" className="ledger-refresh-button" onClick={() => handleTabClick('Overview')}>⟳ Refresh</button>
      </section>

      <nav className="ledger-tabs" aria-label="Account ledger views">
        {tabs.map((tab) => <button type="button" className={activeTab === tab ? 'active' : ''} onClick={() => handleTabClick(tab)} key={tab}>{tab === 'Overview' ? '◈ ' : ''}{tab}</button>)}
      </nav>

      <section className="ledger-summary-grid">
        <article><span>◉ Collected</span><strong>₹39.51 K</strong><small>6 transactions · This period</small></article>
        <article><span>▣ Outstanding</span><strong>₹3.68 L</strong><small>of ₹4.30 L plot value</small></article>
        <article><span>◔ Collection rate</span><strong>14.5%</strong><small>₹62.0 K received</small></article>
      </section>

      <section className="ledger-panels">
        <article className="ledger-panel">
          <header>◔ Collections breakdown</header>
          <div className="ledger-rows"><div><span>Cash</span><strong>₹39,500</strong></div><div><span>Bank (UPI / NEFT / card)</span><strong>₹0</strong></div><div><span>Cheque</span><strong>₹0</strong></div><div className="total"><span>Total collected</span><strong>₹39,505</strong></div></div>
        </article>
        <article className="ledger-panel">
          <header>▣ Receivables &amp; payout</header>
          <div className="receivables-content"><div className="progress-label"><span>Collection progress</span><strong>14.5%</strong></div><div className="ledger-progress"><span /></div><div className="receivable-line"><span>Plot value (all projects)</span><strong>₹4,30,500</strong></div><div className="receivable-line"><span>Received to date</span><strong>₹62,605</strong></div></div>
        </article>
      </section>
    </div>
  )
}

export default AccountLedgerPage
