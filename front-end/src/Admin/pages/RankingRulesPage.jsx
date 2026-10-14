import { useEffect, useState } from 'react'
import { createAdminResource, listAdminResource } from '../../services/api'

function RankingRulesPage() {
  const [project, setProject] = useState('The Crown City')
  const [plot, setPlot] = useState('— any plot —')
  const [date, setDate] = useState('')
  const [rules, setRules] = useState([])
  const [status, setStatus] = useState('Draft')
  const [form, setForm] = useState({ name: '', rate: '', cap: '', conditions: [] })
  useEffect(() => { listAdminResource('rules').then(setRules).catch(() => {}) }, [])

  const updateForm = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const toggleCondition = (event) => {
    const { value, checked } = event.target
    setForm((current) => ({ ...current, conditions: checked ? [...current.conditions, value] : current.conditions.filter((condition) => condition !== value) }))
  }

  const createRule = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.rate.trim()) return
    try { const rule = await createAdminResource('rules', { ...form, project, status }); setRules((current) => [...current, rule]); setForm({ name: '', rate: '', cap: '', conditions: [] }) } catch { /* keep the form values for retry */ }
  }

  return (
    <div className="ranking-rules-page">
      <section className="pricing-filter-card">
        <div className="pricing-filter-row pricing-project-row">
          <label>Project<select value={project} onChange={(event) => setProject(event.target.value)}><option>The Crown City</option><option>Green Valley</option></select></label>
          <button type="button" className="check-price-button">▣ &nbsp;Check price</button>
        </div>
        <div className="pricing-filter-row pricing-secondary-row">
          <label>Test plot (optional)<select value={plot} onChange={(event) => setPlot(event.target.value)}><option>— any plot —</option><option>A-101</option><option>B-204</option></select></label>
          <label>Test date (optional)<input type="date" placeholder="dd-mm-yyyy" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        </div>
      </section>

      <section className="rules-list-card">
        <header>Rules ({rules.length})</header>
        {rules.length === 0 ? <p className="rules-empty-state">No pricing rules for this project yet.</p> : <div className="table-wrap"><table className="rules-table"><thead><tr><th>Rule</th><th>Rate</th><th>Owner cap</th><th>Status</th></tr></thead><tbody>{rules.map((rule) => <tr key={`${rule.name}-${rule.rate}`}><td>{rule.name}</td><td>₹{rule.rate}/sq ft</td><td>₹{rule.cap || 0}</td><td>{rule.status}</td></tr>)}</tbody></table></div>}
      </section>

      <section className="create-rule-card">
        <header><span aria-hidden="true">⊕</span> Create rule</header>
        <form onSubmit={createRule}>
          <div className="rule-form-grid">
            <label>Rule name *<input name="name" placeholder="e.g. Festive Offer 2027" value={form.name} onChange={updateForm} required /></label>
            <label>Rule rate (₹/sq ft)<input name="rate" type="number" min="0" placeholder="e.g. 2600" value={form.rate} onChange={updateForm} required /></label>
          </div>
          <fieldset className="rule-conditions"><legend>Conditions (optional — all enabled must match)</legend><label><input type="checkbox" value="date-range" checked={form.conditions.includes('date-range')} onChange={toggleCondition} /> Apply to date range</label><label><input type="checkbox" value="group-owner" checked={form.conditions.includes('group-owner')} onChange={toggleCondition} /> Apply to selected plots (per-group owner min)</label><label><input type="checkbox" value="after-plot" checked={form.conditions.includes('after-plot')} onChange={toggleCondition} /> Apply after plot added</label><label><input type="checkbox" value="first-n" checked={form.conditions.includes('first-n')} onChange={toggleCondition} /> Apply to first N plots/units (bar by-bird)</label></fieldset>
          <div className="rule-form-grid">
            <label>Owner minimum cap (₹/sq ft) *<input name="cap" type="number" min="0" placeholder="e.g. 1800" value={form.cap} onChange={updateForm} required /></label>
            <label>Pool (rate - owner min)<input value={form.rate && form.cap ? `${Math.max(0, Number(form.rate) - Number(form.cap))}/sq ft` : '—/sq ft'} readOnly /></label>
          </div>
          <fieldset className="rule-status"><legend>Status</legend><div><button type="button" className={status === 'Draft' ? 'selected' : ''} onClick={() => setStatus('Draft')}>Draft</button><button type="button" className={status === 'Active' ? 'selected active' : ''} onClick={() => setStatus('Active')}>Active</button></div></fieldset>
          <button type="submit" className="create-rule-button">Create rule</button>
        </form>
      </section>
    </div>
  )
}

export default RankingRulesPage
