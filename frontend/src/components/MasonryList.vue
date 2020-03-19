<template>
  <div>
    <masonry
    :cols="3"
    :gutter="30"
    >
      <masonry-item v-for="fed in tempFeed" v-bind:key="fed.name" v-bind:name="fed.name" v-bind:story="fed.story" v-bind:kudos="fed.kudos"></masonry-item>
    </masonry>
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
      feed: [],
      tempFeed: [
        {
          name: 'test1',
          kudos: 23,
          story: 'this is the story for 1 bla bla bla'
        },
        {
          name: 'test2',
          kudos: 23,
          story: 'this is the story for 2 bla bla bla'
        },
        {
          name: 'test3',
          kudos: 23,
          story: 'this is the story for 3 bla bla bla'
        },
        {
          name: 'test4',
          kudos: 23,
          story: 'this is the story for 4 bla bla bla'
        },
        {
          name: 'test5',
          kudos: 23,
          story: 'this is the story for 5 bla bla bla'
        },
        {
          name: 'test6',
          kudos: 23,
          story: 'this is the story for 6 bla bla bla'
        },
        {
          name: 'test7',
          kudos: 23,
          story: 'this is the story for 7 bla bla bla'
        }
      ]
    }
  },
  methods: {
    getFeed () {
      const path = API_URL + 'feed'
      axios.get(path)
        .then((res) => {
          this.feed += res.data.feed
        })
        .catch((error) => {
          console.log(error)
        })
    },
    scroll () {
      window.onscroll = () => {
        const bottomOfWindow = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop) + window.innerHeight === document.documentElement.offsetHeight
        if (bottomOfWindow) {
          this.tempFeed = this.tempFeed.concat(this.tempFeed)
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
