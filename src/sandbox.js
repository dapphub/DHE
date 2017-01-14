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

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
var fork = web3.currentProvider;

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

// const FakeSniffer = (in$) => {
//
//   //
//   // var {fork, id} = Router.newFork()
//   var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
//   var fork = web3.currentProvider;
//
//   // TODO
//   //       [ ] modularize fork/ chain selection
//   //       [x] analyze chain type
//   //       [x] push chaintype, forktype to DHE
//
//   var _listener;
//   // Do all the chain related analytics
//   setTimeout(() => {
//     _listener.next({
//       type: "CHAINTYPE",
//       chaintype: "passive"
//     })
//     web3.eth.getBlock(0, (err, res) => {
//       let types = {
//         "4194102368": "ropsen",
//         "1dcc4de8de": "eth"
//       }
//       _listener.next({
//         type: "CHAINTYPE",
//         chaintype: `passive > ${types[res.hash.slice(2,12)]}`
//       })
//     })
//   }, 1000)
//
//   const out$ = xs
//   .periodic(1000)
//   // .of(1)
//   .mapTo({
//     type: "RES",
//     req: {
//       "jsonrpc":"2.0",
//       "method":"eth_call",
//       "params":[{
//         "data":"0x4579268a",
//         "to":"0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a"
//       }],
//       "id":1
//     },
//     res: "0x123"})
//
//   const resp$ = xs.create({
//     start: listener => {
//       _listener = listener;
//       in$.addListener({
//         next: r => {
//           const handleRequest = (e) => {
//             switch(e.type) {
//               case "REQ":
//                 fork.sendAsync(e.req, (err, res) => {
//                   let resp = {type: "RES", res, req: e.req};
//                   listener.next(_.assign({}, e, resp));
//                 })
//                 break;
//               case "DH_RESET_FORK":
//                 fork = Router.resetFork(id);
//                 break;
//               case "NEW_FORK":
//                 fork = Router.newFork(e);
//                 break;
//               default:
//                 console.log("NO SNIFFER HANDLER FOR", e);
//             }
//           }
//           if(Array.isArray(r)) {
//             r.forEach(handleRequest);
//           } else {
//             handleRequest(r);
//           }
//         },
//         error: e => console.log(e),
//         complete: e => console.log(e)
//       })
//     },
//     stop: () => {}
//   })
//
//   return xs.merge(out$, resp$)
//
// }

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

const in$ = xs.create({
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
// .of(1)
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


run(onionify(main), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Sniffer: DHEBridge({ onout, in$: xs.merge(
    in$,
    out$
  ) }),
});
