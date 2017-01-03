"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import isolate from '@cycle/isolate';
import {isolateSource} from '@cycle/isolate';
import Collection from '@cycle/collection';
import sampleCombine from 'xstream/extra/sampleCombine'
import {Sniffer} from './components/sniffer.js';
import {AddrView} from './components/addr.js';
import {Memepool} from './memepool.js';
import {member} from './helper.js';
import {componentSwitch} from './helper.js';
import {pick, mix, isolateSource as isolateOnionSource, isolateSink as isolateOnionSink} from 'cycle-onionify';
import _ from 'lodash';

export const MakeTabChildren = (tabs, typef) => {
  return tabs
  .map((t, i) => ({
    index: i,
    state: t,
    selected: i === 0,
    type: typef && typef(t)
  }))
}

export const TabNav = TabNavView => ({DOM, onion}) => {

  const select$ = DOM
  .select(".navBtn")
  .events("click")
  .compose(sampleCombine(onion.state$))
  .map(([_, state]) => ({type: "SELECT", index: state.index}))

  var tabView;
  if(TabNavView) {
    tabView = isolate(TabNavView, 'state')({DOM, onion})
  } else {
    tabView = {DOM: onion.state$.map(state => state.name || state.index)}
  }

  const view$ = xs.combine(onion.state$, tabView.DOM)
  .map(([p, view]) => div(".navBtn", {
    class: {
      selected: p.selected
    },
    attrs: {ref: p.signature}
  }, [view]));

  return {
    DOM: view$,
    select$
  }
}

export const Stage = (C, sinkNames) => (sources) => {

  const ctype$ = sources.onion.state$
  .filter(state => state.selected)
  .compose(componentSwitch(state => state.type, C, sources))

  const filterSelected = attr => in$ =>
    in$
    .map(c => c.c[attr] || xs.of())
    .flatten()
    .compose(sampleCombine(sources.onion.state$))
    .filter(([_, s]) => s.selected)
    .map(([v]) => v)

  const filterInstant = attr => in$ =>
    xs.combine(sources.onion.state$, in$
    .map(c => c.c[attr] || xs.of())
    .flatten())
    .filter(([s]) => s.selected)
    .map(([_, v]) => v)

  const sinkObjects = sinkNames
  .map(sink => ctype$
  .compose(filterSelected(sink)))

  var sinks = _.zipObject(sinkNames, sinkObjects);

  sinks.DOM = ctype$
  .compose(filterInstant("DOM"))

  return sinks;
}

export const Tabs = opt => (sources) => {

  const nav$ = sources.onion.state$
  .compose(member(TabNav(opt.TabNavView), {
    DOM: sources.DOM.isolateSource(sources.DOM, 'tab'),
    onion: sources.onion
  }))

  const stage$ = sources.onion.state$
  .compose(member(Stage(opt.C, opt.sinkNames), sources))

  const tabStageView$ = stage$
    .compose(pick(sinks => sinks.DOM))
    .compose(mix(xs.merge))

  const tabStageReducers$ = stage$
    .compose(pick(sinks => sinks.onion))
    .compose(mix(xs.merge))

  const tabNavView$ = nav$
    .compose(pick((sinks, i) =>
      sources.DOM.isolateSink(sinks.DOM)
    ))
    .compose(mix(xs.combine))

  const web3$ = stage$
    .compose(pick(sinks => sinks.web3$))
    .compose(mix(xs.merge))

  const sinkObjects = opt.sinkNames
  .map(sink => stage$
    .compose(pick(sinks => sinks[sink]))
    .compose(mix(xs.merge)))

  var sinks = _.zipObject(opt.sinkNames, sinkObjects);

  const vdom$ = xs.combine(tabNavView$, tabStageView$)
  .map(([tabs, view]) => div(opt.classname, [
      div('.selectView', tabs),
      div('.mainView', [view])
  ]));

  const selectReducer$ = nav$
  .compose(pick(sinks => sinks.select$))
  .compose(mix(xs.merge))
  .map(e => function selectReducer(parent){
    const oldIndex = parent.findIndex(t => t.selected)
    const newIndex = parent.findIndex(t => t.index === e.index)

    if(oldIndex === newIndex) return parent;
    const tabs_ = parent.slice(0);
    tabs_[oldIndex] = _.assign({}, tabs_[oldIndex], {
      selected: false
    })
    tabs_[newIndex] = _.assign({}, tabs_[newIndex], {
      selected: true
    })
    return tabs_;
  })

  return _.assign(sinks, {
    DOM: vdom$,
    onion: xs.merge(selectReducer$, tabStageReducers$),
  })

}

export const DHExtension = (sources) => {
  // Selected tab
  const memepool = Memepool(sources)

  sources.memepool$ = memepool.state$;

  const newMemeReducer$ = memepool.state$
  .map(state => function newMemeReducer(parent) {
    const oldAddrs = parent.tabs
    .filter(t => t.type === "addr")
    .map(t => t.index)
    const newAddrs = Object.keys(state.addrs)
    const intersection = _.difference(newAddrs, oldAddrs);
    const newObjects = intersection
    .map(addr => ({
      index: addr,
      name: state.addrs[addr].name,
      type: "addr",
      state: state.addrs[addr],
      selected: false,
      children: MakeTabChildren(state.addrs[addr].contract.abi, () => "abi")
    }))

    return _.assign({}, parent, {
      tabs: parent.tabs.concat(newObjects)
    });
  })

  const C = {
    addr: AddrView,
    sniffer: isolate(Sniffer, "state")
  };

  const tabSinks = isolate(Tabs({
    sinkNames: ["onion", "web3$"],
    C,
    classname: ".treeview"
  }), 'tabs')(sources)

  const web3$ = tabSinks.web3$
    .fold((parent, cmd) => ({
      cmd: _.assign(cmd, {id: parent.id + 1}),
      id: parent.id + 1
    }) ,{cmd: {}, id: 0})
    .filter(e => e.id > 0)
    .map(e => e.cmd)

  const initState$ = xs.of(function initStateReducer() {
    return {
      tabs: [{
        index: "tab1",
        name: "address",
        type: "asd",
        selected: true
      }, {
        index: "tab2",
        name: "sniffer",
        type: "sniffer",
        state: {
          history: []
        },
        selected: false
      }],
      // stores all meta information
      mempool: {
      }
    };
  })

  const reducer$ = xs.merge(
    initState$,
    tabSinks.onion,
    newMemeReducer$
  )

  return {
    DOM: tabSinks.DOM,
    HTTP: memepool.HTTP,
    onion: reducer$,
    web3$: tabSinks.web3$
  }
}
