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
render: function(){with(this){return _h('span',{on:{"click":method}},["METHOD"])}},
staticRenderFns: [],
		methods: {
			method: method$1,
			noop
		}
	};

export default WithoutRollupRender;
