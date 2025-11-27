import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    setUsername(localStorage.getItem('username'))
    setRole(localStorage.getItem('role'))
  }, [])

  return (
    <div className="text-center mt-5">
      <h1>Welcome, {username}!</h1>
      <p className="lead">You are logged in as: <strong>{role}</strong></p>
      <p>This is the dashboard page.</p>
    </div>
  )
}

export default Dashboard
