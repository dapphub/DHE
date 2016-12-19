import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {makeHTTPDriver} from '@cycle/http';
import {Memepool} from './memepool.js';
require("./style.scss");


import {AddrView} from './components/addr.js';

const Sniffer = xs.of({
  req: {
  "jsonrpc":"2.0",
  "method":"eth_call",
  "params":[{
    "data":"0x1234",
    "to":"0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a"
  }],
  "id":1
},
res: "0x123"})

const addr = "0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a";

const main = (sources) => {
  const memepool = Memepool({
    Sniffer,
    HTTP: sources.HTTP
  });

  const props$ = memepool.state$
  .filter(state => addr in state.addrs)
  .map(state => ({
    index: addr,
    name: addr,
    type: "addr",
    state: state.addrs[addr],
    selected: true
  }))

  sources.props = props$;
  const vdom$ = AddrView(sources).DOM;


  return {
    DOM: vdom$,
    HTTP: memepool.HTTP
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
