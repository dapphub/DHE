import {run} from '@cycle/xstream-run';
import xs from 'xstream';
import {makeHTTPDriver} from '@cycle/http';
import {Memepool} from './memepool.js';
import onionify from 'cycle-onionify';
import DHEBridge from './dhe-bridge.js';
import {Router} from './router.js';
require("./style.scss");

import {AddrView} from './components/addr.js';
import {DHExtension} from './components/dhe.js';
import {main, onout, in$, out$} from './sandbox.js';

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var fork = web3.currentProvider;

run(onionify(main), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Sniffer: DHEBridge({ onout, in$: xs.merge(
    in$: in$Make(fork),
    out$
  ) }),
});
