<template>
	<VHover>
		<VCard
			slot-scope="{ hover }"
			:class="`elevation-${hover ? 12 : 2}`"
			height="100%"
			@click.native="$store.commit('video', video)"
		>
			<VImg
				:src="video.thumbnails.high.url"
				height="200"
			/>
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
				<VBtn
					icon
					@click.stop="favorite"
				>
					<VIcon disabled>
						favorite
					</VIcon>
				</VBtn>
				<VBtn
					icon
					@click.stop="watch"
				>
					<VIcon :disabled="!isWatched">
						visibility
					</VIcon>
				</VBtn>
				<VBtn
					icon
					@click.stop="share"
				>
					<VIcon>share</VIcon>
				</VBtn>
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
		}
	},
	methods: {
		favorite() {
			this.$store.dispatch('favorite');
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
