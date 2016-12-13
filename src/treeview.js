import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';
import xs from 'xstream';
import {Sniffer} from './components/sniffer.js';
import {Memepool} from './memepool.js';

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

var Tab = (sources) => {
  console.log("new tab");
  console.log(sources);

  const state$ = sources.props.debug("props");

  const selector$ = state$
  .map(state => div({
    class: {
      navBtn: true,
      selected: state.selected
    },
    attrs: {
      ref: state.index
    }
  }, state.name))

  const defaultView$ = state$
  .filter(state => state.selected)
  .map(state => div(state.name))

  const snifferView$ = isolate(Sniffer)(sources).DOM;

  const view$ = xs.combine(state$, defaultView$, snifferView$)
  .filter(([state]) => state.selected)
  .map(([state, def, sniffer]) => (state.type === "sniffer") ? sniffer : def)

  // const selector$ = sources.props.map(_ => div("omg"));
  return {
    selector$, // TODO - better name
    view$: view$
    // select$
  };
}

export var DHExtension = (sources) => {
  // Selected tab
  const memepool = Memepool(sources)

  sources.memepool$ = memepool.state$;

  const select$ = sources.DOM
  .select('.navBtn')
  .events('click')
  .map(e => e.target.getAttribute('ref'))
  .startWith("tab1")
  .debug("select")

  const state$ = select$
  .map(id => [
    {
      id: "tab1",
      props: {
        index: "tab1",
        name: "address",
        type: "asd",
        selected: id === "tab1"
      }
    },
    {
      id: "tab2",
      props: {
        index: "tab2",
        name: "sniffer",
        type: "sniffer",
        selected: id === "tab2"
      }
    }
  ]).debug("state");

  // console.log(selected$, xs.of("tab1"));
  // sources.selected$ = selected$;
  // sources.selected$ = xs.of("tab1")
  // sources.selected = select$;

  const tab$ = Collection.gather(Tab, sources, state$);

  const tabSelectors$ = Collection
  .pluck(tab$, tab => tab.selector$)

  const mainView$ = Collection
  .merge(tab$, tab => tab.view$)

  const vdom$ = xs.combine(tabSelectors$, mainView$)
  .map(([tabs, view]) => div(".treeview", [
      div('.selectView', tabs),
      div('.mainView', [view])
  ]));

  return {
    DOM: vdom$,
    HTTP: memepool.HTTP
  }
}
