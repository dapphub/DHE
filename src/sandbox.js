import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {makeHTTPDriver} from '@cycle/http';
import {Memepool} from './memepool.js';
import onionify from 'cycle-onionify';
require("./style.scss");


import {AddrView} from './components/addr.js';
import {DHExtension} from './treeview.js';

const FakeSniffer = (in$) => {

  in$
  .addListener({
    next: e => console.log("sniffer", e),
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  return xs
  .periodic(1000)
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
  console.log(sources);

  // sources.props = props$;
  // const vdom$ = AddrView(sources).DOM;
  const dhex = DHExtension(sources);


  return {
    DOM: dhex.DOM,
    // HTTP: memepool.HTTP,
    HTTP: dhex.HTTP,
    onion: dhex.onion,
    Sniffer: dhex.web3$
  };
}

run(onionify(main), {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  Sniffer: FakeSniffer
});
