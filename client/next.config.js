module.exports = {
	webpackDevMiddleware: config => {
		config.watchOptions.poll = 300
		return config
	},
	env: {
		STRIPE_KEY: "pk_test_51Hj06CHD6bbTELi4exC4Eg9zqSNROGVtShW1uNRhAdPJxlWv20mPjSS0YsfiaiP2m7LUhyuBhfAPwcDIC3xeTgLd00X2dIVONN"
	}
}