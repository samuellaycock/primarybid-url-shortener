import fs from "fs";
import path from "path";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import vue from "rollup-plugin-vue";
import livereload from "rollup-plugin-livereload";
import ejs from "ejs";

const { NODE_ENV } = process.env;

const manifest = {
    styles: [],
    scripts: {},
    assets: [],
};
const preload = {};

/**
 * A Rollup plugin to generate a manifest of chunk names to their filenames
 * (including their content hash). This manifest is then used by the template
 * to point to the currect URL.
 * 
 * @return {Object}
 */
function manifestPlugin() {
    return {
        name: "manifest",
        generateBundle(options, bundle) {
            for (const [name, assetInfo] of Object.entries(bundle)) {
                if (name.endsWith(".css")) {
                    manifest.styles.push(name);
                } else if (name.endsWith(".js") || name.endsWith(".mjs")) {
                    manifest.scripts[assetInfo.name] = name;
                } else {
                    manifest.assets.push(name);
                }
            }
        },
    };
}

/**
 * A Rollup plugin to generate a list of import dependencies for each entry
 * point in the module graph. This is then used by the template to generate
 * the necessary `<link rel="modulepreload">` tags.
 * 
 * @return {Object}
 */
function preloadPlugin() {
    return {
        name: "preload",
        generateBundle(options, bundle) {
            // Loop through all the chunks to detect entries.
            // eslint-disable-next-line no-restricted-syntax
            for (const [fileName, chunkInfo] of Object.entries(bundle)) {
                if (chunkInfo.isEntry || chunkInfo.isDynamicEntry) {
                    preload[chunkInfo.name] = [fileName, ...chunkInfo.imports];
                }
            }
        },
    };
}

/**
 * 
 * 
 * @return {Object}
 */
function templatePlugin() {
    return {
        name: "template",
        async generateBundle() {
            const template = await fs.promises.readFile(path.resolve(__dirname, "./client/index.ejs"));
            const html = ejs.render(
                template.toString(),
                {
                    manifest,
                    preload,
                },
                {
                    rmWhitespace: true,
                },
            );

            this.emitFile({
                type: "asset",
                fileName: "index.html",
                source: html,
            });
        },
    };
}

const config = {
    input: {
        main: "./client/src/index.ts",
    },
    output: {
        dir: "./dist/client",
        format: "esm",
        entryFileNames: NODE_ENV === "production"
            ? "[name].[hash].js" : "[name].js",
        chunkFileNames: NODE_ENV === "production"
            ? "[name].[hash].js" : "[name].js",
        dynamicImportFunction: "__import__",
        sourcemap: null
    },
    plugins: [
        replace({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV || "development"),
        }),
        commonjs(),
        nodeResolve(),
        vue(),
        typescript({
            tsconfig: "./tsconfig.client.json"
        }),
        manifestPlugin(),
        preloadPlugin(),
        templatePlugin(),
        terser({
            mangle: NODE_ENV === "production",
            module: true,
        })
    ]
}

if (NODE_ENV !== "production") {
    config.plugins.push(
        livereload({
            watch: "./dist/client",
            verbose: false,
        }),
    );
}

export default config;
