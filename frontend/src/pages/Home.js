import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  const features = [
    { icon: '📅', title: 'Instant Booking', desc: 'Reserve your table in seconds — pick your date, time, and party size.' },
    { icon: '🪑', title: 'Real-Time Availability', desc: 'See which tables are available in real time. No double bookings.' },
    { icon: '🔐', title: 'Secure & Private', desc: 'JWT-secured accounts keep your reservation data safe.' },
    { icon: '📋', title: 'Manage Reservations', desc: 'View, modify or cancel bookings anytime from your dashboard.' },
  ];

  return (
    <>
      <section className="hero-section">
        <h1>Reserve Your<br /><span>Perfect Table</span></h1>
        <p>Experience seamless online table reservations. Book your favourite spot in moments.</p>
        <Link to={user ? '/book' : '/register'} className="btn btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
          {user ? 'Book a Table' : 'Get Started'}
        </Link>
      </section>

      <div className="page">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 8 }}>Why LaTable?</h2>
          <p style={{ color: '#888', fontSize: 15 }}>Everything you need for a perfect dining experience.</p>
        </div>
        <div className="card-grid">
          {features.map(f => (
            <div className="card" key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 28 }}>{f.icon}</span>
              <div>
                <div style={{ fontWeight: 500, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: '#777', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
