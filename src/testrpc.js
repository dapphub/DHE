// var TestRPC = require("ethereumjs-testrpc/");
var GethDefaults = require("ethereumjs-testrpc/lib/subproviders/gethdefaults.js");
var RequestFunnel = require('ethereumjs-testrpc/lib/subproviders/requestfunnel.js');
var GethApiDouble = require('ethereumjs-testrpc/lib/subproviders/geth_api_double.js');
var VmSubprovider = require('web3-provider-engine/subproviders/vm.js');
const ProviderEngine = require('web3-provider-engine');
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')
const level = require('level-js');
const levelup = require('levelup');
var Web3 = require("web3");


// Buffers are not valid keys
["_put", "_get"]
.forEach(f => {
  let _f = level.prototype[f];
  level.prototype[f] = function () {
    var args = Array.prototype.slice.call(arguments);
    args[0] = args[0].toString("hex");
    _f.apply(this, args);
  }
})

let _f = level.prototype._batch;
level.prototype._batch = function () {
  var args = Array.prototype.slice.call(arguments);
  args[0] = args[0].map(o => o.key && (o.key = o.key.toString("hex")) && o || o)
    _f.apply(this, args);
}


function setUpEngine(sendToWeb3) {
  var engine = new ProviderEngine();
  engine._ready.setMaxListeners(30);
  // engine.addProvider(new SnifferSubprovider());

  var _web3 = new Web3(engine);
  var db = levelup("/db", {
    db: level
  })

  // this takes care of rerouting forked requests back
  // into the browser.
  var rerouter = {
    sendAsync: (payload, callback) => {
      sendToWeb3(payload, callback);
    },
    send: () => {
      throw new Error("sync requests are not supported");
    }
  }


  // var sniffer = new SnifferSubprovider();
  // web3.currentProvider._providers.unshift(sniffer);
  // sniffer.setEngine(web3.currentProvider);

  // var forkedProvider = new Web3.providers.HttpProvider("");
  // forkedProvider.sendAsync = web3.currentProvider.sendAsync;
  var gethApiDouble = new GethApiDouble({
    // fork: rerouter,
    fork: "http://localhost:8545",
    db,
    mnemonic: "secret",
    // blocktime: 0.1
  });
  engine.manager = gethApiDouble;
  engine.addProvider(new RequestFunnel());
  engine.addProvider(new FilterSubprovider());
  engine.addProvider(new GethDefaults());
  engine.addProvider(new VmSubprovider());
  engine.addProvider(gethApiDouble);
  // engine.addProvider(new Web3Subprovider(forkedProvider));

  console.log("injecting");
  window.web3 = _web3;

  // start polling for blocks
  engine.start()
  // web3.currentProvider.sendAsync = _web3.currentProvider.sendAsync.bind(_web3.currentProvider);
  return engine;
}

module.exports = setUpEngine;
