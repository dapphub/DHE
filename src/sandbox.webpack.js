require("./style.scss");
import {webpackMain} from './sandbox.js';

try {
  webpackMain()
} catch (e) {
  console.err('DappHub Explorer Sandbox error: ' + e);
}
