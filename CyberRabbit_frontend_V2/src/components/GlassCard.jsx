function GlassCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`glass-card ${className}`}>
      {(title || subtitle) && (
        <div className="glass-header">
          {title && <h2 className="glass-title">{title}</h2>}
          {subtitle && <p className="glass-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="glass-content">{children}</div>
    </div>
  );
}

export default GlassCard;