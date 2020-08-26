<template>
  <div>
    <my-component :text="text"></my-component>
    <my-component2></my-component2>
  </div>
</template>

<component name="my-component">
  <div>{{text}}</div>
</component>

<component name="my-component2" export>
  <div>Custom Component Render2</div>
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
