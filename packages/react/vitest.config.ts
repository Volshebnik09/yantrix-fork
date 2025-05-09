import { VitestMarkdownReporter } from 'vitest-markdown-reporter';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		reporters: [
			'default',
			new VitestMarkdownReporter({ title: 'Test Cases' }),
		],
		exclude: ['**/node_modules', '**/dist'],
		environment: 'jsdom',
		passWithNoTests: true,
	},
});
