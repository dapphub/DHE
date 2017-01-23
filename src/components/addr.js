"use strict";

import {button, fieldset, legend, table, tbody, tr, td, thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine'
import {json, member, componentSwitch} from '../helper.js';
import isolate from '@cycle/isolate';
import {Tabs} from '../treeview.js';
import {pick, mix} from 'cycle-onionify';
import {isolateSource, isolateSink} from 'cycle-onionify';
import xs from 'xstream';
import _ from 'lodash';

var ABI = ({DOM, onion, Sniffer}) => {

  // TODO - handle errors well
  const resp$ = Sniffer
  .filter(e => e.type === "RES")
  .filter(e => !(typeof e.res === "object" && "error" in e.res))
  .filter(e => e.req.method === "eth_call" || e.req.method === "eth_sendTransaction")
  .compose(sampleCombine(onion.state$))
  .filter(([resp, state]) => resp.req.params[0].data.slice(2,10) === state.signature)
  .filter(([resp]) => resp.res.result.slice(2) !== "")
  .map(([resp, state]) => state.decodeOutputs(resp.res.result && resp.res.result.slice(2)))
  .startWith([])

  const click$ = DOM
  .select("button")
  .events("click")

  const changes$ = DOM
  .select("input")
  .events("change")
  .map(e => ({
    index: e.target.getAttribute('ref'),
    value: e.target.value}))

  const sendState$ = changes$
  .fold((acc, e) => {(acc[e.index] = e.value); return acc;}, [])

  const sendEvent$ = click$
  .compose(sampleCombine(sendState$))
  .map(([_, state]) => state)
  .compose(sampleCombine(onion.state$))
  .map(([value, state]) => ({
    value: value,
    fabi: state
  }))

  const context = (name, content) => fieldset("", [
    legend(name),
    table("", [
      tbody("", content)
    ])
  ]);

  const interfaceform = (interfaces, data = []) => interfaces
  .map((iface, index) =>
       tr("", [
    td(".label", [label(iface.name || iface.type)]),
    td(".input", [input({attrs: {
      type: "text",
      value: index in data && data[index] || "",
      ref: index
    }})]),
    td("", ["::" + iface.type])
  ])
  )

  const mainView$ = xs.combine(onion.state$, resp$)
  .map(([p, resp]) => div(".objectView", [
    // Display Inputs
    p.inputs && p.inputs.length > 0
    ? context("Input", interfaceform(p.inputs))
    : div(),
    button(p.constant ? "call" : "trigger"),
    // Display Outputs
    p.outputs && p.outputs.length > 0
    ? context("Output", interfaceform(p.outputs, resp))
    : div()
  ]))

  return {
    DOM: mainView$,
    web3$: sendEvent$
  }
}

const TabNavView = ({DOM, onion}) => {
  const view$ = onion.state$
  .map(p =>  span(`${p.name}(${p.inputs && p.inputs.map(i => i.type).join(", ")})`))

  return {
    DOM: view$
  }
}

export const AddrView = ({DOM, onion, Sniffer}) => {

  const fabisOnion = isolateSource(onion, 'children')

  const C = {
    abi: isolate(ABI, 'state'),
  };

  const tabs = Tabs({
    C,
    TabNavView,
    sinkNames: ["onion", "web3$"],
    classname: ".abiView"
  })

  const tab = tabs({
    DOM: DOM,
    onion: fabisOnion,
    Sniffer
  })

  const web3$ = tab.web3$
  .compose(sampleCombine(onion.state$))
  .map(([{value, fabi}, {state}]) => ({
    type: "REQ",
    req: {
      id: 1,
      method: fabi.constant ? "eth_call" : "eth_sendTransaction",
      params: [{
        to: state.address,
        gas: "0x2dc6c0",
        gasPrice: "0x4a817c800",
        value: "0x0",
        data: "0x"+fabi.signature+fabi.encodeInputs(value)
      }, "latest"]
    }
  }))

  return {
    DOM: tab.DOM,
    onion: isolateSink(tab.onion, 'children'),
    Sniffer: web3$
  }
}
