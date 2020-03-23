import Axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true // send cookies with CORS requests
})

export default {
  getFeed (limit, page) {
    return axios.get(`/feed?limit=${limit}&page=${page}`).then(res => res.data)
  },
  getUser () {
    return axios.get('/user')
      .then(res => res.data)
  },
  updateUser (user) {
    return axios.patch('/user', user)
  },
  login () {
    window.location = `${API_URL}/auth/github`
  },
  logout () {
  }
}
