<template>
	<div class="AppHeader">
		<a href="/">
			<img class="logo" src="https://yt3.ggpht.com/a-/AAuE7mDIygpHO-9UrB4lq2nzzUNScl6r4Tr3WB6dPw=s176-c-k-c0x00ffffff-no-rj-mo">
		</a>
		<VCardTitle class="display-1 white font-weight-black">
			<VLayout
				row
				nowrap
				align-center
			>
				<VFlex xs10 sm9>
					<span class="hidden-xs-only">
						JRE on
					</span>✨ 🍄
				</VFlex>
				<VFlex xs2 sm3 text-xs-right class="hidden-md-and-up">
					<VMenu offset-x offset-y bottom left>
						<VBtn
							slot="activator"
							icon
						>
							<VIcon>fas fa-bars</VIcon>
						</VBtn>
						<VList>
							<VListTile @click.native="openStats = !openStats">
								<VListTileTitle>Stats</VListTileTitle>
							</VListTile>
							<VListTile>
								<VListTileTitle>About</VListTileTitle>
							</VListTile>
							<VListTile
								v-if="$lock.loggedIn"
								:disabled="$lock.isLoadingAuth"
								@click.native="logout()"
							>
								<VListTileTitle>Logout</VListTileTitle>
							</VListTile>
							<VListTile
								v-else
								:disabled="$lock.isLoadingAuth"
								@click.native="auth()"
							>
								<VListTileTitle>Sign In/Up</VListTileTitle>
							</VListTile>
						</VList>
					</VMenu>
				</VFlex>
				<VFlex sm3 class="hidden-sm-and-down">
					<VLayout
						row
						justify-end
					>
						<VBtn
							@click.native="openStats = !openStats"
						>
							Stats
						</VBtn>
						<VBtn to="/about">
							About
						</VBtn>
						<VBtn
							v-if="$lock.loggedIn"
							:loading="$lock.isLoadingAuth"
							:disabled="$lock.isLoadingAuth"
							@click.native="logout()"
						>
							Logout
						</VBtn>
						<VBtn
							v-else
							:loading="$lock.isLoadingAuth"
							:disabled="$lock.isLoadingAuth"
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
			@keydown.esc="openStats = false"
		>
			<AppStats @close="openStats = false" />
		</VDialog>
	</div>
</template>

<script>
import AppStats from '~/components/AppStats.vue';

export default {
	components: { AppStats },
	data() {
		return {
			// Toggle. True if we want to open statistics dialog.
			openStats: false
		};
	},
	created() {
		const store = this.$store;
		this.$lock.$on('authenticated', user => {
			store.commit('USER_IDENTITY_SET', user);
			store.dispatch('updateUser');
		});
		this.$lock.$on('logout', () => {
			store.commit('USER_IDENTITY_SET', null);
		});
		this.$lock.init();
	},
	methods: {
		// Sign in/up
		auth() {
			this.$lock.login();
		},

		// Logout
		logout() {
			this.$lock.logout();
		}
	}
};
</script>

<style scoped lang="scss">
.AppHeader {
	margin-top: 3rem;
}
.logo {
	position: absolute;
	top: 0%;
	left: 50%;
	width: 22vw;
	max-width: 128px;
	transform: translate(-50%, -50%);
	border-radius: 50%;
	box-shadow: 0 3px 4px rgba(0, 0, 0, 0.35);
}
</style>
