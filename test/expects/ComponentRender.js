var ComponentRender = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('my-component',{attrs:{"text":_vm.text}}),_vm._v(" "),_c('my-component2')],1)},
staticRenderFns: [],
componentMixins: [{
  name: 'my-component',
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._v(_vm._s(_vm.text))])},
  staticRenderFns: [],
},{
  name: 'my-component2',
  export: true,
  render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_vm._v("Custom Component Render2")])},
  staticRenderFns: [],
}],
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
};

export default ComponentRender;
