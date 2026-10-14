function EditRequestPage() {
  return (
    <div className="edit-request-page">
      <header className="edit-request-topbar">
        <div className="edit-request-brand">ADMIN PANEL</div>

        <div className="edit-request-actions">
          <button type="button" className="edit-request-icon" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="edit-request-icon" aria-label="Settings">
            ⚙
          </button>
          <div className="edit-request-avatar" aria-label="User profile">
            A
          </div>
        </div>
      </header>

      <section className="edit-request-card">
        <div className="edit-request-toolbar">
          <h1>Pending Installment Edit Approvals</h1>

          <div className="edit-request-toolbar-actions">
            <div className="edit-request-select-wrap">
              <select defaultValue="pending">
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </div>

            <div className="edit-request-select-wrap small-wrap">
              <select defaultValue="all-bookings">
                <option value="all-bookings">All Bookings</option>
                <option value="booking-1">Booking 1</option>
              </select>
            </div>
          </div>
        </div>

        <div className="edit-request-table-wrap">
          <table className="edit-request-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Customer</th>
                <th>Installment</th>
                <th>Current</th>
                <th>Proposed</th>
                <th>Requested By</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>

          <div className="edit-request-empty-state">
            <div className="edit-request-empty-icon">🗂</div>
            <p>No pending edit requests right now.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default EditRequestPage
