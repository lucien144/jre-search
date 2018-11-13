<template>
	<v-app>
		<v-container fluid>
			<router-view/>
		</v-container>
	</v-app>
</template>

<style lang="less">
* { margin: 0; padding: 0; box-sizing: border-box; }
html {
  font-size: 16px;
}
body {
  font-family: 'Catamaran', sans-serif;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
#app { background: #f7f7f7 url(~@/assets/pattern.svg); }
</style>
