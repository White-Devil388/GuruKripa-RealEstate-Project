import { useState } from 'react'

function SubadminPage() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(true)
  const matches = 'Sub Admin sub.admin@mlm.com'.toLowerCase().includes(query.toLowerCase())

  return (
    <div className="sub-admin-page">
      <section className="sub-admin-card">
        <header className="sub-admin-header">
          <h1>Sub Admin Management</h1>
          <button type="button" className="add-sub-admin"><span>+</span> Add Sub Admin</button>
        </header>

        <div className="sub-admin-search-row">
          <label className="sub-admin-search">
            <span aria-hidden="true">⌕</span>
            <input type="search" placeholder="Search by name or email..." value={query} onChange={(event) => setQuery(event.target.value)} />
          </label>
        </div>

        <div className="table-wrap">
          <table className="sub-admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>{matches ? <tr><td>Sub Admin</td><td>sub.admin@mlm.com</td><td>-</td><td><span className={active ? 'sub-active-badge' : 'sub-inactive-badge'}>{active ? 'Active' : 'Inactive'}</span></td><td><div className="sub-admin-actions"><button type="button" className="edit-sub-admin">✎ Edit</button><button type="button" className="deactivate-sub-admin" onClick={() => setActive((value) => !value)}>{active ? '◉ Deactivate' : '◉ Activate'}</button></div></td></tr> : <tr><td colSpan="5" className="sub-admin-empty">No sub admins found.</td></tr>}</tbody>
          </table>
        </div>

        <footer className="sub-admin-pagination"><span>Page 1 of 1 ({matches ? 1 : 0} total)</span><div><button type="button" disabled>Previous</button><button type="button" disabled>Next</button></div></footer>
      </section>
    </div>
  )
}

export default SubadminPage
