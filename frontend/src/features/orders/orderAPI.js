import apiClient from '../../app/apiClient'

const getOrders = () => apiClient.get('/orders').then((r) => r.data)
const getOrder = (id) => apiClient.get(`/orders/${id}`).then((r) => r.data)
const createOrder = (data) => apiClient.post('/orders', data).then((r) => r.data)
const updateOrder = (id, data) => apiClient.put(`/orders/${id}`, data).then((r) => r.data)
const deleteOrder = (id) => apiClient.delete(`/orders/${id}`).then((r) => r.data)

export default { getOrders, getOrder, createOrder, updateOrder, deleteOrder }
