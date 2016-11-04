<template>
	<span @click="method">METHOD</span>
</template>
<script type="text/javascript">
	import {noop} from './WithoutRollupRenderMethod2'
	import {method} from './WithoutRollupRenderMethod'
	noop()
	export default {
		methods: {
			method,
			noop
		}
	}
</script>