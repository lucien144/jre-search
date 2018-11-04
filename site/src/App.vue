<template>
	<div
		id="app"
		data-app>
		<v-container fluid>
			<router-view/>
		</v-container>
	</div>
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
</style>
