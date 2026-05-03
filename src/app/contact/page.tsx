'use client';
import { useState } from 'react';
import './Contact.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'contact-page' }),
      });
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Failed to submit:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page container">
      <div className="contact-header">
        <h1 className="section-title">Get in Touch</h1>
        <p className="section-subtitle">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
      </div>

      <div className="contact-grid">
        <div className="contact-info-cards">
          {[
            { icon: '📍', title: 'Visit Us', info: 'Mankhurd, Mumbai,\nMaharashtra 400088, India' },
            { icon: '📞', title: 'Call Us', info: '+91 99999 99999\nMon-Sat, 10AM - 8PM' },
            { icon: '✉️', title: 'Email Us', info: 'contact@petshopdemo.com\nsupport@petshopdemo.com' },
            { icon: '💬', title: 'WhatsApp', info: '+91 99999 99999\nInstant Replies' },
          ].map((item, i) => (
            <div key={i} className="contact-info-card">
              <span className="contact-info-icon">{item.icon}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.info}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="contact-form-card">
          {submitted ? (
            <div className="contact-success">
              <span className="contact-success-icon">✅</span>
              <h2>Message Sent!</h2>
              <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <button className="btn btn-primary" onClick={() => setSubmitted(false)}>Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2>Send a Message</h2>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Tell us how we can help..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                {submitting ? 'Sending...' : '📩 Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map embed placeholder */}
      <div className="contact-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.498898765432!2d72.92!3d19.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDAzJzAwLjAiTiA3MsKwNTUnMTIuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 'none', borderRadius: 'var(--radius-xl)', opacity: 0.8 }}
          loading="lazy"
          title="Petshop Demo Location"
        />
      </div>
    </div>
  );
}
