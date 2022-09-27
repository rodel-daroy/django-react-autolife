require("babel-register");
const router = require("../App").default;
const Sitemap = require("../").default;

new Sitemap(router).build("https://www.autolife.ca").save("./sitemap.xml");
