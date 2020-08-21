module.exports = {
	extends: ["eslint:recommended", "google", "prettier", "plugin:react/recommended"],
	rules: {"require-jsdoc" : 0},
	parser: "babel-eslint",

	// get rid of 'console' not defined errors
	env: {
		es6: true,
		browser: true,
		node: true,
	},
};
