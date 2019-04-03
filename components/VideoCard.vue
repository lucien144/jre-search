<template>
	<VHover>
		<VCard
			slot-scope="{ hover }"
			height="100%"
			:to="`video/${video.id}/#video`"
			:class="[`elevation-${hover ? 12 : 2}`, 'flexcard']"
		>
			<VImg
				:src="video.thumbnails.high.url"
				:lazy-src="video.thumbnails.default.url"
				height="200"
				max-height="200"
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
			<VCardText class="pt-0 pb-0 grow">
				<p class="caption">
					{{ video.description }}
				</p>
			</VCardText>
			<VCardActions>
				<div>
					<VChip
						v-for="(keyword, index) in bestKeywords(video.keywords)"
						:key="`k${index}`"
						small
						@click.prevent="onChipClick(keyword, 'keywords')"
					>
						{{ keyword.original }}
					</VChip>
				</div>
				<VSpacer />
				<div class="text-xs-center">
					<ShareBar :video="video" />
				</div>
			</VCardActions>
		</VCard>
	</VHover>
</template>

<script>
import ShareBar from '@/components/ShareBar.vue';

export default {
	components: { ShareBar },
	props: {
		video: {
			type: Object,
			required: true
		}
	},
	methods: {
		bestKeywords(keywords) {
			if (!Array.isArray(keywords)) {
				return [];
			}
			const top = [...keywords].filter(el => el.count > 1).slice(0, 2);
			const diff = 2 - top.length;
			if (diff > 0 && keywords.length >= diff) {
				return [...top, ...[...keywords].slice(0, diff)];
			}
			return top;
		},
		onChipClick(keyword, type) {
			this.$store.dispatch('getKeywordVideos', { keyword, type });
		}
	}
};
</script>

<style scoped lang="scss">
.flexcard {
	display: flex;
	flex-direction: column;
}
.v-chip {
	/deep/ .v-chip__content {
		cursor: pointer;
	}
}
</style>
