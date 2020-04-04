<template>
  <div class="masonry">
    <masonry
    :cols="{default: 2, 950: 1}"
    :gutter="{default: '50px'}"
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
        data = data.filter(entry => !this.feed.find(entry2 => entry.name === entry2.name))
        this.feed = this.feed.concat(data)

        if (data.length >= 4) {
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
  max-width: 1000px;
  width: 80%;
  padding-bottom: 100px;
}

@media (max-width: 950px){
  .masonry {
    width: 60%;
  }
}
@media (max-width: 500px){
  .masonry {
    width: 90%;
  }
}
</style>
