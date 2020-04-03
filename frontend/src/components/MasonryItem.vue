<template>
  <div class="wrapper">
      <img class="icon" :src="this.avatar_url"/>
      <div class="name">{{this.name}}</div>
      <div class="streak">STREAK: {{this.streak}}</div>
      <div class="story">{{this.story}}</div>
      <div class="kudos">kudos: {{this.internalKudos}}</div>
      <button :disabled="submitted" class="kudos-button" v-on:click="addKudos()">add kudos</button>
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
  padding: 35px 35px 35px 35px;
  background: #ecf0f3;
  box-shadow: 13px 13px 20px #cbced1,
              -13px -13px 20px #ffffff;
  border-radius: 40px;
  margin: 0px 10px;
  margin-top: 50px;
  align-content: center;
}
.icon {
  width: 12vw;
  min-width: 125px;
  max-width: 200px;
  border-radius: 10%;
  display:block;
  margin:auto;
  box-shadow:
    0px 0px 2px #5f5f5f,
    0px 0px 0px 5px #ecf0f3,
    8px 8px 15px #a7aaaf,
    -8px -8px 15px #ffffff;

}
.name {
  text-align: center;
  font-size: 28px;
  padding-top: 24px;
  letter-spacing: 0.5px;
}

.streak {
  text-align: center;
  font-size: 15px;
  padding-top: 7px;
  letter-spacing: 3px;
}

.story {
  text-align: center;
  font-size: 20px;
  padding-top: 15px;
}

.kudos {
  text-align: center;
  font-size: 15px;
  padding-top: 20px;
  letter-spacing: 3px;
  text-decoration: none;
  color: #aaa;
}

.kudos-button {
  display:block;
  margin:auto;
  outline: none;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  width: 60%;
  height: 30px;
  border-radius: 30px;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  text-align: center;
  background: #24cfaa;
  box-shadow:
    5px 5px 12px #a7aaaf,
    -5px -5px 12px #ffffff;
  transition: 0.5s;
}

.kudos-button:hover {
  background: #2fdbb6;
}
.kudos-button:active {
  background: #1da88a;
}

.kudos-button:disabled {
  background: #a7aaaf;
}

</style>
