<template>
  <div class="wrapper">
      <div class="one">
        <img class="grid-icon" src="../assets/logo.png"/>
      </div>
      <div class="two">
        <h1 class="grid-name">name: {{this.name}}</h1>
      </div>
      <div class="three">
        <h2 class="grid-streak">streak: {{this.streak}}</h2>
      </div>
      <div class="four">
        <p class="grid-kudos">{{this.story}}</p>
      </div>
      <div class="five">
        <h2 class="grid-kudos">kudos: {{this.internalKudos}}</h2>
        <button class="grid-button" v-on:click="addKudos()">add kudos</button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
const API_URL = process.env.API_URL || 'http://localhost:3001/'

export default {
  name: 'masonry-item',
  props: {
    name: String,
    streak: Number,
    story: String,
    kudos: Number
    // iconLink: String,
  },
  data () {
    return {
      internalKudos: null
    }
  },
  methods: {
    addKudos () {
      const path = API_URL + this.name + '/kudos'
      axios.post(path)
        .then((res) => {
          this.internalKudos = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  created () {
    this.internalKudos = this.kudos
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  padding: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin-top: 10px;
}
.grid-icon {
  width: 15vw;
}
.one {
  background-color: brown;
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}
.two {
  background-color: burlywood;
  grid-column: 2 / 4;
  grid-row: 1 / 2;
}
.three {
  background-color: green;
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}
.four {
  background-color: orchid;
  grid-column: 1 / 4;
  grid-row: 3 / 5;
}
.five {
  background-color: orange;
  grid-column: 1 / 4;
  grid-row: 5;
}
</style>
