<template>
	<VHover>
		<VCard
			slot-scope="{ hover }"
			height="100%"
			:to="`video/${video.id}/#video`"
			:class="`elevation-${hover ? 12 : 2}`"
		>
			<VImg
				:src="video.thumbnails.high.url"
				:lazy-src="video.thumbnails.default.url"
				height="200"
			>
				<VLayout
					slot="placeholder"
					fill-height
					align-center
					justify-center
					ma-0
				>
					<VProgressCircular indeterminate color="grey lighten-5" />
				</VLayout>
			</VImg>
			<VCardTitle class="title">
				#{{ video.title.episode }} - {{ video.title.hosts.join(', ') }}
			</VCardTitle>
			<VCardText class="pt-0 pb-0">
				<p class="caption">
					{{ video.description }}
				</p>
			</VCardText>
			<VCardActions>
				<VSpacer />
				<div class="text-xs-center">
					<VTooltip top :disabled="$lock.loggedIn">
						<VBtn
							slot="activator"
							icon
							@click.stop="favorite"
						>
							<VIcon v-if="isFavourite">
								fas fa-heart
							</VIcon>
							<VIcon v-else :disabled="!$lock.loggedIn">
								far fa-heart
							</VIcon>
						</VBtn>
						<span>You need to sign in to save the video into favourites.</span>
					</VTooltip>
					<VTooltip top :disabled="$lock.loggedIn">
						<VBtn
							slot="activator"
							icon
							@click.stop="watch"
						>
							<VIcon v-if="isWatched">
								fas fa-eye
							</VIcon>
							<VIcon v-else :disabled="!$lock.loggedIn">
								far fa-eye
							</VIcon>
						</VBtn>
						<span>You need to sign in to save the video into watched.</span>
					</VTooltip>
					<VBtn
						icon
						@click.stop="share"
					>
						<VIcon>fas fa-share-alt</VIcon>
					</VBtn>
				</div>
			</VCardActions>
		</VCard>
	</VHover>
</template>

<script>
export default {
	props: {
		video: {
			type: Object,
			required: true
		}
	},
	computed: {
		isWatched() {
			return this.$store.state.user.watched.indexOf(this.video.id) > -1;
		},
		isFavourite() {
			return (
				this.$store.state.user.favourites.indexOf(this.video.id) > -1
			);
		}
	},
	methods: {
		favorite() {
			this.$store.dispatch('favourite', this.video);
		},
		watch() {
			this.$store.dispatch('watch', this.video);
		},
		share() {
			console.log('share');
		}
	}
};
</script>
