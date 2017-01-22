require("./style.scss");
import {webpackMain} from './sandbox.js';

try {
  webpackMain()
} catch (e) {
  console.err('DappHub Explorer failed. Error: ' + e);
}
