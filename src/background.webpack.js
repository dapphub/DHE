import {webpackMain} from './background.js';

try {
  webpackMain()
} catch (e) {
  console.err('DappHub Explorer Background error: ' + e);
}
