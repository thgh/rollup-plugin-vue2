var Hello = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('h1',{on:{"click":_vm.log}},[_vm._v("Hello "+_vm._s(_vm.name))])},
staticRenderFns: [],
  props: ['name'],
  methods: {
    log () {
      console.log('Hello', this.name);
    }
  }
};

var App = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('main',[(_vm.uid && _vm.name)?_c('hello',{attrs:{"name":_vm.name}},[_vm._v(_vm._s(_vm.uid && _vm.name))]):_vm._e()],1)},
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
