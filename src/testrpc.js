// var TestRPC = require("ethereumjs-testrpc");
const ProviderEngine = require('web3-provider-engine');
const Subprovider = require('web3-provider-engine/subproviders/subprovider.js')
const Web3Subprovider = require('web3-provider-engine/subproviders/web3.js')
const inherits = require('util').inherits
var Web3 = require("web3");
// var $ = require("jquery");

inherits(SnifferSubprovider, Subprovider)

function SnifferSubprovider(opts){
}

// setup a block listener on 'setEngine'
SnifferSubprovider.prototype.setEngine = function(engine) {
  Subprovider.prototype.setEngine.call(self, engine)
}

SnifferSubprovider.prototype.handleRequest = function(payload, next, end) {
  return next((err, res, cb) => {
    console.log(payload, res);
    window.postMessage({ type: "WEB3_SNIFFER", req: payload, resp: res }, "*");
    cb();
  });
}

// window.TestRPC = TestRPC;

var engine = new ProviderEngine();
engine._ready.setMaxListeners(30);
engine.addProvider(new SnifferSubprovider());
var _web3 = new Web3(engine);

if(web3) {
  console.log(1);
  console.log("injecting", web3);
  var sniffer = new SnifferSubprovider();
  // web3.currentProvider._providers.unshift(sniffer);
  // sniffer.setEngine(web3.currentProvider);
  engine.addProvider(new Web3Subprovider(web3.currentProvider));

  console.log("injecting");
  window.web3 = _web3;

  // start polling for blocks 
  engine.start()
} else {
  console.log(2);
  Object.defineProperty(o, 'web3', {
    get: () => {
      return _web3;
    },
    set: () => {
      console.log("injecting", web3);
      // engine.addProvider(new Web3Subprovider(web3.currentProvider));

      console.log("injecting");
      window.web3 = _web3;

      // start polling for blocks 
      // engine.start()

    }
  });
}

