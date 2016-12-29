////////////////////
////////////////////
const forkMode = true;
const debug = false;
////////////////////
////////////////////

var setUpEngine = require('./testrpc.js');
var xs = require('xstream');
var engine;

// Handle request from devtools
chrome.extension.onConnect.addListener(function (port) {

    var middleware = function (message, sender) {

      if(message.req.method === "eth_sendTransaction") {
        console.log(message.req)
      }
      if(debug) console.log(">>", message);
      if(message.type === "REQ" && forkMode && engine) {
        engine.sendAsync(message.req, (err, res) => {
          if(debug) console.log("<<", res);
          // send back to content script
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "RES",
            res: res
          })
          // Send to dev tool panel
          port && port.postMessage({
            type: "RES",
            res: res,
            req: message.req
          });
        })
      }
      if(message.type === "RES") {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "RES",
          res: message.res,
          req: message.req
        })
        port && port.postMessage(message);
      }
    }

    var initTestrpc = function (message, sender) {
      if( message.type === "start" ) {
        engine = setUpEngine();
        console.log("init testrpc", sender);
      }
    }

    //Posting back to Devtools
    chrome.extension.onMessage.addListener(middleware);
    port.onMessage.addListener(initTestrpc)

    port.onDisconnect.addListener(function () {
      console.log("disconnect");
      chrome.extension.onMessage.removeListener(middleware);
      port = null;
      engine.stop();
      engine = null;
    })

});

