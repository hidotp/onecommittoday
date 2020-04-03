<template>
  <div>
    <div id="nav" class="nav">
      <router-link class="link" to="/">home</router-link>
      <router-link class="link" to="/profile">profile</router-link>
      <button class="neu-button login" v-if="!loggedin" v-on:click="login()">login</button>
      <button class="neu-button logout" v-else v-on:click="logout()">logout</button>
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
  position: fixed;
  display: flex;
  justify-content: space-around;
  right: 0;
  margin: 10px -10px 10px 0px;
  background: #ecf0f3;
  box-shadow: 13px 13px 20px #cbced1,
              -13px -13px 20px #ffffff;
  border-radius: 40px 0px 0px 40px;
  align-content: right;
  padding: 20px 20px 20px 20px;
  text-align: right;
  width: 30%;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.link {
  font-weight: bold;
  text-decoration: none;
  text-align: center;
  font-size: 15px;
  padding-top: 7px;
  letter-spacing: 3px;
  margin: 0 10px;
  color: #2c3e50;
}

.neu-button {
  outline: none;
  border: none;
  cursor: pointer;
  width: 85px;
  min-width: 75px;
  height: 30px;
  border-radius: 30px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  box-shadow:
    5px 5px 12px #a7aaaf,
    -5px -5px 12px #ffffff;
  transition: 0.5s;
}

.login {
  background: #24cfaa;
}
.login:hover {
  background: #2fdbb6;
}
.login:active {
  background: #1da88a;
}

.logout {
  background: #d3411d;
}
.logout:hover {
  background: #d64a27;
}
.logout:active {
  background: #ac3113;
}

@media (max-width: 500px){
  .nav {
    width: 70%;
  }
  .link {
    margin: 0 10px;
  }
}
</style>
