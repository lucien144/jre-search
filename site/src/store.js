import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		videos: []
	},
	mutations: {
		videos(state, videos) {
			state.videos = videos;
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
