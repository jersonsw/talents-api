const { register } = require('tsconfig-paths');

register({
  baseUrl: './',
  paths: require('./tsconfig.json').compilerOptions.paths,
});
