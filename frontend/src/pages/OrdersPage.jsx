import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchOrders,
  createOrder,
  deleteOrder,
  resetOrderState,
} from '../features/orders/orderSlice'

const STATUS_BADGE = {
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

const EMPTY_FORM = { shippingAddress: '', notes: '' }

export default function OrdersPage() {
  const dispatch = useDispatch()
  const { items: orders, isLoading, isError, isSuccess, message } = useSelector((s) => s.orders)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess && message) toast.success(message)
    dispatch(resetOrderState())
  }, [isError, isSuccess, message, dispatch])

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createOrder(form))
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order and all its items?')) return
    dispatch(deleteOrder(id)).then(() => toast.success('Order deleted'))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Orders</h1>
          <p>{orders.length} order{orders.length !== 1 ? 's' : ''} in total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancel' : '+ New Order'}
        </button>
      </div>

      {/* New Order Form */}
      {showForm && (
        <div className="form-card">
          <h2>New Order</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Shipping Address *</label>
                <input
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  placeholder="123 Main St, City, Country"
                  required
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Notes</label>
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional notes or instructions"
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <span className="spinner" /> : 'Create Order'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Orders Table */}
      <div className="card">
        {isLoading && orders.length === 0 ? (
          <div className="no-data">Loading orders…</div>
        ) : orders.length === 0 ? (
          <div className="no-data">No orders yet. Click "+ New Order" to create one.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Shipping Address</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      <code className="id-code">#{o._id.slice(-8).toUpperCase()}</code>
                    </td>
                    <td>
                      {o.user?.name || 'N/A'}
                      <div className="text-muted-sm">{o.user?.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[o.status] || 'badge-info'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <strong>${parseFloat(o.totalAmount || 0).toFixed(2)}</strong>
                    </td>
                    <td className="address-cell">{o.shippingAddress}</td>
                    <td className="text-muted-sm">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="action-btns">
                        <Link to={`/orders/${o._id}`} className="btn btn-ghost btn-sm">
                          View
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(o._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
