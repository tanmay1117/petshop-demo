'use client';
import './About.css';

export default function About() {
  const team = [
    { name: 'Dr. Priya Sharma', role: 'Founder & CEO', emoji: '👩‍⚕️' },
    { name: 'Rahul Mehta', role: 'Head of Operations', emoji: '👨‍💼' },
    { name: 'Ananya Kulkarni', role: 'Vet Consultant', emoji: '👩‍🔬' },
  ];

  const milestones = [
    { year: '2016', event: 'Founded in Mumbai' },
    { year: '2018', event: 'Launched online store' },
    { year: '2020', event: 'Reached 1,000+ customers' },
    { year: '2022', event: 'Expanded to 50+ brands' },
    { year: '2024', event: 'Launched ERP system' },
    { year: '2026', event: '5,000+ happy customers' },
  ];

  return (
    <div className="about-page">
      {/* Hero */}
      <section className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">
            About <span className="gradient-text">Petshop Demo</span>
          </h1>
          <p className="about-hero-subtitle">
            Since 2016, we&apos;ve been dedicated to providing premium products for your beloved pets.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container about-story">
        <div className="about-story-grid">
          <div className="about-story-content">
            <h2 className="section-title" style={{ textAlign: 'left' }}>Our Story</h2>
            <p>Established in 2016, <strong>Petshop Demo</strong> has grown from a humble local store into a thriving nationwide supplier of premium pet products.</p>
            <p>We operate as a manufacturer, wholesaler, and retailer, bringing the best to dogs, cats, birds, and fish across the country.</p>
            <p>Our mission is to ensure every pet lives a joyful, healthy, and stylish life. We carefully curate our inventory to include the most innovative pet carriers, durable cages, comfortable harnesses, and interactive toys.</p>
          </div>
          <div className="about-story-visual">
            <div className="about-visual-card">🐾</div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            {[
              { icon: '❤️', title: 'Pet Welfare', desc: 'Every product is tested for pet safety and comfort.' },
              { icon: '🌿', title: 'Sustainability', desc: 'We prioritize eco-friendly materials and packaging.' },
              { icon: '🤝', title: 'Trust', desc: 'Transparent pricing and genuine product guarantees.' },
              { icon: '🚀', title: 'Innovation', desc: 'Constantly updating our range with the latest pet tech.' },
            ].map((v, i) => (
              <div key={i} className="value-card">
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container about-timeline">
        <h2 className="section-title">Our Journey</h2>
        <div className="timeline">
          {milestones.map((m, i) => (
            <div key={i} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <span className="timeline-year">{m.year}</span>
                <span className="timeline-event">{m.event}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="container about-team">
        <h2 className="section-title">Meet Our Team</h2>
        <div className="team-grid">
          {team.map((t, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{t.emoji}</div>
              <h3>{t.name}</h3>
              <p>{t.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
