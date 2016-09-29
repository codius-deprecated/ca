module.exports = function (wallaby) {
  return {
    files: [
      'src/**/*.js',
      'test/helpers/*.js',
      'example/**/*',
      'index.js'
    ],

    tests: [
      'test/*.spec.js'
    ],

    testFramework: 'mocha',

    env: {
      type: 'node',
      runner: 'node',
      params: {
        env: 'NODE_ENV=unit'
      }
    },

    bootstrap: function () {
      require('co-mocha')(wallaby.testFramework.constructor)
    }
  }
}
