function PlaceholderPage({ title }) {
  return (
    <div className="placeholder-page">
      <div className="page-header">
        <span className="eyebrow">Section</span>
        <h1>{title}</h1>
      </div>
      <div className="page-card">
        <p>{title}</p>
      </div>
    </div>
  )
}

export default PlaceholderPage
