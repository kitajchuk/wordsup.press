const fs = require("fs");
const path = require("path");
const files = require("./server/core/files");
const root = path.resolve(__dirname);
const rootConfig = files.read(path.join(root, ".clutch", "config.json"), true);
// If we're in local sandbox then these come from .clutch/config.json as above.
// However, Netlify doesn't have the config JSON so we use environment variables.
const envVars = {
  apiAccess: rootConfig.prismic.apiAccess || process.env.PRISMIC_API_ACCESS,
  accessToken: rootConfig.prismic.accessToken || process.env.PRISMIC_API_TOKEN,
  webhookSecret:
    rootConfig.prismic.webhookSecret || process.env.PRISMIC_API_SECRET,
};
const config = {
  // The URL of your actual site
  url: "https://wordsup.press",
  // Homepage UID, make sure it matches what you use in Prismic
  homepage: "home",
  // Page Not Found UID — 404
  notfound: "404",
  // Page Server Error UID - 500
  notright: "500",
  // Timestamp ( Stamp of instantiation )
  timestamp: Date.now(),
  // Single page web application
  onepager: false,
  // Environments
  env: {
    sandbox: process.env.NODE_ENV === "sandbox",
    production: process.env.NODE_ENV === "production",
  },
  // Content service API
  api: {
    adapter: "prismic",
    access: envVars.apiAccess,
    token: envVars.accessToken,
    secret: envVars.webhookSecret,
    // Set this to the Label of your Prismic release to query that ref
    release: "",
    // For linked documents these will always be useing in Prismic api querying
    // https://prismic.io/docs/rest-api/query-the-api/fetch-linked-document-fields
    fetchLinks: [
      "post.title",
      "post.image",
      "post.description",
      "post.date",
      "post.color",
      "service.color",
    ],
  },
  // Templating config
  template: {
    module: "ejs",
    dir: path.join(root, "template"),
    layout: path.join(root, "template/index.html"),
    pagesDir: path.join(root, "template", "pages"),
    partialsDir: path.join(root, "template", "partials"),
    staticDir: path.join(root, "static"),
  },
  // Express.js config
  express: {
    port: 3000,
  },
  // Browser-sync config
  browser: {
    port: 3001,
  },
  // Static assets config
  static: {
    // One day
    maxAge: 86400000,
    js: `/js/app.js`,
    css: `/css/screen.css`,
    minify: {
      // html-minifier config
      html: {
        caseSensitive: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: false,
        keepClosingSlash: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
      },
    },
  },
  // Compression js config
  compression: {
    level: 9,
    threshold: 0,
  },
  // Generators config ( sitemap.xml, robots.txt, static )
  generate: {
    sitemap: {
      site: false,
    },
    robots: {
      site: false,
      page: false,
    },
    mappings: {
      post: "blog",
      service: "services",
    },
  },
};

// Local dev URL
if (config.env.sandbox) {
  config.url = `http://localhost:${config.browser.port}`;
}

module.exports = config;
