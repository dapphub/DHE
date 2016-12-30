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
import {componentSwitch} from './helper.js';
import {pick, mix, isolateSource as isolateOnionSource, isolateSink as isolateOnionSink} from 'cycle-onionify';
import _ from 'lodash';

var TabNav = ({DOM, onion}) => {

  const select$ = DOM
  .select('.navBtn')
  .events('click')
  .compose(sampleCombine(onion.state$))
  .map(([_, state]) => ({type: "SELECT", index: state.index}))

  const view$ = onion.state$
  .map(state => div({
    class: {
      navBtn: true,
      selected: state.selected
    },
    attrs: {
      ref: state.index
    }
  }, state.name))

  return {
    DOM: view$,
    select$
  }
}

var Stage = (sources) => {

  const C = {
    addr: AddrView,
    sniffer: Sniffer
  };

  const ctype$ = sources.onion.state$
  .filter(state => state.selected)
  .compose(componentSwitch(state => state.type, C, sources))

  const view$ = xs.combine(sources.onion.state$, ctype$
  .map(c => c.c.DOM)
  .flatten())
  .filter(([s]) => s.selected)
  .map(([_, v]) => v)

  const reducer$ = ctype$
  .map(c => c.c.onion)
  .flatten()

  const web3$ = ctype$
  .map(c => c.c.web3$)
  .filter(c => !!c)
  .flatten()

  return {
    DOM: view$,
    onion: reducer$,
    web3$
  };
}

const Tabs = (sources) => {

  const tabNav$ = sources.onion.state$
  .fold((parent, state) => {
    let arr = new Array(state.length);
    state.forEach((e,i) => {
      if(i in parent) {
        arr[i] = parent[i];
      } else {
        let filteredSources = _.assign({}, sources, {
          onion: isolateOnionSource(sources.onion, i),
          DOM: sources.DOM.isolateSource(sources.DOM, i + '_')
        })
        arr[i] = TabNav(filteredSources);
      }
    })
    return arr;
  }, [])

  const stage$ = sources.onion.state$
  .fold((parent, state) => {
    let arr = new Array(state.length);
    state.forEach((e,i) => {
      if(i in parent) {
        arr[i] = parent[i];
      } else {
        // let filteredSources = _.assign({}, sources, {
        //   onion: isolateOnionSource(sources.onion, i),
        // })
        arr[i] = isolate(Stage, i)(sources)
      }
    })
    return arr;
  }, [])

  const tabNavView$ = tabNav$
    .compose(pick((sinks, i) =>
      sources.DOM.isolateSink(sinks.DOM, i + '_')
    ))
    .compose(mix(xs.combine))

  const tabStageView$ = stage$
    .compose(pick(sinks => sinks.DOM))
    .compose(mix(xs.merge))

  const tabStageReducers$ = stage$
    .compose(pick(sinks => sinks.onion))
    .compose(mix(xs.merge))

  const web3$ = stage$
    .compose(pick(sinks => sinks.web3$))
    .compose(mix(xs.merge))
    .fold((parent, cmd) => ({
      cmd: _.assign(cmd, {id: parent.id + 1}),
      id: parent.id + 1
    }) ,{cmd: {}, id: 0})
    .filter(e => e.id > 0)
    .map(e => e.cmd)

  const vdom$ = xs.combine(tabNavView$, tabStageView$)
  .map(([tabs, view]) => div(".treeview", [
      div('.selectView', tabs),
      div('.mainView', [view])
  ]));

  const selectReducer$ = tabNav$
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

  return {
    DOM: vdom$,
    onion: xs.merge(selectReducer$, tabStageReducers$),
    web3$
  }

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
      selected: false
    }))

    return _.assign({}, parent, {
      tabs: parent.tabs.concat(newObjects)
    });
  })

  const tabSinks = isolate(Tabs, 'tabs')(sources)

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
        history: [],
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
