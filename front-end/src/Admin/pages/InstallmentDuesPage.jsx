function InstallmentDuesPage() {
  return (
    <div className="installment-dues-page">
      <header className="installment-dues-topbar">
        <div className="installment-dues-brand">ADMIN PANEL</div>

        <div className="installment-dues-actions">
          <button type="button" className="installment-dues-icon" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="installment-dues-icon" aria-label="Settings">
            ⚙
          </button>
          <div className="installment-dues-avatar" aria-label="User profile">
            A
          </div>
        </div>
      </header>

      <div className="installment-dues-header-block">
        <h1>Installment dues</h1>
        <p>Amount due today, coming soon, or past due — by schedule line across bookings.</p>
      </div>

      <div className="dues-summary-grid">
        <div className="dues-summary-card dues-danger">
          <span className="dues-label">Past due</span>
          <strong>₹96,050</strong>
        </div>

        <div className="dues-summary-card dues-warning">
          <span className="dues-label">Due today</span>
          <strong>₹0</strong>
        </div>

        <div className="dues-summary-card dues-success">
          <span className="dues-label">Due in 7 days</span>
          <strong>₹0</strong>
        </div>
      </div>

      <div className="dues-filter-bar">
        <div className="dues-field">
          <label>Project</label>
          <div className="dues-select-wrap">
            <select defaultValue="all">
              <option value="all">All projects</option>
              <option value="crown-city">The Crown City</option>
              <option value="green-park">Green Park</option>
            </select>
          </div>
        </div>

        <div className="dues-field dues-search-field">
          <label>Search</label>
          <input type="text" placeholder="Client, plot, project..." />
        </div>

        <button type="button" className="dues-refresh-btn">
          Refresh
        </button>
      </div>

      <div className="dues-tabs-bar">
        <button type="button" className="dues-tab active">
          All open <span>37</span>
        </button>
        <button type="button" className="dues-tab">
          Past due <span>2</span>
        </button>
        <button type="button" className="dues-tab">
          Due today <span>0</span>
        </button>
        <button type="button" className="dues-tab">
          Due in 7 days <span>0</span>
        </button>
      </div>

      <div className="dues-meta-row">
        <span>2 lines ₹ 30,90,895 remaining on this page</span>
      </div>

      <div className="dues-table-wrap">
        <table className="dues-table">
          <thead>
            <tr>
              <th>CLIENT</th>
              <th>PROJECT / PLOT</th>
              <th>STEP</th>
              <th>DUE DATE</th>
              <th>REMAINING</th>
              <th>STATUS</th>
              <th>BOOKING</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Mokshi jain
                <div className="dues-sub-id">1237454513</div>
              </td>
              <td>
                Plot p1
              </td>
              <td>24 EMI due</td>
              <td>03 Sept 2026</td>
              <td>₹ 1,84,700</td>
              <td>
                <span className="dues-status overdue">Overdue</span>
              </td>
              <td>
                <button type="button" className="dues-view-btn">
                  View
                </button>
              </td>
            </tr>

            <tr>
              <td>
                Mokshi jain
                <div className="dues-sub-id">1234578916</div>
              </td>
              <td>
                The Crown City
                <div className="dues-sub-plot">Plot p1</div>
              </td>
              <td>13 EMI due</td>
              <td>12 Sept 2026</td>
              <td>₹ 2,06,195</td>
              <td>
                <span className="dues-status overdue">Overdue</span>
              </td>
              <td>
                <button type="button" className="dues-view-btn">
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="dues-footer">
        <span>Page 1 of 1 (2 total)</span>

        <div className="dues-pagination">
          <button type="button" className="dues-pagination-btn">
            Previous
          </button>
          <button type="button" className="dues-pagination-btn">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default InstallmentDuesPage
