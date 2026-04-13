import { useState, useEffect } from 'react';
import { adminAPI, tableAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed',
  CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed',
};
const TABLE_STATUS_COLORS = {
  AVAILABLE: 'badge-available', OCCUPIED: 'badge-occupied', MAINTENANCE: 'badge-maintenance',
};

export default function AdminDashboard() {
  const [tab, setTab]           = useState('reservations');
  const [reservations, setRes]  = useState([]);
  const [tables, setTables]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [newTable, setNewTable] = useState({ tableNumber: '', capacity: 2, location: 'Indoor', description: '', status: 'AVAILABLE' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [resData, tableData] = await Promise.all([
        adminAPI.getAllReservations(),
        tableAPI.getAll(),
      ]);
      setRes(resData.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setTables(tableData.data);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await adminAPI.updateReservation(id, { status });
      toast.success('Status updated.');
      fetchAll();
    } catch { toast.error('Update failed.'); }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addTable(newTable);
      toast.success('Table added!');
      setShowForm(false);
      setNewTable({ tableNumber: '', capacity: 2, location: 'Indoor', description: '', status: 'AVAILABLE' });
      fetchAll();
    } catch { toast.error('Failed to add table.'); }
  };

  const handleDeleteTable = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    try {
      await adminAPI.deleteTable(id);
      toast.success('Table deleted.');
      fetchAll();
    } catch { toast.error('Delete failed.'); }
  };

  if (loading) return <div className="loading">Loading admin data…</div>;

  return (
    <div className="page">
      <h1 className="page-title">Admin Dashboard</h1>
      <p className="page-sub">Manage reservations and tables.</p>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Bookings',  val: reservations.length },
          { label: 'Pending',         val: reservations.filter(r => r.status === 'PENDING').length },
          { label: 'Confirmed',       val: reservations.filter(r => r.status === 'CONFIRMED').length },
          { label: 'Total Tables',    val: tables.length },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e8e4df', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 500 }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['reservations', 'tables'].map(t => (
          <button key={t} className={`btn ${tab === t ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTab(t)}>
            {t === 'reservations' ? '📋 Reservations' : '🪑 Tables'}
          </button>
        ))}
      </div>

      {/* Reservations Tab */}
      {tab === 'reservations' && (
        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th><th>Table</th><th>Date</th><th>Time</th>
                  <th>Guests</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{r.userName}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{r.userEmail}</div>
                    </td>
                    <td>{r.tableNumber} <span style={{ fontSize: 12, color: '#aaa' }}>({r.tableLocation})</span></td>
                    <td>{r.reservationDate}</td>
                    <td>{r.startTime?.slice(0,5)} – {r.endTime?.slice(0,5)}</td>
                    <td>{r.guestCount}</td>
                    <td><span className={`badge ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                    <td>
                      <select className="form-select" style={{ padding: '4px 8px', fontSize: 12 }}
                        value={r.status}
                        onChange={e => handleStatusChange(r.id, e.target.value)}>
                        {['PENDING','CONFIRMED','CANCELLED','COMPLETED'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {tab === 'tables' && (
        <>
          <div className="section-header">
            <div style={{ fontSize: 15, fontWeight: 500 }}>{tables.length} tables</div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Table'}
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h3 style={{ fontWeight: 500, marginBottom: 16 }}>New Table</h3>
              <form onSubmit={handleAddTable}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Table Number</label>
                    <input className="form-input" placeholder="e.g. T1" value={newTable.tableNumber}
                      onChange={e => setNewTable({ ...newTable, tableNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Capacity</label>
                    <input className="form-input" type="number" min={1} max={20} value={newTable.capacity}
                      onChange={e => setNewTable({ ...newTable, capacity: Number(e.target.value) })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <select className="form-select" value={newTable.location}
                      onChange={e => setNewTable({ ...newTable, location: e.target.value })}>
                      {['Indoor','Outdoor','Private','Bar','Terrace'].map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={newTable.status}
                      onChange={e => setNewTable({ ...newTable, status: e.target.value })}>
                      {['AVAILABLE','MAINTENANCE'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input className="form-input" placeholder="Optional note about this table"
                    value={newTable.description}
                    onChange={e => setNewTable({ ...newTable, description: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit">Add Table</button>
              </form>
            </div>
          )}

          <div className="card">
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Number</th><th>Capacity</th><th>Location</th><th>Status</th><th>Description</th><th></th></tr>
                </thead>
                <tbody>
                  {tables.map(t => (
                    <tr key={t.id}>
                      <td><strong>{t.tableNumber}</strong></td>
                      <td>{t.capacity} seats</td>
                      <td>{t.location}</td>
                      <td><span className={`badge ${TABLE_STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                      <td style={{ color: '#888', fontSize: 13 }}>{t.description || '—'}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteTable(t.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
