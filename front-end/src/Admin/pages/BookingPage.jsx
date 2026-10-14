function BookingPage() {
  return (
    <div className="booking-page-shell">
      <header className="booking-top-header">
        <div className="booking-brand">ADMIN PANEL</div>

        <div className="booking-header-icons">
          <button type="button" className="header-icon" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="header-icon" aria-label="Settings">
            ⚙
          </button>
          <div className="header-avatar" aria-label="User profile">
            A
          </div>
        </div>
      </header>

      <section className="booking-card">
        <div className="booking-toolbar">
          <h1>Booking Management</h1>

          <div className="booking-toolbar-actions">
            <button type="button" className="booking-primary-btn">
              <span className="booking-plus">◉</span>
              Create Booking
            </button>
            <button type="button" className="booking-secondary-btn">
              Pending Approval
            </button>
          </div>
        </div>

        <div className="booking-tabs">
          <button type="button" className="booking-tab active">
            All Bookings
          </button>
          <button type="button" className="booking-tab">
            Pending Approval
          </button>
          <button type="button" className="booking-tab tab-count">
            Active
          </button>
          <button type="button" className="booking-tab">
            Completed
          </button>
        </div>

        <div className="booking-search-panel">
          <div className="booking-search-row">
            <label htmlFor="booking-search" className="booking-label">
              Search
            </label>

            <div className="booking-search-box">
              <span className="search-icon">⌕</span>
              <input
                id="booking-search"
                type="text"
                placeholder="Booking #, customer, agent..."
              />
            </div>
          </div>
        </div>

        <div className="booking-filter-grid">
          <div className="booking-field">
            <label>Project</label>
            <div className="custom-select">
              <select defaultValue="all">
                <option value="all">All Projects</option>
                <option value="the-crown-city">The Crown City</option>
              </select>
            </div>
          </div>

          <div className="booking-field">
            <label>Status</label>
            <div className="custom-select">
              <select defaultValue="all">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="booking-field">
            <label>Approval</label>
            <div className="custom-select">
              <select defaultValue="all">
                <option value="all">All Approval</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="booking-field">
            <label>Agent</label>
            <div className="custom-select">
              <select defaultValue="all">
                <option value="all">All Agents</option>
                <option value="agent-1">Agent 1</option>
              </select>
            </div>
          </div>

          <div className="booking-field booking-date-field">
            <label>Date Range</label>
            <div className="booking-date-inputs">
              <div className="date-input-wrap">
                <input type="text" placeholder="dd-mm-yyyy" />
              </div>
              <span className="date-range-separator">to</span>
              <div className="date-input-wrap">
                <input type="text" placeholder="dd-mm-yyyy" />
              </div>
            </div>
          </div>
        </div>

        <div className="booking-table-wrap">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Booking #</th>
                <th>Customer</th>
                <th>Plot</th>
                <th>Project</th>
                <th>Agent</th>
                <th>Rank @ Booking</th>
                <th>Total Amount</th>
                <th>EMI Amount</th>
                <th>Mode</th>
                <th>Status</th>
                <th>Approval</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="booking-id orange">BK-0002</td>
                <td>Mokshijain</td>
                <td>p1</td>
                <td>The Crown City</td>
                <td>Agent</td>
                <td className="rank-chip">B.EX</td>
                <td>₹ 2,20,500.00</td>
                <td>₹ 2,205.00 x 12</td>
                <td>CASH</td>
                <td>
                  <span className="status-chip active">Active</span>
                </td>
                <td>
                  <span className="approval-chip approved">Approved</span>
                </td>
                <td>-</td>
                <td>12 Sept 2026</td>
                <td>
                  <button type="button" className="view-btn">
                    View
                  </button>
                </td>
              </tr>

              <tr>
                <td className="booking-id orange">BK-0001</td>
                <td>Mokshijain</td>
                <td>p1</td>
                <td>...</td>
                <td>N/A</td>
                <td>—</td>
                <td>₹ 2,10,000.00</td>
                <td>₹ 2,100.00 x 24</td>
                <td>CASH</td>
                <td>
                  <span className="status-chip active">Active</span>
                </td>
                <td>
                  <span className="approval-chip approved">Approved</span>
                </td>
                <td>-</td>
                <td>03 Sept 2026</td>
                <td>
                  <button type="button" className="view-btn">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="booking-footer">
          <span>Page 1 of 1 (2 total)</span>

          <div className="booking-pagination">
            <button type="button" className="pagination-btn">
              Previous
            </button>
            <button type="button" className="pagination-btn">
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BookingPage
