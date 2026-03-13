// ── X ロゴのカスタムアイコン ──
export const X_ICON_ID = "x-logo";
export const X_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor"><path d="M58.17 43.09 79.7 18h-5.1L55.9 40.08 41.82 18H24l22.58 32.87L24 76.84h5.1l19.74-22.95L63.18 76.84H81L58.17 43.09ZM51.38 51.57l-2.29-3.27L31.34 21.5h7.83l14.69 21.01 2.29 3.27 19.09 27.31h-7.83L51.38 51.57Z"/></svg>`;

// ── デフォルト設定 ──
export interface XClipperSettings {
	postsFolder: string;
	copyPathToClipboard: boolean;
	openAfterSave: boolean;
	recentTagHistory: TagHistoryEntry[];
}

// タグ履歴のエントリ（新形式）
export interface TagHistoryEntry {
	manual: string[];
	auto: string[];
	all: string[];
}

export const DEFAULT_SETTINGS: XClipperSettings = {
	postsFolder: "X_Posts",
	copyPathToClipboard: true,
	openAfterSave: false,
	recentTagHistory: [],
};

// ── 正規表現 ──

// 絵文字を除去する正規表現
export const EMOJI_REGEX =
	/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2934}-\u{2935}\u{3030}\u{303D}\u{3297}\u{3299}]/gu;

// 日本語を含むファイル名に使える文字の正規表現
export const SANITIZE_REGEX =
	/[^a-zA-Z0-9\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF ]/g;

// ハッシュタグ抽出用正規表現
export const HASHTAG_REGEX =
	/[#＃][\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF]+/g;
