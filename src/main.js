import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {DHExtension} from './treeview.js';
import {makeHTTPDriver} from '@cycle/http';
import onionify from 'cycle-onionify';
require("./style.scss");

const tabId = chrome.devtools.inspectedWindow.tabId;

const main = (sources) => {

  sources.Sniffer
  .filter(e => e.type === "DH_RES")
  .addListener({
    next: e => console.log(e),
    error: e => console.log(e),
    complete: e => console.log(e)
  })

  const dhExtension = DHExtension(sources);

  var DH$ = dhExtension.DOM;

  var init$ = sources.DOM.select('.toggleDappHub')
  .events('click')
  .fold((acc, x) => !acc, false);

  var vdom$ = xs.combine(DH$, init$)
  .map(([DH, init]) => {
    var initView = div(".injectDappHub", [
      button(".toggleDappHub", { }, "Start"),
      span("This will inject HappHub into your webpage."),
      span("You might want to reload this page."),
    ]);
    var dhView = DH;
    return init ? dhView : initView;
  });

  const sniffer$ = init$
  .map(i => i ? ({type: "start", tabId}) : ({}))

  const web3$ = dhExtension.web3$
  .map(req => ({type: "DH_REQ", req}))

  var MV = {
    DOM: vdom$,
    HTTP: dhExtension.HTTP,
    Sniffer: xs.merge(sniffer$, web3$),
    onion: dhExtension.onion
  }

  return MV;
}

window.main = onionify(main);
window.run = run;
window.makeDOMDriver = makeDOMDriver;
window.makeHTTPDriver = makeHTTPDriver;
window.xs = xs;
