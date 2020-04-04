<template>
  <div class="wrapper">
      <img class="icon" :src="this.avatar_url"/>
      <div class="name">{{this.name}}</div>
      <div class="streak">STREAK: {{this.streak}}</div>
      <div class="story">{{this.story}}</div>
      <button class="kudos button button--primary" :disabled="submitted"  @click="addKudos()">
        <span class="kudos__count">{{this.internalKudos}}</span>
        <span class="kudos__button">❤️</span>
      </button>
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
  position: relative;
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
  width: 120px;
  height: 60px;
  display: flex;
  margin-right: 0;
  margin-left: auto;
  margin-top: 1rem;
  padding-top: 15px;
  font-size: 25px;
}

.kudos__count {
  display: block;
  width: 80px;
  margin-left: 5px;
  letter-spacing: 3px;
  color: white;
  text-align: center;
}

.kudos__button {
  display: block;
  width: 40px;
  margin-right: 5px;
  background: transparent;
  animation-name: pulse;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 2s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  20% { transform: scale(1.2); }
  40% { transform: scale(1); }
  60% { transform: scale(1.2); }
  80% { transform: scale(1); }
  100% { transform: scale(1); }
}
</style>
