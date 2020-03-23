<template>
  <div class="masonry">
    <masonry
    :cols="{default: 3, 1050: 2, 500: 1}"
    :gutter="{default: '0px'}"
    >
      <masonry-item v-for="fed in feed" v-bind:key="fed.name" v-bind:name="fed.name" v-bind:streak="fed.streak" v-bind:story="fed.story" v-bind:kudos="fed.kudos" v-bind:avatar_url="fed.avatar_url"></masonry-item>
    </masonry>
  </div>
</template>

<script>
import MasonryItem from '@/components/MasonryItem'
import Service from '@/service'

export default {
  name: 'masonry-list',
  components: {
    MasonryItem
  },
  data () {
    return {
      feed: [],
      page: 0
    }
  },
  methods: {
    getFeed () {
      Service.getFeed(4, this.page).then(data => {
        if (data.length >= pageSize) {
            this.feed = this.feed.concat(data)
            this.page++
        }

      }).catch((error) => {
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
  margin: auto;
  max-width: 1400px;
}
</style>
