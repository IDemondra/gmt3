import preact from 'eslint-config-preact';

export default [
	{ ignores: ['dist/**', '.astro/**', 'node_modules/**'] },
	...preact,
];
