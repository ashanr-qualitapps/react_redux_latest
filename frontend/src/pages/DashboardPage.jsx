import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { logout } from '../features/auth/authSlice'
import apiClient from '../app/apiClient'

function getInitials(name) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const STATUS_BADGE = {
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

function DashboardPage() {
  const [dashData, setDashData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await apiClient.get('/dashboard')
        setDashData(response.data)
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(logout())
          navigate('/login')
        } else {
          toast.error('Failed to load dashboard data')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboard()
  }, [dispatch, navigate])

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading dashboard…</p>
      </div>
    )
  }

  const stats = dashData?.stats || {}
  const profileUser = dashData?.user || {}
  const recentUsers = dashData?.recentUsers || []
  const recentOrders = dashData?.recentOrders || []

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>{stats.welcomeMessage || `Welcome, ${user?.name}!`}</p>
      </div>

      {/* Stats Cards — 6 total */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalUsers ?? 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div className="stat-info">
            <div className="stat-value">{stats.activeUsers ?? 0}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📦</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalProducts ?? 0}</div>
            <div className="stat-label">Products</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">🛒</div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalOrders ?? 0}</div>
            <div className="stat-label">Total Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">⏳</div>
          <div className="stat-info">
            <div className="stat-value">{stats.pendingOrders ?? 0}</div>
            <div className="stat-label">Pending Orders</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <div className="stat-value sm">${parseFloat(stats.totalRevenue || 0).toFixed(2)}</div>
            <div className="stat-label">Revenue (Delivered)</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-links">
        <Link to="/products" className="btn btn-outline">📦 Manage Products</Link>
        <Link to="/orders" className="btn btn-outline">🛒 Manage Orders</Link>
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <h2>Your Profile</h2>
            <span className="badge badge-success">Active</span>
          </div>
          <div className="card-body">
            <div className="profile-avatar-row">
              <div className="profile-avatar-lg">
                {getInitials(profileUser.name || user?.name)}
              </div>
              <div>
                <div className="profile-name">{profileUser.name || user?.name}</div>
                <div className="profile-email">{profileUser.email || user?.email}</div>
              </div>
            </div>

            <div className="profile-rows">
              <div className="profile-row">
                <span className="profile-label">Full Name</span>
                <span className="profile-value">{profileUser.name || user?.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{profileUser.email || user?.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Role</span>
                <span className="badge badge-primary">{profileUser.role || 'user'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Member Since</span>
                <span className="profile-value">{formatDate(profileUser.memberSince)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <Link to="/orders" className="btn btn-ghost btn-sm">View All</Link>
          </div>
          <div className="card-body">
            {recentOrders.length > 0 ? (
              <div className="users-list">
                {recentOrders.map((o) => (
                  <Link key={o._id} to={`/orders/${o._id}`} className="user-item" style={{ textDecoration: 'none' }}>
                    <div className="user-item-avatar" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                      🛒
                    </div>
                    <div className="user-item-info">
                      <div className="user-item-name">
                        #{o._id.slice(-8).toUpperCase()}{' '}
                        <span className={`badge ${STATUS_BADGE[o.status] || 'badge-info'}`} style={{ fontSize: '0.625rem' }}>
                          {o.status}
                        </span>
                      </div>
                      <div className="user-item-email">{o.user?.name || 'Unknown'}</div>
                    </div>
                    <div className="user-item-date">${parseFloat(o.totalAmount || 0).toFixed(2)}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-state">No orders yet</div>
            )}
          </div>
        </div>

        {/* Recent Members Card */}
        <div className="card">
          <div className="card-header">
            <h2>Recent Members</h2>
            <span className="badge badge-info">{recentUsers.length}</span>
          </div>
          <div className="card-body">
            {recentUsers.length > 0 ? (
              <div className="users-list">
                {recentUsers.map((u) => (
                  <div key={u._id} className="user-item">
                    <div className="user-item-avatar">{getInitials(u.name)}</div>
                    <div className="user-item-info">
                      <div className="user-item-name">{u.name}</div>
                      <div className="user-item-email">{u.email}</div>
                    </div>
                    <div className="user-item-date">{formatDate(u.createdAt)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No members found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
