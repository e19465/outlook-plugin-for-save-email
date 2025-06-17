/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

const urlDev = process.env.REACT_APP_NPM_PACKAGE_DEV_SERVER_URL || "https://localhost:3000/";
const urlProd = process.env.REACT_APP_NPM_PACKAGE_PRODUCTION_URL || "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      react: ["react", "react-dom"],
      taskpane: {
        import: ["./src/taskpane/index.tsx", "./src/taskpane/taskpane.html"],
        dependOn: "react",
      },
      commands: "./src/commands/commands.ts",
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ["ts-loader"],
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|ttf|woff|woff2|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new Dotenv({
        systemvars: true,
      }),
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane", "react"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
      new HtmlWebpackPlugin({
        filename: "redirect.html",
        template: "./src/taskpane/dialog-pages/redirect.html",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "microsoft_authentication_error.html",
        template: "./src/taskpane/dialog-pages/microsoft_authentication_error.html",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "authentication_successful.html",
        template: "./src/taskpane/dialog-pages/authentication_successful.html",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "email_not_permitted.html",
        template: "./src/taskpane/dialog-pages/email_not_permitted.html",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "homepage.html",
        template: "./src/taskpane/pages/homepage.html",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "not-found.html",
        template: "./src/taskpane/pages/not-found.html",
        inject: false,
      }),
      new webpack.ProvidePlugin({
        Promise: ["es6-promise", "Promise"],
      }),
    ],
    devServer: {
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options:
          env.WEBPACK_BUILD || options.https !== undefined
            ? options.https
            : await getHttpsOptions(),
      },
      port: process.env.REACT_APP_NPM_PACKAGE_CONFIG_DEV_SERVER_PORT || 3000,

      historyApiFallback: {
        rewrites: [
          { from: /^\/$/, to: "/homepage.html" }, // root → homepage
        ],
        // fallback to not-found.html for unmatched paths
        index: "/not-found.html",
      },
    },
  };

  return config;
};
