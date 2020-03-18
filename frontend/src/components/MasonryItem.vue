<template>
  <div>
    <h1>name: {{this.name}}</h1>
    <h2>kudos: {{this.kudos}}</h2>
    <p>{{this.desc}}</p>
  </div>
</template>

<script>
export default {
  name: 'masonry-item',
  props: {
    name: String,
    kudos: Number,
    story: String
    // iconLink: String,
  }
}
</script>
