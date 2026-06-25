import React, { useState, useEffect, useRef } from 'react';
import { useWelcomeAudio } from '../hooks/useWelcomeAudio.js';

const STORAGE_KEY = 'sudarshan_awareness_v1';
const COUNTDOWN_SECONDS = 10;

function AwarenessGateway() {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [isChecked, setIsChecked] = useState(false);
  const { playWelcomeAudio } = useWelcomeAudio(0.3);
  
  const modalRef = useRef(null);
  const checkboxRef = useRef(null);

  useEffect(() => {
    // Check persistence
    const hasAcknowledged = localStorage.getItem(STORAGE_KEY) === 'acknowledged';
    if (!hasAcknowledged) {
      setIsVisible(true);
      // Lock background scrolling
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Focus trap setup
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, countdown]);

  const handleAcknowledge = () => {
    if (countdown > 0 || !isChecked) return;
    
    playWelcomeAudio();
    localStorage.setItem(STORAGE_KEY, 'acknowledged');
    setIsVisible(false);
    document.body.style.overflow = 'auto';
  };

  if (!isVisible) return null;

  return (
    <div className="gateway-overlay" role="dialog" aria-modal="true" aria-labelledby="gateway-title" ref={modalRef}>
      <div className="gateway-modal glass-card">
        <div className="gateway-header">
          <div className="gateway-icon">🛡️</div>
          <h2 id="gateway-title">Cybersecurity Awareness Gateway</h2>
        </div>

        <div className="gateway-content">
          <section className="gateway-section">
            <h3>Platform Purpose</h3>
            <p>Sudarshan AI is an educational cybersecurity assistance platform designed to help you analyze and respond to cyber threats. It does not replace professional incident response, law enforcement, or legal counsel.</p>
          </section>

          <section className="gateway-section">
            <h3>Privacy & Data Security</h3>
            <p>Conversation context is temporarily processed to provide accurate guidance. To ensure your safety, <strong>never share sensitive credentials</strong> such as:</p>
            <ul className="gateway-list">
              <li>Passwords or PINs</li>
              <li>One-Time Passwords (OTPs)</li>
              <li>CVVs or Authentication Tokens</li>
            </ul>
          </section>

          <section className="gateway-section">
            <h3>Best Practices</h3>
            <p>For the best assistance, clearly describe the incident timeline, actions you have already taken, and preserve evidence locally (screenshots, emails, URLs).</p>
          </section>
        </div>

        <div className="gateway-footer">
          <label className={`gateway-checkbox-label ${countdown > 0 ? 'disabled' : ''}`}>
            <input 
              type="checkbox" 
              className="gateway-checkbox"
              ref={checkboxRef}
              checked={isChecked}
              disabled={countdown > 0}
              onChange={(e) => setIsChecked(e.target.checked)}
              aria-describedby="countdown-status"
            />
            <span className="gateway-checkbox-text">
              I have read, understood, and agree to the responsible usage guidelines.
            </span>
          </label>

          <div aria-live="polite" className="sr-only" id="countdown-status">
            {countdown > 0 ? `Please read the information. You can acknowledge in ${countdown} seconds.` : 'You can now acknowledge the guidelines.'}
          </div>

          <button 
            className="gateway-continue-btn"
            disabled={countdown > 0 || !isChecked}
            onClick={handleAcknowledge}
          >
            {countdown > 0 ? `Continue (${countdown}s)` : 'Acknowledge & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AwarenessGateway;
