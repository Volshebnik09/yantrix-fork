import { DefaultTheme } from 'vitepress';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { withMermaid } from 'vitepress-plugin-mermaid';

// https://vitepress.dev/reference/site-config
export default withMermaid({
	description: '',
	srcDir: './src',
	ignoreDeadLinks: true,
	base: '/yantrix',
	assetsDir: './public',
	title: 'Yantrix',
	appearance: 'force-dark',
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		siteTitle: false,
		socialLinks: [],
		sidebar: getSidebarItems(path.resolve(__dirname, '../src')),
	},
});

function getMdData(filePath: string) {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	return matter(fileContent);
}

function getFolderItem(folderDir: string, link: string): DefaultTheme.SidebarItem {
	const indexFile = path.join(folderDir, 'index.md');
	const name = path.basename(folderDir, '.md');

	if (fs.existsSync(indexFile)) {
		const frontmatter = getMdData(indexFile);
		return {
			text: frontmatter.data.title || name,
			collapsed: true,
			items: [],
			link: frontmatter.content.length > 0 ? link : undefined,
		};
	} else {
		return {
			text: path.basename(folderDir),
			collapsed: true,
			items: [],
		};
	}
}

function getFileItem(filePath: string, link: string): DefaultTheme.SidebarItem {
	const frontmatter = getMdData(filePath);
	const name = path.basename(filePath).replace('.md', '');
	return {
		text: frontmatter.data.title || name,
		link,
	};
}

/**
 * sort by
 * 1) index.md
 * 2) *.md
 * 3) *
 * @param files
 */
function sortFiles(files: string[]) {
	const indexMd = files.filter((file) => file === 'index.md');
	const md = files.filter((file) => file.endsWith('.md') && file !== 'index.md');
	const other = files.filter((file) => !file.endsWith('.md'));

	return [...indexMd, ...md, ...other];
}

function getSidebarItems(startDir: string, baseDir = '') {
	const ignoreAbsolute = [path.resolve(startDir, 'public')];

	function _getSidebarItems(fileDir = '') {
		const absoluteDirPath = path.resolve(startDir, fileDir);
		const items = [] as DefaultTheme.SidebarItem[];
		const files = sortFiles(fs.readdirSync(absoluteDirPath));
		files.forEach((file) => {
			const absoluteFilePath = path.join(absoluteDirPath, file);
			const stat = fs.statSync(absoluteFilePath);

			if (ignoreAbsolute.includes(path.resolve(absoluteFilePath))) {
				return;
			}

			if (stat.isDirectory()) {
				const item = getFolderItem(absoluteFilePath, '/' + path.join(baseDir, fileDir, file) + '/');
				item.items = _getSidebarItems(path.join(fileDir, file));
				items.push(item);
			} else if (file !== 'index.md') {
				const item = getFileItem(absoluteFilePath, '/' + path.join(baseDir, fileDir, file));
				items.push(item);
			}
		});

		return items;
	}

	const root = getFolderItem(startDir, '/');

	return [root, ..._getSidebarItems()];
}
