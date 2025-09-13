import esbuild from "esbuild";
import fs from "fs";

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

async function main() {
  const ctx = await esbuild.context({
    entryPoints: ["src/extension.ts"],
    resolveExtensions: [".ts", ".js", ".tsx", ".html"],
    bundle: true,
    format: "cjs",
    minify: production,
    sourcemap: !production,
    platform: "node",
    outfile: "dist/extension.js",
    external: ["vscode"],
    logLevel: "warning",
    plugins: [
      /* add to the end of plugins array */
      esbuildProblemMatcherPlugin,
      esbuildHtmlLoaderPlugin
    ]
  });
  if (watch) {
    await ctx.watch();
  } else {
    await ctx.rebuild();
    await ctx.dispose();
  }
}

const esbuildProblemMatcherPlugin: esbuild.Plugin = {
  name: "esbuild-problem-matcher",
  setup: (build) => {
    build.onStart(() => {
      console.log("[watch] build started");
    });
    build.onEnd((result) => {
      result.errors.forEach(({ text, location }) => {
        console.error(`✘ [ERROR] ${text}`);
        if (location == null) return;
        console.error(`    ${location.file}:${location.line}:${location.column}:`);
      });
      console.log("[watch] build finished");
    });
  }
};

const esbuildHtmlLoaderPlugin: esbuild.Plugin = {
  name: "html-loader",
  setup: (build) => {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const contents = fs.readFileSync(args.path, "utf8");
      return {
        contents: `export default ${JSON.stringify(contents)};`,
        loader: "js"
      };
    });
  }
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
