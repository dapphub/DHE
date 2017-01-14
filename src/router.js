import setUpEngine from './testrpc.js';
import _ from 'lodash';

export const Router = {
  forks: [],
  names: {},
  chains: {},
  selectedChain: {}, // client => chain
  clientChannels: {},
  fork: null,
  // TODO - improve native support
  // refactor this a lot
  registerChain: function (clientid, name, chain) {
    if(this.chains[name]) console.error(`Chain with the name ${name} already exists, overwriting may cause WW3.`)
    this.chains[name] = chain;
    if(!this.selectedChain[clientid]) this.selectChain(clientid, name)
  },
  registerClient: function (clientid, channel) {
    this.clientChannels[clientid] = channel;
  },
  selectChain: function (clientid, name) {
    this.selectedChain[clientid] = name;
    this.send(clientid, {
      type: "CHAININFO",
      chaintype: "amazing",
      selected: name
    })
  },

  // Send a msg to a specific client
  send: function (clientid, msg, req) {
    this.clientChannels[clientid](msg, req);
  },
  // Send the msg to all known clients
  broadcast: function (msg) {
    Object.keys(this.clientChannels)
    .map(name => this.clientChannels[name])
    .forEach(ch => ch(msg))
  },

  newFork: function(clientid, opts) {
    var forkSource = 'http://localhost:8545';

    if(opts.fromrpc) {
      forkSource = opts.rpc;
    } else {
      console.error("NON RPC forks currently unsupported.")
    }
    const fork = setUpEngine({forkSource})
    const name = opts.name || "TODO";
    this.chains[name] = {
      chain: fork,
      type: "fork",
      opts
    };
    this.selectChain(clientid, name);
    this.broadcast({
      type: "CHAIN_LIST",
      chains: Object.keys(this.chains)
    });
    // TODO - inform client about new available fork and selected
  },
  resetFork: function(clientid, name) {
    console.log("TODO", name);
    this.chains[name].chain.stop();
    this.newFork(clientid, this.chains[name].opts);
  },
  process: function(clientid) { return msg => {
    const handleRequest = (e) => {
      switch(e.type) {
        case "REQ":
          this.chains[this.selectedChain[clientid]].chain
          .sendAsync(e.req, (err, res) => {
            let resp = {type: "RES", res, req: e.req};
            this.send( clientid, _.assign({}, e, resp));
          })
          break;
        case "RESET_FORK":
          this.resetFork(clientid, e.name);
          break;
        case "NEW_FORK":
          this.newFork(clientid, e);
          break;
        case "GET_CHAINTYPE":
          console.log("getting");
          this.send(clientid, {
            type: "CHAINTYPE",
            chaintype: "passive"
          })
          break;
        case "CHANGE_CHAIN":
          this.selectChain(clientid, e.name)
          break;
        default:
          console.log("NO SNIFFER HANDLER FOR", e);
      }
    }
    if(Array.isArray(msg)) {
      r.forEach(handleRequest);
    } else {
      handleRequest(msg);
    }
  }
  }
}
