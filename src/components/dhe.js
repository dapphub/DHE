import isolate from '@cycle/isolate';
import {Memepool} from '../memepool.js';
import {AddrView} from './addr.js';
import {Sniffer} from './sniffer.js';
import {Settings} from './settings.js';
import xs from 'xstream';
import utils from 'web3/lib/utils/utils.js';
import _ from 'lodash';
import {MakeTabChildren, Tabs} from '../treeview.js';

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
      selected: false,
      children: MakeTabChildren(state.addrs[addr].contract.abi, () => "abi")
    }))

    return _.assign({}, parent, {
      tabs: parent.tabs.concat(newObjects)
    });
  })

  const C = {
    settings: Settings,
    addr: AddrView,
    sniffer: isolate(Sniffer, "state")
  };

  const tabSinks = isolate(Tabs({
    sinkNames: ["onion", "Sniffer"],
    C,
    classname: ".treeview"
  }), 'tabs')(sources)

  const notWeb3Requests$ = tabSinks.Sniffer
  .filter(t => Array.isArray(t) || t.type !== "REQ")

  const initState$ = xs.of(function initStateReducer() {
    return {
      tabs: [{
        index: "tab1",
        name: "settings",
        type: "settings",
        state: {
          forkStatus: 0,
          options: ["not forked"],
          defaultAccount: "0x2134",
          blockNumber: {"/web3": "blockNumber", params: [], f: utils.toDecimal}
        },
        selected: false
      }, {
        index: "tab2",
        name: "sniffer",
        type: "sniffer",
        state: {
          history: []
        },
        selected: true
      }],
      // stores all meta information
      mempool: {
      }
    };
  })

  // save blockNumber
  const blockNumberReducer$ = sources.Sniffer
  .filter(e => e.type === "RES")
  .filter(e => e.req.method === "eth_blockNumber")
  .map(e => function blockNumberReducer(parent) {
    let settings = parent.tabs.find(t => t.type === "settings");
    settings.state.blockNumber = utils.toDecimal(e.res.result);
    return _.assign({}, parent)
  });

  // Set Up Default Settings
  const setUpState$ = xs.of({
    type: "REQ",
    req: {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: []
    }
  })

  // TODO - export this somewhere to the top
  const web3requests$ = xs.merge(tabSinks.Sniffer, setUpState$)
  .filter(t => t.type === "REQ")
  .fold((parent, cmd) => ({
    cmd: _.assign(cmd, {req: _.assign(cmd.req, {
      id: parent.id + 1,
      jsonrpc: "2.0"
    })}),
    id: parent.id + 1
  }) ,{cmd: {}, id: 0})
  .filter(e => e.id > 0)
  .map(e => e.cmd)

  const reducer$ = xs.merge(
    initState$,
    tabSinks.onion,
    newMemeReducer$,
    blockNumberReducer$
  )

  const requests$ = xs.merge(
    web3requests$,
    notWeb3Requests$,
    setUpState$
  )

  return {
    DOM: tabSinks.DOM,
    HTTP: memepool.HTTP,
    onion: reducer$,
    Sniffer: requests$
  }
}
