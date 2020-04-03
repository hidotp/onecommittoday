<template>
  <div class="home">
    <page-title/>
    <masonry-list></masonry-list>
  </div>
</template>

<script>
import MasonryList from '@/components/MasonryList'
import PageTitle from '@/components/PageTitle'

export default {
  name: 'Home',
  components: {
    MasonryList,
    PageTitle
  }
}
</script>
