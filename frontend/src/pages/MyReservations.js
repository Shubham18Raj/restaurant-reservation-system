import { useState, useEffect } from 'react';
import { reservationAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed',
};

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [cancelling, setCancelling]     = useState(null);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await reservationAPI.getMy();
      setReservations(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch { toast.error('Failed to load reservations.'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this reservation?')) return;
    setCancelling(id);
    try {
      await reservationAPI.cancel(id);
      toast.success('Reservation cancelled.');
      fetchReservations();
    } catch { toast.error('Cancellation failed.'); }
    finally { setCancelling(null); }
  };

  if (loading) return <div className="loading">Loading your reservations…</div>;

  return (
    <div className="page">
      <h1 className="page-title">My Reservations</h1>
      <p className="page-sub">View and manage all your bookings.</p>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div>No reservations yet.</div>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                  <th>Special Requests</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.tableNumber}</strong></td>
                    <td>{r.tableLocation}</td>
                    <td>{r.reservationDate}</td>
                    <td>{r.startTime?.slice(0,5)} – {r.endTime?.slice(0,5)}</td>
                    <td>{r.guestCount}</td>
                    <td><span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                    <td style={{ maxWidth: 180, fontSize: 13, color: '#888' }}>{r.specialRequests || '—'}</td>
                    <td>
                      {(r.status === 'PENDING' || r.status === 'CONFIRMED') && (
                        <button className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(r.id)}
                          disabled={cancelling === r.id}>
                          {cancelling === r.id ? '…' : 'Cancel'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
