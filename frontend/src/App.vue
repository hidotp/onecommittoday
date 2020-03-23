<template>
  <div id="app">
    <web-nav></web-nav>
    <router-view/>
  </div>
</template>

<script>
import WebNav from '@/components/WebNav'

export default {
  name: 'App',
  components: {
    WebNav
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
