const path = require('path');
require('babel-core/register');

const specsPath = 'uiTests';
const outputPath = 'uiTestResult';
const courgettePath = 'node_modules/courgette/uiTestHelpers';

exports.pomConfig = {
  outputPath,
  timeoutInSeconds: process.env.courgetteTimeout || 10, // minimum 2 or you'll see strange behaviour with some steps
  pagesPath: path.resolve(specsPath, 'pages'),
  componentsPath: path.resolve(specsPath, 'components'),
  baseUrl: 'https://www.google.com', // <------------ SET THE URL TO YOUR PROJECT HERE
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

const browserCapability = capabilities[process.env.browser || 'firefox'];

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
    'acceptInsecureCerts': true, // ignores SSL warnings
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
      `${courgettePath}/hooks/pageObjectModelBefore.js`,
      `${courgettePath}/hooks/addMethodsBefore.js`,
      `${courgettePath}/hooks/setDefaultTimeout.js`,
      `${courgettePath}/stepDefinitions/*.js`,
      `${specsPath}/stepDefinitions/*.js`,
      // `${specsPath}/helpers/hooks.js`,
    ],
    'tags': ['~ignore'].concat(cukeTags || []),
    'format': [
      'node_modules/courgette/cucumberFormatter.js',
      `json:./${outputPath}/report.json`,
    ].concat(process.env.showStepDefinitionUsage ? 'node_modules/cucumber/lib/formatter/usage_formatter.js' : []),
    'profile': false,
    'no-source': true,
  },
  onPrepare: () => { browser.ignoreSynchronization = true; },
};

exports.config = protractorConfig;
