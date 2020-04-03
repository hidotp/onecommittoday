<template>
  <div>
    <div id="nav" class="nav">
      <router-link to="/">Home</router-link>
      | a commit a day
      <button v-if="!loggedin" v-on:click="login()">login</button>
      <button v-else v-on:click="logout()">logout ({{ name }})</button>
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
      name: '',
      loggedin: Service.isLoggedIn()
    }
  },
  methods: {
    login: Service.login,
    logout: Service.logout
  },
  created () {
    Service.getUser().then(user => { this.name = user.name })
  }
}
</script>

<style scoped>
.nav {
  padding: 35px 35px 35px 35px;
  background: #ecf0f3;
  box-shadow: 13px 13px 20px #cbced1,
              -13px -13px 20px #ffffff;
  border-radius: 40px;
  align-content: center;
}

#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
