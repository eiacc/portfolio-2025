import { readdir, mkdir, readFile, writeFile, rm, copyFile, stat } from "fs/promises";
import path from "path";
import fs from "fs";
import { transform } from "esbuild";
import type { Directory, Extension, Optimize } from "./types.bundle";

const dir: Directory = {
  dev       : {
    index       : "index.html",
    javascript  : {
      ext : "js",
      path: "src/js"
    },
    styles      : {
      ext : "css",
      path: "src/styles"
    },
  },
  output    : {
    index : "dist",
    css   : "styles.min.css",
    js    : "script.min.js",
  },
  pub       : "public",
  pages     : "pages",
  dest      : {}
}

class Bundle {
  dev; output; pub; pages; dest;

  constructor(dir: Directory) {
    const { dev, output, pub, pages, dest } = dir
    this.dev          = dev;
    this.output       = output;
    this.pub          = pub;
    this.pages        = pages;
    this.dest         = dest;

    this.#optimize.bind(this)
  }

  async init() {
    try {
      await this.#generate_dist()
      await this.#optimize(this.dev.styles.ext, this.dev.styles.path, path.join(this.output.index, this.output.css))
      await this.#optimize(this.dev.javascript.ext, this.dev.javascript.path, path.join(this.output.index, this.output.js))
      await this.copy_index_html(this.dev.index, this.output.index)
      await this.copy_directory(this.pub, path.join(this.output.index, this.pub))
      await this.copy_directory(this.pages, path.join(this.output.index, this.pages))
    } catch (error) {
      console.error('❌ Build failed:', error)
    }
  }

  /**
   * Removes and replenish an empty directory for compiled code.
   */
  async #generate_dist() {
    if (fs.existsSync(this.output.index)) {
      await rm(this.output.index, { recursive: true, force: true });
    }

    await mkdir(this.output.index, { recursive: true });
  }

  /**
   * 
   * @param extension - only supports enum of css & js atm.
   * @param from - which directory we are getting our files.
   * @param destination - which directory we are going to send out our final result.
   * @returns
   */
  async #optimize(extension: Extension, from: string, destination: string): Promise<void> {
    try {
      const raw   : string[] = await readdir(from);
      const files : string[] = raw.filter(file => file.endsWith(`.${extension}`)).map(file => path.join(from, file));
      if (files.length === 0) {
        console.warn(`No ${extension} files at ${from} to be optimized.`);
        return
      }

      let compress = "";
      for (const file of files) {
        const temp: string = await readFile(file, 'utf-8');
        compress += `${temp}\n`
      }

      // Minify with esbuild
      const minified = await transform(compress, { loader: extension, minify: true });
      await writeFile(destination, minified.code, "utf-8");
      console.log(`✅ ${extension.toUpperCase()} Minified & Combined into: ${destination}`);
    } catch (error) {
      console.log('optimize method err: ', error)
    }
  }

  async copy_index_html(file: string, destination: string) {
    try {
      if (fs.existsSync(file)) {
        await copyFile(file, path.join(destination, file));
        console.log(`📄 Copied ${file} to ${destination}`);
      } else {
        console.warn(`⚠️ ${file} not found.`);
      }
    } catch (error) {
      console.error("⚠️ Error copying index.html:", error);
    }
  }

  async copy_directory(src: string, dest: string) {
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
          await this.copy_directory(srcPath, destPath);
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
}

const bundle = new Bundle(dir);
bundle.init();