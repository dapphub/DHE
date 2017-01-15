var assert = require('assert');
var sinon = require('sinon');

var sandbox = require('../src/sandbox.js');

describe('ForkManager', function () {
  describe('newFork()', function () {
    it('should return an object with the fork and its ID', function () {
      var setUpEngine = sinon.spy();
      var ret = sandbox.ForkManager.newFork('ropsten', setUpEngine);
      assert('id' in ret);
      assert('fork' in ret);
      assert(setUpEngine.called);
    });
  });
});
