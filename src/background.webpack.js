import {webpackMain} from './background.js';

try {
  webpackMain(chrome, console)
} catch (e) {
  console.err('DappHub Explorer Background error: ' + e);
}
