import { useState } from 'react';
import { tableAPI, reservationAPI } from '../services/api';
import toast from 'react-hot-toast';

const TIME_SLOTS = [
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00',
];

export default function BookTable() {
  const today = new Date().toISOString().split('T')[0];

  const [search, setSearch]       = useState({ date: today, startTime: '19:00', guests: 2 });
  const [tables, setTables]       = useState([]);
  const [selected, setSelected]   = useState(null);
  const [special, setSpecial]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [searching, setSearching] = useState(false);
  const [done, setDone]           = useState(false);

  const endTime = (start) => {
    const [h, m] = start.split(':').map(Number);
    const end = new Date(0, 0, 0, h + 2, m);
    return `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSelected(null);
    try {
      const { data } = await tableAPI.getAvailable({
        date: search.date,
        startTime: search.startTime + ':00',
        endTime:   endTime(search.startTime) + ':00',
        guests:    search.guests,
      });
      setTables(data);
      if (data.length === 0) toast('No tables available for this slot.', { icon: '🪑' });
    } catch {
      toast.error('Failed to fetch tables.');
    } finally {
      setSearching(false);
    }
  };

  const handleBook = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      await reservationAPI.create({
        tableId: selected.id,
        reservationDate: search.date,
        startTime: search.startTime + ':00',
        endTime:   endTime(search.startTime) + ':00',
        guestCount: search.guests,
        specialRequests: special,
      });
      setDone(true);
      toast.success('Reservation confirmed!');
    } catch {
      toast.error('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="page" style={{ maxWidth: 520, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
      <h2 className="page-title">You're booked!</h2>
      <p className="page-sub">Your table has been reserved. See you soon!</p>
      <div className="card" style={{ textAlign: 'left', marginBottom: 20 }}>
        <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
          <div><strong>Table:</strong> {selected.tableNumber} ({selected.location})</div>
          <div><strong>Date:</strong> {search.date}</div>
          <div><strong>Time:</strong> {search.startTime} – {endTime(search.startTime)}</div>
          <div><strong>Guests:</strong> {search.guests}</div>
        </div>
      </div>
      <button className="btn btn-secondary" onClick={() => { setDone(false); setTables([]); setSelected(null); setSpecial(''); }}>
        Make another booking
      </button>
    </div>
  );

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Book a Table</h1>
      <p className="page-sub">Find and reserve your perfect spot.</p>

      {/* Search Form */}
      <div className="card" style={{ marginBottom: 24 }}>
        <form onSubmit={handleSearch}>
          <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Date</label>
              <input className="form-input" type="date" min={today} value={search.date}
                onChange={e => setSearch({ ...search, date: e.target.value })} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Time</label>
              <select className="form-select" value={search.startTime}
                onChange={e => setSearch({ ...search, startTime: e.target.value })}>
                {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Guests</label>
              <select className="form-select" value={search.guests}
                onChange={e => setSearch({ ...search, guests: Number(e.target.value) })}>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
              </select>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 18 }} disabled={searching}>
            {searching ? 'Searching…' : '🔍 Find Tables'}
          </button>
        </form>
      </div>

      {/* Table List */}
      {tables.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 14 }}>
            {tables.length} table{tables.length > 1 ? 's' : ''} available
          </h3>
          <div className="card-grid" style={{ marginBottom: 24 }}>
            {tables.map(t => (
              <div key={t.id} className="card"
                onClick={() => setSelected(t)}
                style={{
                  cursor: 'pointer',
                  border: selected?.id === t.id ? '2px solid #e07b3a' : '1px solid #e8e4df',
                  transition: 'all 0.15s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 16 }}>Table {t.tableNumber}</span>
                  <span className={`badge badge-available`}>Available</span>
                </div>
                <div style={{ fontSize: 13, color: '#666', lineHeight: 1.8 }}>
                  <div>👥 Up to {t.capacity} guests</div>
                  <div>📍 {t.location}</div>
                  {t.description && <div>📝 {t.description}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Confirm Section */}
          {selected && (
            <div className="card">
              <h3 style={{ fontWeight: 500, marginBottom: 16 }}>Confirm Reservation — Table {selected.tableNumber}</h3>
              <div className="form-group">
                <label className="form-label">Special Requests (optional)</label>
                <textarea className="form-textarea" placeholder="e.g. window seat, birthday cake, allergies…"
                  value={special} onChange={e => setSpecial(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="btn btn-primary" onClick={handleBook} disabled={loading}>
                  {loading ? 'Booking…' : '✅ Confirm Booking'}
                </button>
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Cancel</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
