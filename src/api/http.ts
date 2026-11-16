import axios from 'axios'

// прокси к backend'у
const http = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default http
