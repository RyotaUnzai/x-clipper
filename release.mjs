import { readFileSync, mkdirSync, copyFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

// manifest.json からバージョンを取得
const manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const version = manifest.version;
const pluginId = manifest.id || "x-clipper";

// Release/x-clipper<version>/x-clipper/ フォルダを作成
const releaseDir = join("Release", `${pluginId}${version}`, pluginId);
mkdirSync(releaseDir, { recursive: true });

// リリースに必要なファイルをコピー
const files = [
  "main.js",
  "manifest.json",
  "styles.css",
  "LICENSE",
  "README.md",
  "README.ja.md"
];

for (const file of files) {
  if (existsSync(file)) {
    copyFileSync(file, join(releaseDir, file));
    console.log(`  ✓ ${file}`);
  } else {
    console.warn(`  ⚠ ${file} not found, skipped`);
  }
}


// フォルダを再帰的にコピーするヘルパー
function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src);
  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// assets フォルダがあればコピー
if (existsSync("assets") && statSync("assets").isDirectory()) {
  copyDirRecursive("assets", join(releaseDir, "assets"));
  console.log("  ✓ assets/");
}

console.log(`\n✅ Release package created: ${releaseDir}`);
