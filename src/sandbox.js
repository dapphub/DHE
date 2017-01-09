import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {makeHTTPDriver} from '@cycle/http';
import {Memepool} from './memepool.js';
import onionify from 'cycle-onionify';
import setUpEngine from './testrpc.js';
require("./style.scss");


import {AddrView} from './components/addr.js';
import {DHExtension} from './components/dhe.js';

const ForkManager = {
  forks: [],
  newFork: function(type) {
    if(!type) console.log("WARN: no fork type given");
    const fork = setUpEngine({})
    this.forks.push(fork);
    return {id: this.forks.length - 1, fork};
  },
  resetFork: function(id) {
    this.forks[id] && this.forks[id].stop();
    this.forks[id] = setUpEngine({});
    return this.forks[id];
  }
}

const FakeSniffer = (in$) => {

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
  //
  // var {fork, id} = ForkManager.newFork()
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  var fork = web3.currentProvider;

  // TODO
  //       1. modularize fork/ chain selection
  //       2. analyze chain type
  //       3. push chaintype, forktype to DHE


  const out$ = xs
  .periodic(1000)
  // .of(1)
  .mapTo({
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

  const resp$ = xs.create({
    start: listener => {
      in$.addListener({
        next: r => {
          const handleRequest = (e) => {
            switch(e.type) {
              case "REQ":
                console.log(1, e.req);
                fork.sendAsync(e.req, (err, res) => {
                  console.log(err, res);
                  let resp = {type: "RES", res, req: e.req};
                  listener.next(_.assign({}, e, resp));
                })
                break;
              case "DH_RESET_FORK":
                fork = ForkManager.resetFork(id);
                break;
              default:
                console.log("NO SNIFFER HANDLER FOR", e);
            }
          }
          if(Array.isArray(r)) {
            r.forEach(handleRequest);
          } else {
            handleRequest(r);
          }
        },
        error: e => console.log(e),
        complete: e => console.log(e)
      })
    },
    stop: () => {}
  })

  return xs.merge(out$, resp$)

}

const addr = "0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a";

const main = (sources) => {
  // const memepool = Memepool({
  //   sources.Sniffer,
  //   HTTP: sources.HTTP
  // });
  //
  // const props$ = memepool.state$
  // .filter(state => addr in state.addrs)
  // .map(state => ({
  //   index: addr,
  //   name: addr,
  //   type: "addr",
  //   state: state.addrs[addr],
  //   selected: true
  // }))
  // console.log(sources);

  // sources.props = props$;
  // const vdom$ = AddrView(sources).DOM;
  const dhex = DHExtension(sources);

  return {
    DOM: dhex.DOM,
    // HTTP: memepool.HTTP,
    HTTP: dhex.HTTP,
    onion: dhex.onion,
    Sniffer: dhex.Sniffer
  };
}

run(onionify(main), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Sniffer: FakeSniffer
});
