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
render: function render(){var _vm=this;var _h=_vm.$createElement;return _h('span',{on:{"click":_vm.method}},["METHOD"])},
staticRenderFns: [],
		methods: {
			method: method$1,
			noop
		}
	};

export default WithoutRollupRender;
