<template>
  <div class="page">
    <h1 class="page__header">profile</h1>
    <div class="card">
      <form v-if="user !== undefined" class="profile" @submit.prevent="saveProfile()">
        <p class="profile__cta-heading">Share your story, {{ user.name }}.</p>
        <textarea class="profile__story-input" v-model="story"></textarea>
        <button type="submit" class="profile__save-btn">save profile</button>
      </form>
    </div>
    <p v-show="message.length > 0" class="page__message">
      {{ message }}
      You can <router-link to="/">go back to the feed</router-link>.
    </p>
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
    },
    saveProfile () {
      console.log(this.story)
      Service.updateUser({ story: this.story })
        .then(res => { this.message = 'Thank you.' })
    }
  }
}
</script>

<style scoped>
.page {
  max-width: 30rem;
  margin-left: auto;
  margin-right: auto;
}

.card {
  background: #dddddd;
  padding-left: 2rem;
  padding-right: 2rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border: 1px solid white;
}

.page__header {
  text-align: left;
}

.page__message {
  text-align: left;
  color: grey;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.profile {
}

.profile__cta-heading {
  text-align: left;
}

.profile__story-input {
  width: 100%;
}

.profile__save-btn {
  margin-top: 1rem;
}
</style>
