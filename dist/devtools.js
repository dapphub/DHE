console.log("Hello from DevTools");
var _window;

chrome.devtools.panels.create("DappHub","chrome.png", "panel.html", function(panel) {
  panel.onShown.addListener(function tmp(panelWindow) {
     panel.onShown.removeListener(tmp); // Run once only
    _window = panelWindow;
    console.log(panelWindow);

    var port = chrome.extension.connect({
      name: "DappHub" //Given a Name
    });

    _window.run(_window.main, {
      DOM: _window.makeDOMDriver('#app'),
      Sniffer: sniffDriver,
      HTTP: _window.makeHTTPDriver()
    });

    function sniffDriver(outgoing$) {
      outgoing$.addListener({
        next: outgoing => {
          port.postMessage(outgoing)
        },
        error: () => {},
          complete: () => {},
      });

      return _window.xs.create({
        start: listener => {
          port.onMessage.addListener(function (data) {
            let msgs;
            if(Array.isArray(data.req)) {
              msgs = data.req.map( (e, i) => ({req: e, res: data.res[i]}))
            } else {
              msgs = [data]
            }

            msgs.forEach(r => {
              listener.next(r)
            })
          });
        },
        stop: () => {},
      });
    }
  });
});

