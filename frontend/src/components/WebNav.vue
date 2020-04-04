<template>
  <div>
    <div class="nav">
      <router-link class="link" to="/">stories</router-link>
      <router-link class="link nowrap" to="/profile">my story</router-link>
      <button class="button button--fixed button--primary" v-if="!loggedin" @click="login()">login</button>
      <button class="button button--fixed button--secondary" v-else @click="logout()">logout</button>
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
          <button class="button button--text button--primary" @click="login()">login</button> with GitHub
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
  methods: {
    login: Service.login,
    logout: Service.logout
  },
  created () {
    Service.getUser().then(user => { this.$root.$data.user = user })
  },
  computed: {
    name () {
      return this.$root.$data.user?.name || ''
    },
    loggedin () {
      return this.$root.$data.user !== null
    }
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

@media (max-width: 500px){
  .nav {
    width: 70%;
  }
}
</style>
