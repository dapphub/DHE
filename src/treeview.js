"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';
import xs from 'xstream';
import {Sniffer} from './components/sniffer.js';
import {AddrView} from './components/addr.js';
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

  const state$ = sources.props

  const navigation$ = state$
  .map(state => div({
    class: {
      navBtn: true,
      selected: state.selected
    },
    attrs: {
      ref: state.index
    }
  }, state.name))

  const view$ = state$
  .filter(state => state.selected)
  .map(state => {
    var vdom$;
    switch(state.type) {
      case "addr":
        vdom$ = isolate(AddrView)(sources).DOM;
        break;
      case "sniffer":
        vdom$ = isolate(Sniffer)(sources).DOM;
        break;
      default:
        vdom$ = xs.of(div(state.name),div(state.name));
    }
    return xs.combine(sources.props, vdom$)
  })
  .flatten()
  .filter(([p]) => p.selected)
  .map(([_, dom]) => dom);

  return {
    navigation$, // TODO - better name
    view$: view$
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

  const state$ = xs.combine(select$, memepool.state$)
  .map(([id, state]) => {
    return [{
      id: "tab1",
      props: {
        index: "tab1",
        name: "address",
        type: "asd",
        selected: id === "tab1"
      }
    }, {
      id: "tab2",
      props: {
        index: "tab2",
        name: "sniffer",
        type: "sniffer",
        selected: id === "tab2"
      }
    }].concat(Object.keys(state.addrs).map(addr => ({
      id: addr,
      props: {
        index: addr,
        name: addr.slice(0,10),
        type: "addr",
        state: state.addrs[addr],
        selected: id === addr
      }
    })))
  })

  const tab$ = Collection.gather(Tab, sources, state$);

  const tabNavigation$ = Collection
  .pluck(tab$, tab => tab.navigation$)

  const mainView$ = Collection
  .merge(tab$, tab => tab.view$)

  const vdom$ = xs.combine(tabNavigation$, mainView$)
  .map(([tabs, view]) => div(".treeview", [
      div('.selectView', tabs),
      div('.mainView', [view])
  ]));

  return {
    DOM: vdom$,
    HTTP: memepool.HTTP
  }
}
