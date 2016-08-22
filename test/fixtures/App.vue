<template>
  <main>
    <hello :name="name"></hello>
  </main>
</template>

<script>
import Hello from './Hello.vue'

export default {
  components: {
    Hello
  }
}
</script>

<style>
body {
  font-size: 2em;
}
</style>