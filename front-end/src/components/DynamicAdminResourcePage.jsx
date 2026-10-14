import { useEffect, useMemo, useState } from 'react'
import { createAdminResource, deleteAdminResource, listAdminResource, updateAdminResource } from '../services/api'

const resourceConfig = {
  bookings: { title: 'Booking Management', fields: ['customer', 'project', 'plot', 'amount', 'status'] },
  'payment-plans': { title: 'Payment Plans', fields: ['project', 'name', 'months', 'amount'] },
  'edit-requests': { title: 'Installment Edit Requests', fields: ['booking', 'requestedBy', 'currentAmount', 'proposedAmount', 'status'] },
  'installment-dues': { title: 'Installment Dues', fields: ['customer', 'project', 'dueDate', 'amount', 'status'] },
  'installments-emi': { title: 'Installments (EMI)', fields: ['booking', 'customer', 'dueDate', 'amount', 'status'] },
  reports: { title: 'Reports', fields: ['name', 'type', 'period', 'status'] },
  'rank-levels': { title: 'Rank Levels', fields: ['name', 'onlinePoints', 'cashPoints', 'minTeamSize'] },
  'full-tree': { title: 'Full Company Tree', fields: ['name', 'rank', 'level', 'status'] },
  'referral-links': { title: 'Referral Links', fields: ['rank', 'url', 'agents', 'onlineRate', 'cashRate'] },
  'subadmins': { title: 'Sub Admin Management', fields: ['name', 'email', 'phone', 'status'] },
  'audit-logs': { title: 'Audit Logs', fields: ['user', 'action', 'description', 'ip'] },
  'account-ledger': { title: 'Account Ledger', fields: ['type', 'description', 'amount', 'status'] },
  'finance-tds': { title: 'Finance and TDS', fields: ['period', 'gross', 'tds', 'net', 'status'] },
}

function DynamicAdminResourcePage({ resource }) {
  const config = resourceConfig[resource] || { title: resource, fields: ['name', 'status'] }
  const [items, setItems] = useState([])
  const [form, setForm] = useState({})
  const [query, setQuery] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => { listAdminResource(resource).then(setItems).catch((error) => setMessage(error.message)) }, [resource])
  const visibleItems = useMemo(() => items.filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase())), [items, query])

  function updateField(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })) }
  async function save(event) {
    event.preventDefault()
    try { const item = await createAdminResource(resource, form); setItems((current) => [item, ...current]); setForm({}); setMessage('Record created successfully.') } catch (error) { setMessage(error.message) }
  }
  async function toggleStatus(item) {
    const status = item.status === 'Active' ? 'Inactive' : 'Active'
    const updated = await updateAdminResource(resource, item.id, { status })
    setItems((current) => current.map((entry) => entry.id === item.id ? updated : entry))
  }
  async function remove(item) {
    await deleteAdminResource(resource, item.id)
    setItems((current) => current.filter((entry) => entry.id !== item.id))
  }

  return <section className="dynamic-admin-page"><header><span className="eyebrow">Admin Panel</span><h1>{config.title}</h1><p>Manage records with live create, update, search, and delete actions.</p></header><div className="dynamic-admin-toolbar"><input type="search" placeholder="Search records..." value={query} onChange={(event) => setQuery(event.target.value)} /></div><form className="dynamic-admin-form" onSubmit={save}>{config.fields.map((field) => <label key={field}>{field.replace(/[A-Z]/g, (letter) => ` ${letter}`).replace(/^./, (letter) => letter.toUpperCase())}<input name={field} value={form[field] || ''} onChange={updateField} required={field === config.fields[0]} /></label>)}<button type="submit">Add Record</button></form>{message && <p role="status">{message}</p>}<div className="table-wrap"><table><thead><tr>{config.fields.map((field) => <th key={field}>{field}</th>)}<th>Actions</th></tr></thead><tbody>{visibleItems.map((item) => <tr key={item.id}>{config.fields.map((field) => <td key={field}>{item[field] || '-'}</td>)}<td><button type="button" onClick={() => toggleStatus(item)}>Toggle</button><button type="button" onClick={() => remove(item)}>Delete</button></td></tr>)}{!visibleItems.length && <tr><td colSpan={config.fields.length + 1}>No records found.</td></tr>}</tbody></table></div></section>
}

export default DynamicAdminResourcePage