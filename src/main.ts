import {App, Editor, MarkdownView, Modal, Notice, Plugin} from 'obsidian';
import {DEFAULT_SETTINGS, VowelChartViewPluginSettings, VowelChartViewPluginSettingTab} from "./settings";
import {renderContainer} from 'render/main'
import {parse} from 'parser/main';

export default class VowelChartViewPlugin extends Plugin {
	settings: VowelChartViewPluginSettings;

	vowelChartProcessor(source, el, ctx) {
		const container = renderContainer(el);
		const localSettings = Object.assign({}, this.settings);
		const vowels = parse(source, localSettings, (msg) => container.createEl('p',{text:msg}));
		container.renderVowels(vowels, localSettings);
	}

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new VowelChartViewPluginSettingTab(this.app, this));
		this.registerMarkdownCodeBlockProcessor('vowel-chart', (...args) => this.vowelChartProcessor(...args));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}