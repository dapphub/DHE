// var TestRPC = require("ethereumjs-testrpc/");
var GethDefaults = require("ethereumjs-testrpc/lib/subproviders/gethdefaults.js");
var RequestFunnel = require('ethereumjs-testrpc/lib/subproviders/requestfunnel.js');
var GethApiDouble = require('ethereumjs-testrpc/lib/subproviders/geth_api_double.js');
var VmSubprovider = require('web3-provider-engine/subproviders/vm.js');

var DelayedBlockFilter = require("ethereumjs-testrpc/lib/subproviders/delayedblockfilter.js");
var ReactiveBlockTracker = require("ethereumjs-testrpc/lib/subproviders/reactiveblocktracker.js");

const ProviderEngine = require('web3-provider-engine');
var FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')
const level = require('level-js');
const levelup = require('levelup');
const memdown = require("memdown")
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


function setUpEngine({db, forkSource}) {

  console.log("set up engine");
  if(!forkSource) {
    forkSource = "http://localhost:8545";
  }
  if(!db) {
    db = levelup("/db", {
      db: memdown
    })
  }

  var engine = new ProviderEngine();
  var _web3 = new Web3(engine);

  var gethApiDouble = new GethApiDouble({
    fork: forkSource,
    db,
    mnemonic: "secret"
  });

  engine.manager = gethApiDouble;
  engine.addProvider(new RequestFunnel());
  engine.addProvider(new ReactiveBlockTracker());
  engine.addProvider(new DelayedBlockFilter());
  engine.addProvider(new FilterSubprovider());
  engine.addProvider(new GethDefaults());
  engine.addProvider(new VmSubprovider());
  engine.addProvider(gethApiDouble);

  // for debug purposes only
  window.web3 = _web3;

  // start polling for blocks
  engine._ready.setMaxListeners(100);
  engine.start()
  return engine;
}

module.exports = setUpEngine;
