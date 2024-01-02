// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

// initialize configuration
const config = getDefaultConfig(__dirname);
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;


// // Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require("@expo/metro-config");

// const defaultConfig = getDefaultConfig(__dirname);
// defaultConfig.resolver.assetExts.push("cjs");

// module.exports = defaultConfig;
