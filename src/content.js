////////
////////
const forkMode = true;
const debug = false;
////////
////////

import xs from "xstream";
import fromEvent from "xstream/extra/fromEvent";
import {run} from '@cycle/xstream-run';

var injected = false;
// TODO - better name
var _sendAsync;
// var cbBuffer = {};
var injectingMiddleware = function(web3, web3Event) {
  if (injected) return true;
  injected = true;

  _sendAsync = web3.currentProvider.sendAsync.bind(web3.currentProvider);

  // function injectedDapphub(payload, callback) {

    // if (!forkMode) {
    //   _sendAsync(payload, (err, res) => {
    //     window.postMessage({
    //       type: "REQ",
    //       req: payload,
    //       res: res
    //     }, "*");
    //     callback(err, res);
    //   })
    // } else {

    // web3Event({
    //   payload,
    //   callback
    // })

      // Remember the callbacks from local web3
      // if (Array.isArray(payload)) {
      //   if (debug) console.log(">", payload[0].id, payload[0].method);
      //   cbBuffer[payload[0].id] = callback;
      // } else {
      //   if (debug) console.log(">", payload.id, payload.method);
      //   cbBuffer[payload.id] = callback;
      // }
      // window.postMessage({
      //   type: "REQ",
      //   req: payload
      // }, "*");
    // }
  // }
  // injectedDapphub.__DappHub = true
  web3.currentProvider.sendAsync = web3Event.bind(web3.currentProvider);

  // const msg$ = fromEvent(window, "message")
  // .filter(_ => forkMode)
  // .map(msg => msg.data)

  // msg$
  // .filter(msg => msg.type === "RES")
  // .map(msg => {
  //   if (Array.isArray(msg.res)) {
  //     if (debug) console.log("<", msg.res[0].id);
  //     cbBuffer[msg.res[0].id](null, msg.res);
  //     delete cbBuffer[msg.res[0].id];
  //   } else {
  //     if (debug) console.log("<", msg.res.id);
  //     cbBuffer[msg.res.id](null, msg.res);
  //     delete cbBuffer[msg.res.id];
  //   }
  // })
  // .addListener({
  //   next: e => console.log("45", e),
  //   error: e => console.log(e),
  //   complete: e => console.log(e)
  // })

  // msg$
  // .filter(msg => msg.type === "REQ")
  // .map(msg => {
  //   _sendAsync(msg.req, (e, res) => {
  //     window.postMessage({
  //       type: "RES",
  //       res: res
  //     }, "*");
  //   });
  // })
  // .addListener({
  //   next: e => console.log("21", e),
  //   error: e => console.log(e),
  //   complete: e => console.log(e)
  // })

}


// Dapp - payload
function main({Msg, Chain, Dapp}) {

  // TODO
  //   [ ] post "REQ" msg to background page
  const dappReq$ = Dapp
  .map(req => ({type: "REQ", req}))

  const res$ = Msg
  .filter(msg => msg.type === "RES")
  .map(msg => msg.res)

  const req$ = Msg
  .filter(msg => msg.type === "REQ")

  const chainRes$ = Chain

  return {
    Msg: xs.merge(
      dappReq$,
      chainRes$
    ),
    Chain: xs.merge(req$),
    Dapp: res$
  }
}

// in$  - messages to the background page
// out$ - messages from the background page
const MsgDriver = (in$) => {

  in$
  .addListener({
    next: (msg) => {
      window.postMessage({msg, type: "BRIDGE_OUT"}, "*");
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  // TODO - look for a way to filter only for background pages
  // or delete it if it works
  return fromEvent(window, "message")
  .filter(msg => msg.data.type === "BRIDGE_IN")
  .map(msg => msg.data.msg)
}

// in$  - requests to the chain
// out$ - responses from the chain
const ChainDriver = (in$) => {

  return xs.create({
    start: listener => {
      in$
      .addListener({
        next: ({req}) => {
          let request = JSON.parse(JSON.stringify(req));
          // Set default account if no from value is given
          if(request.method === "eth_call" || request.method === "eth_sendTransaction") {
            if(!request.params[0].from || request.params[0].from === "")
              request.params[0].from = web3.eth.defaultAccount;
          }
          _sendAsync(request, (e, res) => {
            listener.next({type: "RES", res, req})
          });
        },
        error: e => console.log(e),
        complete: e => console.log(e)
      })
    },
    stop: () => {}
  })

}


// in$  - web3 responses to the dapp
// out$ - catched web3 requests from the dapp
const DappDriver = (in$) => {

  var cbBuffer = {};

  in$
  .addListener({
    next: res => {
      let isArray = Array.isArray(res);
      let id = isArray ? res[0].id : res.id;
      // TODO - handle error
      if(!(id in cbBuffer)) return null;
      cbBuffer[id](null, res)
      delete cbBuffer[id];
    },
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  return xs.create({
    start: listener => {

      const foo = (payload, callback) => {
        // save callback to call once results arrive
        let isArray = Array.isArray(payload);
        let id = isArray ? payload[0].id : payload.id;
        cbBuffer[id] = callback;
        listener.next(payload);
      }

      if (window.web3) {
        injectingMiddleware(window.web3, foo);
        console.log("Injecting DappHub");
      } else {
        console.log("Injecting DappHub - no web3 found");

        var _web3;
        Object.defineProperty(window, 'web3', {
          set: (web3) => {
            console.log("SETTING WEB3", web3);
            injectingMiddleware(web3, foo);
            _web3 = web3;
          },
          get: () => {
            return _web3;
          }
        });
      }

    },
    stop: () => {}
  })

}

run(main, {
  Msg: MsgDriver,
  Chain: ChainDriver,
  Dapp: DappDriver
})
