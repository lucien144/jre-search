import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// List of videos to display
		videos: [],

		// Active video to play
		video: null
	},
	mutations: {
		videos(state, videos) {
			state.videos = videos;
		},
		video(state, video) {
			state.video = video;
		}
	},
	actions: {

	},
	getters: {
		API: _ => {
			return 'http://localhost:8000';
		}
	}
});
