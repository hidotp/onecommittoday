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
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #ecf0f3;
  margin: 0;
}
</style>
