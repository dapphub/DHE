"use strict";
import xs from 'xstream';
import Contract from 'dapple-core/contract.js';
import flattenSequentially from 'xstream/extra/flattenSequentially'

export var Memepool = (sources) => {

  const res$ = sources.HTTP
  .select('expert')
  .compose(flattenSequentially)
  .filter(res => res.text !== "")
  .map(res => ({type: "res", data: JSON.parse(res.text)}))

  const req$ = sources.Sniffer
  .filter(comm => comm.type === "RES")
  .filter(comm => comm.req.method === "eth_call")
  .map(comm => ({type: "req", addr: comm.req.params[0].to}))

  // TODO - refactor this to onion state
  const memepool$ = xs.merge(res$, req$)
  .fold((state, act) => {
    state.next = null;

    switch(act.type) {

      case "res":
        const data = act.data;
        const contract_name = data.contract_type.contract_name
        // .find(name => data.lock.contracts[name].address === data.address);
        const contract_type = data.contract_type;
        data.name = contract_name;
        data.contract = new Contract(contract_type, contract_type.contract_name);
        state.addrs[data.address] = data;
        break;

      case "req":
        const addr = act.addr;
        if(!(addr in state.known)) {
          state.next = addr;
          state.known[addr] = true;
        }
        break;
    }
    return state;
  }, {addrs: {}, known: {}, next: null})


  const request$ = memepool$
  .filter(memepool => !!memepool.next)
  .map(memepool => memepool.next)
  .map(addr => ({
    url: 'https://4zgkma87x3.execute-api.us-east-1.amazonaws.com/dev/get',
    method: 'GET',
    query: {"address": addr},
    category: 'expert'
  }))

  return {
    state$: memepool$,
    HTTP: request$
  };
}
