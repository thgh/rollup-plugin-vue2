<template>
  <h1 @click="log">Hello {{ name }}</h1>
</template>

<script>
export default {
  props: ['name'],
  methods: {
    log () {
      console.log('Hello', this.name)
    }
  }
}
</script>

<style>
html {
  color: green;
}
</style>
