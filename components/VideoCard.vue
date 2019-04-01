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
				<div>
					<VChip
						v-for="(keyword, index) in bestKeywords(video.keywords)"
						:key="`k${index}`"
						@click.prevent="onChipClick(keyword, 'keywords')"
						small
					>
						{{ keyword.original }}
					</VChip>
				</div>
				<VSpacer />
				<div class="text-xs-center">
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
		},
		bestKeywords(keywords) {
			return [...keywords].filter(el => el.count > 1).slice(0, 2);
		},
		onChipClick(keyword, type) {
			this.$store.dispatch('getKeywordVideos', { keyword, type });
		}
	}
};
</script>

<style scoped lang="scss">
.v-chip {
	/deep/ .v-chip__content {
		cursor: pointer;
	}
}
</style>