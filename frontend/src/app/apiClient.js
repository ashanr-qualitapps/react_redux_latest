import axios from 'axios'

const apiClient = axios.create({
  baseURL: '/api',
})

// Attach JWT token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

export default apiClient
