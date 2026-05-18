import axios from 'axios'

const request = axios.create({
  baseURL: 'http://localhost:8000/oppo',
  timeout: 8000
})

request.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err)
)

export default request
