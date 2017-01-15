import {run} from '@cycle/xstream-run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import onionify from 'cycle-onionify';
import {FakeSniffer, main} from './sandbox.js';
require("./style.scss");

run(onionify(main), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Sniffer: FakeSniffer
});
