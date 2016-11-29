var Hello = {
render: function render(){var _vm=this;var _h=_vm.$createElement;return _h('h1',{on:{"click":_vm.log}},["Hello "+_vm._s(_vm.name)])},
staticRenderFns: [],
  props: ['name'],
  methods: {
    log () {
      console.log('Hello', this.name);
    }
  }
};

var App = {
render: function render(){var _vm=this;var _h=_vm.$createElement;return _h('main',[(_vm.uid && _vm.name)?_h('hello',{attrs:{"name":_vm.name}},[_vm._s(_vm.uid && _vm.name)]):_vm._e()])},
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
