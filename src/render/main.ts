import {DEFAULT_SETTINGS, VowelChartViewPluginSettings, VowelChartViewPluginSettingTab} from "../settings";

function trapezoidChartCoord(x, y) {
	x = x * ((6-y)/3);
	return [x+(2*y/3), y];
}

function triangleChartCoord(x, y) {
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

function squareChartCoord(x, y) {
	return [x*2, y];
}

function formantChartCoord(x, y) {
	const nx = 1 - (x/2)*0.2;
	y = y*nx;
	x = x * 2* ((3-y)/3);
	return [x+(2*y/3), y];
}

const layoutFunction = {
	'square': squareChartCoord,
	'trapezoid': trapezoidChartCoord,
	'triangle': triangleChartCoord,
	'formant': formantChartCoord,
}

function drawSVG(svg, layout, size) {
	svg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svg.setAttribute('width', (size*4+64)+'px');
	svg.setAttribute('height', (size*3+32)+'px');
	svg.setAttribute('viewBox', `0 0 ${64+4*size} ${32+3*size}`);
	svg.setAttribute('aria-label', 'Vowel diagram');
	svg.setAttribute('class', 'vowel-chart-svg');

	let line = (x1,y1,x2,y2) => {
		const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
		l.setAttribute('x1', x1);
		l.setAttribute('y1', y1);
		l.setAttribute('x2', x2);
		l.setAttribute('y2', y2);
		svg.appendChild(l);
	};

	const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	polygon.setAttribute("fill", `transparent`);
	svg.appendChild(polygon);

	if (layout == 'square') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+0*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+4*size,16+1*size,32,16+1*size);
		line(32+4*size,16+2*size,32,16+2*size);
	} else if (layout == 'triangle') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+2*size,16+3*size);
		line(32+3.33*size,16+1*size,32+0.66*size,16+1*size);
		line(32+2.69*size,16+2*size,32+1.32*size,16+2*size);
	} else if (layout == 'formant') {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+2*size},${16+3*size}`);
		line(32+1.33*size,16,32+2*size,16+3*size);
		line(32+2.66*size,16,32+2*size,16+3*size);
		line(32+3.46*size,16+0.8*size,32+0.66*size,16+1*size);
		line(32+2.93*size,16+1.6*size,32+1.32*size,16+2*size);
	} else {
		polygon.setAttribute("points", `32,16 ${32+4*size},16 ${32+4*size},${16+3*size} ${32+2*size},${16+3*size}`);
		line(32+2*size,16,32+3*size,16+3*size);
		line(32+4*size,16+1*size,32+0.66*size,16+1*size);
		line(32+4*size,16+2*size,32+1.32*size,16+2*size);
	}
}

export function renderContainer(el) {
	const container = el.createEl('div', {cls: 'vowel-chart-container'});


	const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	container.appendChild(svgEl);

	const textFloat = container.createEl('div',{cls:'vowel-chart-text-float-container'});

	container.renderVowels = (vowels, settings) => {
		settings.size = Number(settings.size) || DEFAULT_SETTINGS.size;
		settings.layout = settings.layout.toLowerCase();

		const positionFunc = layoutFunction[settings.layout] ?? trapezoidChartCoord;

		for (const vowel of vowels) {
			const [x, y] = positionFunc(vowel.x, vowel.y);

			if (vowel.dot!='middle') {
				const dotEl = textFloat.createEl('span', {cls: 'vowel-chart-text-dot'});
				dotEl.style.left = `${(x*settings.size+32)-3}px`;
				dotEl.style.top = `${(y*settings.size+16)-3}px`;
			}
			const text = textFloat.createEl('span', {text: vowel.label, cls: 'vowel-chart-text-float '+vowel.dot});
			text.style.left = `${(x*settings.size+32)+(vowel.dot=='left'?-4:vowel.dot=='right'?4:0)}px`;
			text.style.top = `${(y*settings.size+16)}px`;
		}

		drawSVG(svgEl, settings.layout.toLowerCase(), settings.size);

	};

	return container;
}