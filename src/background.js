////////////////////
////////////////////
const forkMode = true;
const debug = 1;
////////////////////
////////////////////

var setUpEngine = require('./testrpc.js');
var xs = require('xstream');
const levelup = require('levelup');
const level = require('level-js');
var engine;

// Handle request from devtools
chrome.extension.onConnect.addListener(function (port) {
  // TODO - better name
  // holds the callbacks for each payload id
  var origMSGpassCallback = {}

  var middleware = function (message, sender) {
    // if(debug >= 1) console.log("Adding Middleware", sender);

    if(debug >= 2) console.log(">>", message);
    if(message.type === "REQ" && forkMode && engine) {
      engine.sendAsync(message.req, (err, res) => {
        if(debug >= 2) console.log("<<", res);
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
    if(message.type === "FORK_RES") {
      let id = message.res.id;
      // TODO - forward errors
      origMSGpassCallback[id](null, message.res);
      delete origMSGpassCallback[id];
    }
  }


  var onDappMsg = function (message, _port) {
    // if(debug >= 1) console.log("Adding Testrpc", message, port);
    const sendToOrigWeb3 = (tabId) => (payload, cb) => {
      origMSGpassCallback[payload.id] = cb;
      chrome.tabs.sendMessage(tabId, {
        type: "FORK_REQ",
        req: payload
      })
    }

    switch(message && message.type) {
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
        engine = setUpEngine({db, forkSource})
        console.log("init testrpc", port);
        break;
      case "DH_REQ":
        console.log("DH REQ", message.req);
        engine.sendAsync(message.req, (err, res) => {
          console.log("DH RES", res);
          port && port.postMessage({
            type: "DH_RES",
            res: res,
            req: message.req
          });
        })
        break;
    }

  }

  // if(debug >= 1) console.log("Adding Middleware", port);
  //Posting back to Devtools
  chrome.extension.onMessage.addListener(middleware);
  port.onMessage.addListener(onDappMsg)

  port.onDisconnect.addListener(function (a,b) {
    console.log("disconnect", a, b);
    chrome.extension.onMessage.removeListener(middleware);
    port = null;
    engine && engine.stop();
    engine = null;
  })

});

