<template>
  <div>
    <div id="nav">
      <router-link to="/">Home</router-link>
      | a commit a day
      <button v-if="!loggedin" v-on:click="login()">login</button>
      <button v-else v-on:click="logout()">logout</button>
      <router-link to="/profile">profile</router-link>
    </div>
  </div>
</template>

<script>
import Service from '@/service'

export default {
  name: 'web-nav',
  data () {
    return {
      loggedin: false
    }
  },
  methods: {
    login: Service.login,
    logout: Service.logout
  }
}
</script>
