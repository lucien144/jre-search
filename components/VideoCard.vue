<template>
	<v-hover>
		<v-card
			slot-scope="{ hover }"
			:class="`elevation-${hover ? 12 : 2}`"
			height="100%"
			@click.native="$store.commit('video', video)">
			<v-img
				:src="video.thumbnails.high.url"
				height="200"/>
			<v-card-title class="title">
				#{{ video.title.episode }} - {{ video.title.hosts.join(', ') }}
			</v-card-title>
			<v-card-text class="pt-0 pb-0">
				<p class="caption">{{ video.description }}</p>
			</v-card-text>
			<v-card-actions>
				<v-spacer/>
				<v-btn
					icon
					@click.stop="favorite">
					<v-icon disabled>favorite</v-icon>
				</v-btn>
				<v-btn
					icon
					@click.stop="watch">
					<v-icon :disabled="!isWatched">visibility</v-icon>
				</v-btn>
				<v-btn
					icon
					@click.stop="share">
					<v-icon>share</v-icon>
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-hover>
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
