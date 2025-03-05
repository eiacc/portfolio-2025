import { readdir, mkdir, readFile, writeFile, rm, copyFile, stat } from "fs/promises";
import path from "path";
import fs from "fs";
import { transform } from "esbuild";

const jsDir: string = "src/js";
const stylesDir: string = "src/styles"; 
const outputDir: string = "dist"; 
const outputCSSFile: string = path.join(outputDir, "styles.min.css");
const outputJSFile: string = path.join(outputDir, "script.min.js");
const publicDir: string = "public";
const indexFile: string = "index.html"; // Root-level index.html file
const destDir: string = path.join(outputDir, "public");

(async () => {
  try {
    // Ensure dist/ exists
    if (fs.existsSync(outputDir)) {
      await rm(outputDir, { recursive: true, force: true });
      console.log(`🗑️ Removed existing directory: ${outputDir}`);
    }

    await mkdir(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);

    await optimize("css", stylesDir, outputCSSFile);
    await optimize("js", jsDir, outputJSFile);
    await copyIndexFile();
    await copyPublicDir(publicDir, destDir);
  } catch (error) {
    console.error("❌ Build failed:", error);
  }
})();

async function optimize(ext: "css" | "js", filesDir: string, outFile: string): Promise<void> {
  // Check if directory exists before reading files
  if (!fs.existsSync(filesDir)) {
    console.warn(`⚠️ No ${ext} directory found: ${filesDir}`);
    return;
  }

  const files: string[] = await readdir(filesDir);
  const extractFiles: string[] = files
    .filter(file => file.endsWith(`.${ext}`))
    .map(file => path.join(filesDir, file));

  if (extractFiles.length === 0) {
    console.warn(`⚠️ No ${ext} files found in ${filesDir}`);
    return;
  }

  let combineFiles = "";
  for (const file of extractFiles) {
    const content: string = await readFile(file, "utf-8");
    combineFiles += content + "\n";
  }

  // Minify with esbuild
  const loader: "js" | "css" = ext === "js" ? "js" : "css";
  const minified = await transform(combineFiles, { loader, minify: true });

  await writeFile(outFile, minified.code, "utf-8");
  console.log(`✅ ${ext.toUpperCase()} Minified & Combined into: ${outFile}`);
}

async function copyIndexFile() {
  try {
    if (fs.existsSync(indexFile)) {
      await copyFile(indexFile, path.join(outputDir, indexFile));
      console.log(`📄 Copied ${indexFile} to ${outputDir}`);
    } else {
      console.warn(`⚠️ ${indexFile} not found.`);
    }
  } catch (error) {
    console.error("⚠️ Error copying index.html:", error);
  }
}

async function copyPublicDir(src: string, dest: string) {
  try {
    // Ensure public directory exists
    if (!fs.existsSync(src)) {
      console.warn(`⚠️ ${src} directory not found.`);
      return;
    }

    // Ensure destination exists
    await mkdir(dest, { recursive: true });

    // Read all files and directories inside public
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        // Recursively copy nested directories
        await copyPublicDir(srcPath, destPath);
      } else {
        // Copy files
        await copyFile(srcPath, destPath);
      }
    }

    console.log(`✅ Copied ${src} → ${dest}`);
  } catch (error) {
    console.error("⚠️ Error copying public directory:", error);
  }
}
