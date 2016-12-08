console.log("Hello from DevTools");
var _window;

chrome.devtools.panels.create("DappHub","chrome.png", "panel.html", function(panel) {
  panel.onShown.addListener(function tmp(panelWindow) {
     panel.onShown.removeListener(tmp); // Run once only
    _window = panelWindow;
    console.log(panelWindow);
    var port = chrome.extension.connect({
      name: "Sample Communication" //Given a Name
    });

    _window.run(_window.main, {
      DOM: _window.makeDOMDriver('#app'),
      Sniffer: sniffDriver,
      HTTP: _window.makeHTTPDriver()
    });

    function sniffDriver(outgoing$) {
      outgoing$.addListener({
        next: outgoing => {
          console.log("out",outgoing);
          // sock.send(outgoing);
        },
        error: () => {},
          complete: () => {},
      });

      return _window.xs.create({
        start: listener => {
          console.log("asd");
          port.onMessage.addListener(function (data) {
            console.log(data);
            listener.next(data);
          });
        },
        stop: () => {},
      });
    }
  });
});

