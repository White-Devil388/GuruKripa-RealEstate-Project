function LeadEnginePage() {
  return (
    <div className="lead-engine-page">
      <header className="lead-engine-header">
        <div className="lead-engine-brand">ADMIN PANEL</div>

        <div className="lead-engine-header-actions">
          <button type="button" className="lead-icon-button" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="lead-icon-button" aria-label="Settings">
            ⚙
          </button>
          <div className="lead-avatar" aria-label="User profile">A</div>
        </div>
      </header>

      <div className="lead-engine-toolbar">
        <h1>Lead Engine</h1>

        <button type="button" className="add-lead-button">
          <span className="add-lead-icon">＋</span>
          Add Lead
        </button>
      </div>

      <div className="lead-engine-filter-bar">
        <div className="lead-search-field">
          <label htmlFor="lead-search" className="lead-field-label">
            Search
          </label>
          <input
            id="lead-search"
            type="text"
            placeholder="Search by name or plot number"
          />
        </div>

        <div className="lead-status-field">
          <label htmlFor="lead-status" className="lead-field-label">
            Lead Status
          </label>
          <div className="lead-select-wrap">
            <select id="lead-status" defaultValue="all">
              <option value="all">All Leads</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="lead-table-wrapper">
        <table className="lead-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Mobile</th>
              <th>Plot No</th>
              <th>Project</th>
              <th>Location</th>
              <th>Budget</th>
              <th>Source</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
        </table>

        <div className="lead-empty-state">No leads found.</div>
      </div>

      <div className="lead-engine-footer">
        <span>Page 1 of 1 (0 total)</span>

        <div className="lead-pagination">
          <button type="button" className="lead-pagination-button">
            Previous
          </button>
          <button type="button" className="lead-pagination-button">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeadEnginePage
