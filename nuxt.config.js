require('dotenv').config();
const pkg = require('./package');

module.exports = {
	mode: 'universal',

	/*
  ** Headers of the page
  */
	head: {
		title: pkg.name,
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: pkg.description
			}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{
				rel: 'stylesheet',
				href:
					'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700'
			},
			{
				rel: 'stylesheet',
				href: 'https://use.fontawesome.com/releases/v5.6.3/css/all.css'
			}
		]
	},

	/*
  ** Customize the progress-bar color
  */
	loading: { color: '#fff' },

	/*
  ** Global CSS
  */
	css: ['~/assets/style/app.styl'],

	/*
	** Plugins to load before mounting the App
	*/
	plugins: ['@/plugins/vuetify', '@/plugins/filters'],

	auth: {
		redirect: {
			login: '/',
			logout: '/',
			callback: '/login/success',
			home: '/'
		},
		strategies: {
			auth0: {
				domain: process.env.AUTH_DOMAIN,
				client_id: process.env.AUTH_CLIENT_ID // eslint-disable-line camelcase
			}
		},
		plugins: ['~/plugins/auth.js']
	},

	/*
  ** Nuxt.js modules
  */
	modules: [
		// Doc: https://github.com/nuxt-community/axios-module#usage
		'@nuxtjs/axios',
		'@nuxtjs/auth'
	],
	/*
  ** Axios module configuration
  */
	axios: {
		// See https://github.com/nuxt-community/axios-module#options
	},

	serverMiddleware: ['~/api/index.js'],

	/*
  ** Build configuration
  */
	build: {
		/*
    ** You can extend webpack config here
    */
		extend(config, ctx) {} // eslint-disable-line no-unused-vars
	}
};
