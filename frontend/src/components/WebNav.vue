<template>
  <div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      | a commit a day
      <button v-if="!loggedin" v-on:click="login()">login</button>
      <button v-else v-on:click="logout()">logout</button>
    </div>
  </div>
</template>

<script>
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

export default {
  name: 'web-nav',
  data () {
    return {
      loggedin: false
    }
  },
  methods: {
    login () {
      window.location = `${API_URL}/auth/github`
    },
    logout () {
    }
  }
}
</script>
