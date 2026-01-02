// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add the NativeWind transformer
module.exports = withNativeWind(config, {
  input: "./app/globals.css", // Path to your global Tailwind CSS file
});
