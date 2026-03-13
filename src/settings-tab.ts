import { App, PluginSettingTab, Setting } from "obsidian";
import type XClipperPlugin from "./main";

export class XClipperSettingTab extends PluginSettingTab {
	plugin: XClipperPlugin;

	constructor(app: App, plugin: XClipperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Posts folder")
			.setDesc(
				'Choose where to save your posts. Leave empty to save in your vault\'s ' +
				'root folder, or specify a path like "Bookmarks/Posts" to organize them in subfolders.'
			)
			.addText((text) =>
				text
					.setPlaceholder("Posts")
					.setValue(this.plugin.settings.postsFolder)
					.onChange(async (value) => {
						this.plugin.settings.postsFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Copy note path to clipboard")
			.setDesc(
				"Automatically copy the path to the saved post note to your clipboard after saving."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.copyPathToClipboard)
					.onChange(async (value) => {
						this.plugin.settings.copyPathToClipboard = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Open saved note after saving")
			.setDesc("Automatically open the saved post note after saving")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.openAfterSave)
					.onChange(async (value) => {
						this.plugin.settings.openAfterSave = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
