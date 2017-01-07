import {input, h2, button, div, select, option} from '@cycle/dom';
import xs from 'xstream';
import _ from 'lodash';
import sampleCombine from 'xstream/extra/sampleCombine'
import {json, member, componentSwitch} from '../helper.js';
import utils from 'web3/lib/utils/utils.js';

export const Settings = ({DOM, onion, Sniffer}) => {

  const vdom$ = onion.state$
  .map(state => div(".settings", [
    h2(`Block Height: ${state.state.blockHeight}`),
    select('.forkStatus', [
      option({attrs:{value: 0, selected: state.state.forkStatus === 0}}, "native web3"),
      option({attrs:{value: 1, selected: state.state.forkStatus === 1}}, "new fork")
    ]),
    state.state.options[state.state.forkStatus],
    button(".reset", "reset fork"),
    h2(`Default Account:`),
    input(".defaultAccount", {attrs: {
      value: state.state.defaultAccount
    }}),
    button(".setDefaultAccount", "submit"),
    json(state.state)
  ]))

  const defaultAccountChange$ = DOM
  .select('.defaultAccount')
  .events('change')
  .map(e => e.target.value)

  const defaultAccountReducer$ = DOM
  .select('.setDefaultAccount')
  .events('click')
  .compose(sampleCombine(defaultAccountChange$))
  .map(([e, value]) => function defaultAccountReducer(parent) {
    parent.state.defaultAccount = value;
    return _.assign({}, parent);
  })


  const selectReducer$ = DOM
  .select('.forkStatus')
  .events('change')
  .map(e => parseInt(e.target.value))
  .map(e => function reduceForkStatus(parent) {
    let state = parent.state;
    state.forkStatus = e;
    return _.assign({}, parent, {state});
  })

  // TODO come up with a descreptive web3 query which builds requests + reducers
  // TODO - refactor this
  // e.g.
  // {
  //   blockNumber: {"/web3": "blockNumber", format: utils.toDecimal}
  // }
  //
  // which will leave onion.state$
  // {
  //    blockNumber: 12345
  // }
  //
  // toDecimal is a function which is applied to the result
  //
  const genRequests = (path, o) => {
    let reqs = []
    if(typeof o === "object") {
      let index = Object.keys(o).indexOf("/web3");
      if(index > -1) {
        let method = o["/web3"];
        let params = o["params"];
        reqs.push({
          type: "DH_REQ",
          _location: path,
          _f: o.f,
          req: {
            "jsonrpc": "2.0",
            "method": "eth_"+method,
            "params": params
          }
        })
      } else { // index === -1
        let childReqs = Object.keys(o)
        .map(key => genRequests(path + (path ? "." : "") + key, o[key]))
        reqs = _.flatten(childReqs);
      }
    }
    return reqs;
  }

  const blockHeightRequest$ = onion.state$
  .map(state => genRequests("", state))
  .filter(r => r.length > 0)

  const removeKnownRequestsReducer$ = blockHeightRequest$
  .map(s => function removeKnownRequestsReducer (parent) {
    s.forEach(t => {
      let o = t._location
      .split('.')
      .slice(0,-1)
      .reduce((a, l) => a[l], parent);
      o[t._location.split('.').slice(-1)] = "."
    })
    return _.assign({}, parent);
  })

  const blockHeightReducer$ = Sniffer
  .filter(t => t.type === "DH_RES")
  .filter(t => t.req.method === "eth_blockNumber")
  .map(t => function blockNumberReducer(parent) {
    let _df = e => e
    // TODO - rewrite it with immutable or something
    let o = t._location
    .split('.')
    .slice(0,-1)
    .reduce((a, l) => a[l], parent);
    o[t._location.split('.').slice(-1)] = (t._f || _df)(t.res.result)
    return _.assign({}, parent);
  })

  // TODO - trigger reducer
  const reset$ = DOM
  .select('.reset')
  .events('click')
  .mapTo({type: "DH_RESET_FORK"})

  const snifReq$ = xs.merge(reset$, blockHeightRequest$.map(e => xs.fromArray(e)).flatten())

  return {
    DOM: vdom$,
    onion: xs.merge(
      selectReducer$,
      blockHeightReducer$,
      defaultAccountReducer$,
      removeKnownRequestsReducer$
    ),
    Sniffer: snifReq$,
  }
}

