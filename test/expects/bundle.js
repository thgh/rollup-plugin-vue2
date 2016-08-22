var Hello = {
render: function(){with(this){return _h('h1',{on:{"click":log}},["Hello "+_s(name)])}},
staticRenderFns: [],
  props: ['name'],
  methods: {
    log () {
      console.log('Hello', this.name)
    }
  }
}

var App = {
render: function(){with(this){return _h('main',[_h('hello',{attrs:{"name":name}})])}},
staticRenderFns: [],
  components: {
    Hello
  }
}

new Vue({
  el: '#app',
  data: {
    name: 'world'
  },
  render: h => h(App)
})