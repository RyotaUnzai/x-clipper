import { App, Modal, Setting, TextComponent, ButtonComponent, Notice } from "obsidian";

export class ClipPostModal extends Modal {
	constructor(
		app: App,
		onSubmit: (url: string, shouldOpen: boolean, tags: string) => void,
		openAfterSave = false,
		suggestedTags: string[] = [],
		lastUsedTags: string[] = []
	) {
		super(app);
		this.setTitle("Clip Post");

		let url = "";
		let tags = "";
		const selectedTags = new Set<string>();

		new Setting(this.contentEl)
			.setName("Post URL")
			.setDesc("Enter the URL of the post you want to save");

		const controlsRow = this.contentEl.createDiv({
			cls: "x-post-saver-controls-row",
		});

		const textInput = new TextComponent(controlsRow)
			.setPlaceholder("https://x.com/username/status/...")
			.onChange((value) => {
				url = value;
			});

		if (textInput.inputEl) {
			textInput.inputEl.classList.add("x-post-saver-text");
		}

		// クリップボードから貼り付けボタン
		new ButtonComponent(controlsRow)
			.setIcon("paste")
			.setTooltip("Paste from clipboard")
			.onClick(async () => {
				try {
					const clipText = await navigator.clipboard.readText();
					if (clipText && clipText.trim()) {
						url = clipText;
						textInput.setValue(clipText);
						new Notice("Pasted from clipboard");
					} else {
						new Notice("Clipboard is empty");
					}
				} catch {
					new Notice("Failed to read clipboard");
				}
			});

		// タグ入力欄
		let tagInput: TextComponent | null = null;
		new Setting(this.contentEl)
			.setName("Tags")
			.setDesc("Space-separated tags (e.g. #houdini #3dcg)")
			.addText((text) => {
				tagInput = text;
				text
					.setPlaceholder("#houdini #3dcg")
					.onChange((value) => {
						tags = value;
					});
			});

		// よく使うタグのトグルボタン
		if (suggestedTags.length > 0) {
			const tagSuggestContainer = this.contentEl.createDiv({
				cls: "x-post-saver-tag-suggest",
			});
			tagSuggestContainer.createEl("div", {
				text: "Recent tags:",
				cls: "x-post-saver-tag-suggest-label",
			});

			const tagButtonsRow = tagSuggestContainer.createDiv({
				cls: "x-post-saver-tag-buttons",
			});

			const syncTagInput = (): void => {
				const manualTags = tags
					.trim()
					.split(/\s+/)
					.filter((t) => t.length > 0)
					.filter((t) => {
						const normalized = t.startsWith("#") ? t : `#${t}`;
						return !suggestedTags.includes(normalized.replace(/^#/, ""));
					});

				const allTags = [
					...Array.from(selectedTags).map((t) => `#${t}`),
					...manualTags,
				];
				tags = allTags.join(" ");
				if (tagInput) {
					tagInput.setValue(tags);
				}
			};

			for (const tag of suggestedTags) {
				const isLastUsed = lastUsedTags.includes(tag);

				const btn = tagButtonsRow.createEl("button", {
					text: `#${tag}`,
					cls: isLastUsed
						? "x-post-saver-tag-btn x-post-saver-tag-btn-active"
						: "x-post-saver-tag-btn",
				});

				if (isLastUsed) {
					selectedTags.add(tag);
				}

				btn.addEventListener("click", () => {
					if (selectedTags.has(tag)) {
						selectedTags.delete(tag);
						btn.classList.remove("x-post-saver-tag-btn-active");
					} else {
						selectedTags.add(tag);
						btn.classList.add("x-post-saver-tag-btn-active");
					}
					syncTagInput();
				});
			}

			syncTagInput();

			// 一括オフボタン
			const clearBtn = tagSuggestContainer.createEl("button", {
				text: "Clear all",
				cls: "x-post-saver-tag-clear",
			});
			clearBtn.addEventListener("click", () => {
				selectedTags.clear();
				tagButtonsRow.querySelectorAll(".x-post-saver-tag-btn").forEach((btn) => {
					btn.classList.remove("x-post-saver-tag-btn-active");
				});
				syncTagInput();
			});
		}

		let shouldOpen = openAfterSave;

		new Setting(this.contentEl)
			.setName("Open after saving")
			.setDesc("Open the saved post note after it is created")
			.addToggle((toggle) =>
				toggle.setValue(shouldOpen).onChange((value) => {
					shouldOpen = value;
				})
			);

		new Setting(this.contentEl)
			.addButton((btn) =>
				btn
					.setButtonText("Clip Post")
					.setCta()
					.onClick(() => {
						this.close();
						onSubmit(url, shouldOpen, tags);
					})
			)
			.addButton((btn) =>
				btn.setButtonText("Cancel").onClick(() => {
					this.close();
				})
			);
	}
}
