<template>
	<div class="AppHeader">
		<img class="logo" src="https://yt3.ggpht.com/a-/AAuE7mDIygpHO-9UrB4lq2nzzUNScl6r4Tr3WB6dPw=s176-c-k-c0x00ffffff-no-rj-mo"/>
		<VCardTitle class="display-1 white font-weight-black">
			<VLayout
				row
				nowrap
				align-center
			>
				<VFlex xs9>
					JRE on steroids 💊
				</VFlex>
				<VFlex xs3>
					<VLayout
						row
						justify-end
					>
						<VBtn
							:loading="$store.state.stats === null"
							@click.native="openStats = !openStats"
						>
							Stats
						</VBtn>
						<VBtn to="/about">
							About
						</VBtn>
						<VBtn
							v-if="$auth.loggedIn"
							:loading="isLoadingAuth"
							:disabled="isLoadingAuth"
							@click.native="logout()"
						>
							Logout
						</VBtn>
						<VBtn
							v-else
							:loading="isLoadingAuth"
							:disabled="isLoadingAuth"
							@click.native="auth()"
						>
							Sign In/Up
						</VBtn>
					</VLayout>
				</VFlex>
			</VLayout>
		</VCardTitle>
		<VDialog
			v-if="$store.state.stats"
			v-model="openStats"
			@input="v => v || (openStats = false)"
		>
			<AppStats
				@selectHost="host => { $emit('selectHost', host); openStats = false; }"
				@selectKeyword="keyword => { $emit('selectKeyword', keyword); openStats = false; }"
				@selectVideo="video => { $store.commit('video', video); openStats = false; }"
			/>
		</VDialog>
	</div>
</template>

<script>
import AppStats from '~/components/AppStats.vue';

export default {
	components: { AppStats },
	mounted() {
		console.log(this.$auth.loggedIn);
		if (this.$auth.loggedIn) {
			this.$store.dispatch('updateUser');
		}
	},
	data() {
		return {
			// Toggle. True if we want to open statistics dialog.
			openStats: false,

			// Toggle. True if authorization process is running atm.
			isLoadingAuth: false,

			// Toggle. True if list of videos being loaded.
			isLoadingVideos: false,
		};
	},
	methods: {
		// Sign in/up
		async auth() {
			this.isLoadingAuth = true;
			if (!this.$auth.loggedIn) {
				await this.$auth.loginWith('auth0');
			}
			this.$store.dispatch('updateUser');
			this.isLoadingAuth = false;
		},

		// Logout
		async logout() {
			this.isLoadingAuth = true;
			await this.$auth.logout();
			this.isLoadingAuth = false;
		}
	}
};
</script>

<style scoped lang="scss">
.AppHeader { margin-top: 3rem; }
.logo {
	position: absolute;
	top: 0%;
	left: 50%;
	width: 8rem;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	box-shadow: 0 3px 4px rgba(0, 0, 0, .35);
}
</style>
