import React, { useState } from 'react';

function InvestigationPanel({ incidentData }) {
  const [expandedSection, setExpandedSection] = useState(null);

  if (!incidentData || !incidentData.classified) return null;

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getSeverityColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'var(--danger)';
      case 'high': return 'var(--color-coral)';
      case 'medium': return 'var(--trust-gold)';
      case 'low': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return 'var(--color-coral)';
      case 'monitoring': return 'var(--trust-gold)';
      case 'contained': return 'var(--color-purple)';
      case 'escalated': return 'var(--danger)';
      case 'resolved': return 'var(--success)';
      default: return 'var(--text-secondary)';
    }
  };

  const { category, severity, risk, status, confidence, immediateActions, evidenceChecklist, reportingGuidance, relevantLaws } = incidentData;

  return (
    <div className="investigation-panel glass-card">
      <div className="panel-header">
        <div className="panel-title-row">
          <h3 className="panel-title">Active Investigation</h3>
          <span className="status-badge" style={{ borderColor: getStatusColor(status), color: getStatusColor(status) }}>
            {status}
          </span>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-label">Category</span>
            <span className="metric-value">{category}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Severity</span>
            <span className="metric-value" style={{ color: getSeverityColor(severity) }}>{severity}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Risk</span>
            <span className="metric-value" style={{ color: getSeverityColor(risk) }}>{risk}</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Confidence</span>
            <span className="metric-value">{confidence}%</span>
          </div>
        </div>
      </div>

      <div className="panel-drawers">
        <Drawer 
          title="Immediate Actions" 
          isOpen={expandedSection === 'actions'} 
          onToggle={() => toggleSection('actions')}
        >
          <ul className="drawer-list">
            {immediateActions?.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
        </Drawer>

        <Drawer 
          title="Evidence Preservation" 
          isOpen={expandedSection === 'evidence'} 
          onToggle={() => toggleSection('evidence')}
        >
          <ul className="drawer-list">
            {evidenceChecklist?.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </Drawer>

        <Drawer 
          title="Reporting Guidance" 
          isOpen={expandedSection === 'reporting'} 
          onToggle={() => toggleSection('reporting')}
        >
          <div className="reporting-grid">
            {reportingGuidance?.map((guidance, i) => (
              <div key={i} className="reporting-card">
                <strong>{guidance.portal}</strong>
                <span className="urgency-pill" data-urgency={guidance.urgency?.toLowerCase()}>{guidance.urgency}</span>
                <p>{guidance.action}</p>
              </div>
            ))}
          </div>
        </Drawer>

        <Drawer 
          title="Relevant Laws (Educational)" 
          isOpen={expandedSection === 'laws'} 
          onToggle={() => toggleSection('laws')}
        >
          <div className="laws-list">
            {relevantLaws?.map((law, i) => (
              <div key={i} className="law-item">
                <strong>{law.law}</strong>
                <p>{law.description}</p>
              </div>
            ))}
          </div>
        </Drawer>
      </div>
    </div>
  );
}

function Drawer({ title, isOpen, onToggle, children }) {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <button className="drawer-header" onClick={onToggle}>
        <span>{title}</span>
        <svg className={`drawer-icon ${isOpen ? 'rotated' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && <div className="drawer-content">{children}</div>}
    </div>
  );
}

export default InvestigationPanel;
