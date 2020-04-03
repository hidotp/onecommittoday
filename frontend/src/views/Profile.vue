<template>
  <div class="wrapper">
    <div class="page">
      <div class="page__header">profile</div>
      <div class="card">
        <form v-if="user !== undefined" class="profile" @submit.prevent="saveProfile()">
          <p class="profile__cta-heading">Share your story, {{ user.name }}.</p>
          <textarea class="profile__story-input" v-model="story"></textarea>
          <button type="submit" class="profile-button">save story</button>
        </form>
      </div>
      <p v-show="message.length > 0" class="page__message">
        {{ message }}
        You can <router-link to="/" class="link">go back to the feed</router-link>.
      </p>
      <button type="button" @click="deleteProfile()" class="profile__delete-btn">delete profile</button>
    </div>
  </div>
</template>

<script>
import Service from '@/service'

export default {
  name: 'Profile',
  components: {
  },
  data () {
    return {
      user: undefined,
      story: '',
      message: ''
    }
  },
  created () {
    Service.getUser()
      .then(user => {
        this.user = user
        this.story = user.story
      })
      .catch(error => error.response?.status === 403 ? Service.login() : console.error(error))
  },
  methods: {
    deleteProfile () {
      Service.deleteUser()
        .then(res => this.$router.replace('/'))
    },
    saveProfile () {
      Service.updateUser({ story: this.story })
        .then(res => { this.message = 'Thank you.' })
    }
  }
}
</script>

<style scoped>
.wrapper {
  padding-top: 14vh;
  min-height: 100vh;
  background: #ecf0f3;
}

.link {
  text-decoration: none;
  color: #2c3e50;
}

.page {
  width: 80%;
  max-width: 30rem;
  padding: 35px 10px 35px 10px;
  background: #ecf0f3;
  box-shadow: 13px 13px 20px #cbced1,
              -13px -13px 20px #ffffff;
  border-radius: 40px;
  margin: 10px;
  margin-left: auto;
  margin-right: auto;
  align-content: center;
  text-align: center;
}

.card {
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.page__header {
  text-align: center;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.page__message {
  color: grey;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.profile__story-input {
  border: none;
  outline: none;
  background: none;
  font-size: 18px;
  color: #555;
  border-radius: 15px;
  padding: 15px 10px 15px 10px;
  box-shadow: inset 4px 4px 4px #cbced1,
              inset -4px -4px 4px #ffffff;
  width: 100%;
}

.profile-button {
  margin-top: 1rem;
  display:block;
  margin:auto;
  outline: none;
  border: none;
  cursor: pointer;
  background: none;
  font-size: 16px;
  margin-top: 8px;
  border-radius: 30px;
  font-weight: bold;
  text-align: center;
  color: #42b983;
  transition: 0.5s;
}

.profile__delete-btn {
    outline: none;
  border: none;
  cursor: pointer;
  width: 60%;
  height: 30px;
  border-radius: 30px;
  font-size: 15px;
  letter-spacing: 3px;
  font-weight: bold;
  color: #fff;
  text-align: center;
  box-shadow:
    5px 5px 12px #a7aaaf,
    -5px -5px 12px #ffffff;
  transition: 0.5s;
  margin-top: 2rem;
  background: #d3411d;
}

.profile__delete-btn:hover {
  background: #d64a27;
}
.profile__delete-btn:active {
  background: #ac3113;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
