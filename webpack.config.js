"use strict";

/* eslint-disable n/no-extraneous-require */

const { join } = require("node:path");
const gitCommitInfo = require("git-commit-info");
const { DefinePlugin } = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ManifestPlugin = require("@keybr/scripts/lib/webpack-manifest.js");
const { intlTransformer } = require("@keybr/scripts/lib/intl.js");
const ENV = require("@keybr/thirdparties/webpack-env.js");

const mode = process.env.NODE_ENV || "production";

const isVendor = (excludedVendors) => {
  const vendorsDir = join(__dirname, "node_modules");
  return ({ resource }) => {
    // A vendor package is anything in the root /node_modules/ dir
    // except for some explicitly excluded packages.
    // Packages in the nested /node_modules/ dirs are not vendors.
    return (
      resource != null &&
      resource.startsWith(vendorsDir) &&
      !excludedVendors.some((excluded) =>
        resource.startsWith(join(vendorsDir, excluded)),
      )
    );
  };
};

const dev = mode === "development";
const filename = dev ? "[name]" : "[contenthash:16]";
const chunkFilename = dev ? "[name]" : "[contenthash:16]";
const assetModuleFilename = dev ? "[name]" : "[contenthash:16]";
const localIdentName = dev
  ? "[name]__[local]__[hash:base64:10]"
  : "[hash:base64:10]";

const commitInfo = gitCommitInfo({ cwd: __dirname });

const rule_ts = () => ({
  test: /\.(ts|tsx)$/,
  type: "javascript/auto",
  use: [
    {
      loader: "ts-loader",
      options: {
        transpileOnly: true,
        compilerOptions: {
          target: "es2022",
          module: "es2022",
          jsx: mode === "development" ? "react-jsxdev" : "react-jsx",
        },
        getCustomTransformers: () => ({
          before: [intlTransformer()],
        }),
      },
    },
  ],
});

const rule_js = () => ({
  test: /\.(js|jsx)$/,
  type: "javascript/auto",
  use: [
    {
      loader: "source-map-loader",
    },
  ],
});

const rule_less = (emit) => ({
  test: /\.less$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        emit,
      },
    },
    {
      loader: "css-loader",
      options: {
        modules: {
          auto: true,
          namedExport: true,
          exportGlobals: true,
          exportLocalsConvention: "dashesOnly",
          localIdentName,
        },
      },
    },
    {
      loader: "less-loader",
    },
  ],
});

module.exports = [
  {
    name: "server",
    target: "node",
    mode,
    context: __dirname,
    entry: {
      index: "./packages/server/lib/index.ts",
      keybr: "./packages/server-cli/lib/index.ts",
    },
    output: {
      path: join(__dirname, "root", "lib"),
      clean: false,
      filename: "[name].js",
      chunkFilename: "[name].js",
      assetModuleFilename: `[name][ext]`,
    },
    module: {
      rules: [
        rule_ts(),
        rule_js(),
        rule_less(false),
        {
          test: /\/react-dom\//,
          exclude: /server/,
          use: "null-loader",
        },
        {
          test: /\/knex\/lib\/dialects\//,
          exclude: /\/mysql|sqlite3|better-sqlite3\//,
          use: "null-loader",
        },
        {
          test: /\/knex\/lib\/migrations\//,
          use: "null-loader",
        },
      ],
    },
    externals: {
      "sqlite3": "commonjs sqlite3",
      "better-sqlite3": "commonjs better-sqlite3",
      "bufferutil": "commonjs bufferutil",
      "utf-8-validate": "commonjs utf-8-validate",
    },
    optimization: {
      minimize: false,
      moduleIds: "named",
      chunkIds: "named",
    },
    devtool: "source-map",
    plugins: [
      new DefinePlugin({
        ...ENV,
        "COMMIT_ID": JSON.stringify(commitInfo.hash),
        "typeof window": JSON.stringify("undefined"),
      }),
      new MiniCssExtractPlugin(),
    ],
  },
  {
    name: "browser",
    target: "web",
    mode,
    context: __dirname,
    entry: {
      "styles-bundle": "./packages/keybr-styles/lib/index.ts",
      "page-account": "./packages/page-account/lib/entry.tsx",
      "page-help": "./packages/page-help/lib/entry.tsx",
      "page-highscores": "./packages/page-highscores/lib/entry.tsx",
      "page-layouts": "./packages/page-layouts/lib/entry.tsx",
      "page-multiplayer": "./packages/page-multiplayer/lib/entry.tsx",
      "page-practice": "./packages/page-practice/lib/entry.tsx",
      "page-profile": "./packages/page-profile/lib/entry.tsx",
      "page-static": "./packages/page-static/lib/entry.tsx",
      "page-typing-test": "./packages/page-typing-test/lib/entry.tsx",
      "page-word-count": "./packages/page-word-count/lib/entry.tsx",
      "assets": "./packages/keybr-assets/lib/entry.ts",
      "ads": "./packages/thirdparties-ads/lib/entry.ts",
    },
    output: {
      path: join(__dirname, "root/public/assets"),
      clean: true,
      publicPath: "/assets/",
      filename: `${filename}.js`,
      chunkFilename: `${chunkFilename}.js`,
      assetModuleFilename: `${assetModuleFilename}[ext]`,
    },
    module: {
      rules: [
        rule_ts(),
        rule_js(),
        rule_less(true),
        {
          test: /\/assets\//,
          type: "asset/resource",
        },
      ],
    },
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      splitChunks: {
        cacheGroups: {
          polyfills: {
            test: /\/@formatjs\/intl-segmenter\//,
            chunks: "all",
            name: "polyfills",
          },
          vendor: {
            test: isVendor(["tslib", "@mdi", "@formatjs/intl-segmenter"]),
            chunks: "all",
            name: "shared-vendor",
          },
          widget: {
            test: /\/keybr-widget\//,
            chunks: "all",
            name: "shared-widget",
          },
          keyboard: {
            test: /\/keybr-keyboard\//,
            chunks: "all",
            name: "shared-keyboard",
          },
          styles: {
            type: "css/mini-extract",
            chunks: "all",
            name: "styles",
          },
        },
      },
    },
    devtool: "source-map",
    plugins: [
      new DefinePlugin({
        ...ENV,
        "COMMIT_ID": JSON.stringify(commitInfo.hash),
        "typeof window": JSON.stringify("object"),
      }),
      new MiniCssExtractPlugin({
        filename: `${filename}.css`,
        chunkFilename: `${chunkFilename}.css`,
        ignoreOrder: true,
      }),
      new ManifestPlugin(),
      ...(dev
        ? []
        : [
            new CompressionPlugin({
              test: /\.(js|css|svg|data)$/,
              filename: "[file].gz",
              algorithm: "gzip",
            }),
            new CompressionPlugin({
              test: /\.(js|css|svg|data)$/,
              filename: "[file].br",
              algorithm: "brotliCompress",
            }),
          ]),
      new BundleAnalyzerPlugin({
        analyzerMode: "disabled",
      }),
    ],
    performance: {
      maxAssetSize: 1048576,
      maxEntrypointSize: 1048576,
    },
  },
];
