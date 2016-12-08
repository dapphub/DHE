import {div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import xs from 'xstream';
import flattenConcurrently from 'xstream/extra/flattenConcurrently'

var constructSelectors = (selected, data) => {
  return data
    .map((k, i) =>
       div(`.navBtn ${ selected == i ? ".selected" : ""}`, {attrs: {ref: i}}, k.name));
}

var constructView = (selected, data) => {
  return [div("."+data[selected].name, data[selected].data)];
}

export var tab = (name, data) => {
  return {
    name: name,
    data: data
  };
}

var formatSniffLine = (data, selected = 0) => {
  var line = [
    span({
      class: {req: true, open: selected != 0},
      attrs: {_id: data.req.id }
    }, `${data.req.method}(${data.req.params.map(e => JSON.stringify(e)).join(", ")})`)
  ];
  if(selected != 0) {
    line.push(span(".resp", JSON.stringify(data.resp, false, 2)))
  }
  return li({
    class: {sniffline: true, open: selected != 0, ["id"+data.req.id]: true},
  }, line)
}

const Line = function(sources) {
  var expanded$ = sources.DOM
  .select(".req")
  .events("click")
  .fold(acc => !acc, false)
  .debug("isExpanded");

  const vdom$ = xs.combine(sources.data, expanded$)
  .debug("draw", )
  .map(([state, isExpanded]) => {
    return (formatSniffLine(state, isExpanded));
  })

  return {
    DOM: vdom$
  }
}

var SnifferTab = (sources) => {
  // var click$ = sources.DOM
  // .select(".sniffline .req")
  // .events("click")
  // .map(e => {
  //   console.log(e.target.attributes);
  //   return e.target.getAttribute("_id")
  // })
  // .fold((acc, e) => {
  //   if(e in acc) {
  //     acc[e] = (acc[e]+1) % 2;
  //   } else {
  //     acc[e] = 1;
  //   }
  //   return acc;
  // }, {});

  var vdom$ = sources.Sniffer
  .take(10)
  // TODO - here I wanted to flatten a stream of streams into an array
  // .map(l => isolate(Line)({
  //   DOM: sources.DOM,
  //   data: xs.of(l)
  // }).DOM)
  // .compose(flattenConcurrently)
  .fold((acc, e) => acc.concat([isolate(Line)({
    DOM: sources.DOM,
    data: xs.of(l)
  }).DOM], []) // TODO - here I have a array of streams
  .map(lines => tab("sniffer", [ul("", lines)]));

  // var vdom$ = xs.combine(lines$)
  // .map(([lines]) => {
  //   var vdom = lines.map(line => formatSniffLine(line, false))
  //   return tab("sniffer", [
  //     ul("", vdom)
  //   ]);
  // });

  return {
    DOM: vdom$
  }
}

export var mainView = (sources) => {
  const selected$ = sources.DOM
  .select(".navBtn")
  .events("click")
  .map(e => {
    let newState = e.target.getAttribute("ref");
    return newState;
  })
  .startWith(0);

  var snifferTab$ = SnifferTab(sources).DOM;

  let response$ = sources.HTTP
  .select('hello')
  .flatten()
  .map(res => JSON.parse(res.text))
  .startWith('Loading...')

  const vdom$ = xs.combine(selected$, snifferTab$, response$)
  .map( ([state, snifferTab, res]) => {
    var data = [
      tab("something", "here"),
      tab("address", [
        h1("")
      ]),
      snifferTab
    ]
    // const data = state[0];
    const selected = state;
    return div('.treeview',[
      div('.selectView', constructSelectors(selected, data) ),
      div('.mainView', constructView(selected, data))
    ])
  });

  let request$ = xs.of({
    url: 'https://7i22h93cg3.execute-api.us-east-1.amazonaws.com/dev/get',
    method: 'GET',
    query: {"address": "0x9d6bb976159a6c131512ce27c83ba1fcb05b22ea"},
    category: 'hello',
  });

  return {
    DOM: vdom$,
    HTTP: request$
  }
}
