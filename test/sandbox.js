var assert = require('assert');
var sinon = require('sinon');

var sandbox = require('../src/sandbox.js');

describe('ForkManager', function () {
  var setUpEngine;
  var mockFork = function () {
    return new Object({
      stop: sinon.spy()
    });
  };

  before(function () {
    setUpEngine = sinon.stub();
    setUpEngine.onCall(0).returns(mockFork());
    setUpEngine.onCall(1).returns(mockFork());
  });

  describe('newFork()', function () {
    var ret;

    before(function () {
      ret = sandbox.ForkManager.newFork('ropsten', setUpEngine);
    });

    it('should return an object with the fork and its ID', function () {
      assert('id' in ret);
      assert('fork' in ret);
      assert(setUpEngine.called);
    });

    it('should insert the fork object into the forks array', function () {
      assert(sandbox.ForkManager.forks.includes(ret.fork));
    });
  });

  describe('resetFork(forkId)', function () {
    it('should stop and reinitialize the specified fork', function () {
      var old = sandbox.ForkManager.newFork('ropsten', setUpEngine);
      var newFork = sandbox.ForkManager.resetFork(old.id, setUpEngine);
      assert(old.fork !== newFork); // different identity?
      assert(old.fork.stop.called);
    });
  })
});
