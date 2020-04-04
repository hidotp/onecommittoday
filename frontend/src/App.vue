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

@media (max-width: 500px){
  .link {
    margin: 0 10px;
  }
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

.button--primary {
  background: #24cfaa;
}
.button--primary:hover {
  background: #2fdbb6;
}
.button--primary:active {
  background: #1da88a;
}

.text--primary {
  color: #24cfaa;
}
.text--primary:hover {
  color: #2fdbb6;
}
.text--primary:active {
  color: #1da88a;
}

.button--secondary {
  background: #d3411d;
}
.button--secondary:hover {
  background: #d64a27;
}
.button--secondary:active {
  background: #ac3113;
}

.text--secondary {
  color: #d3411d;
}
.text--secondary:hover {
  color: #d64a27;
}
.text--secondary:active {
  color: #ac3113;
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

</style>
