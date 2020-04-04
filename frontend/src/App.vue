<template>
  <div id="app">
    <web-nav></web-nav>
    <router-view class="container" />
    <footer class="footer">
      Do you like this project?
      <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=Y9TKS7F2E2A2E">Buy us a beer through PayPal</a>
      or
      give us <a href="https://github.com/hidotp/onecommittoday">a star on GitHub</a>.
      Built with love by <a href="https://schneefux.xyz">@schneefux</a> and <a href="https://github.com/hidotp">@hidotp</a>.
    </footer>
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
  min-height: 100vh;
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
.button--primary:disabled {
  background: #a7aaaf;
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
.text--primary:disabled {
  color: #a7aaaf;
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
.button--primary:active {
  background: #a7aaaf;
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
.text--primary:disabled {
  color: #a7aaaf;
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

.footer {
  margin-left: 1rem;
  margin-right: 1rem;
  text-align: center;
  color: gray;
  font-size: small;
  margin-top: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  line-height: 120%;
}

a {
  color: #42b983;
  text-decoration: none;
}
</style>
