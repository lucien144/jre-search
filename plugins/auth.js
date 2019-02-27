import Vue from 'vue';
import Auth0Lock from 'auth0-lock';

export default ({ app, env }, inject) => {
	inject(
		'auth',
		new Vue({
			data: {
				loggedIn: false,
				user: null,
				isLoadingAuth: true
			},
			methods: {
				login() {},
				logout() {}
			}
		})
	);

	if (process.server) {
		return;
	}

	const lock = new Auth0Lock(env.auth.cid, env.auth.domain, options);

	const error = err => {
		console.log(err);
		app.$auth.isLoadingAuth = false;
	};

	const signIn = token => {
		app.$auth.isLoadingAuth = true;

		lock.getUserInfo(token, (err, profile) => {
			if (err === null) {
				app.$cookies.set('auth', token);
				app.$auth.user = profile;
				app.$auth.loggedIn = true;
				app.$auth.isLoadingAuth = false;
			} else {
				error(err);
			}
		});
	};

	const signOut = () => {
		app.$auth.user = null;
		app.$auth.loggedIn = false;
		app.$cookies.remove('auth');
		app.$auth.isLoadingAuth = false;
	};

	const options = {
		oidcConformant: true,
		allowShowPassword: true,
		usernameStyle: 'email',
		defaultDatabaseConnection: 'acme'
	};

	const token = app.$cookies.get('auth');
	if (token) {
		signIn(token);
	} else {
		app.$auth.isLoadingAuth = false;
	}

	lock.on('authenticated', authResult => {
		signIn(authResult.accessToken);
	});

	lock.on('authorization_error', err => {
		error(err);
	});

	lock.on('hide', () => {
		app.$auth.isLoadingAuth = false;
	});

	app.$auth.login = () => {
		app.$auth.isLoadingAuth = true;
		lock.show();
	};
	app.$auth.logout = () => {
		app.$auth.isLoadingAuth = true;
		signOut();
		lock.logout({
			returnTo: window.location.href
		});
	};
};
