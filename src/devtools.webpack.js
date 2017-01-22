import _ from "lodash";
import {webpackMain} from './devtools.js'

try {
  webpackMain(chrome, console, Math)
} catch (e) {
  console.err('DappHub Explorer developer tab error: ' + e);
}
