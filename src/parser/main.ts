import {VowelChartViewPluginSettings, Vowel} from "../settings";

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
	'ε': [3 , 0.0 , 2.0],
	'a': [4 , 0.0 , 3.0],
	'ɑ': [5 , 2.0 , 3.0],
	'α': [5 , 2.0 , 3.0],
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
	['mid high', 1],
	['mid low', 2],
	['near low', 2.5],
	['near close', 0.5],
	['mid close', 1],
	['mid open', 2],
	['half close', 1],
	['half open', 2],
	['near open', 2.5],
	['high', 0],
	['low', 3],
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

function keywords(position: string, template: Position | null, _settings: VowelChartViewPluginSettings): Position {
	position = position.toLowerCase().replace(/-/g, ' ');

	let x = template?.x ?? 1, y = template?.y ?? 1.5;

	for (const kw of HEIGHT_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { y = kw[1]; break; }
	}
	for (const kw of BACKNESS_KEYWORDS) {
		const re = new RegExp(`\\b${kw[0]}\\b`, 'g');
		if (position.match(re)) { x = kw[1]; break; }
	}

	return {...template, x, y};
}

function getPosition(position: string, settings: VowelChartViewPluginSettings): Position | null {
	position = position.trim()

	if (position[0] == '(' && position.includes(',')) {
		const axis = position.slice(1, -1).split(',');
		return {x: parseFloat(axis[0]?.trim()||'0'), y: parseFloat(axis[1]?.trim()||'0')};
	}

	const ipa = position.match(/\[([^\]]+)\]/);
	let item: Position | null = null;
	if (ipa) {
		let s = ipa[1] ?? '';
		if (s[0]=='(' && s[s.length-1]==')') s = s.slice(1, -1);

		const decomposed = s.normalize("NFD");
		
		const chart = getCardinalLayout(settings);

		const vowel = chart[decomposed[0]??''];
		if (!vowel) return null;
		
		item = {label: ipa[1], cardinal: vowel[0], x: vowel[1], y: vowel[2]};

		position = position.replace(ipa[0],'').trim()
	}

	if (position==='') {
		return item;
	}

	return keywords(position, item, settings);
}

export function parse(source: string, settings: VowelChartViewPluginSettings, error: (msg: string) => void) {
	const vowels: Vowel[] = [];

	const lines = source.split('\n').filter(line => {
		// filter empty lines and comments
		if (line.trim() == '') return false;
		if (line[0] == ';') return false;

		return true;
	});

	const nonCmdLines: string[] = [];
	const positionMap: {[n: number]: {x: number, y: number, text: string[]}} = {};

	for (const line of lines) {
		const layoutMatch = line.match(/^layout (\w+)/m);
		if (layoutMatch) {
			settings.layout = layoutMatch[1]?.toLowerCase()??'trapezoid';
			continue;
		}

		const configMatch = line.match(/^config ([\w-]+) (.*)/);
		if (line.startsWith('config') && configMatch && configMatch[1]) {
			try {
				const value = JSON.parse(configMatch[2] ?? '');
				switch (configMatch[1]) {
					case 'centralLowVowel': settings['centralLowVowel'] = value; break;
					case 'layout': settings['layout'] = value; break;
					case 'size': settings['size'] = value; break;
				}
			} catch {
				error(`Invalid value in ‘${line}’`)
			}
			continue;
		}

		const match = line.match(/^add\s+(?:(?:dot\s+)?(left|right))?\s*(\[[^\]]+\]|\([^)]+\)|[^"]+)\s*(?:"([^"]*)")?/m);
		if (!match) {
			nonCmdLines.push(line);
			continue;
		}

		const dot = match[1]??'middle';
		const position = getPosition(match[2]??'', settings);
		let label = match[3];

		if (!position) {
			error(`Invalid position ‘${match[2]}’`);
			continue;
		}

		if (label === undefined) {
			if (!position.label) {
				error(`Error rendering line ‘${line}’: Missing label`);
				continue;
			}
			label = position.label;
		}

		if (position.cardinal && dot=='middle') {
			const cardinal = positionMap[position.cardinal];
			if (cardinal) {
				cardinal.text.push(label);
			} else {
				positionMap[position.cardinal] = {x: position.x, y: position.y, text:[label]};
			}
			continue;
		}

		vowels.push({
			...position,
			label, x: position.x, y: position.y, dot,
		});
	}
	
	nonCmdLines.join(' ').replace(/\s+"/g,'"').split(/[\s,]+/g)
		.forEach(v => {
			if (!v.trim()) return;

			const p = getPosition(`[${v}]`, settings);

			if (v.match(/"([^"]+)"/)) {
				v = v.match(/"([^"]+)"/)?.[1] ?? v;
			}

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

	for (const [_, vowel] of Object.entries(positionMap)) {
		vowels.push({label: vowel.text.join(' '), x: vowel.x, y: vowel.y, dot: 'middle'});
	}

	return vowels;
}