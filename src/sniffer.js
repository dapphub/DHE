const Subprovider = require('web3-provider-engine/subproviders/subprovider.js')
const inherits = require('util').inherits

inherits(SnifferSubprovider, Subprovider)

function SnifferSubprovider(opts){
}

// setup a block listener on 'setEngine'
SnifferSubprovider.prototype.setEngine = function(engine) {
  Subprovider.prototype.setEngine.call(self, engine)
}

SnifferSubprovider.prototype.handleRequest = function(payload, next, end) {
  return next((err, res, cb) => {
    // console.log(payload, res);
    window.postMessage({ type: "WEB3_SNIFFER", req: payload, res: res }, "*");
    cb();
  });
}

module.exports = SnifferSubprovider;
