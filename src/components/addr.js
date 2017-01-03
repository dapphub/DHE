"use strict";

import {button, fieldset, legend, table, tbody, tr, td, thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine'
import {json, member, componentSwitch} from '../helper.js';
import isolate from '@cycle/isolate';
import {Stage, TabNav, Tabs} from '../treeview.js';
import {pick, mix} from 'cycle-onionify';
import Collection from '@cycle/collection';
import {isolateSource, isolateSink} from 'cycle-onionify';
import xs from 'xstream';
import _ from 'lodash';

var ABI = ({DOM, onion}) => {

  const context = (name, content) => fieldset("", [
    legend(name),
    table("", [
      tbody("", content)
    ])
  ]);

  const interfaceform = (interfaces) => interfaces
  .map((iface, index) =>
       tr("", [
    td(".label", [label(iface.name || iface.type)]),
    td(".input", [input({attrs: {
      type: "text",
      ref: index
    }})]),
    td("", ["::" + iface.type])
  ])
  )

  const mainView$ = onion.state$
  .map(p => div(".objectView", [
    // Display Inputs
    p.inputs && p.inputs.length > 0
    ? context("Input", interfaceform(p.inputs))
    : div(),
    button("trigger"),
    // Display Outputs
    p.outputs && p.outputs.length > 0
    ? context("Output", interfaceform(p.outputs))
    : div()
  ]))

  return {
    DOM: mainView$
  }
}

const TabNavView = ({DOM, onion}) => {
  const view$ = onion.state$
  .map(p =>  span(`${p.name}(${p.inputs && p.inputs.map(i => i.type).join(", ")})`))

  return {
    DOM: view$
  }
}

export const AddrView = ({DOM, onion}) => {

  const click$ = DOM
  .select("button")
  .events("click")

  const changes$ = DOM
  .select("input")
  .events("change")
  .map(e => ({
    index: e.target.getAttribute('ref'),
    value: e.target.value
  }))

  const select$ = DOM
  .select(".abiNavBtn")
  .events("click")
  .map(e => e.target.getAttribute('ref'))
  .startWith("0")

  const sendState$ = xs.merge(changes$, select$.mapTo("reset"))
  .fold((acc, e) => e === "reset"
    ? []
    : (acc[e.index] = e.value) && acc, [])

  const sendEvent$ = click$
  .compose(sampleCombine(sendState$))
  .map(([_, state]) => state)

  const fabisOnion = isolateSource(onion, 'children')

  const C = {
    abi: isolate(ABI, 'state'),
  };

  const tabs = Tabs({
    C,
    TabNavView,
    sinkNames: ["onion"],
    classname: ".abiView"
  })

  const tab = tabs({
    DOM: DOM,
    onion: fabisOnion
  })

  const currentFABI$ = xs.combine(select$, onion.state$)
  .filter(([s, _]) => s !== 0)
  .map(([select, p]) => ({
    contract: p.state.contract,
    fabi: p.state.contract.signatures_to_fabi[select],
    address: p.state.address,
    p: p
  }))

  const snapshot$ = xs.combine(select$, onion.state$)
  .map(([select, p]) => p.state.contract.abi.map(abi => ({
    id: abi.signature,
    props: {
      abi,
      selected: select === abi.signature
    }
  })));

  const web3$ = sendEvent$
  .compose(sampleCombine(currentFABI$))
  .map(([params, {contract, fabi, address}]) => ({
    id: 1,
    method: fabi.constant ? "eth_call" : "eth_sendTransaction",
    params: [{
      from: "0xb007ed86a7198a7bfe97b4dcf291bceabe40852d", // TODO - dynamic
      to: address,
      gas: "0x76c0",
      gasPrice: "0x9184e72a000",
      value: "0x0",
      data: "0x"+fabi.signature+fabi.encodeInputs(params)
    }]
  }))

  return {
    DOM: tab.DOM,
    web3$: web3$,
    onion: isolateSink(tab.onion, 'children')
  }
}
