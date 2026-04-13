import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
};

// ── Tables ───────────────────────────────────────────────────────────────────
export const tableAPI = {
  getAll:       ()     => api.get('/tables'),
  getAvailable: (params) => api.get('/tables/available', { params }),
};

// ── Reservations ─────────────────────────────────────────────────────────────
export const reservationAPI = {
  create: (data) => api.post('/reservations', data),
  getById:(id)   => api.get(`/reservations/${id}`),
  getMy:  ()     => api.get('/reservations/my'),
  update: (id, data) => api.put(`/reservations/${id}`, data),
  cancel: (id)   => api.delete(`/reservations/${id}`),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminAPI = {
  getAllReservations: ()         => api.get('/admin/reservations'),
  updateReservation: (id, data) => api.put(`/admin/reservations/${id}`, data),
  addTable:          (data)     => api.post('/admin/tables', data),
  updateTable:       (id, data) => api.put(`/admin/tables/${id}`, data),
  deleteTable:       (id)       => api.delete(`/admin/tables/${id}`),
};

export default api;
