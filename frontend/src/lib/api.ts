import axios from 'axios'

// Determine the API URL based on the environment
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api/proxy' : 'http://localhost:5000/api')

// In production, use the backend URL for images, or empty if using Cloudinary
export const IMAGE_URL_PREFIX = process.env.NODE_ENV === 'production' 
  ? (process.env.NEXT_PUBLIC_BACKEND_URL || '') 
  : 'http://localhost:5000'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
