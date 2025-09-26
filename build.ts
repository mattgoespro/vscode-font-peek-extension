import child_process from "child_process";
import chokidar from "chokidar";
import { program } from "commander";
import esbuild from "esbuild";
import fs from "fs";

const TextIcons = {
  loading: "⏳",
  info: "ℹ️",
  success: "✔️",
  warning: "⚠️",
  error: "💥"
};

const colorize = (color: "red" | "green" | "yellow" | "blue", text: string) => {
  const colors: Record<string, string> = {
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    reset: "\x1b[0m"
  };
  return `${colors[color]}${text}${colors.reset}`;
};

const log = (type: keyof typeof TextIcons, message: string) => {
  switch (type) {
    case "loading":
    case "info":
      process.stdout.write(`${TextIcons[type]}  ${colorize("blue", message)}\n`);
      return;
    case "warning":
      process.stdout.write(`${TextIcons[type]}  ${colorize("yellow", message)}\n`);
      return;
    case "error":
      process.stderr.write(`${TextIcons[type]}  ${colorize("red", message)}\n`);
      return;
  }

  process.stdout.write(`${TextIcons[type]}  ${colorize("green", message)}\n`);
};

const esbuildProblemMatcherPlugin: (watch: boolean) => esbuild.Plugin = (watch) => {
  return {
    name: "esbuild-problem-matcher",
    setup: (build) => {
      build.onStart(() => {
        log("info", "Build started.");
      });
      build.onEnd((result) => {
        if (result.errors.length > 0) {
          result.errors.forEach(({ text, location }) => {
            if (location == null) {
              log("error", text);
              return;
            }

            const locationStr = `${location.file}:${location.line}:${location.column}`;
            log("error", `${text} (${locationStr})`);
          });

          if (watch) {
            log("info", "Build finished with errors. Waiting for file changes...");
          } else {
            log("error", "Build finished with errors.");
          }
        }

        if (result.warnings.length > 0) {
          result.warnings.forEach(({ text, location }) => {
            if (location == null) {
              log("warning", text);
              return;
            }

            const locationStr = `${location.file}:${location.line}:${location.column}`;
            log("warning", `${text} (${locationStr})`);
          });

          if (watch) {
            log("info", "Build finished with warnings. Waiting for file changes...");
            return;
          } else {
            log("warning", "Build finished with warnings.");
          }

          log("warning", "Build completed with warnings.");
          return;
        }

        if (watch) {
          log("success", "Build finished successfully. Waiting for file changes...");
          return;
        }

        log("success", "Build finished successfully.");
      });
    }
  };
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

const esbuildTsTypeCheckPlugin: esbuild.Plugin = {
  name: "ts-type-check",
  setup: (build) => {
    build.onStart(() => {
      log("info", "Type checking in progress...");

      child_process.exec("tsc --noEmit", (error, _, stderr) => {
        if (error) {
          log("error", stderr);
        } else {
          log("success", "No TypeScript type errors found.");
        }
      });
    });
  }
};

program
  .configureOutput({
    writeOut: (str) => log("info", str),
    writeErr: (str) => log("error", str)
  })
  .requiredOption("--mode <mode>", "Build mode")
  .option("--watch", "Watch files for changes", false)
  .option("--clean", "Clean the output directory before building", false)
  .action(async (options) => {
    const { mode, watch, clean } = options;

    if (clean) {
      log("info", "Cleaning build directory...");
      fs.rmSync("dist", { recursive: true, force: true });
    }

    const ctx = await esbuild.context({
      tsconfig: "tsconfig.json",
      entryPoints: ["src/extension.ts"],
      resolveExtensions: [".ts", ".tsx", ".js", ".html"],
      bundle: true,
      format: "cjs",
      minify: mode === "production",
      sourcemap: mode !== "production",
      platform: "node",
      outfile: "dist/extension.js",
      external: ["vscode"],
      logLevel: "warning",
      plugins: [
        esbuildTsTypeCheckPlugin,
        esbuildProblemMatcherPlugin(watch),
        esbuildHtmlLoaderPlugin
      ]
    });

    if (watch) {
      // esbuild's own watcher (dependency graph)
      await ctx.watch();

      // chokidar for *all* files under src/
      chokidar
        .watch("src/**/*", {
          ignored: ["dist/**/*", "node_modules/**/*"],
          ignoreInitial: true,
          usePolling: true,
          interval: 300
        })
        .on("all", async (event, path) => {
          log("info", `Detected ${event} in ${path}, rebuilding...`);
          await ctx.rebuild();
        });

      return;
    }

    await ctx.rebuild();
    await ctx.dispose();
  })
  .parse(process.argv);

// main().catch((error) => {
//   console.error(error);
// });
