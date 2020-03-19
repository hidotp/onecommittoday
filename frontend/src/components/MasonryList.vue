<template>
  <div>
    <masonry-item v-for="fed in feed" v-bind:key="fed.name" v-bind:name="fed.name" v-bind:story="fed.story" v-bind:kudos="fed.kudos"></masonry-item>
  </div>
</template>

<script>
import axios from 'axios'
import MasonryItem from '@/components/MasonryItem'

const API_URL = process.env.API_URL || 'http://localhost:3001/'

export default {
  name: 'masonry-list',
  components: {
    MasonryItem
  },
  data () {
    return {
      feed: []
    }
  },
  methods: {
    getFeed () {
      const path = API_URL + 'feed'
      axios.get(path)
        .then((res) => {
          this.feed = res.data.feed
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  created () {
    this.getFeed()
  }
}
</script>

<style scoped>
.masonry {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
  grid-auto-rows: 0;
}
</style>
