import Axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true // send cookies with CORS requests
})

function storeUser (user) {
  window.localStorage.setItem('user', JSON.stringify(user))
}

function clearUser () {
  window.localStorage.removeItem('user')
}

export default {
  getFeed (limit, page) {
    return axios.get(`/feed?limit=${limit}&page=${page}`).then(res => res.data)
  },
  getUser () {
    return axios.get('/user')
      .then(res => {
        const user = res.data
        storeUser(user)
        return user
      })
      .catch(err => {
        clearUser()
        throw err
      })
  },
  updateUser (user) {
    return axios.patch('/user', user)
      .then(res => {
        const user = res.data
        storeUser(user)
        return user
      })
  },
  deleteUser () {
    clearUser()
    return axios.delete('/user')
  },
  login () {
    window.location = `${API_URL}/auth/github`
  },
  logout () {
    return axios.post('/logout')
      .then(res => {
        clearUser()
        window.location.reload()
      })
  }
}
