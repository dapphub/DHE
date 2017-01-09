"use strict";

import {thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import xs from 'xstream';
import isolate from '@cycle/isolate';
import {isolateSource} from '@cycle/isolate';
import sampleCombine from 'xstream/extra/sampleCombine'
import flattenConcurrently from 'xstream/extra/flattenConcurrently'
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

  const selected$ = sources.onion.state$
  .map(s => s.selected)

  const ctype$ = xs.combine(sources.onion.state$, selected$)
  .filter(([state, s]) => s)
  .map(([s]) => s)
  .compose(componentSwitch(state => state.type, C, sources))

  const filterSelected = attr => in$ =>
    in$
    .map(c => c.c[attr] || xs.of())
    .flatten()
    .compose(sampleCombine(sources.onion.state$))
    .filter(([_, s]) => s.selected)
    .map(([v]) => v)

  const filterInstant = attr => in$ =>
    xs.combine(selected$, in$
    .map(c => c.c[attr] || xs.of())
    .flatten())
    .filter(([s]) => s)
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
