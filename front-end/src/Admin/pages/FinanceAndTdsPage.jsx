import { useState } from 'react'

function FinanceAndTdsPage() {
  const [period, setPeriod] = useState('This month')

  return (
    <div className="finance-tds-page">
      <section className="finance-filter-card">
        <label>Period<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>This month</option><option>Last month</option><option>This quarter</option><option>This year</option></select></label>
        <button type="button" className="finance-refresh-button">⟳ Refresh</button>
      </section>

      <section className="finance-summary-grid">
        <article><span>Current TDS rate</span><strong>2%</strong><small>Edit in Settings</small></article>
        <article><span>▣ Gross withdrawals</span><strong>₹0</strong><small>0 entries</small></article>
        <article className="tds-card"><span>TDS deducted</span><strong>₹0</strong></article>
        <article className="payout-card"><span>▣ Net paid out</span><strong>₹0</strong></article>
      </section>

      <section className="tds-ledger-card">
        <header>▣ TDS deduction ledger</header>
        <p>No TDS deductions in this period.</p>
      </section>
    </div>
  )
}

export default FinanceAndTdsPage
