import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AdminPanel() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  // state for new user form
  const [newUsername, setNewUsername] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState('student')
  const [createMsg, setCreateMsg] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      const res = await axios.get('http://localhost:8000/api/users/', {
        headers: { Authorization: `Token ${token}` }
      })
      setUsers(res.data)
    } catch (err) {
      setError('Failed to fetch users. ' + (err.response?.data?.error || err.message))
    }
  }

  const handleCreateUser = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      await axios.post('http://localhost:8000/api/users/create/', {
        username: newUsername,
        email: newEmail,
        password: newPassword,
        role: newRole
      }, {
        headers: { Authorization: `Token ${token}` }
      })

      setCreateMsg('User created successfully!')
      // clearing form
      setNewUsername('')
      setNewEmail('')
      setNewPassword('')
      setNewRole('student')
      // refresh list
      fetchUsers()
    } catch (err) {
      setCreateMsg('Error creating user: ' + (err.response?.data?.error || 'Unknown error'))
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return

    const token = localStorage.getItem('token')
    try {
      await axios.post('http://localhost:8000/api/users/delete/',
        { user_id: id },
        { headers: { Authorization: `Token ${token}` } }
      )
      // refreshing list
      fetchUsers()
    } catch (err) {
      alert('Failed to delete user')
    }
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create User Section */}
      <div className="card mb-4 mt-3">
        <div className="card-header">Create New User</div>
        <div className="card-body">
          {createMsg && <div className={`alert ${createMsg.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{createMsg}</div>}
          <form onSubmit={handleCreateUser} className="row g-3">
            <div className="col-md-3">
              <input type="text" className="form-control" placeholder="Username" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="email" className="form-control" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
            </div>
            <div className="col-md-3">
              <input type="password" className="form-control" placeholder="Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="col-md-2">
              <select className="form-select" value={newRole} onChange={e => setNewRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="col-md-1">
              <button type="submit" className="btn btn-success w-100">Add</button>
            </div>
          </form>
        </div>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== 'admin' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPanel
