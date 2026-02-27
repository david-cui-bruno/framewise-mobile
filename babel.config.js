module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      ["react-native-css-interop/dist/babel-plugin", { nativeStyleToProp: { "className": true } }],
      "react-native-reanimated/plugin",
    ],
  };
};
