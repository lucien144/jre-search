<template>
	<div>
		<VTooltip top :disabled="$lock.loggedIn">
			<VBtn
				slot="activator"
				icon
				@click.prevent="favorite"
			>
				<VIcon v-if="isFavourite">
					fas fa-heart
				</VIcon>
				<VIcon v-else :disabled="!$lock.loggedIn">
					far fa-heart
				</VIcon>
			</VBtn>
			<span>You need to be logged in to save the video to favourites.</span>
		</VTooltip>
		<VTooltip top :disabled="$lock.loggedIn">
			<VBtn
				slot="activator"
				icon
				@click.prevent="watch"
			>
				<VIcon v-if="isWatched">
					fas fa-eye
				</VIcon>
				<VIcon v-else :disabled="!$lock.loggedIn">
					far fa-eye
				</VIcon>
			</VBtn>
			<span>You need to be logged in to save the video to the watched list.</span>
		</VTooltip>
		<VBtn
			icon
			@click.stop="share"
		>
			<VIcon>fas fa-share-alt</VIcon>
		</VBtn>
	</div>
</template>

<script>
export default {
	methods: {
		favorite() {
			if (this.$lock.loggedIn) {
				this.$store.dispatch('favourite', this.video);
			} else {
				this.$lock.login();
			}
		},
		watch() {
			if (this.$lock.loggedIn) {
				this.$store.dispatch('watch', this.video);
			} else {
				this.$lock.login();
			}

		},
		share() {
			console.log('share');
		}
	}
}
</script>

<style>

</style>
