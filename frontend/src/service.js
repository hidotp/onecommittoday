import Axios from 'axios'
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

const axios = Axios.create({
  baseURL: API_URL,
  withCredentials: true // send cookies with CORS requests
})

// ! vue reactivity does not support ssesionStorage
const Store = {
  get (key) {
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  set (key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },
  remove (key) {
    window.sessionStorage.removeItem(key)
  },
  has (key) {
    return window.sessionStorage.getItem(key) !== null
  }
}

export default {
  getFeed (limit, page) {
    return axios.get(`/feed?limit=${limit}&page=${page}`).then(res => res.data)
  },
  getUser () {
    if (Store.has('user')) {
      return Promise.resolve(Store.get('user'))
    }

    return axios.get('/user')
      .then(res => {
        const user = res.data
        Store.set('user', user)
        return user
      })
      .catch(err => {
        Store.remove('user')
        throw err
      })
  },
  updateUser (user) {
    return axios.patch('/user', user)
      .then(res => {
        const user = res.data
        Store.set('user', user)
        return user
      })
  },
  login () {
    window.location = `${API_URL}/auth/github`
  },
  logout () {
    return axios.post('/logout')
      .then(res => {
        Store.remove('user')
        window.location.reload()
      })
  },
  isLoggedIn () {
    return Store.has('user')
  }
}
