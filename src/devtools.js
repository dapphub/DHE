import DHEBridge from './dhe-bridge.js';
import xs from 'xstream';
var _window;

chrome.devtools.panels.create("DappHub","chrome.png", "panel.html", function(panel) {
  panel.onShown.addListener(function tmp(panelWindow) {
     panel.onShown.removeListener(tmp); // Run once only
    _window = panelWindow;

    var port = chrome.extension.connect({
      name: "DappHub" + Math.random().toString().slice(2)
    });

    var tabid = chrome.devtools.inspectedWindow.tabId;
    port.postMessage({type: "CONNECT", tabid})

    // const sender = {send}
    //
    // sender.send("something")

    const onout = port.postMessage.bind(port)
    const dappMsg$ = xs.create({
      start: listener => {
        port.onMessage.addListener(function (data) {
          let msgs;
          if(Array.isArray(data.req)) {
            msgs = data.req.map( (e, i) => ({type: "RES", req: e, res: data.res[i]}))
          } else {
            console.log(data);
            msgs = [data]
          }

          msgs.forEach(r => {
            listener.next(r)
          })
        });
      },
      stop: () => {}
    })

    dappMsg$
    .debug("msg")

    _window.run(_window.main, {
      DOM: _window.makeDOMDriver('#app'),
      Sniffer: DHEBridge({
        onout, // forward some msgs to dapp
        in$: xs.merge(dappMsg$) // msgs received from dapp
      }),
      HTTP: _window.makeHTTPDriver()
    });

  });
});

