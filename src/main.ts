import {Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, VowelChartViewPluginSettings, VowelChartViewPluginSettingTab} from "./settings";
import {renderContainer} from 'render/main'
import {parse} from 'parser/main';

export default class VowelChartViewPlugin extends Plugin {
	settings: VowelChartViewPluginSettings;

	vowelChartProcessor(source: string, el: HTMLElement) {
		const [container, renderVowels] = renderContainer(el);
		const localSettings = Object.assign({}, this.settings);
		const vowels = parse(source, localSettings, (msg) => container.createEl('p',{text:msg}));
		renderVowels(vowels, localSettings);
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new VowelChartViewPluginSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor('vowel-chart', (source, el, _) => this.vowelChartProcessor(source, el));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}