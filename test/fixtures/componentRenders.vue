<template>
  <div>
    <my-component :text="text"></my-component>
  </div>
</template>

<component name="my-component">
  <div>{{text}}</div>
</component>

<script>
export default {
  data () {
    return {
      text: 'Custom Component Render'
    }
  },
  components: {
    myComponent: {
      props: {
        text: {
          default: String
        }
      }
    }
  }
}
</script>
