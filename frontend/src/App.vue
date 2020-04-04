<template>
  <div id="app">
    <web-nav></web-nav>
    <router-view class="container" />
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
@import '~normalize.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #ecf0f3;
}

.container {
  position: relative;
}
</style>
