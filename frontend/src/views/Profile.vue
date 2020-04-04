<template>
  <div class="wrapper">
    <div class="page">
      <div class="page__header">your story</div>
      <div class="card">
        <form v-if="loggedin" class="profile" @submit.prevent="saveProfile()">
          <p class="profile__cta-heading">
            How does the Coronavirus pandemic affect you, <span class="highlight">{{ name }}</span>?
          </p>
          <textarea class="profile__story-input" v-model="story"></textarea>
          <button type="submit" class="button button--primary profile-button">save story</button>
        </form>
      </div>
      <p v-show="message.length > 0" class="page__message">
        {{ message }}
        You can <router-link to="/" class="text--primary">go back to the feed</router-link>.
      </p>
      <button type="button" @click="deleteProfile()" class="button text--secondary profile__delete-btn">delete profile</button>
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
      story: '',
      message: ''
    }
  },
  created () {
    Service.getUser()
      .then(user => {
        this.$root.$data.user = user
        this.story = user.story
      })
      .catch(error => error.response?.status === 403 ? Service.login() : console.error(error))
  },
  computed: {
    name () {
      return this.$root.$data.user?.name || ''
    },
    loggedin () {
      return this.$root.$data.user !== null
    }
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
  margin-top: 3rem;
  min-height: 100vh;
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
  resize: none;
  border: none;
  outline: none;
  background: none;
  height: 6rem;
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
  width: 60%;
  height: 30px;
  font-size: 15px;
  border-radius: 30px;
  text-align: center;
  letter-spacing: 3px;
  box-shadow:
    5px 5px 12px #a7aaaf,
    -5px -5px 12px #ffffff;
}

.profile__delete-btn {
  width: 60%;
  height: 30px;
  font-size: 15px;
  text-align: center;
  margin-top: 1.5rem;
}
</style>
