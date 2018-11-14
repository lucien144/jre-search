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
				<v-btn icon>
					<v-icon>favorite</v-icon>
				</v-btn>
				<v-btn icon>
					<v-icon>bookmark</v-icon>
				</v-btn>
				<v-btn icon>
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
	}
};
</script>
