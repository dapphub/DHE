"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import Collection from '@cycle/collection';
import {pick, mix, isolateSource as isolateOnionSource, isolateSink as isolateOnionSink} from 'cycle-onionify';
import isolate from '@cycle/isolate';
import sampleCombine from 'xstream/extra/sampleCombine'
import xs from 'xstream';
import {member, json} from 'dh-core/helper';


var formatSniffLine = (data, memep = {}) => {

  var formattedInput = `${data.req.method}(${data.req.params.map(e => JSON.stringify(e)).join(", ")})`;
  var formattedOutput = JSON.stringify(data.res, false, 2);

  var call = false;
  var tx = false;
  if((data.req.method === "eth_call" || data.req.method === "eth_sendTransaction")
   && data.req.params[0].to in memep.addrs) {
     const object = memep.addrs[data.req.params[0].to];
     const fsign = data.req.params[0].data.slice(2, 10);
     const fdata = data.req.params[0].data.slice(10);
     const fres = typeof data.res === "object"
                  ? data.res.result.slice(2)
                  : data.res.slice(2)
     const fabi = object.contract.signatures_to_fabi[fsign]
     const fname = fabi.name;
     const finput = fabi.decodeInputs(fdata);
     const foutput = fabi.decodeOutputs(fres);
     formattedInput = `${object.contract.name}(${object.address}).${fname}(${finput.join(', ')})`;
     formattedOutput = foutput.join(', ');
     if(data.req.method === "eth_call") {
       call = true;
     } else {
       tx = true;
     }
   } else {

   }

   var line = [
     span({
       class: {
         req: true,
         open: data.expanded
       },
       attrs: {
         _id: data.req.id
       }
     }, formattedInput)
   ];
   if(data.expanded) {
     line.push(span(".res", formattedOutput))
   }

  return li({
    class: {
      call,
      tx,
      sniffline: true,
      open: data.expanded,
      loading: !data.res,
      ["id"+data.req.id]: true
    },
  }, line)
}

const Line = function(sources) {
  var expanded$ = sources.DOM
  .select(".req")
  .events("click")

  const vdom$ = xs.combine(
    sources.onion.state$,
    sources.memepool$
  )
  .map(([state, memep]) => formatSniffLine(state, memep))

  const reducer$ = expanded$
  .compose(sampleCombine(sources.onion.state$))
  .filter(([_, state]) => !!state.res)
  .map(v => function lineExpandedReducer(parent) {
    return _.assign({}, parent, {
      expanded: !parent.expanded
    });
  })

  return {
    DOM: vdom$,
    onion: reducer$
  }
}

const Children = (sources) => {

  const lineList$ = sources.onion.state$
  .compose(member(Line, sources))

  const lines$ = lineList$
  .compose(pick(sinks => sinks.DOM))
  .compose(mix(xs.combine))

  const reducer$ = lineList$
  .compose(pick(sinks => sinks.onion))
  .compose(mix(xs.merge))

  return {
    DOM: lines$,
    onion: reducer$
  }
}

export var Sniffer = (sources) => {

  const toggle$ = sources.DOM
  .select(".record input")
  .events("change")
  .map(e => e.target.checked)
  .startWith(false)

  // Filter out uninteresting information
  const filter = ["eth_syncing", "eth_getFilterChanges"]
  const filtered$ = sources.Sniffer
  .filter(comm => comm.type === "RES" || comm.type === "REQ")
  .filter(l => filter.indexOf(l.req.method) === -1)

  const lines = isolate(Children, 'history')(sources);

  const vdom$ = xs.combine(lines.DOM, toggle$)
  .map(([lines, toggled]) => div(".sniffer", [
    div(".controllBar", [
      label(".record", {class: {checked: toggled}}, [
        input({attrs: {type: 'checkbox'}}),
        span("record"),
      ])
    ]),
    ul("", lines)
  ]));

  const logReducer$ = filtered$
  .compose(sampleCombine(toggle$))
  .filter(([_, toggle]) => toggle)
  .map(([comm]) => function logReducer(parent) {
    // console.log(parent);
    var history = [];
    if(comm.type === "RES") {
      var knownIndex = parent.history
      .findIndex(el => el.req && el.req.id === comm.req.id)
      if(knownIndex > -1) {
        history = parent.history
        .slice(0, knownIndex)
        .concat([comm])
        .concat(parent.history.slice(knownIndex + 1))
      } else {
        console.log(parent.history, comm);
        history = parent.history.concat(comm)
      }
    } else if(comm.type === "REQ") {
      history = parent.history.concat(comm)
    }
    return _.assign({}, parent, {history});
  })

  return {
    DOM: vdom$,
    onion: xs.merge(logReducer$, lines.onion)
  }
}
