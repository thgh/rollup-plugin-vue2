<template>
  <main>
    <hello :name="name" v-if="uid && name">{{ uid && name }}</hello>
  </main>
</template>

<script>
import Hello from './Hello.vue'

export default {
  props: ['name'],
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