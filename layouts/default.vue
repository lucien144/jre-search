<template>
	<VApp>
		<VContainer fluid>
			<!-- eslint-disable-next-line vue/component-name-in-template-casing //-->
			<nuxt />
		</VContainer>
	</VApp>
</template>

<style lang="scss">
* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}
html {
	font-size: 16px;
}
body {
	font-family: 'Catamaran', sans-serif;
	font-weight: 500;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
#app {
	background: #f7f7f7 url(~@/assets/pattern.svg);
}
</style>
