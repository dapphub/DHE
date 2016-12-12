"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import Collection from '@cycle/collection';
import xs from 'xstream';


var formatSniffLine = (data, selected = 0, memep = {}) => {
  var line = [
    span({
      class: {req: true, open: selected != 0},
      attrs: {_id: data.req.id }
    }, `${data.req.method}(${data.req.params.map(e => JSON.stringify(e)).join(", ")})`)
  ];
  if(selected != 0) {
    line.push(span(".resp", JSON.stringify(data.resp, false, 2)))
  }
  var succ = false;
  if(data.req.method === "eth_call"
   && "addrs" in memep 
   && data.req.params[0].to in memep.addrs) succ = true;

  return li({
    class: {
      sniffline: true,
      open: selected != 0,
      ["id"+data.req.id]: true,
      success: succ
    },
  }, line)
}

const Line = function(sources) {
  var expanded$ = sources.DOM
  .select(".req")
  .events("click")
  .fold(acc => !acc, false)

  const vdom$ = expanded$.map( isExpanded => {
    return (formatSniffLine(sources.comm, isExpanded, sources.memp));
  })

  return {
    DOM: vdom$
  }
}

export var Sniffer = (sources) => {

  var logState$ = xs.combine(sources.Sniffer, sources.memepool$)
  .map(([comm, memp]) => ({comm, memp}));


  const lineList$ = Collection(Line, sources, logState$);
  const lines$ = Collection.pluck(lineList$, item => item.DOM)

  const vdom$ = lines$
  .map(lines => div(".sniffer", [
    div(".controllBar", []),
    ul("", lines)
  ]));

  return {
    DOM: vdom$
  }
}
