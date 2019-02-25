export default ({ route, redirect }) => {
	if (route.path === '/login/success') {
		redirect(301, '/');
	}
};
