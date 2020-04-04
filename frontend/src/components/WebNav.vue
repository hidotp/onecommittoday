<template>
  <div>
    <div class="nav">
      <router-link class="link" to="/">stories</router-link>
      <router-link class="link" to="/profile">my story</router-link>
      <button class="button button--fixed login" v-if="!loggedin" v-on:click="login()">login</button>
      <button class="button button--fixed logout" v-else v-on:click="logout()">logout</button>
    </div>
    <div class="title">
      <h1 class="title__headline">one commit <span class="highlight highlight--runaway">today</span></h1>
      <img class="title__image" src="@/assets/undraw_social_distancing_2g0u.svg" />
      <p class="title__subtext">
        We spend our time working from home.<br>
        One commit, every day, starting today.<br>
        Join us and <span class="highlight">#flattenthecurve</span>.
      </p>
      <p v-if="!loggedin" class="title__cta">
        How is your life during this crisis?
        <span class="nowrap">
          <button class="button button--text login" @click="login()">login</button> with GitHub
        </span>
        and share your story.
      </p>
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
.title {
  padding-top: 6rem;
  padding-left: 2rem;
  padding-right: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.title__headline {
  letter-spacing: -2px;
}

.title__subtext {
  line-height: 150%;
}

.title__cta {
  max-width: 50vw;
  line-height: 200%;
}

.title__image {
  position: absolute;
  top: 7rem;
  right: 8rem;
  width: 25vw;
  z-index: 0;
}

@media (max-width: 500px){
  .title__image {
    display: none;
  }
}

.highlight {
  color: #42b983;
  letter-spacing: 1px;
}

.highlight--runaway {
  margin-left: 6px;
  letter-spacing: 3px;
}

.nowrap {
  white-space: nowrap;
}

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
  z-index: 1;
}

.nav a.router-link-exact-active {
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

.button {
  outline: none;
  border: none;
  cursor: pointer;
  border-radius: 30px;
  font-weight: bold;
  color: #fff;
  transition: 0.5s;
}

.button--fixed {
  width: 90px;
  min-width: 80px;
  height: 30px;
  font-size: 15px;
  letter-spacing: 3px;
  text-align: center;
  box-shadow:
    5px 5px 12px #a7aaaf,
    -5px -5px 12px #ffffff;
}

.button--text {
  font-size: 90%;
  letter-spacing: 2px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 3px;
  margin-right: 3px;
  box-shadow:
    3px 3px 5px #a7aaaf,
    -3px -3px 5px #ffffff;
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
