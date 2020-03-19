<template>
  <div class="wrapper">
      <div class="one">
        <img class="grid-icon" src="../assets/logo.png"/>
      </div>
      <div class="two">
        <h1 class="grid-name">name: {{this.name}}</h1>
      </div>
      <div class="three">
        <h2 class="grid-kudos">kudos: {{this.kudos}}</h2>
      </div>
      <div class="four">
        <p class="grid-kudos">{{this.story}}</p>
      </div>
      <div class="five">
        <div class="grid-buttons">add kudos</div>
      </div>
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

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  grid-auto-rows: minmax(100px, auto);
  padding: 5px;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 5px;
  margin-top: 10px;
}
.grid-icon {
  width: 15vw;
}
.one {
  background-color: brown;
  grid-column: 1 / 2;
  grid-row: 1 / 3;
}
.two {
  background-color: burlywood;
  grid-column: 2 / 4;
  grid-row: 1 / 2;
}
.three {
  background-color: green;
  grid-column: 2 / 4;
  grid-row: 2 / 3;
}
.four {
  background-color: orchid;
  grid-column: 1 / 4;
  grid-row: 3 / 5;
}
.five {
  background-color: orange;
  grid-column: 1 / 4;
  grid-row: 5;
}
</style>
