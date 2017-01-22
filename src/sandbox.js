import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {makeHTTPDriver} from '@cycle/http';
import {Memepool} from './memepool.js';
import onionify from 'cycle-onionify';
import DHEBridge from './dhe-bridge.js';
import {Router} from './router.js';
require("./style.scss");

import {AddrView} from './components/addr.js';
import {DHExtension} from './components/dhe.js';

// This should manage the current chain endpoint
// Chain endpoints must be one of the following:
// 1. passive
//    no fork, just sniff the input and use native web3
//
// 2. native fork
//    fork off the native web3 provided by the client
//    e.g. Metamask
//
// 3. custom fork from rpc
//    fork off a given rpc endpoint provided by the user
//
// 4. custom semantic rpc fork
//    fork off a given semantic pointer
//    Semantic pointer which should be supported are:
//    rposen, morden, livenet...

const main = (sources) => {

  const dhex = DHExtension(sources);

  return {
    DOM: dhex.DOM,
    HTTP: dhex.HTTP,
    onion: dhex.onion,
    Sniffer: dhex.Sniffer
  };
}

// TODO - this should be called whenever dhe triggers some event
const onout = Router.process('the one and only client');

// TODO - Streamify? My brain still thinks in closures.
const in$Make = (fork) => xs.create({
  start: listener => {
    Router.registerClient('the one and only client', msg => {
      listener.next(msg)
    })
    Router.registerChain('the one and only client', 'native', {
      type: "native",
      chain: fork
    });
  },
  stop: () => {}
})

// Fake incomming sniffer msgs
const out$ = xs
.periodic(1000)
.mapTo({
  type: "RES",
  req: {
    "jsonrpc":"2.0",
    "method":"eth_call",
    "params":[{
      "data":"0x4579268a",
      "to":"0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a"
    }],
    "id":1
  },
  res: "0x123"})

module.exports = {
  main,
  onout,
  in$Make,
  out$
};
