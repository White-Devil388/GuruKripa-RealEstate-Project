function InstallmentSchedulesPage() {
  return (
    <div className="installment-schedules-page">
      <header className="installment-schedules-topbar">
        <div className="installment-schedules-brand">ADMIN PANEL</div>

        <div className="installment-schedules-actions">
          <button type="button" className="installment-schedules-icon" aria-label="Toggle theme">
            ☾
          </button>
          <button type="button" className="installment-schedules-icon" aria-label="Settings">
            ⚙
          </button>
          <div className="installment-schedules-avatar" aria-label="User profile">
            A
          </div>
        </div>
      </header>

      <div className="installment-schedules-card">
        <div className="installment-schedules-header">
          <h1>Payment Plans</h1>
        </div>

        <div className="installment-schedules-divider" />

        <div className="installment-schedules-form">
          <label htmlFor="project-select" className="installment-schedules-label">
            Project
          </label>

          <div className="installment-schedules-select-wrap">
            <select id="project-select" defaultValue="">
              <option value="" disabled>
                Select a project
              </option>
              <option value="crown-city">The Crown City</option>
              <option value="green-park">Green Park</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstallmentSchedulesPage
