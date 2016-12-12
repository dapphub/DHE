"use strict";
import xs from 'xstream';

export var Memepool = (sources) => {

  const memepool$ = sources.HTTP
  .select('expert')
  .flatten()
  .debug("res")
  .map(res => JSON.parse(res.text))
  .fold( (acc, meme) => {
    acc.addrs[meme.address] = meme;
    return acc;
  }, {addrs: {}})
  .debug("meme");

  const discoveredAddrs$ = sources.Sniffer
  .filter(comm => comm.req.method === "eth_call")
  .map(comm => comm.req.params[0].to)


  const request$ = xs.combine(discoveredAddrs$, memepool$)
  .filter(([addr, memepool]) => !(addr in memepool.addrs))
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
