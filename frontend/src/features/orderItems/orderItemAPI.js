import apiClient from '../../app/apiClient'

const getOrderItems = (orderId) =>
  apiClient.get('/order-items', { params: { orderId } }).then((r) => r.data)

const createOrderItem = (data) =>
  apiClient.post('/order-items', data).then((r) => r.data)

const updateOrderItem = (id, data) =>
  apiClient.put(`/order-items/${id}`, data).then((r) => r.data)

const deleteOrderItem = (id) =>
  apiClient.delete(`/order-items/${id}`).then((r) => r.data)

export default { getOrderItems, createOrderItem, updateOrderItem, deleteOrderItem }
