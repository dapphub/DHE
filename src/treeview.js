<<<<<<< HEAD
import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
=======
import {div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';
>>>>>>> line_decorator_sandbox
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

  const vdom$ = expanded$.map( isExpanded => {
    return (formatSniffLine(sources.comm, isExpanded, sources.memp));
  })

  return {
    DOM: vdom$
  }
}

<<<<<<< HEAD
  var vdom$ = xs.combine(lines$, click$)
  .map(([lines, clicks]) => {
    var vdom = lines.map(line => thunk("li", line.req.id, (line, ac) => formatSniffLine(line,ac), [line, clicks[line.req.id]]))
    return tab("sniffer", [
      ul("", vdom)
    ]);
  });
=======
var SnifferTab = (sources) => {

  var logState$ = xs.combine(sources.Sniffer, sources.memepool$)
  .map(([comm, memp]) => ({comm, memp}));


  const lineList$ = Collection(Line, sources, logState$);
  const lines$ = Collection.pluck(lineList$, item => item.DOM)

  const vdom$ = lines$
  .map(lines => tab("sniffer", [
    div(".controllBar", [
    ]),
    ul("", lines)
  ]));
>>>>>>> line_decorator_sandbox

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

  const memepool$ = sources.HTTP
  .select('expert')
  .flatten()
  .debug("res")
  .map(res => JSON.parse(res.text))
  .fold( (acc, meme) => {
    acc.addrs[meme.address] = meme;
    return acc;
  }, {addrs: {}})
  .debug("meme");

  const snifferTab$ = SnifferTab({
    memepool$: memepool$,
    DOM: sources.DOM,
    Sniffer: sources.Sniffer
  }).DOM;

  const vdom$ = xs.combine(selected$, snifferTab$)
  .map( ([state, snifferTab]) => {
    var data = [
      tab("something", "here"),
      tab("address", [
        h1("")
      ]),
      snifferTab
    ]
    const selected = state;
    return div('.treeview',[
      div('.selectView', constructSelectors(selected, data) ),
      div('.mainView', constructView(selected, data))
    ])
  });

  // const request$ = xs.of({
  //   url: 'https://7i22h93cg3.execute-api.us-east-1.amazonaws.com/dev/get',
  //   method: 'GET',
  //   query: {"address": "0xd43a1e8b374a17d5556ccca1c42353cc18b55b7a"},
  //   category: 'expert',
  // });

  return {
    DOM: vdom$,
    // HTTP: request$
  }
}
