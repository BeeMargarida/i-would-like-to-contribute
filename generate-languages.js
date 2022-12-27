import fetch from 'node-fetch';
import { load } from 'js-yaml';
import { writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Fetches the YAML file of languages supported by Github and converts
 * it into an array of language names.
 *
 * @returns An array containing all programming languages available for
 * filtering by Github.
 */
async function getLanguages() {
	const languages = [];

	const response = await fetch(
		'https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml'
	);
	const textResponse = await response.text();
	const yamlParsed = await load(textResponse);

	for (const key in yamlParsed) {
		if (yamlParsed[key].type !== 'programming') continue;
		languages.push(key);
	}
	return languages;
}

/**
 * Saves an array of languages supported by Github into a
 * Typescript file to be used by the website.
 */
async function saveLanguages() {
	const dir = process.cwd();
	const languages = await getLanguages();
	const textString = `export const LANGUAGES = [\n${languages
		.map((l) => `"${l}"`)
		.join(',\n')}\n];`;

	await writeFile(join(dir, 'src/lib/languages.ts'), textString);
}

(async function () {
	await saveLanguages();
})();
