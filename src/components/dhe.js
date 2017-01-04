
import isolate from '@cycle/isolate';
import {Memepool} from '../memepool.js';
import {AddrView} from './addr.js';
import {Sniffer} from './sniffer.js';
import xs from 'xstream';
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
    addr: AddrView,
    sniffer: isolate(Sniffer, "state")
  };

  const tabSinks = isolate(Tabs({
    sinkNames: ["onion", "web3$"],
    C,
    classname: ".treeview"
  }), 'tabs')(sources)

  const web3$ = tabSinks.web3$
    .fold((parent, cmd) => ({
      cmd: _.assign(cmd, {id: parent.id + 1}),
      id: parent.id + 1
    }) ,{cmd: {}, id: 0})
    .filter(e => e.id > 0)
    .map(e => e.cmd)

  const initState$ = xs.of(function initStateReducer() {
    return {
      tabs: [{
        index: "tab1",
        name: "address",
        type: "asd",
        selected: true
      }, {
        index: "tab2",
        name: "sniffer",
        type: "sniffer",
        state: {
          history: []
        },
        selected: false
      }],
      // stores all meta information
      mempool: {
      }
    };
  })

  const reducer$ = xs.merge(
    initState$,
    tabSinks.onion,
    newMemeReducer$
  )

  return {
    DOM: tabSinks.DOM,
    HTTP: memepool.HTTP,
    onion: reducer$,
    web3$: tabSinks.web3$
  }
}
