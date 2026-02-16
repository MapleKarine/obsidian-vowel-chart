import {App, PluginSettingTab, Setting} from "obsidian";
import VowelChartViewPlugin from "./main";

export interface VowelChartViewPluginSettings {
	centralLowVowel: boolean;
	layout: string;
	size: number;
	style: VowelChartViewPluginStyleSettings;
}

export interface VowelChartViewPluginStyleSettings {
	gridColor?: string;
	backgroundColor?: string;
	textColor?: string;
}

export const DEFAULT_SETTINGS: VowelChartViewPluginSettings = {
	centralLowVowel: true,
	layout: 'trapezoid',
	size: 40,
	style: {
		backgroundColor: 'white',
		gridColor: 'black',
		textColor: 'black',
	}
}

export class VowelChartViewPluginSettingTab extends PluginSettingTab {
	plugin: VowelChartViewPlugin;

	constructor(app: App, plugin: VowelChartViewPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Layout')
			.setDesc('Chart layout.')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('trapezoid', 'Trapezoid')
					.addOption('triangle', 'Triangle')
					.addOption('square', 'Square')
					.addOption('formant', 'Formant')
					.setValue(this.plugin.settings.layout)
					.onChange(async (value) => {
						this.plugin.settings.layout = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName('Set [a] as central')
			.setDesc('Makes [a] the open central vowel and [æ] open front.')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.centralLowVowel)
				.onChange(async (value) => {
					this.plugin.settings.centralLowVowel = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Size')
			.addText(text => text
				.setValue(String(this.plugin.settings.size))
				.setPlaceholder(String(DEFAULT_SETTINGS.size))
				.onChange(async (value) => {
					this.plugin.settings.size = Number(value) || DEFAULT_SETTINGS.size;
					await this.plugin.saveSettings();
				}))
	}
}
