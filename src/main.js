import {run} from '@cycle/xstream-run';
import {button, span, div, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import {mainView, tab} from './treeview.js';
import {makeHTTPDriver} from '@cycle/http';
require("./style.scss");

window.main = (sources) => {
  
  const DHExtension = mainView(sources);

  var DH$ = DHExtension.DOM;

  var init$ = sources.DOM.select('.toggleDappHub')
  .events('click')
  .fold((acc, x) => !acc, false);

  var vdom$ = xs.combine(DH$, init$)
  .map(([DH, init]) => {
    var color = init ? '#0f0' : '#f0f';
    var initView = div([
      button(".toggleDappHub", { style: {background: color} }, "Start"),
      span("This will trigger reloading this webpage.")
    ]);
    var dhView = DH;
    return init ? dhView : initView;
  });

  var MV = {
    DOM: vdom$,
    HTTP: DHExtension.HTTP
  }

  return MV;
}

window.run = run;
window.makeDOMDriver = makeDOMDriver;
window.makeHTTPDriver = makeHTTPDriver;
window.xs = xs;
