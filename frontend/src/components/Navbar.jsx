import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const role = localStorage.getItem('role')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">College Project</Link>
        <div className="navbar-nav ms-auto">
          {!token ? (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/dashboard">Home</Link>
              {role === 'admin' && (
                <Link className="nav-link" to="/admin">Admin Panel</Link>
              )}
              <Link className="nav-link" to="/change-password">Change Password</Link>
              <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
