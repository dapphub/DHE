"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import Collection from '@cycle/collection';
import xs from 'xstream';


var formatSniffLine = (data, selected = 0, memep = {}) => {
  

  var formattedInput = `${data.req.method}(${data.req.params.map(e => JSON.stringify(e)).join(", ")})`;
  var formattedOutput = JSON.stringify(data.resp, false, 2);

  var succ = false;
  if(data.req.method === "eth_call"
   && "addrs" in memep
   && data.req.params[0].to in memep.addrs) {
     const object = memep.addrs[data.req.params[0].to];
     const fsign = data.req.params[0].data.slice(2, 10);
     const fdata = data.req.params[0].data.slice(10);
     const fres = data.resp.slice(2);
     const fabi = object.contract.signatures_to_fabi[fsign]
     const fname = fabi.name;
     const finput = fabi.decodeInputs(fdata);
     const foutput = fabi.decodeOutputs(fres);
     formattedInput = `${object.contract.name}(${object.address}).${fname}(${finput.join(', ')})`;
     formattedOutput = foutput.join(', ');
     succ = true;
   } else {

   }

   var line = [
     span({
       class: {
         req: true,
         open: selected != 0
       },
       attrs: {
         _id: data.req.id
       }
     }, formattedInput)
   ];
   if(selected != 0) {
     line.push(span(".resp", formattedOutput))
   }

  return li({
    class: {
      succ,
      sniffline: true,
      open: selected != 0,
      ["id"+data.req.id]: true
    },
  }, line)
}

const Line = function(sources) {
  var expanded$ = sources.DOM
  .select(".req")
  .events("click")
  .fold(acc => !acc, false)

  const vdom$ = xs.combine(expanded$, sources.memepool$)
  .map(([isExpanded, memp]) => {
    return (formatSniffLine(sources.comm, isExpanded, memp));
  })

  return {
    DOM: vdom$
  }
}

export var Sniffer = (sources) => {


  const toggle$ = sources.DOM
  .select(".record input")
  .events("change")
  .map(e => e.target.checked)
  .startWith(false)

  var logState$ = xs.combine(sources.Sniffer, toggle$)
  .filter(([_, toggle]) => toggle)
  .map(([comm]) => ({comm, memp: sources.mempool$}))

  const lineList$ = Collection(Line, sources, logState$);
  const lines$ = Collection.pluck(lineList$, item => item.DOM)

  const vdom$ = xs.combine(lines$, toggle$)
  .map(([lines, toggled]) => div(".sniffer", [
    div(".controllBar", [
      label(".record", {class: {checked: toggled}}, [
        input({attrs: {type: 'checkbox'}}),
        span("record"),
      ]),
      toggled ? "YEP" : "NO"
    ]),
    ul("", lines)
  ]));

  return {
    DOM: vdom$
  }
}
