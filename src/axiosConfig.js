import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'http://192.168.245.174:8020/api/',
  // baseURL: 'https://api.chinhnhan.com/api/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('adminCN')
      ? `Bearer ${localStorage.getItem('adminCN')}`
      : '',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminCN')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Configuration for images
const imageBaseUrl = 'https://api.chinhnhan.com/uploads/'
const mainUrl = 'https://chinhnhan.com/'

export { axiosClient, imageBaseUrl, mainUrl }
