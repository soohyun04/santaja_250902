// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // .geojson 파일을 소스 모듈로 인식하게 추가
  config.resolver.sourceExts.push('geojson');

  return config;
})();
