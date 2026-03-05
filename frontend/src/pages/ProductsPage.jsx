import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  resetProductState,
} from '../features/products/productSlice'

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  stock: '',
  category: 'general',
  isActive: 'true',
}

export default function ProductsPage() {
  const dispatch = useDispatch()
  const { items: products, total, isLoading, isError, isSuccess, message } = useSelector(
    (s) => s.products
  )
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  useEffect(() => {
    if (isError) toast.error(message)
    if (isSuccess && message) toast.success(message)
    dispatch(resetProductState())
  }, [isError, isSuccess, message, dispatch])

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setEditing(null)
    setShowForm(true)
  }

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      category: p.category || 'general',
      isActive: String(p.isActive),
    })
    setEditing(p)
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(EMPTY_FORM)
  }

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10) || 0,
      isActive: form.isActive === 'true',
    }
    if (editing) {
      dispatch(updateProduct({ id: editing._id, data }))
    } else {
      dispatch(createProduct(data))
    }
    closeForm()
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return
    dispatch(deleteProduct(id)).then(() => toast.success('Product deleted'))
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p>{total} product{total !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Add Product
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="form-card">
          <h2>{editing ? 'Edit Product' : 'New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="form-group">
                <label>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Optional description"
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="isActive" value={form.isActive} onChange={handleChange}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? <span className="spinner" /> : editing ? 'Update Product' : 'Create Product'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={closeForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="card">
        {isLoading && products.length === 0 ? (
          <div className="no-data">Loading products…</div>
        ) : products.length === 0 ? (
          <div className="no-data">No products yet. Click "+ Add Product" to create one.</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <strong>{p.name}</strong>
                      {p.description && (
                        <div className="text-muted-sm">
                          {p.description.slice(0, 45)}{p.description.length > 45 ? '…' : ''}
                        </div>
                      )}
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>${parseFloat(p.price).toFixed(2)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge ${p.isActive ? 'badge-success' : 'badge-warning'}`}>
                        {p.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-muted-sm">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p._id)}>
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
