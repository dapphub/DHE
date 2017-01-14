////////////////////
////////////////////
const forkMode = true;
const debug = 1;
////////////////////
////////////////////

var setUpEngine = require('./testrpc.js');
const levelup = require('levelup');
const level = require('level-js');
import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import {run} from "@cycle/xstream-run";
import {Router} from './router.js';
import onionify from 'cycle-onionify';
import _ from 'lodash';

var name2tabid = {};

const dheManager = (msg) => {
  // Handle request from devtools
  chrome.extension.onConnect
  .addListener(function (port) {

    const setUpRouter = (clientid) => {
      Router.registerClient(clientid, (res, req) => {
        // console.log(1,res);
        if(res.type === "RES") {
          // send back to dapp
          chrome.tabs.sendMessage(name2tabid[clientid], res)
        } else {
          // console.log("this", res);
        }
        // Send to dev tool panel
        port && port.postMessage(res);
        // {
        //   type: "RES",
        //   res: res,
        //   req: req
        // }
      })

      // TODO - this is designed to serve as a fallback provider
      //        its verry likely that the callback
      //        don't work as intended
      const forkSource = {
        sendAsync: (payload, callback) => {
          chrome.tabs.sendMessage(name2tabid[clientid], {
            type: "REQ",
            req: payload
          })
          origMSGpassCallback[payload.id] = callback;
        },
        send: () => {
          throw new Error("sync requests are not supported");
        }
      }
      Router.registerChain(clientid, "native", {
        type: "native",
        chain: forkSource
      })
    }

    // TODO - better name
    // holds the callbacks for each payload id
    var origMSGpassCallback = {}

    // dapp => bg
    var middleware = function (message, sender) {
      Router.process(port.name)(message)
      // if(debug >= 1) console.log("Adding Middleware", sender);

      // if(debug >= 2) console.log(">>", message);
      // if(message.type === "REQ" && forkMode && engine) {
      //   engine.sendAsync(message.req, (err, res) => {
      //     if(debug >= 2) console.log("<<", res);
      //     // send back to content script
      //     chrome.tabs.sendMessage(sender.tab.id, {
      //       type: "RES",
      //       res: res
      //     })
      //     // Send to dev tool panel
      //     port && port.postMessage({
      //       type: "RES",
      //       res: res,
      //       req: message.req
      //     });
      //   })
      // }
      if(message.type === "RES") {
        console.log("NEVER EXPECTED TO GET HERE", new Error());
        // chrome.tabs.sendMessage(sender.tab.id, {
        //   type: "RES",
        //   res: message.res,
        //   req: message.req
        // })
        // port && port.postMessage(message);
      }
      if(message.type === "RES") {
        console.log("DUNNO WHAT THIS IS");
        let id = message.res.id;
        // TODO - forward errors
        // origMSGpassCallback[id](null, message.res);
        // delete origMSGpassCallback[id];
      }
    }


    var onDHEMsg = function (message, _port) {
      msg({
        type: "MSG",
        name: _port.name,
        msg: message,
        port: _port
      })
      return null;
      // if(debug >= 1) console.log("Adding Testrpc", message, port);
      const sendToOrigWeb3 = (tabId) => (payload, cb) => {
        origMSGpassCallback[payload.id] = cb;
        chrome.tabs.sendMessage(tabId, {
          type: "REQ",
          req: payload
        })
      }

      switch(message && message.type) {
        case "CONNECT":
          name2tabid[_port.name] = message.tabid;
          setUpRouter(_port.name);
          // msg({
          //   type: "CONNECT",
          //   name: _port.name
          // })
          break;
        case "start":
          //TODO - better name for sendToWeb3
          const sendToWeb3 = sendToOrigWeb3(message.tabId);
          const db = levelup("/db", {
            db: level
          });
          // this takes care of rerouting forked requests back
          // into the browser.
          const forkSource = {
            sendAsync: (payload, callback) => {
              sendToWeb3(payload, callback);
            },
            send: () => {
              throw new Error("sync requests are not supported");
            }
          }

          // TODO - switch between different fork sources
          // engine = setUpEngine({db, forkSource})
          console.log("init testrpc", port);
          break;
        case "REQ":
          // engine.sendAsync(message.req, (err, res) => {
          //   port && port.postMessage({
          //     type: "RES",
          //     res: res,
          //     req: message.req
          //   });
          // })
          break;
      }

    }

    port.onMessage.addListener(onDHEMsg)

    port.onDisconnect.addListener(function (_port) {
      msg({
        type: "DISCONNECT",
        name: _port.name
      })
    })

  });
};

// in$  - messages, which should be send to DHE
// out$ - messages received from DHE
const DappDriver = (in$) => {
  in$
  .addListener({
    next: (msg) => {
      // omit msg.sender and msg.chainid
      chrome.tabs.sendMessage(msg.sender, msg)
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  return xs.create({
    start: listener => {
      chrome.extension.onMessage
      .addListener((msg, sender) => {
        listener.next(_.assign(
          {},
          msg,
          {sender: sender.tab.id}))
      })
    },
    stop: () => {}
  })
}

const DHEDriver = (in$) => {

  var name2sender = {};
  var sender2port = {};

  in$
  .addListener({
    next: msg => {
      if(msg.sender in sender2port) {
        sender2port[msg.sender].postMessage(msg);
      }
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  return xs.create({
    start: listener => {
      dheManager((msg) => {
        if(msg.msg.type === "CONNECT") {
          name2sender[msg.name] = msg.msg.tabid;
          sender2port[msg.msg.tabid] = msg.port;
        } else if(msg.name in name2sender) {
          msg.msg.sender = name2sender[msg.name];
        }
        listener.next(msg.msg);
      })
    },
    stop: () => {}
  })

}

const ChainDriver = (in$) => {

  const forkSource = 'http://localhost:8545';
  const fork = setUpEngine({forkSource})

  return xs.create({
    start: listener => {
      in$
      .addListener({
        next: ({msg, sender, chainid}) => {
          fork
          .sendAsync(msg.req, (err, res) => {
            var response = {type: "RES", res, req: msg.req};
            listener.next({res: response, sender})
          })
        },
        error: e => console.log(e),
          complete: e => console.log(e)
      })
    },
    stop: () => {}
  })
}

// TODO - make an consistent msg format
function main({Dapp, DHE, Chain, onion}) {

  // TODO - get msg type here right
  const dappreq$ = Dapp
  .filter(msg => msg.type === "REQ")
  .compose(sampleCombine(onion.state$))
  .map(([msg, state]) =>
    _.assign({}, msg, {chainid: state.selected[msg.sender]})
  )

  const dhereq$ = DHE
  .filter(msg => msg.type === "REQ")
  .compose(sampleCombine(onion.state$))
  .map(([{req, sender}, state]) => ({
    type: "REQ",
    req,
    sender,
    chainid: state.selected[sender]
  }))

  const req$ = xs.merge(dappreq$, dhereq$)

  // send requests to a fork
  const forkReq$ = req$
  .filter(({chainid}) => !!chainid);

  forkReq$
  .addListener({
    next: e => console.log("fork", e),
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  // send request back to the dapps web3
  const nativeReq$ = req$
  .filter(({chainid}) => !chainid)

  const dappres$ = Dapp
  .filter(msg => msg.type === "RES")

  const forkres$ = Chain
  .map(({res, sender}) => ({msg: res, sender}))

  const res$ = xs.merge(dappres$, forkres$)

  const initialStateReducer$ = xs.of(function initialStateReducer() {
    return {
      forks: {},
      selected: {}
    };
  })

  return {
    Dapp: xs.merge(res$, nativeReq$), // {msg, sender}
    DHE: xs.merge(res$),
    Chain: forkReq$, // {msg, sender, chainid}
    onion: xs.merge(
      initialStateReducer$
    )
  };
}

run(onionify(main), {
  Dapp: DappDriver,
  DHE: DHEDriver,
  Chain: ChainDriver
})
