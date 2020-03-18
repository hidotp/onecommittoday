<template>
  <div class="home">
    <masonry-item name="This is home" v-bind:kudos="42" story="eakalwldlawl"></masonry-item>
    <masonry-list></masonry-list>
  </div>
</template>

<script>
import MasonryItem from '@/components/MasonryItem'
import MasonryList from '@/components/MasonryList'

export default {
  name: 'Home',
  components: {
    MasonryItem,
    MasonryList
  }
}
</script>
