import { hr, fieldset, legend, input, h2, label, button, div, select, option } from "@cycle/dom";
import xs from "xstream";
import _ from "lodash";
import sampleCombine from "xstream/extra/sampleCombine";
import dropRepeats from "xstream/extra/dropRepeats";
import { json, member, componentSwitch } from "../helper.js";
import utils from "web3/lib/utils/utils.js";

export const Settings = ({ DOM, onion, Sniffer }) => {
  // INTENT
  //   DOM
  const newForkClick$ = DOM.select(".newForkBtn").events("click");

  const fromRPC$ = DOM
    .select(".fromRPC")
    .events("change")
    .map(e => e.target.checked)
    .startWith(false)

  const forkName$ = DOM
    .select(".forkName")
    .events("change")
    .map(e => e.target.value)
    .startWith("")

  const forkURI$ = DOM
    .select(".rpcURI")
    .events("change")
    .map(e => e.target.value)
    .startWith("http://localhost:8545")

  const defaultAccountChange$ = DOM
    .select(".defaultAccount")
    .events("change")
    .map(e => e.target.value);

  const changeChain$ = DOM
    .select(".forkStatus")
    .events("change")
    .map(e => e.target.value)

  // INTENT
  //   SNIFFER

  const newChainList$ = Sniffer
  .filter(msg => msg.type === "CHAIN_LIST")

  const chaininfo$ = Sniffer
  .filter(msg => msg.type === "CHAININFO")


  // ACTIONS
  const vdom$ = onion.state$.map(
    state =>
      div(".settings", [
        fieldset([
          h2(`Block Height: ${state.state.blockNumber}`),
          h2(`Chain Type: ${state.state.chaintype}`),
          hr(),
          h2("actions"),
          legend("current fork"),
          label([
            "Select fork:",
            select(
              ".forkStatus",
              state.state.options.map(
                (name, i) => option({ attrs: {
                  value: name,
                  selected: state.state.selected === name
                } }, name)
              )
            ),
          ]),
          button(".reset", "reset fork")
        ]),
        fieldset([
          legend("new fork"),
          label("", [
            "Fork Name",
            input(".forkName", { attrs: { placeholder: "new fork name" } })
          ]),
          label("", [
            "from RPC",
            input({ attrs: { type: "checkbox" }, class: { fromRPC: true } })
          ]),
          label("", [
            "RPC URI",
            input({
              attrs: { placeholder: "e.g. http://localhost:8545" },
              class: { rpcURI: true }
            })
          ]),
          button(".newForkBtn", "create new fork")
        ]),
        fieldset([
          legend("default account"),
          h2(`Default Account:`),
          input(".defaultAccount", {
            attrs: { value: state.state.defaultAccount }
          }),
          button(".setDefaultAccount", "submit")
        ]),
        json(state.state)
      ])
  );

  const defaultAccountReducer$ = DOM
    .select(".setDefaultAccount")
    .events("click")
    .compose(sampleCombine(defaultAccountChange$))
    .map(
      ([ e, value ]) => function defaultAccountReducer(parent) {
        parent.state.defaultAccount = value;
        return _.assign({}, parent);
      }
    );

  const selectReducer$ = changeChain$
    .map(
      e => function reduceForkStatus(parent) {
        let state = parent.state;
        console.log(e);
        state.selected = e;
        return _.assign({}, parent, { state });
      }
    );

  const chaintypeReq$ = onion.state$
  .map(state => state.state.chaintype)
  .filter(state => !state)
  .mapTo({type: "GET_CHAINTYPE"})

  const changeChainReq$ = changeChain$
  .map(name => ({type: "CHANGE_CHAIN", name}))

  const newForkMsg$ = newForkClick$
  .compose(sampleCombine(xs.combine(forkName$, fromRPC$, forkURI$ )))
  .map(([_, data]) => ({
    type: "NEW_FORK",
    name: data[0],
    fromrpc: data[1],
    rpc: data[2]
  }))

  const chainListReducer$ = newChainList$
  .map(msg => function chainListReducer(parent) {
    parent.state.options = msg.chains;
    return _.assign({}, parent)
  });

  const chaininfoReducer$ = chaininfo$
  .map(msg => function chaininfoReducer(parent) {
    parent.state.selected = msg.selected;
    parent.state.chaintype = msg.chaintype;
    return _.assign({}, parent);
  })


  // TODO come up with a descreptive web3 query which builds requests + reducers
  // TODO - refactor this
  //      - do I really want to have this approach?
  //        overall, this only happens during certain
  //        events/ intents, and with this the state
  //        is scanned every time some property is
  //        changed. So a reason for another approach
  //        would be performance.
  //
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
  // const genRequests = (path, o) => {
  //   let reqs = []
  //   if(typeof o === "object") {
  //     let index = Object.keys(o).indexOf("/web3");
  //     if(index > -1) {
  //       let method = o["/web3"];
  //       let params = o["params"];
  //       reqs.push({
  //         type: "DH_REQ",
  //         _location: path,
  //         _f: o.f,
  //         req: {
  //           "jsonrpc": "2.0",
  //           "method": "eth_"+method,
  //           "params": params
  //         }
  //       })
  //     } else { // index === -1
  //       let childReqs = Object.keys(o)
  //       .map(key => genRequests(path + (path ? "." : "") + key, o[key]))
  //       reqs = _.flatten(childReqs);
  //     }
  //   }
  //   return reqs;
  // }
  // const blockHeightRequest$ = onion.state$
  // .map(state => genRequests("", state))
  // .filter(r => r.length > 0)
  // const removeKnownRequestsReducer$ = blockHeightRequest$
  // .map(s => function removeKnownRequestsReducer (parent) {
  //   s.forEach(t => {
  //     let o = t._location
  //     .split('.')
  //     .slice(0,-1)
  //     .reduce((a, l) => a[l], parent);
  //     o[t._location.split('.').slice(-1)] = "."
  //   })
  //   return _.assign({}, parent);
  // })
  // const blockHeightReducer$ = Sniffer
  // .filter(t => t.type === "RES")
  // .filter(t => t.req.method === "eth_blockNumber")
  // .map(t => function blockNumberReducer(parent) {
  //   let _df = e => e
  //   // TODO - rewrite it with immutable or something
  //   let o = t._location
  //   .split('.')
  //   .slice(0,-1)
  //   .reduce((a, l) => a[l], parent);
  //   o[t._location.split('.').slice(-1)] = (t._f || _df)(t.res.result)
  //   return _.assign({}, parent);
  // })
  // TODO - trigger reducer
  const reset$ = DOM
    .select(".reset")
    .events("click")
    .mapTo({ type: "RESET_FORK" })
    .compose(sampleCombine(onion.state$))
    .map(([e, state]) => _.assign({}, e, {name: state.state.selected}))

  const snifReq$ = xs.merge(
    reset$,
    // blockHeightRequest$
    // .map(e => xs.fromArray(e))
    // .flatten()
    newForkMsg$,
    changeChainReq$
  );


  return {
    DOM: vdom$,
    onion: xs.merge(
      selectReducer$,
      // blockHeightReducer$,
      // removeKnownRequestsReducer$
      defaultAccountReducer$,
      chainListReducer$,
      chaininfoReducer$
    ),
    Sniffer: xs.merge(
      snifReq$,
      chaintypeReq$
    )
  };
};
