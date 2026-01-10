import {VowelChartViewPluginSettings} from "../settings";

type characterMap = {[string: string]: [number, number, number]};
interface Position {
	x: number;
	y: number;
	cardinal?: number;
	label?: string;
}

const IPA_VOWELS: characterMap = {
	'i': [1, 0.0, 0.0],
	'y': [1, 0.0, 0.0],
	'e': [2, 0.0, 1.0],
	'ø': [2, 0.0, 1.0],
	'ɛ': [3, 0.0, 2.0],
	'œ': [3, 0.0, 2.0],
	'a': [4, 0.0, 3.0],
	'ɶ': [4, 0.0, 3.0],
	'ɑ': [5, 2.0, 3.0],
	'ɒ': [5, 2.0, 3.0],
	'ɔ': [6, 2.0, 2.0],
	'ʌ': [6, 2.0, 2.0],
	'o': [7, 2.0, 1.0],
	'ɤ': [7, 2.0, 1.0],
	'u': [8, 2.0, 0.0],
	'ɯ': [8, 2.0, 0.0],
	'ɨ': [9, 1.0, 0.0],
	'ʉ': [9, 1.0, 0.0],
	'ɘ': [10, 1.0, 1.0],
	'ɵ': [10, 1.0, 1.0],
	'ə': [11, 1.0, 1.5],
	'ɞ': [12, 1.0, 2.0],
	'ɜ': [12, 1.0, 2.0],
	'ɪ': [13, 0.5, 0.5],
	'ʏ': [13, 0.5, 0.5],
	'ʊ': [14, 1.5, 0.5],
	'ɐ': [15, 1.0, 2.5],
	'æ': [16, 0.0, 2.5],
}

const IPA_VOWELS_CENTRAL_A: characterMap = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 3.0],
}

const IPA_VOWELS_TRIANGLE: characterMap = {
	...IPA_VOWELS,
	'a': [17, 1.0, 3.0],
	'æ': [4, 0.0, 2.5],
	'ɶ': [4, 0.0, 2.5],
	'ɑ': [5, 2.0, 2.5],
	'ɒ': [5, 2.0, 2.5],
}

const IPA_VOWELS_FORMANT: characterMap = {
	'i': [1 , 0.0 , 0.0],
	'e': [2 , 0.0 , 1.0],
	'ɛ': [3 , 0.0 , 2.0],
	'a': [4 , 0.0 , 3.0],
	'ɑ': [5 , 2.0 , 3.0],
	'ɔ': [6 , 2.0 , 2.0],
	'o': [7 , 2.0 , 1.0],
	'u': [8 , 2.0 , 0.0],
	'ɯ': [9 , 1.33, 0.0],
	'ɨ': [9 , 1.33, 0.0],
	'ɤ': [10, 1.33, 1.0],
	'ɵ': [10, 1.33, 1.0],
	'ə': [11, 1.0 , 1.5],
	'ʌ': [12, 1.33, 2.0],
	'ɞ': [12, 1.33, 2.0],
	'ɪ': [13, 0.33, 0.5],
	'ʏ': [13, 0.33, 0.5],
	'ʊ': [14, 1.66, 0.5],
	'ɐ': [15, 1.0 , 2.5],
	'æ': [16, 0.0 , 2.5],
	'ɶ': [16, 0.0 , 2.5],
	'y': [18, 0.66, 0.0],
	'ɘ': [19, 0.66, 1.0],
	'ø': [19, 0.66, 1.0],
	'œ': [20, 0.66, 2.0],
	'ɜ': [20, 0.66, 2.0],
	'ʉ': [21, 1.0 , 0.5],
	'ɒ': [22, 2.0 , 2.5],
}

const HEIGHT_KEYWORDS: [string, number][] = [
	['near high', 0.5],
	['high mid', 1],
	['low mid', 2],
	['near low', 2.5],
	['high', 0],
	['low', 3],
	['near close', 0.5],
	['close mid', 1],
	['open mid', 2],
	['near open', 2.5],
	['close', 0],
	['open', 3],
	['mid', 1.5],
]

const BACKNESS_KEYWORDS: [string, number][] = [
	['near front', 0.5],
	['near back', 1.5],
	['front', 0],
	['central', 1],
	['back', 2],
]

function getCardinalLayout(settings: VowelChartViewPluginSettings) {
	if (settings.layout === 'triangle')
		return IPA_VOWELS_TRIANGLE;

	if (settings.layout === 'formant')
		return IPA_VOWELS_FORMANT;

	return settings.centralLowVowel ? IPA_VOWELS_CENTRAL_A : IPA_VOWELS;
}

function keywords(position: string, settings: VowelChartViewPluginSettings) {
	position = position.toLowerCase().replace(/-/g, ' ');
	let x = 1, y = 1.5;
	for (const kw of HEIGHT_KEYWORDS) {
		if (position.includes(kw[0])) {
			y = kw[1];
			break;
		}
	}
	for (const kw of BACKNESS_KEYWORDS) {
		if (position.includes(kw[0])) {
			x = kw[1];
			break;
		}
	}

	return {x, y};
}

function getPosition(position: string, settings: VowelChartViewPluginSettings): Position | null {
	if (position[0] == '(' && position.includes(',')) {
		const axis = position.slice(1, -1).split(',');
		return {x: parseFloat(axis[0]?.trim()||'0'), y: parseFloat(axis[1]?.trim()||'0')};
	}

	if (position[0] == '[') {
		const decomposed = position.slice(1, -1).normalize("NFD");

		const chart = getCardinalLayout(settings);

		const vowel = chart[decomposed[0]??''];
		if (!vowel) return null;

		return {label: decomposed, cardinal: vowel[0], x: vowel[1], y: vowel[2]};
	}

	return keywords(position, settings);
}

export function parse(source: string, settings: VowelChartViewPluginSettings, error: (msg: string) => void) {
	let end = 0;
	const vowels = [];

	const lines = source.split('\n');
	for (const line of lines) {
		if (line.trim() == '') { end++; continue; }
		if (line[0] == ';') { end++; continue; }

		const layoutMatch = line.match(/^layout (\w+)/m);
		if (layoutMatch) {
			end++;
			settings.layout = layoutMatch[1]?.toLowerCase()??'trapezoid';
			continue;
		}

		const configMatch = line.match(/^config ([\w-]+) (.*)/);
		if (configMatch && configMatch[1]) {
			end++;
			//@ts-ignore Oh please
			settings[configMatch[1]] = JSON.parse(configMatch[2]);
			continue;
		}

		const match = line.match(/^add\s+(?:(?:dot\s+)?(left|right))?\s*(\[[^\]]+\]|\([^)]+\)|[^"]+)\s*(?:"([^"]*)")?/m);
		if (!match) { break; }

		end++;

		const dot = match[1]??'middle';
		const position = getPosition(match[2]??'', settings);
		let label = match[3];

		if (!position) {
			error(`Error rendering line ‘${line}’`);
			continue;
		}

		if (label === undefined) {
			if (!position.label) {
				error(`Error rendering line ‘${line}’: Missing label`);
				continue;
			}
			label = position.label;
		}

		vowels.push({label, x: position.x, y: position.y, dot});
	}

	const positionMap: {[n: number]: {x: number, y: number, text: string[]}} = {};

	lines.slice(end).join(' ').split(/\s+/g)
		.forEach(v => {
			if (!v.trim()) return;
			const p = getPosition(`[${v}]`, settings);
			if (!p || !p.cardinal) {
				error(`Error rendering vowel ‘${v}’`);
				return;
			}
			const cardinal = positionMap[p.cardinal];
			if (cardinal) {
				cardinal.text.push(v);
			} else {
				positionMap[p.cardinal] = {x: p.x, y: p.y, text:[v]};
			}
		});

	for (const cardinal in positionMap) {
		const v = positionMap[cardinal] as {x: number, y: number, text: string[]};
		vowels.push({label: v.text.join(' '), x: v.x, y: v.y, dot: 'middle'});
	}

	return vowels;
}