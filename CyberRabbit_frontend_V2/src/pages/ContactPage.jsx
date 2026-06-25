import { useRef, useState } from 'react';

import GlassCard from '../components/GlassCard.jsx';
import { submitContactForm } from '../services/contactService.js';

const initialState = {
  name: '',
  email: '',
  subject: '',
  message: '',
  feedbackType: 'General Inquiry',
  company: ''
};

function ContactPage() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });
  const bannerRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      return 'Please fill in all required fields.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Enter a valid email address.';
    }
    if (form.message.trim().length < 20) {
      return 'Message should be at least 20 characters.';
    }
    return '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    /* Honeypot check */
    if (form.company) {
      setStatus({ loading: false, success: 'Message received.', error: '' });
      setForm(initialState);
      return;
    }

    const validationError = validate();
    if (validationError) {
      setStatus({ loading: false, success: '', error: validationError });
      return;
    }

    setStatus({ loading: true, success: '', error: '' });

    try {
      await submitContactForm(form);
      setStatus({
        loading: false,
        success: 'Message sent successfully. We\u2019ll get back to you shortly.',
        error: ''
      });
      setForm(initialState);

      /* Focus the success banner for accessibility */
      requestAnimationFrame(() => {
        bannerRef.current?.focus();
      });
    } catch (err) {
      setStatus({
        loading: false,
        success: '',
        error: err.message || 'Unable to send message right now.'
      });
    }
  };

  return (
    <section className="page contact-page">
      <div className="contact-container">

        <GlassCard>
          <div className="contact-header">
            <h1>Contact Sudarshan AI</h1>
            <p>Questions, feedback, or report a security concern.</p>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} noValidate>

            <label>
              Name
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Your full name"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Subject
              <input
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                placeholder="Brief summary of your inquiry"
                required
              />
            </label>

            <label>
              Feedback Type
              <select
                value={form.feedbackType}
                onChange={(e) => updateField('feedbackType', e.target.value)}
              >
                <option>General Inquiry</option>
                <option>Security Concern</option>
                <option>Bug Report</option>
                <option>Feature Request</option>
              </select>
            </label>

            <label>
              Message
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                placeholder="Describe your concern in detail..."
                required
              />
            </label>

            {/* Honeypot — hidden from humans */}
            <div className="honeypot" aria-hidden="true">
              <label>
                Company
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => updateField('company', e.target.value)}
                />
              </label>
            </div>

            {/* Feedback banners */}
            {status.error && (
              <div className="error-banner" role="alert">
                {status.error}
              </div>
            )}
            {status.success && (
              <div
                className="success-banner"
                role="status"
                ref={bannerRef}
                tabIndex={-1}
              >
                {status.success}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary contact-submit"
              disabled={status.loading}
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>

          </form>
        </GlassCard>

      </div>
    </section>
  );
}

export default ContactPage;