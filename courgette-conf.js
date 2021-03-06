const path = require('path');
require('babel-core/register');

// This config file is used to validate the pre-defined
// reusable generic step definitions in this repo

const specsPath = 'testsToValidateStepDefinitions';
const outputPath = 'uiTestResult';
const courgettePath = 'uiTestHelpers';

exports.pomConfig = {
  outputPath,
  timeoutInSeconds: process.env.courgetteTimeout || 10,
  pagesPath: path.resolve(specsPath, 'pages'),
  componentsPath: path.resolve(specsPath, 'components'),
  baseUrl: 'http://localhost:3000',
};

exports.cucumberHtmlReporterConfig = {};

const capabilities = {
  chrome: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--window-size=1100,800']
        .concat(process.env.disableHeadless ? [] : ['--headless', '--disable-gpu']),
    },
  },
  firefox: {
    'browserName': 'firefox',
    'moz:firefoxOptions': {
      args: [].concat(process.env.disableHeadless ? [] : ['-headless']),
      prefs: {
        'general.useragent.override': 'Automated tests',
      },
    },
  },
};

const browserCapability = capabilities[process.env.browser || 'chrome'];

const cukeTags = process.env.cukeTags ? process.env.cukeTags.replace(',', ' or ') : '';

const protractorConfig = {
  directConnect: true,
  ignoreUncaughtExceptions: true,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: [
    `${specsPath}/features/**/*.feature`,
  ],
  capabilities: {
    // change acceptInsecureCerts to true if you are testing on https and using self-signed certs
    'shardTestFiles': !cukeTags && !process.env.linearise && !process.env.showStepDefinitionUsage,
    'maxInstances': 4,
    ...browserCapability,
  },
  cucumberOpts: {
    'require': [
      // `${specsPath}/helpers/globals.js`,
      `${courgettePath}/globals.js`,
      `${courgettePath}/hooks/attachScenarioNameBefore.js`,
      `${courgettePath}/hooks/attachScreenshotAfter.js`,
      `${courgettePath}/hooks/deleteAllCookies.js`,
      `${courgettePath}/hooks/pageObjectModelBefore.js`,
      `${courgettePath}/hooks/addMethodsBefore.js`,
      `${courgettePath}/hooks/setDefaultTimeout.js`,
      `${courgettePath}/stepDefinitions/*.js`,
      `${specsPath}/stepDefinitions/*.js`,
      // `${specsPath}/helpers/hooks.js`,
    ],
    'tags': ['~ignore'].concat(cukeTags || []),
    'format': [
      'cucumberFormatter.js',
      `json:./${outputPath}/report.json`,
    ].concat(process.env.showStepDefinitionUsage ? 'node_modules/cucumber/lib/formatter/usage_formatter.js' : []),
    'profile': false,
    'no-source': true,
  },
  onPrepare: () => { browser.ignoreSynchronization = true; },
};

exports.config = protractorConfig;
