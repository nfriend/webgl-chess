const webpackConfig = require('./webpack.config.js');

module.exports = config => {
    config.set({
        basePath: '',
        browsers: ['Chrome'],
        frameworks: ['jasmine'],
        reporters: ['spec'],
        specReporter: {
            maxLogLines: 5,             // limit number of lines logged per test
            suppressErrorSummary: true, // do not print error summary
            suppressFailed: false,      // do not print information about failed tests
            suppressPassed: false,      // do not print information about passed tests
            suppressSkipped: true,      // do not print information about skipped tests
            showSpecTiming: false       // print the time elapsed for each spec
        },
        files: [
            { pattern: './node_modules/jquery/dist/jquery.js', watched: false, included: true },
            { pattern: './node_modules/angular/angular.js', watched: false, included: true },
            { pattern: './node_modules/angular-aria/angular-aria.js', watched: false, included: true },
            { pattern: './node_modules/angular-animate/angular-animate.js', watched: false, included: true },
            { pattern: './node_modules/angular-material/angular-material.js', watched: false, included: true },
            { pattern: './node_modules/angular-mocks/angular-mocks.js', watched: false, included: true },
            { pattern: './node_modules/angular-ui-router/release/angular-ui-router.js', watched: false, included: true },
            { pattern: '**/*.spec.ts', watched: false },
        ],
        preprocessors: {
            '**/*.spec.ts': ['webpack']
        },
        port: 9876,
        colors: true,

        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only'
        },

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,
    });
};