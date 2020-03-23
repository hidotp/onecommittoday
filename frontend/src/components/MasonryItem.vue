<template>
  <div class="wrapper">
      <div class="grid-icon centered">
        <img class="icon" :src="this.avatar_url"/>
      </div>
      <div class="grid-name centered">
        <h1 id="name-element" class="name">{{this.name}}</h1>
      </div>
      <div class="grid-streak centered">
        <div class="streak">streak: {{this.streak}}</div>
      </div>
      <div class="grid-story centered">
        <p class="story">{{this.story}}</p>
      </div>
      <div class="grid-kudos centered">
        <div class="kudos">kudos: {{this.internalKudos}}</div>
        <button :disabled="submitted" class="grid-button" v-on:click="addKudos()">add kudos</button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3001'

export default {
  name: 'masonry-item',
  props: {
    name: String,
    streak: Number,
    story: String,
    kudos: Number,
    avatar_url: String
  },
  data () {
    return {
      internalKudos: null,
      submitted: false
    }
  },
  methods: {
    addKudos () {
      const path = `${API_URL}/users/${this.name}/kudos`
      axios.post(path)
        .then((res) => {
          this.internalKudos = res.data
          this.submitted = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    updateFitment () {
    }
  },
  created () {
    this.internalKudos = this.kudos
    window.addEventListener('resize', this.updateFitment)
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;
  grid-auto-rows: minmax(100px, auto);
  padding: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin: 0px 10px;
  margin-top: 10px;
}
.icon {
  width: 12vw;
  min-width: 125px;
  max-width: 200px;
}
.grid-icon {
  grid-column: 1;
  grid-row: 1 / 3;
}
.grid-name {
  grid-column: 2;
  grid-row: 1 / 2;
}
.grid-streak {
  grid-column: 2;
  grid-row: 2 / 3;
}
.grid-story {
  grid-column: 1 / 3;
  grid-row: 3 / 5;
}
.grid-kudos {
  grid-column: 1 / 3;
  grid-row: 5;
}
.centered {
  margin: auto;
}
.name {
  font-size: 100%;
}
</style>
