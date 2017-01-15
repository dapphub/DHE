import {button, span, div, label, input, hr, h1} from '@cycle/dom';
import xs from 'xstream';
import {Memepool} from './memepool.js';
import onionify from 'cycle-onionify';
import setUpEngine from './testrpc.js';


import {AddrView} from './components/addr.js';
import {DHExtension} from './components/dhe.js';

const ForkManager = {
  forks: [],
  newFork: function(type, _setUpEngine=setUpEngine) {
    if(!type) console.log("WARN: no fork type given");
    const fork = _setUpEngine({})
    this.forks.push(fork);
    return {id: this.forks.length - 1, fork};
  },
  resetFork: function(id, _setUpEngine=setUpEngine) {
    this.forks[id] && this.forks[id].stop();
    this.forks[id] = _setUpEngine({});
    return this.forks[id];
  }
}

const FakeSniffer = (in$, _setUpEngine=setUpEngine) => {

  var {fork, id} = ForkManager.newFork(undefined, _setUpEngine)

  const out$ = xs
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

  const resp$ = xs.create({
    start: listener => {
      in$.addListener({
        next: r => {
          console.log("rr",r)
          const handleRequest = (e) => {
            switch(e.type) {
              case "DH_REQ":
                fork.sendAsync(e.req, (err, res) => {
                  let resp = {type: "DH_RES", res, req: e.req};
                  listener.next(_.assign({}, e, resp));
                })
                break;
              case "DH_RESET_FORK":
                fork = ForkManager.resetFork(id, _setUpEngine);
                break;
              default:
                console.log("NO SNIFFER HANDLER FOR", e);
            }
          }
          console.log("!",r);
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

module.exports = {
  FakeSniffer,
  ForkManager,
  main
};
