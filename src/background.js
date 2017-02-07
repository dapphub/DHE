////////////////////
////////////////////
const forkMode = true;
const debug = 1;
////////////////////
////////////////////
var setUpEngine = require("./testrpc.js");
const levelup = require("levelup");
const level = require("level-js");
import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { run } from "@cycle/xstream-run";
import { Router } from "./router.js";
import onionify from "cycle-onionify";
import _ from "lodash";

var name2tabid = {};

const dheManager = _.curry((chrome, msg) => {
  // Handle request from devtools
  chrome.extension.onConnect.addListener(function(port) {
    const onDHEMsg = function(message, _port) {
      msg(_.assign({}, message, {port: _port}));
    };
    const onDisconnect = function(_port) {
      port.onMessage.removeListener(onDHEMsg);
      port.onDisconnect.removeListener(onDisconnect);
      msg({type: "DISCONNECT", port: _port});
    }

    port.onMessage.addListener(onDHEMsg);
    port.onDisconnect.addListener(onDisconnect);
  });
});

// in$  - messages, which should be send to DHE
// out$ - messages received from DHE
const DappDriver = _.curry((chrome, console, in$) => {
  in$.addListener({
    next: msg => {
      chrome.tabs.sendMessage(msg.sender, _.omit(msg, [ "sender", "chainid" ]));
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  });

  return xs.create({
    start: listener => {
      chrome.extension.onMessage.addListener((msg, sender) => {
        listener.next(_.assign({}, msg, { sender: sender.tab.id }));
      });
    },
    stop: () => {}
  });
});

const DHEDriver = _.curry((chrome, console, in$) => {
  var name2sender = {};
  var sender2port = {};

  in$.addListener({
    next: msg => {
      if (msg.sender in sender2port) {
        sender2port[msg.sender].postMessage(msg);
      }
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  });

  return xs.create({
    start: listener => {
      dheManager(chrome, msg => {
        if (msg.type === "CONNECT") {
          // TODO rename tabid to sender?
          name2sender[msg.port.name] = msg.tabid;
          sender2port[msg.tabid] = msg.port;
          msg.sender = msg.tabid;
        } else if(msg.type === "DISCONNECT") {
          let sender = name2sender[msg.port.name];
          delete name2sender[msg.port.name];
          delete sender2port[sender];
        } else if (msg.port.name in name2sender) {
          msg.sender = name2sender[msg.port.name];
        }
        listener.next(msg);
      });
    },
    stop: () => {}
  });
});

const ChainDriver = _.curry((console, in$) => {
  // const forkSource = "http://localhost:8545";
  const db = levelup("/db", { db: level });
  // const fork = setUpEngine({ forkSource, db });
  const chains = {};

  return xs.create({
    start: listener => {
      in$.addListener({
        // TODO - change forkReq format
        next: (msg) => {
          switch(msg.type) {
            case "REQ":
              if(msg.req.method === "eth_sendTransaction") {
                msg.req.params = [
                  _.assign({}, _.omit(msg.req.params[0], ['gasPrice']), {})
                ]
              }
              chains[msg.chainid].chain.sendAsync(msg.req, (err, res) => {
                var response = { type: "RES", res, req: msg.req, sender: msg.sender };
                listener.next(response);
              });
              break;
            case "NEW_FORK": // { name, sender, rpc }
              if(chains[msg.name]) console.error(`Chain with the name ${msg.name} already exists, overwriting may cause WW3.`)
              let forkSource = msg.rpc;
              let setup = { db };
              if(!msg.fromrpc) {
                // FORK from native web3
                // this involves sending requests back to the dapp,
                // remember the callback, and call it once a response
                // arrives.
                // TODO - this needs a cleaner architecture and a review
                forkSource = {
                  sendAsync: (payload, callback) => {
                    // TODO - refactor this outu together with content's native
                    //        callback rememberance methods
                    listener.next({
                      type: "REQ",
                      req: payload,
                      sender: msg.sender
                    })
                    chains[msg.name].cbs[payload.id] = callback;
                  },
                  send: () => {
                    throw new Error("sync requests are not supported");
                  }
                }
                // remember sender for fork rerouting
                setup.from = msg.sender;
              }
              setup.forkSource = forkSource;
              chains[msg.name] = {
                chain: setUpEngine(setup),
                setup,
                cbs: {} // callback for native forks
              }
              break;
            case "RESET_FORK":
              console.log("reset", msg);
              chains[msg.chainid].chain =
                setUpEngine(chains[msg.chainid].setup)
              break;
            case "RES": // { chainid, req, res, sender }
              if(!(msg.req.id in chains[msg.chainid].cbs)) {
                console.log(`WARN: no callback known for fork response with id ${msg.req.id}`, msg)
                return null;
              }
              chains[msg.chainid].cbs[msg.req.id](null, msg.res);
              delete chains[msg.chainid].cbs[msg.req.id];
          }
        },
        error: e => console.log(e),
        complete: e => console.log(e)
      });
    },
    stop: () => {}
  });
});

// TODO - make an consistent msg format
// ## Dapp
// -> REQ:
// -> RES:
//
// <- REQ:
// <- RES:
//
// ## DHE
// -> NEW_FORK { name, port, sender }
//
// ## Chain
// -> FORK_REQ
// -> REQ
//
// <- FORK_RES
// <- RES
//
// ## onion
// TODO - imidiatelly notify DHE for the defaultAccount and height
function main({ Dapp, DHE, Chain, onion }) {

  // TODO - get msg type here right
  const dappreq$ = Dapp
    .filter(msg => msg.type === "REQ")
    .compose(sampleCombine(onion.state$))
    .map(
      ([ msg, state ]) => {
        let msg_ = _.assign({}, msg, { chainid: state.selected[msg.sender] })
        // if(msg_.req.method === "eth_call" || msg_.req.method === "eth_sendTransaction") msg_.req.params[0].from = state.accounts[0];
        return msg_;
      }
    )

  const dhereq$ = DHE
    .filter(msg => msg.type === "REQ")
    .compose(sampleCombine(onion.state$))
    .map(
      ([ { req, sender }, state ]) =>
        ({ type: "REQ", req, sender, chainid: state.selected[sender] })
    )

  const chaintypeReq$ = DHE
  .filter(msg => msg.type === "GET_CHAINTYPE")

  const newForkReq$ = DHE
  .filter(msg => msg.type === "NEW_FORK")

  const resetReq$ = DHE
  .filter(msg => msg.type === "RESET_FORK")
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => _.assign({}, msg, {
    chainid: state.selected[msg.sender]
  }))

  const changeChain$ = DHE
  .filter(msg => msg.type === "CHANGE_CHAIN")
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => {
    var selected;
    if(msg.name === "native") {
      selected = Object.keys(state.chains)
      .find(name => state.chains[name].owner === msg.sender)
    } else {
      selected = msg.name;
    }
    msg.name = selected;
    return msg;
  })

  const chaintypeRes$ = chaintypeReq$
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => {
    let selected = state.selected[msg.sender];
    return {
      sender: msg.sender,
      port: msg.port,
      type: "CHAINTYPE",
      chaintype: state.chains[selected].type
    };
  })

  const accountReducer$ = Dapp
  .filter(msg => msg.type === "RES")
  .filter(msg => msg.req.method === "eth_accounts")
  .map(msg => function accountReducer(parent) {
    parent.accounts = msg.res.result
    return _.assign({}, parent);
  })

  const newChaintypeChange$ = xs.merge(newForkReq$, changeChain$)
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => {
    let name = /^native_/.test(msg.name) ? "native" : msg.name;
    return ({
      type: "CHAININFO",
      port: msg.port,
      sender: msg.sender,
      chaintype: state.chains[msg.name].type,
      selected: name,
      accounts: state.accounts
    })
  })
  .debug("info")

  const chainListChange$ = newForkReq$
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => {
    let chains = _.map(state.chains, (info, name) => {
      if("owner" in info) {
        if(info.owner !== msg.sender) return null
        return "native";
      } else {
        return name;
      }
    })
    .filter(name => !!name)

    return ({
      sender: msg.sender,
      port: msg.port,
      type: "CHAIN_LIST",
      chains: chains
    })
  })

  const req$ = xs.merge(dappreq$, dhereq$);

  const isNative = (name) => !name || /^native_/.test(name)
  // send requests to a fork
  const forkReq$ = req$
  .filter(({ chainid }) => !isNative(chainid))

  const requests2fork$ = forkReq$
  .filter(msg => msg.req.method !== "eth_accounts")

  const forkAccountsRes$ = forkReq$
  .filter(msg => msg.req.method === "eth_accounts")
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) => _.assign({}, msg, {res: {
    id: msg.req.id,
    jsonrpc: "2.0",
    result: state.accounts
  }, type: "RES"}))

  // send request back to the dapps web3
  const nativeReq$ = req$.filter(({ chainid }) => isNative(chainid))

  const dappres$ = Dapp.filter(msg => msg.type === "RES")

  const forkres$ = Chain
  .filter(msg => msg.type === "RES")
  // .map(({ res, sender }) => ({ msg: res, sender }));

  const forkNativeReq$ = Chain
  .filter(msg => msg.type === "REQ")

  const dappres2dapp$ = dappres$
  .compose(sampleCombine(onion.state$))
  .filter(([msg, state]) => {
    let chainid = state.selected[msg.sender];
    return isNative(chainid);
    // let chain = state.chains[selected];
    // console.log(state, msg);
    // return chain.type === "native"
  })
  .map(([msg, state]) => msg)

  const dappres2fork$ = dappres$
  .compose(sampleCombine(onion.state$))
  .filter(([msg, state]) => {
    let chainid = state.selected[msg.sender];
    return !isNative(chainid);
  })
  .map(([msg, state]) => _.assign({}, msg, {
    chainid: state.selected[msg.sender]
  }))

  const res$ = xs.merge(dappres2dapp$, forkres$, forkAccountsRes$);

  const initNativeReducer$ = DHE
  .filter(msg => msg.type === "CONNECT")
  .map(msg => function initNativeReducer(parent) {
    parent.chains["native_" + msg.sender] = {
      type: "native",
      owner: msg.sender
    }
    parent.selected[msg.sender] = "native_" + msg.sender;
    return _.assign({}, parent)
  })

  const selectForkReducer$ = newForkReq$
  .map(msg => function selectForkReducer(parent) {
    parent.selected[msg.sender] = msg.name;
    parent.chains[msg.name] = {
      type: "fork"
    };
    return _.assign({}, parent)
  })

  // If a new fork is created, make sure the accounts are updated based on the fork source
  // const newForkAccountReq$ = newForkReq$
  // .map(msg => ({type: "REQ", sender: msg.sender, req: {
  //   id: Math.floor(Math.random() * 100000),
  //   method: "eth_accounts",
  //   jsonrpc: "2.0",
  //   params: []
  // }}))

  const changeChainReducer$ = changeChain$
  // .compose(sampleCombine(onion.state$))
  .map((msg) => function changeChainReducer(parent) {
    parent.selected[msg.sender] = msg.name;
    return _.assign({}, parent)
  })

  const initialStateReducer$ = xs.of(function initialStateReducer() {
    return {
      chains: {}, // fork_name => ???
      selected: {}, // sender => fork_name
      accounts: ["0x0000000000000000000000000000000000000000"]
    };
  });

  return {
    // {msg, sender}
    Dapp: xs.merge(
      res$,
      nativeReq$,
      forkNativeReq$
    ),
    DHE: xs.merge(
      res$,
      nativeReq$,
      chaintypeRes$,
      newChaintypeChange$,
      chainListChange$
    ),
    // {msg, sender, chainid}
    Chain: xs.merge(
      requests2fork$,
      newForkReq$,
      resetReq$,
      dappres2fork$
    ),
    onion: xs.merge(
      initialStateReducer$,
      selectForkReducer$,
      initNativeReducer$,
      changeChainReducer$,
      accountReducer$
    )
  };
}

function webpackMain(chrome, console) {
  run(onionify(main), {
    Dapp: DappDriver(chrome, console),
    DHE: DHEDriver(chrome, console),
    Chain: ChainDriver(console)
  });
}

module.exports = {
  ChainDriver,
  DappDriver,
  DHEDriver,
  dheManager,
  main,
  webpackMain
}
