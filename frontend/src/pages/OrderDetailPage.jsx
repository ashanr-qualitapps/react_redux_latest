import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { fetchOrder, updateOrder } from '../features/orders/orderSlice'
import {
  fetchOrderItems,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
} from '../features/orderItems/orderItemSlice'
import { fetchProducts } from '../features/products/productSlice'

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_BADGE = {
  pending: 'badge-warning',
  processing: 'badge-info',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
}

const EMPTY_ITEM = { product: '', quantity: 1, unitPrice: '' }

export default function OrderDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { selected: order, isLoading: orderLoading } = useSelector((s) => s.orders)
  const { items: orderItems, isLoading: itemsLoading } = useSelector((s) => s.orderItems)
  const { items: products } = useSelector((s) => s.products)

  const [editMode, setEditMode] = useState(false)
  const [orderForm, setOrderForm] = useState({ status: '', shippingAddress: '', notes: '' })
  const [showItemForm, setShowItemForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [itemForm, setItemForm] = useState(EMPTY_ITEM)

  useEffect(() => {
    dispatch(fetchOrder(id))
    dispatch(fetchOrderItems(id))
    dispatch(fetchProducts())
  }, [dispatch, id])

  useEffect(() => {
    if (order) {
      setOrderForm({
        status: order.status,
        shippingAddress: order.shippingAddress,
        notes: order.notes || '',
      })
    }
  }, [order])

  const handleOrderSave = async () => {
    await dispatch(updateOrder({ id, data: orderForm }))
    dispatch(fetchOrder(id))
    setEditMode(false)
    toast.success('Order updated')
  }

  const handleProductSelect = (productId) => {
    const product = products.find((p) => p._id === productId)
    setItemForm((f) => ({
      ...f,
      product: productId,
      unitPrice: product ? product.price : '',
    }))
  }

  const handleItemSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      quantity: parseInt(itemForm.quantity, 10),
      unitPrice: parseFloat(itemForm.unitPrice),
    }
    if (editingItem) {
      await dispatch(updateOrderItem({ id: editingItem._id, data: payload }))
      toast.success('Item updated')
    } else {
      await dispatch(createOrderItem({ ...payload, order: id, product: itemForm.product }))
      toast.success('Item added')
    }
    dispatch(fetchOrder(id))
    closeItemForm()
  }

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Remove this item from the order?')) return
    await dispatch(deleteOrderItem(itemId))
    dispatch(fetchOrder(id))
    toast.success('Item removed')
  }

  const openEditItem = (item) => {
    setEditingItem(item)
    setItemForm({
      product: item.product?._id || item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    })
    setShowItemForm(true)
  }

  const closeItemForm = () => {
    setShowItemForm(false)
    setEditingItem(null)
    setItemForm(EMPTY_ITEM)
  }

  if (orderLoading && !order) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading order…</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="page-container">
        <p>Order not found.</p>
        <button className="btn btn-ghost" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </button>
      </div>
    )
  }

  const itemsTotal = orderItems.reduce((sum, i) => sum + (i.subtotal || 0), 0)

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Order #{id.slice(-8).toUpperCase()}</h1>
          <p>
            Created{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/orders')}>
          ← Back to Orders
        </button>
      </div>

      {/* Order Info Card */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <h2>Order Details</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => setEditMode((s) => !s)}>
            {editMode ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <div className="card-body">
          {editMode ? (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={orderForm.status}
                    onChange={(e) => setOrderForm((f) => ({ ...f, status: e.target.value }))}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Shipping Address</label>
                  <input
                    value={orderForm.shippingAddress}
                    onChange={(e) =>
                      setOrderForm((f) => ({ ...f, shippingAddress: e.target.value }))
                    }
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Notes</label>
                  <input
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Optional notes"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button className="btn btn-primary btn-sm" onClick={handleOrderSave}>
                  Save Changes
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="profile-rows">
              <div className="profile-row">
                <span className="profile-label">Status</span>
                <span className={`badge ${STATUS_BADGE[order.status] || 'badge-info'}`}>
                  {order.status}
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Customer</span>
                <span className="profile-value">{order.user?.name || 'N/A'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Email</span>
                <span className="profile-value">{order.user?.email || 'N/A'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Shipping Address</span>
                <span className="profile-value">{order.shippingAddress}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Notes</span>
                <span className="profile-value">{order.notes || '—'}</span>
              </div>
              <div className="profile-row">
                <span className="profile-label">Order Total</span>
                <span className="profile-value" style={{ color: 'var(--primary)', fontSize: '1.125rem', fontWeight: 700 }}>
                  ${parseFloat(order.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Items Card */}
      <div className="card">
        <div className="card-header">
          <h2>Order Items ({orderItems.length})</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (showItemForm && !editingItem) return closeItemForm()
              closeItemForm()
              setShowItemForm(true)
            }}
          >
            {showItemForm && !editingItem ? 'Cancel' : '+ Add Item'}
          </button>
        </div>

        {/* Item Form */}
        {showItemForm && (
          <div
            style={{
              padding: '1.25rem',
              borderBottom: '1px solid var(--border)',
              background: '#fafafa',
            }}
          >
            <form onSubmit={handleItemSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product *</label>
                  <select
                    value={itemForm.product}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    required
                    disabled={!!editingItem}
                  >
                    <option value="">— Select a product —</option>
                    {products
                      .filter((p) => p.isActive)
                      .map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} — ${parseFloat(p.price).toFixed(2)}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    min="1"
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm((f) => ({ ...f, quantity: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemForm.unitPrice}
                    onChange={(e) => setItemForm((f) => ({ ...f, unitPrice: e.target.value }))}
                    required
                  />
                </div>
                {itemForm.quantity && itemForm.unitPrice && (
                  <div className="form-group">
                    <label>Subtotal</label>
                    <div style={{ padding: '0.625rem 0', fontWeight: 600, color: 'var(--primary)' }}>
                      ${(parseFloat(itemForm.quantity || 0) * parseFloat(itemForm.unitPrice || 0)).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary btn-sm">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={closeItemForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Items Table */}
        <div className="table-wrapper">
          {itemsLoading ? (
            <div className="no-data">Loading items…</div>
          ) : orderItems.length === 0 ? (
            <div className="no-data">No items yet. Use "+ Add Item" to add products to this order.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.product?.name || 'Unknown Product'}</strong>
                    </td>
                    <td className="text-muted-sm">{item.product?.category || '—'}</td>
                    <td>{item.quantity}</td>
                    <td>${parseFloat(item.unitPrice).toFixed(2)}</td>
                    <td>
                      <strong>${parseFloat(item.subtotal || item.quantity * item.unitPrice).toFixed(2)}</strong>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEditItem(item)}>
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteItem(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {/* Total row */}
                <tr className="table-total-row">
                  <td colSpan="4" style={{ textAlign: 'right', fontWeight: 600, paddingRight: '1rem' }}>
                    Order Total:
                  </td>
                  <td colSpan="2" style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1rem' }}>
                    ${itemsTotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
