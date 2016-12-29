"use strict";

import {button, fieldset, legend, table, tbody, tr, td, thunk, div, span, ul, li, label, input, hr, h1, makeDOMDriver} from '@cycle/dom';
import sampleCombine from 'xstream/extra/sampleCombine'
import {json} from '../helper.js';
import isolate from '@cycle/isolate';
import Collection from '@cycle/collection';
import xs from 'xstream';

var ABI = ({DOM, props}) => {

  const navBtns$ = props.map(p => div(".abiNavBtn", {
    class: {
      selected: p.selected
    },
    attrs: {ref: p.abi.signature}
  }, `${p.abi.name}(${p.abi.inputs && p.abi.inputs.map(i => i.type).join(", ")})`));

  const context = (name, content) => fieldset("", [
    legend(name),
    table("", [
      tbody("", content)
    ])
  ]);

  const interfaceform = (interfaces) => interfaces
  .map((iface, index) =>
       tr("", [
    // i
    td(".label", [label(iface.name || iface.type)]),
    td(".input", [input({attrs: {
      type: "text",
      ref: index
    }})]),
    td("", ["::" + iface.type])
  ])
  )

  const mainView$ = props
  .filter(p => p.selected)
  .map(p => div(".objectView", [
    // Display Inputs
    p.abi.inputs && p.abi.inputs.length > 0
    ? context("Input", interfaceform(p.abi.inputs))
    : div(),
    button("trigger"),
    // Display Outputs
    p.abi.outputs && p.abi.outputs.length > 0
    ? context("Output", interfaceform(p.abi.outputs))
    : div()
  ]))

  return {
    navBtns$,
    mainView$
  }
}


export const AddrView = ({DOM, onion}) => {

  var listener = {
    next: (value) => {
      console.log('The Stream gave me a value: ', value);
    },
    error: (err) => {
      console.error('The Stream gave me an error: ', err);
    },
    complete: () => {
      console.log('The Stream told me it is done.');
    },
  }

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

  const currentFABI$ = xs.combine(select$, onion.state$)
  .filter(([s, _]) => s !== 0)
  .map(([select, p]) => ({
    contract: p.state.contract,
    fabi: p.state.contract.signatures_to_fabi[select],
    address: p.state.address,
    p: p
  }))

  const web3$ = sendEvent$
  .compose(sampleCombine(currentFABI$))
  .map(([params, {contract, fabi, address}]) => ({
    id: 1,
    method: fabi.constant ? "eth_call" : "eth_sendTransaction",
    params: [{
      from: "",
      to: address,
      gas: "0x76c0",
      gasPrice: "0x9184e72a000",
      value: "0x0",
      data: fabi.encodeInputs(params)
    }]
  }))
  // .addListener(listener)

  const snapshot$ = xs.combine(select$, onion.state$)
  .map(([select, p]) => p.state.contract.abi.map(abi => ({
    id: abi.signature,
    props: {
      abi,
      selected: select === abi.signature
    }
  })));

  const abiC$ = Collection.gather(isolate(ABI), {DOM}, snapshot$);

  const abisView$ = Collection.pluck(abiC$, abi => abi.navBtns$);

  const mainView$ = Collection
  .merge(abiC$, abi => abi.mainView$)
  .startWith(div("no"))

  const vdom$ = xs.combine(onion.state$, abisView$, mainView$)
  .map(([p, abis, view]) => {
    return div(".abiView", [
      div(".navigationView", abis),
      div(".mainView", [
        view
      ])
    ])
  })

  return {
    DOM: vdom$,
    web3$: web3$,
    onion: xs.of()
  }
}
