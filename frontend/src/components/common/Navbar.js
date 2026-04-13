import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        La<span>Table</span>
      </NavLink>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/book" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              Book a Table
            </NavLink>
            <NavLink to="/my-reservations" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              My Reservations
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                Admin
              </NavLink>
            )}
            <span className="user-badge">Hi, {user.name.split(' ')[0]}</span>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login"    className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>Login</NavLink>
            <NavLink to="/register" className="nav-btn" style={{ textDecoration: 'none', padding: '7px 18px' }}>Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
