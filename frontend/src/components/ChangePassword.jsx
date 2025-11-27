import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function ChangePassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    try {
      await axios.post('http://localhost:8000/api/change-password/',
        { new_password: newPassword },
        { headers: { Authorization: `Token ${token}` } }
      )
      setMessage('Password changed successfully!')
      setNewPassword('')
    } catch (err) {
      setMessage('Error changing password')
    }
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">Change Password</div>
          <div className="card-body">
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label>New Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={4}
                />
              </div>
              <button type="submit" className="btn btn-warning">Update Password</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangePassword
