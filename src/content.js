////////
////////
const forkMode = true;
const debug = false;
////////
////////


var knownWeb3 = [];
var injected = false;
var cbBuffer = {};
var injectingMiddleware = function (web3) {
  if(injected) return true;
  injected = true;
  // knownWeb3.push(web3.currentProvider);

  var _sendAsync = web3.currentProvider.sendAsync.bind(web3.currentProvider);

  web3.currentProvider.sendAsync = function (payload, callback) {

    if(!forkMode) {
      _sendAsync(payload, (err, res) => {
        window.postMessage({ type: "REQ", req: payload, res: res}, "*");
        callback(err, res);
      })
    } else {
      // Remember the callbacks from local web3
      if(Array.isArray(payload)) {
        if(debug) console.log(">", payload[0].id);
        cbBuffer[payload[0].id] = callback;
      } else {
        if(debug) console.log(">", payload.id);
        cbBuffer[payload.id] = callback;
      }
      window.postMessage({ type: "REQ", req: payload}, "*");
    }
  }
  if(forkMode) {
    window.addEventListener("message", (msg) => {
      if(["RES"].indexOf(msg.data.type) === -1) {
        return null;
      }

      // console.log(Object.keys(cbBuffer));
      if(Array.isArray(msg.data.res)) {
        if(debug) console.log("<", msg.data.res[0].id);
        // msg.data.res[0].id in cbBuffer &&
        cbBuffer[msg.data.res[0].id](null, msg.data.res);
        delete cbBuffer[msg.data.res[0].id];
      } else {
        if(debug) console.log("<", msg.data.res.id);
        // msg.data.res[0].id in cbBuffer &&
        // console.log("id", msg.data.res.id);
        // msg.data.res.id in cbBuffer &&
        cbBuffer[msg.data.res.id](null, msg.data.res);
        delete cbBuffer[msg.data.res.id];
      }
    })
  }

}

if(window.web3) {
  injectingMiddleware(window.web3);
} else {
  console.log("Injecting DappHub - no web3 found");

  var _web3;
  Object.defineProperty(window, 'web3', {
    set: (web3) => {
      console.log("SETTING WEB3", web3);
      injectingMiddleware(web3);
      _web3 = web3;
    },
    get: () => {
      return _web3;
    }
  });
}
