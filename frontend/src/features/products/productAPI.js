import apiClient from '../../app/apiClient'

const getProducts = (params = {}) =>
  apiClient.get('/products', { params }).then((r) => r.data)

const getProduct = (id) =>
  apiClient.get(`/products/${id}`).then((r) => r.data)

const createProduct = (data) =>
  apiClient.post('/products', data).then((r) => r.data)

const updateProduct = (id, data) =>
  apiClient.put(`/products/${id}`, data).then((r) => r.data)

const deleteProduct = (id) =>
  apiClient.delete(`/products/${id}`).then((r) => r.data)

export default { getProducts, getProduct, createProduct, updateProduct, deleteProduct }
