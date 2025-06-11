// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("cjs");
// Isto é essencial para contornar o registro do Auth
config.resolver.unstable_enablePackageExports = false;

module.exports = config;