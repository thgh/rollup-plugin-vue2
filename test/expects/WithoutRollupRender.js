function method() {
	console.log('method');
}
function noop() {
	method();
}

function method$1() {
	noop$1();
}
function noop$1() {
	console.log('noop');
}

noop();
	var WithoutRollupRender = {
render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('span',{on:{"click":_vm.method}},[_vm._v("METHOD")])},
staticRenderFns: [],
		methods: {
			method: method$1,
			noop
		}
	};

export default WithoutRollupRender;
