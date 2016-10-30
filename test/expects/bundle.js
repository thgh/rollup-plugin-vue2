var Hello = {
render: function(){with(this){return _h('h1',{on:{"click":log}},["Hello "+_s(name)])}},
staticRenderFns: [],
  props: ['name'],
  methods: {
    log () {
      console.log('Hello', this.name);
    }
  }
};

var App = {
render: function(){with(this){return _h('main',[(uid && name)?_h('hello',{attrs:{"name":name}},[_s(uid && name)]):_e()])}},
staticRenderFns: [],
  props: ['name'],
  components: {
    Hello
  }
};

new Vue({
  el: '#app',
  data: {
    name: 'world'
  },
  render: h => h(App)
});
