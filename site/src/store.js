import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// List of videos to display
		videos: [],

		// Active video to play
		video: null,

		// Logged user
		user: null
	},
	mutations: {
		videos(state, videos) {
			state.videos = videos;
		},
		video(state, video) {
			state.video = video;
		},
		user(state, user) {
			state.user = user;
		}
	},
	actions: {

	},
	getters: {
		API: _ => {
			return 'http://localhost:8000';
		},
		orderedVideos(state) {
			return state.videos.sort((a, b) => {
				return a.title.episode < b.title.episode ? 1 : (a.title.episode > b.title.episode ? -1 : 0);
			});
		}
	}
});
