import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, reset } from '../features/auth/authSlice'

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(reset())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user ? '/dashboard' : '/login'} className="navbar-brand">
          ⚡ ReactRedux App
        </Link>

        {user && (
          <div className="navbar-links">
            <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Dashboard
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Products
            </NavLink>
            <NavLink to="/orders" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Orders
            </NavLink>
          </div>
        )}

        <div className="navbar-nav">
          {user ? (
            <>
              <div className="navbar-user">
                <div className="user-avatar">{getInitials(user.name)}</div>
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
