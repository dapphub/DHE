"use strict";
import xs from 'xstream';
import Contract from 'dapple-core/contract.js';

export var Memepool = (sources) => {

  const memepool$ = sources.HTTP
  .select('expert')
  .flatten()
  .debug("res")
  .filter(res => res.text !== "")
  .map(res => JSON.parse(res.text))
  .fold( (acc, meme) => {
    const contractName = Object.keys(meme.lock.contracts).find(name => meme.lock.contracts[name].address === meme.address);
    const contractDef = meme.lock.contracts[contractName];
    meme.contract = new Contract(contractDef, contractDef.contract_name);
    acc.addrs[meme.address] = meme;
    return acc;
  }, {addrs: {}, known: {}})
  .debug("meme");

  const discoveredAddrs$ = sources.Sniffer
  .filter(comm => comm.req.method === "eth_call")
  .map(comm => comm.req.params[0].to)


  const request$ = xs.combine(discoveredAddrs$, memepool$)
  .filter(([addr, memepool]) => !(addr in memepool.addrs) && !(addr in memepool.known))
  .map(([addr, _]) => ({
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
