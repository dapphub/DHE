////////////////////
////////////////////
const forkMode = true;
const debug = false;
////////////////////
////////////////////

var engine = require('./testrpc.js');

// Handle request from devtools
chrome.extension.onConnect.addListener(function (port) {
    //Posting back to Devtools
    chrome.extension.onMessage.addListener(function (message, sender) {
      if(debug) console.log(">>", message);
      if(message.type === "REQ" && forkMode) {
        engine.sendAsync(message.req, (err, res) => {
          if(debug) console.log("<<", res);
          // send back to content script
          chrome.tabs.sendMessage(sender.tab.id, {
            type: "RES",
            res: res
          })
          // Send to dev tool panel
          port.postMessage({
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
        port.postMessage(message);
      }
    });
});
