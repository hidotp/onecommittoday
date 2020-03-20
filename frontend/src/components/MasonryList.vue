<template>
  <div>
    <masonry
    :cols="{default: 3, 1000: 2, 500: 1}"
    :gutter="{default: '20px', 900: '10px'}"
    >
      <masonry-item v-for="fed in feed" v-bind:key="fed.name" v-bind:name="fed.name" v-bind:streak="fed.streak" v-bind:story="fed.story" v-bind:kudos="fed.kudos"></masonry-item>
    </masonry>
  </div>
</template>

<script>
import axios from 'axios'
import MasonryItem from '@/components/MasonryItem'

const API_URL = process.env.API_URL || 'http://localhost:3001/'
const feedPath = API_URL + 'feed'

export default {
  name: 'masonry-list',
  components: {
    MasonryItem
  },
  data () {
    return {
      feed: [],
      offset: 0
    }
  },
  methods: {
    getFeed () {
      console.log(this.offset)
      const path = feedPath + '?limit=4&offset=' + this.offset
      axios.get(path)
        .then((res) => {
          this.feed = this.feed.concat(res.data)
          this.offset++
        })
        .catch((error) => {
          console.log(error)
        })
    },
    scroll () {
      window.onscroll = () => {
        const bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.getFeed()
        }
      }
    }
  },
  created () {
    this.getFeed()
    this.scroll()
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
