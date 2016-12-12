/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _xstreamRun = __webpack_require__(1);

	var _dom = __webpack_require__(10);

	var _xstream = __webpack_require__(4);

	var _xstream2 = _interopRequireDefault(_xstream);

	var _treeview = __webpack_require__(125);

	var _http = __webpack_require__(126);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(135);

	window.main = function (sources) {

	  var dhExtension = (0, _treeview.DHExtension)(sources);

	  var DH$ = dhExtension.DOM;

	  var init$ = sources.DOM.select('.toggleDappHub').events('click').fold(function (acc, x) {
	    return !acc;
	  }, false);

	  var vdom$ = _xstream2.default.combine(DH$, init$).map(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        DH = _ref2[0],
	        init = _ref2[1];

	    var color = init ? '#0f0' : '#f0f';
	    var initView = (0, _dom.div)([(0, _dom.button)(".toggleDappHub", { style: { background: color } }, "Start"), (0, _dom.span)("This will trigger reloading this webpage.")]);
	    var dhView = DH;
	    return init ? dhView : initView;
	  });

	  var MV = {
	    DOM: vdom$,
	    HTTP: dhExtension.HTTP
	  };

	  return MV;
	};

	window.run = _xstreamRun.run;
	window.makeDOMDriver = _dom.makeDOMDriver;
	window.makeHTTPDriver = _http.makeHTTPDriver;
	window.xs = _xstream2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var base_1 = __webpack_require__(2);
	var xstream_adapter_1 = __webpack_require__(3);
	/**
	 * Takes a `main` function and circularly connects it to the given collection
	 * of driver functions.
	 *
	 * **Example:**
	 * ```js
	 * import {run} from '@cycle/xstream-run';
	 * const dispose = run(main, drivers);
	 * // ...
	 * dispose();
	 * ```
	 *
	 * The `main` function expects a collection of "source" streams (returned from
	 * drivers) as input, and should return a collection of "sink" streams (to be
	 * given to drivers). A "collection of streams" is a JavaScript object where
	 * keys match the driver names registered by the `drivers` object, and values
	 * are the streams. Refer to the documentation of each driver to see more
	 * details on what types of sources it outputs and sinks it receives.
	 *
	 * @param {Function} main a function that takes `sources` as input and outputs
	 * `sinks`.
	 * @param {Object} drivers an object where keys are driver names and values
	 * are driver functions.
	 * @return {Function} a dispose function, used to terminate the execution of the
	 * Cycle.js program, cleaning up resources used.
	 * @function run
	 */
	function run(main, drivers) {
	    var _a = base_1.default(main, drivers, { streamAdapter: xstream_adapter_1.default }), run = _a.run, sinks = _a.sinks;
	    if (typeof window !== 'undefined' && window['CyclejsDevTool_startGraphSerializer']) {
	        window['CyclejsDevTool_startGraphSerializer'](sinks);
	    }
	    return run();
	}
	exports.run = run;
	/**
	 * A function that prepares the Cycle application to be executed. Takes a `main`
	 * function and prepares to circularly connects it to the given collection of
	 * driver functions. As an output, `Cycle()` returns an object with three
	 * properties: `sources`, `sinks` and `run`. Only when `run()` is called will
	 * the application actually execute. Refer to the documentation of `run()` for
	 * more details.
	 *
	 * **Example:**
	 * ```js
	 * import Cycle from '@cycle/xstream-run';
	 * const {sources, sinks, run} = Cycle(main, drivers);
	 * // ...
	 * const dispose = run(); // Executes the application
	 * // ...
	 * dispose();
	 * ```
	 *
	 * @param {Function} main a function that takes `sources` as input and outputs
	 * `sinks`.
	 * @param {Object} drivers an object where keys are driver names and values
	 * are driver functions.
	 * @return {Object} an object with three properties: `sources`, `sinks` and
	 * `run`. `sources` is the collection of driver sources, `sinks` is the
	 * collection of driver sinks, these can be used for debugging or testing. `run`
	 * is the function that once called will execute the application.
	 * @function Cycle
	 */
	var Cycle = function (main, drivers) {
	    var out = base_1.default(main, drivers, { streamAdapter: xstream_adapter_1.default });
	    if (typeof window !== 'undefined' && window['CyclejsDevTool_startGraphSerializer']) {
	        window['CyclejsDevTool_startGraphSerializer'](out.sinks);
	    }
	    return out;
	};
	Cycle.run = run;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Cycle;
	//# sourceMappingURL=index.js.map

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	function logToConsoleError(err) {
	    var target = err.stack || err;
	    if (console && console.error) {
	        console.error(target);
	    }
	    else if (console && console.log) {
	        console.log(target);
	    }
	}
	function makeSinkProxies(drivers, streamAdapter) {
	    var sinkProxies = {};
	    for (var name_1 in drivers) {
	        if (drivers.hasOwnProperty(name_1)) {
	            var holdSubject = streamAdapter.makeSubject();
	            var driverStreamAdapter = drivers[name_1].streamAdapter || streamAdapter;
	            var stream = driverStreamAdapter.adapt(holdSubject.stream, streamAdapter.streamSubscribe);
	            sinkProxies[name_1] = {
	                stream: stream,
	                observer: holdSubject.observer,
	            };
	        }
	    }
	    return sinkProxies;
	}
	function callDrivers(drivers, sinkProxies, streamAdapter) {
	    var sources = {};
	    for (var name_2 in drivers) {
	        if (drivers.hasOwnProperty(name_2)) {
	            var driverOutput = drivers[name_2](sinkProxies[name_2].stream, streamAdapter, name_2);
	            var driverStreamAdapter = drivers[name_2].streamAdapter;
	            if (driverStreamAdapter && driverStreamAdapter.isValidStream(driverOutput)) {
	                sources[name_2] = streamAdapter.adapt(driverOutput, driverStreamAdapter.streamSubscribe);
	            }
	            else {
	                sources[name_2] = driverOutput;
	            }
	            if (sources[name_2] && typeof sources[name_2] === 'object') {
	                sources[name_2]._isCycleSource = name_2;
	            }
	        }
	    }
	    return sources;
	}
	function replicateMany(sinks, sinkProxies, streamAdapter) {
	    var results = Object.keys(sinks)
	        .filter(function (name) { return !!sinkProxies[name]; })
	        .map(function (name) {
	        return streamAdapter.streamSubscribe(sinks[name], {
	            next: function (x) { sinkProxies[name].observer.next(x); },
	            error: function (err) {
	                logToConsoleError(err);
	                sinkProxies[name].observer.error(err);
	            },
	            complete: function (x) {
	                sinkProxies[name].observer.complete(x);
	            }
	        });
	    });
	    var disposeFunctions = results
	        .filter(function (dispose) { return typeof dispose === 'function'; });
	    return function () {
	        disposeFunctions.forEach(function (dispose) { return dispose(); });
	    };
	}
	function disposeSources(sources) {
	    for (var k in sources) {
	        if (sources.hasOwnProperty(k) && sources[k]
	            && typeof sources[k].dispose === 'function') {
	            sources[k].dispose();
	        }
	    }
	}
	var isObjectEmpty = function (obj) { return Object.keys(obj).length === 0; };
	function Cycle(main, drivers, options) {
	    if (typeof main !== "function") {
	        throw new Error("First argument given to Cycle must be the 'main' " +
	            "function.");
	    }
	    if (typeof drivers !== "object" || drivers === null) {
	        throw new Error("Second argument given to Cycle must be an object " +
	            "with driver functions as properties.");
	    }
	    if (isObjectEmpty(drivers)) {
	        throw new Error("Second argument given to Cycle must be an object " +
	            "with at least one driver function declared as a property.");
	    }
	    var streamAdapter = options.streamAdapter;
	    if (!streamAdapter || isObjectEmpty(streamAdapter)) {
	        throw new Error("Third argument given to Cycle must be an options object " +
	            "with the streamAdapter key supplied with a valid stream adapter.");
	    }
	    var sinkProxies = makeSinkProxies(drivers, streamAdapter);
	    var sources = callDrivers(drivers, sinkProxies, streamAdapter);
	    var sinks = main(sources);
	    if (typeof window !== 'undefined') {
	        window.Cyclejs = { sinks: sinks };
	    }
	    var run = function () {
	        var disposeReplication = replicateMany(sinks, sinkProxies, streamAdapter);
	        return function () {
	            disposeSources(sources);
	            disposeReplication();
	        };
	    };
	    return { sinks: sinks, sources: sources, run: run };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Cycle;
	//# sourceMappingURL=index.js.map

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	var XStreamAdapter = {
	    adapt: function (originStream, originStreamSubscribe) {
	        if (XStreamAdapter.isValidStream(originStream)) {
	            return originStream;
	        }
	        ;
	        var dispose = null;
	        return xstream_1.default.create({
	            start: function (out) {
	                var observer = out;
	                dispose = originStreamSubscribe(originStream, observer);
	            },
	            stop: function () {
	                if (typeof dispose === 'function') {
	                    dispose();
	                }
	            },
	        });
	    },
	    makeSubject: function () {
	        var stream = xstream_1.default.create();
	        var observer = {
	            next: function (x) { stream.shamefullySendNext(x); },
	            error: function (err) { stream.shamefullySendError(err); },
	            complete: function () { stream.shamefullySendComplete(); },
	        };
	        return { observer: observer, stream: stream };
	    },
	    remember: function (stream) {
	        return stream.remember();
	    },
	    isValidStream: function (stream) {
	        return (typeof stream.addListener === 'function' &&
	            typeof stream.shamefullySendNext === 'function');
	    },
	    streamSubscribe: function (stream, observer) {
	        stream.addListener(observer);
	        return function () { return stream.removeListener(observer); };
	    },
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = XStreamAdapter;
	//# sourceMappingURL=index.js.map

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(5);
	exports.Stream = core_1.Stream;
	exports.MemoryStream = core_1.MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = core_1.Stream;
	//# sourceMappingURL=index.js.map

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var symbol_observable_1 = __webpack_require__(6);
	var NO = {};
	function noop() { }
	function copy(a) {
	    var l = a.length;
	    var b = Array(l);
	    for (var i = 0; i < l; ++i) {
	        b[i] = a[i];
	    }
	    return b;
	}
	exports.NO_IL = {
	    _n: noop,
	    _e: noop,
	    _c: noop,
	};
	// mutates the input
	function internalizeProducer(producer) {
	    producer._start =
	        function _start(il) {
	            il.next = il._n;
	            il.error = il._e;
	            il.complete = il._c;
	            this.start(il);
	        };
	    producer._stop = producer.stop;
	}
	function and(f1, f2) {
	    return function andFn(t) {
	        return f1(t) && f2(t);
	    };
	}
	var Subscription = (function () {
	    function Subscription(_stream, _listener) {
	        this._stream = _stream;
	        this._listener = _listener;
	    }
	    Subscription.prototype.unsubscribe = function () {
	        this._stream.removeListener(this._listener);
	    };
	    return Subscription;
	}());
	exports.Subscription = Subscription;
	var ObservableProducer = (function () {
	    function ObservableProducer(observable) {
	        this.type = 'fromObservable';
	        this.ins = observable;
	    }
	    ObservableProducer.prototype._start = function (out) {
	        this.out = out;
	        this._subscription = this.ins.subscribe(new ObservableListener(out));
	    };
	    ObservableProducer.prototype._stop = function () {
	        this._subscription.unsubscribe();
	    };
	    return ObservableProducer;
	}());
	var ObservableListener = (function () {
	    function ObservableListener(_listener) {
	        this._listener = _listener;
	    }
	    ObservableListener.prototype.next = function (value) {
	        this._listener._n(value);
	    };
	    ObservableListener.prototype.error = function (err) {
	        this._listener._e(err);
	    };
	    ObservableListener.prototype.complete = function () {
	        this._listener._c();
	    };
	    return ObservableListener;
	}());
	var MergeProducer = (function () {
	    function MergeProducer(insArr) {
	        this.type = 'merge';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ac = 0;
	    }
	    MergeProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var L = s.length;
	        this.ac = L;
	        for (var i = 0; i < L; i++) {
	            s[i]._add(this);
	        }
	    };
	    MergeProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var L = s.length;
	        for (var i = 0; i < L; i++) {
	            s[i]._remove(this);
	        }
	        this.out = NO;
	    };
	    MergeProducer.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    MergeProducer.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MergeProducer.prototype._c = function () {
	        if (--this.ac <= 0) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    return MergeProducer;
	}());
	exports.MergeProducer = MergeProducer;
	var CombineListener = (function () {
	    function CombineListener(i, out, p) {
	        this.i = i;
	        this.out = out;
	        this.p = p;
	        p.ils.push(this);
	    }
	    CombineListener.prototype._n = function (t) {
	        var p = this.p, out = this.out;
	        if (out === NO)
	            return;
	        if (p.up(t, this.i)) {
	            out._n(p.vals);
	        }
	    };
	    CombineListener.prototype._e = function (err) {
	        var out = this.out;
	        if (out === NO)
	            return;
	        out._e(err);
	    };
	    CombineListener.prototype._c = function () {
	        var p = this.p;
	        if (p.out === NO)
	            return;
	        if (--p.Nc === 0) {
	            p.out._c();
	        }
	    };
	    return CombineListener;
	}());
	exports.CombineListener = CombineListener;
	var CombineProducer = (function () {
	    function CombineProducer(insArr) {
	        this.type = 'combine';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ils = [];
	        this.Nc = this.Nn = 0;
	        this.vals = [];
	    }
	    CombineProducer.prototype.up = function (t, i) {
	        var v = this.vals[i];
	        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
	        this.vals[i] = t;
	        return Nn === 0;
	    };
	    CombineProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var n = this.Nc = this.Nn = s.length;
	        var vals = this.vals = new Array(n);
	        if (n === 0) {
	            out._n([]);
	            out._c();
	        }
	        else {
	            for (var i = 0; i < n; i++) {
	                vals[i] = NO;
	                s[i]._add(new CombineListener(i, out, this));
	            }
	        }
	    };
	    CombineProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var n = s.length;
	        var ils = this.ils;
	        for (var i = 0; i < n; i++) {
	            s[i]._remove(ils[i]);
	        }
	        this.out = NO;
	        this.ils = [];
	        this.vals = [];
	    };
	    return CombineProducer;
	}());
	exports.CombineProducer = CombineProducer;
	var FromArrayProducer = (function () {
	    function FromArrayProducer(a) {
	        this.type = 'fromArray';
	        this.a = a;
	    }
	    FromArrayProducer.prototype._start = function (out) {
	        var a = this.a;
	        for (var i = 0, l = a.length; i < l; i++) {
	            out._n(a[i]);
	        }
	        out._c();
	    };
	    FromArrayProducer.prototype._stop = function () {
	    };
	    return FromArrayProducer;
	}());
	exports.FromArrayProducer = FromArrayProducer;
	var FromPromiseProducer = (function () {
	    function FromPromiseProducer(p) {
	        this.type = 'fromPromise';
	        this.on = false;
	        this.p = p;
	    }
	    FromPromiseProducer.prototype._start = function (out) {
	        var prod = this;
	        this.on = true;
	        this.p.then(function (v) {
	            if (prod.on) {
	                out._n(v);
	                out._c();
	            }
	        }, function (e) {
	            out._e(e);
	        }).then(noop, function (err) {
	            setTimeout(function () { throw err; });
	        });
	    };
	    FromPromiseProducer.prototype._stop = function () {
	        this.on = false;
	    };
	    return FromPromiseProducer;
	}());
	exports.FromPromiseProducer = FromPromiseProducer;
	var PeriodicProducer = (function () {
	    function PeriodicProducer(period) {
	        this.type = 'periodic';
	        this.period = period;
	        this.intervalID = -1;
	        this.i = 0;
	    }
	    PeriodicProducer.prototype._start = function (stream) {
	        var self = this;
	        function intervalHandler() { stream._n(self.i++); }
	        this.intervalID = setInterval(intervalHandler, this.period);
	    };
	    PeriodicProducer.prototype._stop = function () {
	        if (this.intervalID !== -1)
	            clearInterval(this.intervalID);
	        this.intervalID = -1;
	        this.i = 0;
	    };
	    return PeriodicProducer;
	}());
	exports.PeriodicProducer = PeriodicProducer;
	var DebugOperator = (function () {
	    function DebugOperator(ins, arg) {
	        this.type = 'debug';
	        this.ins = ins;
	        this.out = NO;
	        this.s = noop;
	        this.l = '';
	        if (typeof arg === 'string') {
	            this.l = arg;
	        }
	        else if (typeof arg === 'function') {
	            this.s = arg;
	        }
	    }
	    DebugOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    DebugOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DebugOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var s = this.s, l = this.l;
	        if (s !== noop) {
	            try {
	                s(t);
	            }
	            catch (e) {
	                u._e(e);
	            }
	        }
	        else if (l) {
	            console.log(l + ':', t);
	        }
	        else {
	            console.log(t);
	        }
	        u._n(t);
	    };
	    DebugOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DebugOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DebugOperator;
	}());
	exports.DebugOperator = DebugOperator;
	var DropOperator = (function () {
	    function DropOperator(max, ins) {
	        this.type = 'drop';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.dropped = 0;
	    }
	    DropOperator.prototype._start = function (out) {
	        this.out = out;
	        this.dropped = 0;
	        this.ins._add(this);
	    };
	    DropOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DropOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.dropped++ >= this.max)
	            u._n(t);
	    };
	    DropOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DropOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DropOperator;
	}());
	exports.DropOperator = DropOperator;
	var OtherIL = (function () {
	    function OtherIL(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    OtherIL.prototype._n = function (t) {
	        this.op.end();
	    };
	    OtherIL.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    OtherIL.prototype._c = function () {
	        this.op.end();
	    };
	    return OtherIL;
	}());
	var EndWhenOperator = (function () {
	    function EndWhenOperator(o, ins) {
	        this.type = 'endWhen';
	        this.ins = ins;
	        this.out = NO;
	        this.o = o;
	        this.oil = exports.NO_IL;
	    }
	    EndWhenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.o._add(this.oil = new OtherIL(out, this));
	        this.ins._add(this);
	    };
	    EndWhenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.o._remove(this.oil);
	        this.out = NO;
	        this.oil = exports.NO_IL;
	    };
	    EndWhenOperator.prototype.end = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    EndWhenOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    EndWhenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    EndWhenOperator.prototype._c = function () {
	        this.end();
	    };
	    return EndWhenOperator;
	}());
	exports.EndWhenOperator = EndWhenOperator;
	var FilterOperator = (function () {
	    function FilterOperator(passes, ins) {
	        this.type = 'filter';
	        this.ins = ins;
	        this.out = NO;
	        this.passes = passes;
	    }
	    FilterOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    FilterOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    FilterOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            if (this.passes(t))
	                u._n(t);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FilterOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FilterOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FilterOperator;
	}());
	exports.FilterOperator = FilterOperator;
	var FlattenListener = (function () {
	    function FlattenListener(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    FlattenListener.prototype._n = function (t) {
	        this.out._n(t);
	    };
	    FlattenListener.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    FlattenListener.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return FlattenListener;
	}());
	var FlattenOperator = (function () {
	    function FlattenOperator(ins) {
	        this.type = 'flatten';
	        this.ins = ins;
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    }
	    FlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.ins._add(this);
	    };
	    FlattenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    FlattenOperator.prototype.less = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (!this.open && this.inner === NO)
	            u._c();
	    };
	    FlattenOperator.prototype._n = function (s) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new FlattenListener(u, this));
	    };
	    FlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return FlattenOperator;
	}());
	exports.FlattenOperator = FlattenOperator;
	var FoldOperator = (function () {
	    function FoldOperator(f, seed, ins) {
	        this.type = 'fold';
	        this.ins = ins;
	        this.out = NO;
	        this.f = f;
	        this.acc = this.seed = seed;
	    }
	    FoldOperator.prototype._start = function (out) {
	        this.out = out;
	        this.acc = this.seed;
	        out._n(this.acc);
	        this.ins._add(this);
	    };
	    FoldOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.acc = this.seed;
	    };
	    FoldOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.acc = this.f(this.acc, t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FoldOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FoldOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FoldOperator;
	}());
	exports.FoldOperator = FoldOperator;
	var LastOperator = (function () {
	    function LastOperator(ins) {
	        this.type = 'last';
	        this.ins = ins;
	        this.out = NO;
	        this.has = false;
	        this.val = NO;
	    }
	    LastOperator.prototype._start = function (out) {
	        this.out = out;
	        this.has = false;
	        this.ins._add(this);
	    };
	    LastOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.val = NO;
	    };
	    LastOperator.prototype._n = function (t) {
	        this.has = true;
	        this.val = t;
	    };
	    LastOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    LastOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.has) {
	            u._n(this.val);
	            u._c();
	        }
	        else {
	            u._e('TODO show proper error');
	        }
	    };
	    return LastOperator;
	}());
	exports.LastOperator = LastOperator;
	var MapFlattenInner = (function () {
	    function MapFlattenInner(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    MapFlattenInner.prototype._n = function (r) {
	        this.out._n(r);
	    };
	    MapFlattenInner.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    MapFlattenInner.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return MapFlattenInner;
	}());
	var MapFlattenOperator = (function () {
	    function MapFlattenOperator(mapOp) {
	        this.type = mapOp.type + "+flatten";
	        this.ins = mapOp.ins;
	        this.out = NO;
	        this.mapOp = mapOp;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	    }
	    MapFlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	        this.mapOp.ins._add(this);
	    };
	    MapFlattenOperator.prototype._stop = function () {
	        this.mapOp.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    MapFlattenOperator.prototype.less = function () {
	        if (!this.open && this.inner === NO) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    MapFlattenOperator.prototype._n = function (v) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        var s;
	        try {
	            s = this.mapOp.project(v);
	        }
	        catch (e) {
	            u._e(e);
	            return;
	        }
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new MapFlattenInner(u, this));
	    };
	    MapFlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapFlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return MapFlattenOperator;
	}());
	exports.MapFlattenOperator = MapFlattenOperator;
	var MapOperator = (function () {
	    function MapOperator(project, ins) {
	        this.type = 'map';
	        this.ins = ins;
	        this.out = NO;
	        this.project = project;
	    }
	    MapOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    MapOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    MapOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.project(t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    MapOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return MapOperator;
	}());
	exports.MapOperator = MapOperator;
	var FilterMapOperator = (function (_super) {
	    __extends(FilterMapOperator, _super);
	    function FilterMapOperator(passes, project, ins) {
	        _super.call(this, project, ins);
	        this.type = 'filter+map';
	        this.passes = passes;
	    }
	    FilterMapOperator.prototype._n = function (t) {
	        if (!this.passes(t))
	            return;
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.project(t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    return FilterMapOperator;
	}(MapOperator));
	exports.FilterMapOperator = FilterMapOperator;
	var RememberOperator = (function () {
	    function RememberOperator(ins) {
	        this.type = 'remember';
	        this.ins = ins;
	        this.out = NO;
	    }
	    RememberOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(out);
	    };
	    RememberOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return RememberOperator;
	}());
	exports.RememberOperator = RememberOperator;
	var ReplaceErrorOperator = (function () {
	    function ReplaceErrorOperator(fn, ins) {
	        this.type = 'replaceError';
	        this.ins = ins;
	        this.out = NO;
	        this.fn = fn;
	    }
	    ReplaceErrorOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    ReplaceErrorOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    ReplaceErrorOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    ReplaceErrorOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            this.ins._remove(this);
	            (this.ins = this.fn(err))._add(this);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    ReplaceErrorOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return ReplaceErrorOperator;
	}());
	exports.ReplaceErrorOperator = ReplaceErrorOperator;
	var StartWithOperator = (function () {
	    function StartWithOperator(ins, val) {
	        this.type = 'startWith';
	        this.ins = ins;
	        this.out = NO;
	        this.val = val;
	    }
	    StartWithOperator.prototype._start = function (out) {
	        this.out = out;
	        this.out._n(this.val);
	        this.ins._add(out);
	    };
	    StartWithOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return StartWithOperator;
	}());
	exports.StartWithOperator = StartWithOperator;
	var TakeOperator = (function () {
	    function TakeOperator(max, ins) {
	        this.type = 'take';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.taken = 0;
	    }
	    TakeOperator.prototype._start = function (out) {
	        this.out = out;
	        this.taken = 0;
	        if (this.max <= 0) {
	            out._c();
	        }
	        else {
	            this.ins._add(this);
	        }
	    };
	    TakeOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    TakeOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.taken++ < this.max - 1) {
	            u._n(t);
	        }
	        else {
	            u._n(t);
	            u._c();
	        }
	    };
	    TakeOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    TakeOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return TakeOperator;
	}());
	exports.TakeOperator = TakeOperator;
	var Stream = (function () {
	    function Stream(producer) {
	        this._prod = producer || NO;
	        this._ils = [];
	        this._stopID = NO;
	        this._dl = NO;
	        this._d = false;
	        this._target = NO;
	        this._err = NO;
	    }
	    Stream.prototype._n = function (t) {
	        var a = this._ils;
	        var L = a.length;
	        if (this._d)
	            this._dl._n(t);
	        if (L == 1)
	            a[0]._n(t);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._n(t);
	        }
	    };
	    Stream.prototype._e = function (err) {
	        if (this._err !== NO)
	            return;
	        this._err = err;
	        var a = this._ils;
	        var L = a.length;
	        this._x();
	        if (this._d)
	            this._dl._e(err);
	        if (L == 1)
	            a[0]._e(err);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._e(err);
	        }
	    };
	    Stream.prototype._c = function () {
	        var a = this._ils;
	        var L = a.length;
	        this._x();
	        if (this._d)
	            this._dl._c();
	        if (L == 1)
	            a[0]._c();
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._c();
	        }
	    };
	    Stream.prototype._x = function () {
	        if (this._ils.length === 0)
	            return;
	        if (this._prod !== NO)
	            this._prod._stop();
	        this._err = NO;
	        this._ils = [];
	    };
	    Stream.prototype._stopNow = function () {
	        // WARNING: code that calls this method should
	        // first check if this._prod is valid (not `NO`)
	        this._prod._stop();
	        this._err = NO;
	        this._stopID = NO;
	    };
	    Stream.prototype._add = function (il) {
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._add(il);
	        var a = this._ils;
	        a.push(il);
	        if (a.length > 1)
	            return;
	        if (this._stopID !== NO) {
	            clearTimeout(this._stopID);
	            this._stopID = NO;
	        }
	        else {
	            var p = this._prod;
	            if (p !== NO)
	                p._start(this);
	        }
	    };
	    Stream.prototype._remove = function (il) {
	        var _this = this;
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._remove(il);
	        var a = this._ils;
	        var i = a.indexOf(il);
	        if (i > -1) {
	            a.splice(i, 1);
	            if (this._prod !== NO && a.length <= 0) {
	                this._err = NO;
	                this._stopID = setTimeout(function () { return _this._stopNow(); });
	            }
	            else if (a.length === 1) {
	                this._pruneCycles();
	            }
	        }
	    };
	    // If all paths stemming from `this` stream eventually end at `this`
	    // stream, then we remove the single listener of `this` stream, to
	    // force it to end its execution and dispose resources. This method
	    // assumes as a precondition that this._ils has just one listener.
	    Stream.prototype._pruneCycles = function () {
	        if (this._hasNoSinks(this, [])) {
	            this._remove(this._ils[0]);
	        }
	    };
	    // Checks whether *there is no* path starting from `x` that leads to an end
	    // listener (sink) in the stream graph, following edges A->B where B is a
	    // listener of A. This means these paths constitute a cycle somehow. Is given
	    // a trace of all visited nodes so far.
	    Stream.prototype._hasNoSinks = function (x, trace) {
	        if (trace.indexOf(x) !== -1) {
	            return true;
	        }
	        else if (x.out === this) {
	            return true;
	        }
	        else if (x.out && x.out !== NO) {
	            return this._hasNoSinks(x.out, trace.concat(x));
	        }
	        else if (x._ils) {
	            for (var i = 0, N = x._ils.length; i < N; i++) {
	                if (!this._hasNoSinks(x._ils[i], trace.concat(x))) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        else {
	            return false;
	        }
	    };
	    Stream.prototype.ctor = function () {
	        return this instanceof MemoryStream ? MemoryStream : Stream;
	    };
	    /**
	     * Adds a Listener to the Stream.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.addListener = function (listener) {
	        listener._n = listener.next || noop;
	        listener._e = listener.error || noop;
	        listener._c = listener.complete || noop;
	        this._add(listener);
	    };
	    /**
	     * Removes a Listener from the Stream, assuming the Listener was added to it.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.removeListener = function (listener) {
	        this._remove(listener);
	    };
	    /**
	     * Adds a Listener to the Stream returning a Subscription to remove that
	     * listener.
	     *
	     * @param {Listener} listener
	     * @returns {Subscription}
	     */
	    Stream.prototype.subscribe = function (listener) {
	        this.addListener(listener);
	        return new Subscription(this, listener);
	    };
	    /**
	     * Add interop between most.js and RxJS 5
	     *
	     * @returns {Stream}
	     */
	    Stream.prototype[symbol_observable_1.default] = function () {
	        return this;
	    };
	    /**
	     * Creates a new Stream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {Stream}
	     */
	    Stream.create = function (producer) {
	        if (producer) {
	            if (typeof producer.start !== 'function'
	                || typeof producer.stop !== 'function') {
	                throw new Error('producer requires both start and stop functions');
	            }
	            internalizeProducer(producer); // mutates the input
	        }
	        return new Stream(producer);
	    };
	    /**
	     * Creates a new MemoryStream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {MemoryStream}
	     */
	    Stream.createWithMemory = function (producer) {
	        if (producer) {
	            internalizeProducer(producer); // mutates the input
	        }
	        return new MemoryStream(producer);
	    };
	    /**
	     * Creates a Stream that does nothing when started. It never emits any event.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *          never
	     * -----------------------
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.never = function () {
	        return new Stream({ _start: noop, _stop: noop });
	    };
	    /**
	     * Creates a Stream that immediately emits the "complete" notification when
	     * started, and that's it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * empty
	     * -|
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.empty = function () {
	        return new Stream({
	            _start: function (il) { il._c(); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a Stream that immediately emits an "error" notification with the
	     * value you passed as the `error` argument when the stream starts, and that's
	     * it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * throw(X)
	     * -X
	     * ```
	     *
	     * @factory true
	     * @param error The error event to emit on the created stream.
	     * @return {Stream}
	     */
	    Stream.throw = function (error) {
	        return new Stream({
	            _start: function (il) { il._e(error); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a stream from an Array, Promise, or an Observable.
	     *
	     * @factory true
	     * @param {Array|Promise|Observable} input The input to make a stream from.
	     * @return {Stream}
	     */
	    Stream.from = function (input) {
	        if (typeof input[symbol_observable_1.default] === 'function') {
	            return Stream.fromObservable(input);
	        }
	        else if (typeof input.then === 'function') {
	            return Stream.fromPromise(input);
	        }
	        else if (Array.isArray(input)) {
	            return Stream.fromArray(input);
	        }
	        throw new TypeError("Type of input to from() must be an Array, Promise, or Observable");
	    };
	    /**
	     * Creates a Stream that immediately emits the arguments that you give to
	     * *of*, then completes.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * of(1,2,3)
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param a The first value you want to emit as an event on the stream.
	     * @param b The second value you want to emit as an event on the stream. One
	     * or more of these values may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.of = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        return Stream.fromArray(items);
	    };
	    /**
	     * Converts an array to a stream. The returned stream will emit synchronously
	     * all the items in the array, and then complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromArray([1,2,3])
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param {Array} array The array to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromArray = function (array) {
	        return new Stream(new FromArrayProducer(array));
	    };
	    /**
	     * Converts a promise to a stream. The returned stream will emit the resolved
	     * value of the promise, and then complete. However, if the promise is
	     * rejected, the stream will emit the corresponding error.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromPromise( ----42 )
	     * -----------------42|
	     * ```
	     *
	     * @factory true
	     * @param {Promise} promise The promise to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromPromise = function (promise) {
	        return new Stream(new FromPromiseProducer(promise));
	    };
	    /**
	     * Converts an Observable into a Stream.
	     *
	     * @factory true
	     * @param {any} observable The observable to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromObservable = function (observable) {
	        return new Stream(new ObservableProducer(observable));
	    };
	    /**
	     * Creates a stream that periodically emits incremental numbers, every
	     * `period` milliseconds.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *     periodic(1000)
	     * ---0---1---2---3---4---...
	     * ```
	     *
	     * @factory true
	     * @param {number} period The interval in milliseconds to use as a rate of
	     * emission.
	     * @return {Stream}
	     */
	    Stream.periodic = function (period) {
	        return new Stream(new PeriodicProducer(period));
	    };
	    Stream.prototype._map = function (project) {
	        var p = this._prod;
	        var ctor = this.ctor();
	        if (p instanceof FilterOperator) {
	            return new ctor(new FilterMapOperator(p.passes, project, p.ins));
	        }
	        return new ctor(new MapOperator(project, this));
	    };
	    /**
	     * Transforms each event from the input Stream through a `project` function,
	     * to get a Stream that emits those transformed events.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7------
	     *    map(i => i * 10)
	     * --10--30-50----70-----
	     * ```
	     *
	     * @param {Function} project A function of type `(t: T) => U` that takes event
	     * `t` of type `T` from the input Stream and produces an event of type `U`, to
	     * be emitted on the output Stream.
	     * @return {Stream}
	     */
	    Stream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    /**
	     * It's like `map`, but transforms each input event to always the same
	     * constant value on the output Stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7-----
	     *       mapTo(10)
	     * --10--10-10----10----
	     * ```
	     *
	     * @param projectedValue A value to emit on the output Stream whenever the
	     * input Stream emits any value.
	     * @return {Stream}
	     */
	    Stream.prototype.mapTo = function (projectedValue) {
	        var s = this.map(function () { return projectedValue; });
	        var op = s._prod;
	        op.type = op.type.replace('map', 'mapTo');
	        return s;
	    };
	    /**
	     * Only allows events that pass the test given by the `passes` argument.
	     *
	     * Each event from the input stream is given to the `passes` function. If the
	     * function returns `true`, the event is forwarded to the output stream,
	     * otherwise it is ignored and not forwarded.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2--3-----4-----5---6--7-8--
	     *     filter(i => i % 2 === 0)
	     * ------2--------4---------6----8--
	     * ```
	     *
	     * @param {Function} passes A function of type `(t: T) +> boolean` that takes
	     * an event from the input stream and checks if it passes, by returning a
	     * boolean.
	     * @return {Stream}
	     */
	    Stream.prototype.filter = function (passes) {
	        var p = this._prod;
	        if (p instanceof FilterOperator) {
	            return new Stream(new FilterOperator(and(p.passes, passes), p.ins));
	        }
	        return new Stream(new FilterOperator(passes, this));
	    };
	    /**
	     * Lets the first `amount` many events from the input stream pass to the
	     * output stream, then makes the output stream complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *    take(3)
	     * --a---b--c|
	     * ```
	     *
	     * @param {number} amount How many events to allow from the input stream
	     * before completing the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.take = function (amount) {
	        return new (this.ctor())(new TakeOperator(amount, this));
	    };
	    /**
	     * Ignores the first `amount` many events from the input stream, and then
	     * after that starts forwarding events from the input stream to the output
	     * stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *       drop(3)
	     * --------------d---e--
	     * ```
	     *
	     * @param {number} amount How many events to ignore from the input stream
	     * before forwarding all events from the input stream to the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.drop = function (amount) {
	        return new Stream(new DropOperator(amount, this));
	    };
	    /**
	     * When the input stream completes, the output stream will emit the last event
	     * emitted by the input stream, and then will also complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c--d----|
	     *       last()
	     * -----------------d|
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.last = function () {
	        return new Stream(new LastOperator(this));
	    };
	    /**
	     * Prepends the given `initial` value to the sequence of events emitted by the
	     * input stream. The returned stream is a MemoryStream, which means it is
	     * already `remember()`'d.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3---
	     *   startWith(0)
	     * 0--1---2-----3---
	     * ```
	     *
	     * @param initial The value or event to prepend.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.startWith = function (initial) {
	        return new MemoryStream(new StartWithOperator(this, initial));
	    };
	    /**
	     * Uses another stream to determine when to complete the current stream.
	     *
	     * When the given `other` stream emits an event or completes, the output
	     * stream will complete. Before that happens, the output stream will behaves
	     * like the input stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3--4----5----6---
	     *   endWhen( --------a--b--| )
	     * ---1---2-----3--4--|
	     * ```
	     *
	     * @param other Some other stream that is used to know when should the output
	     * stream of this operator complete.
	     * @return {Stream}
	     */
	    Stream.prototype.endWhen = function (other) {
	        return new (this.ctor())(new EndWhenOperator(other, this));
	    };
	    /**
	     * "Folds" the stream onto itself.
	     *
	     * Combines events from the past throughout
	     * the entire execution of the input stream, allowing you to accumulate them
	     * together. It's essentially like `Array.prototype.reduce`. The returned
	     * stream is a MemoryStream, which means it is already `remember()`'d.
	     *
	     * The output stream starts by emitting the `seed` which you give as argument.
	     * Then, when an event happens on the input stream, it is combined with that
	     * seed value through the `accumulate` function, and the output value is
	     * emitted on the output stream. `fold` remembers that output value as `acc`
	     * ("accumulator"), and then when a new input event `t` happens, `acc` will be
	     * combined with that to produce the new `acc` and so forth.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ------1-----1--2----1----1------
	     *   fold((acc, x) => acc + x, 3)
	     * 3-----4-----5--7----8----9------
	     * ```
	     *
	     * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
	     * takes the previous accumulated value `acc` and the incoming event from the
	     * input stream and produces the new accumulated value.
	     * @param seed The initial accumulated value, of type `R`.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.fold = function (accumulate, seed) {
	        return new MemoryStream(new FoldOperator(accumulate, seed, this));
	    };
	    /**
	     * Replaces an error with another stream.
	     *
	     * When (and if) an error happens on the input stream, instead of forwarding
	     * that error to the output stream, *replaceError* will call the `replace`
	     * function which returns the stream that the output stream will replicate.
	     * And, in case that new stream also emits an error, `replace` will be called
	     * again to get another stream to start replicating.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2-----3--4-----X
	     *   replaceError( () => --10--| )
	     * --1---2-----3--4--------10--|
	     * ```
	     *
	     * @param {Function} replace A function of type `(err) => Stream` that takes
	     * the error that occurred on the input stream or on the previous replacement
	     * stream and returns a new stream. The output stream will behave like the
	     * stream that this function returns.
	     * @return {Stream}
	     */
	    Stream.prototype.replaceError = function (replace) {
	        return new (this.ctor())(new ReplaceErrorOperator(replace, this));
	    };
	    /**
	     * Flattens a "stream of streams", handling only one nested stream at a time
	     * (no concurrency).
	     *
	     * If the input stream is a stream that emits streams, then this operator will
	     * return an output stream which is a flat stream: emits regular events. The
	     * flattening happens without concurrency. It works like this: when the input
	     * stream emits a nested stream, *flatten* will start imitating that nested
	     * one. However, as soon as the next nested stream is emitted on the input
	     * stream, *flatten* will forget the previous nested one it was imitating, and
	     * will start imitating the new nested one.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --+--------+---------------
	     *   \        \
	     *    \       ----1----2---3--
	     *    --a--b----c----d--------
	     *           flatten
	     * -----a--b------1----2---3--
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.flatten = function () {
	        var p = this._prod;
	        return new Stream(p instanceof MapOperator && !(p instanceof FilterMapOperator) ?
	            new MapFlattenOperator(p) :
	            new FlattenOperator(this));
	    };
	    /**
	     * Passes the input stream to a custom operator, to produce an output stream.
	     *
	     * *compose* is a handy way of using an existing function in a chained style.
	     * Instead of writing `outStream = f(inStream)` you can write
	     * `outStream = inStream.compose(f)`.
	     *
	     * @param {function} operator A function that takes a stream as input and
	     * returns a stream as well.
	     * @return {Stream}
	     */
	    Stream.prototype.compose = function (operator) {
	        return operator(this);
	    };
	    /**
	     * Returns an output stream that behaves like the input stream, but also
	     * remembers the most recent event that happens on the input stream, so that a
	     * newly added listener will immediately receive that memorised event.
	     *
	     * @return {MemoryStream}
	     */
	    Stream.prototype.remember = function () {
	        return new MemoryStream(new RememberOperator(this));
	    };
	    /**
	     * Returns an output stream that identically behaves like the input stream,
	     * but also runs a `spy` function fo each event, to help you debug your app.
	     *
	     * *debug* takes a `spy` function as argument, and runs that for each event
	     * happening on the input stream. If you don't provide the `spy` argument,
	     * then *debug* will just `console.log` each event. This helps you to
	     * understand the flow of events through some operator chain.
	     *
	     * Please note that if the output stream has no listeners, then it will not
	     * start, which means `spy` will never run because no actual event happens in
	     * that case.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3-----4--
	     *         debug
	     * --1----2-----3-----4--
	     * ```
	     *
	     * @param {function} labelOrSpy A string to use as the label when printing
	     * debug information on the console, or a 'spy' function that takes an event
	     * as argument, and does not need to return anything.
	     * @return {Stream}
	     */
	    Stream.prototype.debug = function (labelOrSpy) {
	        return new (this.ctor())(new DebugOperator(this, labelOrSpy));
	    };
	    /**
	     * *imitate* changes this current Stream to emit the same events that the
	     * `other` given Stream does. This method returns nothing.
	     *
	     * This method exists to allow one thing: **circular dependency of streams**.
	     * For instance, let's imagine that for some reason you need to create a
	     * circular dependency where stream `first$` depends on stream `second$`
	     * which in turn depends on `first$`:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var first$ = second$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * ```
	     *
	     * However, that is invalid JavaScript, because `second$` is undefined
	     * on the first line. This is how *imitate* can help solve it:
	     *
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var secondProxy$ = xs.create();
	     * var first$ = secondProxy$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * secondProxy$.imitate(second$);
	     * ```
	     *
	     * We create `secondProxy$` before the others, so it can be used in the
	     * declaration of `first$`. Then, after both `first$` and `second$` are
	     * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
	     * that they are "the same". `imitate` will not trigger the start of any
	     * stream, it just binds `secondProxy$` and `second$` together.
	     *
	     * The following is an example where `imitate()` is important in Cycle.js
	     * applications. A parent component contains some child components. A child
	     * has an action stream which is given to the parent to define its state:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * const childActionProxy$ = xs.create();
	     * const parent = Parent({...sources, childAction$: childActionProxy$});
	     * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
	     * childActionProxy$.imitate(childAction$);
	     * ```
	     *
	     * Note, though, that **`imitate()` does not support MemoryStreams**. If we
	     * would attempt to imitate a MemoryStream in a circular dependency, we would
	     * either get a race condition (where the symptom would be "nothing happens")
	     * or an infinite cyclic emission of values. It's useful to think about
	     * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
	     * define a spreadsheet cell `A1` with a formula that depends on `B1` and
	     * cell `B1` defined with a formula that depends on `A1`.
	     *
	     * If you find yourself wanting to use `imitate()` with a
	     * MemoryStream, you should rework your code around `imitate()` to use a
	     * Stream instead. Look for the stream in the circular dependency that
	     * represents an event stream, and that would be a candidate for creating a
	     * proxy Stream which then imitates the target Stream.
	     *
	     * @param {Stream} target The other stream to imitate on the current one. Must
	     * not be a MemoryStream.
	     */
	    Stream.prototype.imitate = function (target) {
	        if (target instanceof MemoryStream) {
	            throw new Error('A MemoryStream was given to imitate(), but it only ' +
	                'supports a Stream. Read more about this restriction here: ' +
	                'https://github.com/staltz/xstream#faq');
	        }
	        this._target = target;
	        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++) {
	            target._add(ils[i]);
	        }
	        this._ils = [];
	    };
	    /**
	     * Forces the Stream to emit the given value to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param value The "next" value you want to broadcast to all listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendNext = function (value) {
	        this._n(value);
	    };
	    /**
	     * Forces the Stream to emit the given error to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param {any} error The error you want to broadcast to all the listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendError = function (error) {
	        this._e(error);
	    };
	    /**
	     * Forces the Stream to emit the "completed" event to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     */
	    Stream.prototype.shamefullySendComplete = function () {
	        this._c();
	    };
	    /**
	     * Adds a "debug" listener to the stream. There can only be one debug
	     * listener, that's why this is 'setDebugListener'. To remove the debug
	     * listener, just call setDebugListener(null).
	     *
	     * A debug listener is like any other listener. The only difference is that a
	     * debug listener is "stealthy": its presence/absence does not trigger the
	     * start/stop of the stream (or the producer inside the stream). This is
	     * useful so you can inspect what is going on without changing the behavior
	     * of the program. If you have an idle stream and you add a normal listener to
	     * it, the stream will start executing. But if you set a debug listener on an
	     * idle stream, it won't start executing (not until the first normal listener
	     * is added).
	     *
	     * As the name indicates, we don't recommend using this method to build app
	     * logic. In fact, in most cases the debug operator works just fine. Only use
	     * this one if you know what you're doing.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.setDebugListener = function (listener) {
	        if (!listener) {
	            this._d = false;
	            this._dl = NO;
	        }
	        else {
	            this._d = true;
	            listener._n = listener.next;
	            listener._e = listener.error;
	            listener._c = listener.complete;
	            this._dl = listener;
	        }
	    };
	    /**
	     * Blends multiple streams together, emitting events from all of them
	     * concurrently.
	     *
	     * *merge* takes multiple streams as arguments, and creates a stream that
	     * behaves like each of the argument streams, in parallel.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b----c---d------
	     *            merge
	     * --1-a--2--b--3-c---d--4---
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to merge together with other streams.
	     * @param {Stream} stream2 A stream to merge together with other streams. Two
	     * or more streams may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.merge = function merge() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new MergeProducer(streams));
	    };
	    /**
	     * Combines multiple input streams together to return a stream whose events
	     * are arrays that collect the latest events from each input stream.
	     *
	     * *combine* internally remembers the most recent event from each of the input
	     * streams. When any of the input streams emits an event, that event together
	     * with all the other saved events are combined into an array. That array will
	     * be emitted on the output stream. It's essentially a way of joining together
	     * the events from multiple streams.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b-----c--d------
	     *          combine
	     * ----1a-2a-2b-3b-3c-3d-4d--
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to combine together with other streams.
	     * @param {Stream} stream2 A stream to combine together with other streams.
	     * Multiple streams, not just two, may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.combine = function combine() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new CombineProducer(streams));
	    };
	    return Stream;
	}());
	exports.Stream = Stream;
	var MemoryStream = (function (_super) {
	    __extends(MemoryStream, _super);
	    function MemoryStream(producer) {
	        _super.call(this, producer);
	        this._has = false;
	    }
	    MemoryStream.prototype._n = function (x) {
	        this._v = x;
	        this._has = true;
	        _super.prototype._n.call(this, x);
	    };
	    MemoryStream.prototype._add = function (il) {
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._add(il);
	        var a = this._ils;
	        a.push(il);
	        if (a.length > 1) {
	            if (this._has)
	                il._n(this._v);
	            return;
	        }
	        if (this._stopID !== NO) {
	            if (this._has)
	                il._n(this._v);
	            clearTimeout(this._stopID);
	            this._stopID = NO;
	        }
	        else if (this._has)
	            il._n(this._v);
	        else {
	            var p = this._prod;
	            if (p !== NO)
	                p._start(this);
	        }
	    };
	    MemoryStream.prototype._stopNow = function () {
	        this._has = false;
	        _super.prototype._stopNow.call(this);
	    };
	    MemoryStream.prototype._x = function () {
	        this._has = false;
	        _super.prototype._x.call(this);
	    };
	    MemoryStream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    MemoryStream.prototype.mapTo = function (projectedValue) {
	        return _super.prototype.mapTo.call(this, projectedValue);
	    };
	    MemoryStream.prototype.take = function (amount) {
	        return _super.prototype.take.call(this, amount);
	    };
	    MemoryStream.prototype.endWhen = function (other) {
	        return _super.prototype.endWhen.call(this, other);
	    };
	    MemoryStream.prototype.replaceError = function (replace) {
	        return _super.prototype.replaceError.call(this, replace);
	    };
	    MemoryStream.prototype.remember = function () {
	        return this;
	    };
	    MemoryStream.prototype.debug = function (labelOrSpy) {
	        return _super.prototype.debug.call(this, labelOrSpy);
	    };
	    return MemoryStream;
	}(Stream));
	exports.MemoryStream = MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Stream;
	//# sourceMappingURL=core.js.map

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7);


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, module) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _ponyfill = __webpack_require__(9);

	var _ponyfill2 = _interopRequireDefault(_ponyfill);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var root; /* global window */


	if (typeof self !== 'undefined') {
	  root = self;
	} else if (typeof window !== 'undefined') {
	  root = window;
	} else if (typeof global !== 'undefined') {
	  root = global;
	} else if (true) {
	  root = module;
	} else {
	  root = Function('return this')();
	}

	var result = (0, _ponyfill2['default'])(root);
	exports['default'] = result;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(8)(module)))

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports['default'] = symbolObservablePonyfill;
	function symbolObservablePonyfill(root) {
		var result;
		var _Symbol = root.Symbol;

		if (typeof _Symbol === 'function') {
			if (_Symbol.observable) {
				result = _Symbol.observable;
			} else {
				result = _Symbol('observable');
				_Symbol.observable = result;
			}
		} else {
			result = '@@observable';
		}

		return result;
	};

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var thunk = __webpack_require__(11);
	exports.thunk = thunk;
	/**
	 * A factory for the DOM driver function.
	 *
	 * Takes a `container` to define the target on the existing DOM which this
	 * driver will operate on, and an `options` object as the second argument. The
	 * input to this driver is a stream of virtual DOM objects, or in other words,
	 * Snabbdom "VNode" objects. The output of this driver is a "DOMSource": a
	 * collection of Observables queried with the methods `select()` and `events()`.
	 *
	 * `DOMSource.select(selector)` returns a new DOMSource with scope restricted to
	 * the element(s) that matches the CSS `selector` given.
	 *
	 * `DOMSource.events(eventType, options)` returns a stream of events of
	 * `eventType` happening on the elements that match the current DOMSource. The
	 * returned stream is an *xstream* Stream if you use `@cycle/xstream-run` to run
	 * your app with this driver, or it is an RxJS Observable if you use
	 * `@cycle/rxjs-run`, and so forth. The `options` parameter can have the field
	 * `useCapture`, which is by default `false`, except it is `true` for event
	 * types that do not bubble. Read more here
	 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
	 * about the `useCapture` and its purpose.
	 *
	 * `DOMSource.elements()` returns a stream of the DOM element(s) matched by the
	 * selectors in the DOMSource. Also, `DOMSource.select(':root').elements()`
	 * returns a stream of DOM element corresponding to the root (or container) of
	 * the app on the DOM.
	 *
	 * @param {(String|HTMLElement)} container the DOM selector for the element
	 * (or the element itself) to contain the rendering of the VTrees.
	 * @param {DOMDriverOptions} options an object with two optional fields:
	 * `transposition: boolean` enables/disables transposition of inner streams in
	 * the virtual DOM tree, `modules: array` contains additional Snabbdom modules.
	 * @return {Function} the DOM driver function. The function expects a stream of
	 * of VNode as input, and outputs the DOMSource object.
	 * @function makeDOMDriver
	 */
	var makeDOMDriver_1 = __webpack_require__(15);
	exports.makeDOMDriver = makeDOMDriver_1.makeDOMDriver;
	/**
	 * A factory for the HTML driver function.
	 *
	 * Takes an `effect` callback function and an `options` object as arguments. The
	 * input to this driver is a stream of virtual DOM objects, or in other words,
	 * Snabbdom "VNode" objects. The output of this driver is a "DOMSource": a
	 * collection of Observables queried with the methods `select()` and `events()`.
	 *
	 * The HTML Driver is supplementary to the DOM Driver. Instead of producing
	 * elements on the DOM, it generates HTML as strings and does a side effect on
	 * those HTML strings. That side effect is described by the `effect` callback
	 * function. So, if you want to use the HTML Driver on the server-side to render
	 * your application as HTML and send as a response (which is the typical use
	 * case for the HTML Driver), you need to pass something like the
	 * `html => response.send(html)` function as the `effect` argument. This way,
	 * the driver knows what side effect to cause based on the HTML string it just
	 * rendered.
	 *
	 * The HTML driver is useful only for that side effect in the `effect` callback.
	 * It can be considered a sink-only driver. However, in order to serve as a
	 * transparent replacement to the DOM Driver when rendering from the server, the
	 * HTML driver returns a source object that behaves just like the DOMSource.
	 * This helps reuse the same application that is written for the DOM Driver.
	 * This fake DOMSource returns empty streams when you query it, because there
	 * are no user events on the server.
	 *
	 * `DOMSource.select(selector)` returns a new DOMSource with scope restricted to
	 * the element(s) that matches the CSS `selector` given.
	 *
	 * `DOMSource.events(eventType, options)` returns an empty stream. The returned
	 * stream is an *xstream* Stream if you use `@cycle/xstream-run` to run your app
	 * with this driver, or it is an RxJS Observable if you use `@cycle/rxjs-run`,
	 * and so forth.
	 *
	 * `DOMSource.elements()` returns the stream of HTML string rendered from your
	 * sink virtual DOM stream.
	 *
	 * @param {Function} effect a callback function that takes a string of rendered
	 * HTML as input and should run a side effect, returning nothing.
	 * @param {HTMLDriverOptions} options an object with one optional field:
	 * `transposition: boolean` enables/disables transposition of inner streams in
	 * the virtual DOM tree.
	 * @return {Function} the HTML driver function. The function expects a stream of
	 * of VNode as input, and outputs the DOMSource object.
	 * @function makeHTMLDriver
	 */
	var makeHTMLDriver_1 = __webpack_require__(95);
	exports.makeHTMLDriver = makeHTMLDriver_1.makeHTMLDriver;
	/**
	 * A factory function to create mocked DOMSource objects, for testing purposes.
	 *
	 * Takes a `streamAdapter` and a `mockConfig` object as arguments, and returns
	 * a DOMSource that can be given to any Cycle.js app that expects a DOMSource in
	 * the sources, for testing.
	 *
	 * The `streamAdapter` parameter is a package such as `@cycle/xstream-adapter`,
	 * `@cycle/rxjs-adapter`, etc. Import it as `import a from '@cycle/rx-adapter`,
	 * then provide it to `mockDOMSource. This is important so the DOMSource created
	 * knows which stream library should it use to export its streams when you call
	 * `DOMSource.events()` for instance.
	 *
	 * The `mockConfig` parameter is an object specifying selectors, eventTypes and
	 * their streams. Example:
	 *
	 * ```js
	 * const domSource = mockDOMSource(RxAdapter, {
	 *   '.foo': {
	 *     'click': Rx.Observable.of({target: {}}),
	 *     'mouseover': Rx.Observable.of({target: {}}),
	 *   },
	 *   '.bar': {
	 *     'scroll': Rx.Observable.of({target: {}}),
	 *     elements: Rx.Observable.of({tagName: 'div'}),
	 *   }
	 * });
	 *
	 * // Usage
	 * const click$ = domSource.select('.foo').events('click');
	 * const element$ = domSource.select('.bar').elements();
	 * ```
	 *
	 * The mocked DOM Source supports isolation. It has the functions `isolateSink`
	 * and `isolateSource` attached to it, and performs simple isolation using
	 * classNames. *isolateSink* with scope `foo` will append the class `___foo` to
	 * the stream of virtual DOM nodes, and *isolateSource* with scope `foo` will
	 * perform a conventional `mockedDOMSource.select('.__foo')` call.
	 *
	 * @param {Object} mockConfig an object where keys are selector strings
	 * and values are objects. Those nested objects have `eventType` strings as keys
	 * and values are streams you created.
	 * @return {Object} fake DOM source object, with an API containing `select()`
	 * and `events()` and `elements()` which can be used just like the DOM Driver's
	 * DOMSource.
	 *
	 * @function mockDOMSource
	 */
	var mockDOMSource_1 = __webpack_require__(123);
	exports.mockDOMSource = mockDOMSource_1.mockDOMSource;
	/**
	 * The hyperscript function `h()` is a function to create virtual DOM objects,
	 * also known as VNodes. Call
	 *
	 * ```js
	 * h('div.myClass', {style: {color: 'red'}}, [])
	 * ```
	 *
	 * to create a VNode that represents a `DIV` element with className `myClass`,
	 * styled with red color, and no children because the `[]` array was passed. The
	 * API is `h(tagOrSelector, optionalData, optionalChildrenOrText)`.
	 *
	 * However, usually you should use "hyperscript helpers", which are shortcut
	 * functions based on hyperscript. There is one hyperscript helper function for
	 * each DOM tagName, such as `h1()`, `h2()`, `div()`, `span()`, `label()`,
	 * `input()`. For instance, the previous example could have been written
	 * as:
	 *
	 * ```js
	 * div('.myClass', {style: {color: 'red'}}, [])
	 * ```
	 *
	 * There are also SVG helper functions, which apply the appropriate SVG
	 * namespace to the resulting elements. `svg()` function creates the top-most
	 * SVG element, and `svg.g`, `svg.polygon`, `svg.circle`, `svg.path` are for
	 * SVG-specific child elements. Example:
	 *
	 * ```js
	 * svg({width: 150, height: 150}, [
	 *   svg.polygon({
	 *     attrs: {
	 *       class: 'triangle',
	 *       points: '20 0 20 150 150 20'
	 *     }
	 *   })
	 * ])
	 * ```
	 *
	 * @function h
	 */
	var hyperscript_1 = __webpack_require__(29);
	exports.h = hyperscript_1.h;
	var hyperscript_helpers_1 = __webpack_require__(124);
	exports.svg = hyperscript_helpers_1.default.svg;
	exports.a = hyperscript_helpers_1.default.a;
	exports.abbr = hyperscript_helpers_1.default.abbr;
	exports.address = hyperscript_helpers_1.default.address;
	exports.area = hyperscript_helpers_1.default.area;
	exports.article = hyperscript_helpers_1.default.article;
	exports.aside = hyperscript_helpers_1.default.aside;
	exports.audio = hyperscript_helpers_1.default.audio;
	exports.b = hyperscript_helpers_1.default.b;
	exports.base = hyperscript_helpers_1.default.base;
	exports.bdi = hyperscript_helpers_1.default.bdi;
	exports.bdo = hyperscript_helpers_1.default.bdo;
	exports.blockquote = hyperscript_helpers_1.default.blockquote;
	exports.body = hyperscript_helpers_1.default.body;
	exports.br = hyperscript_helpers_1.default.br;
	exports.button = hyperscript_helpers_1.default.button;
	exports.canvas = hyperscript_helpers_1.default.canvas;
	exports.caption = hyperscript_helpers_1.default.caption;
	exports.cite = hyperscript_helpers_1.default.cite;
	exports.code = hyperscript_helpers_1.default.code;
	exports.col = hyperscript_helpers_1.default.col;
	exports.colgroup = hyperscript_helpers_1.default.colgroup;
	exports.dd = hyperscript_helpers_1.default.dd;
	exports.del = hyperscript_helpers_1.default.del;
	exports.dfn = hyperscript_helpers_1.default.dfn;
	exports.dir = hyperscript_helpers_1.default.dir;
	exports.div = hyperscript_helpers_1.default.div;
	exports.dl = hyperscript_helpers_1.default.dl;
	exports.dt = hyperscript_helpers_1.default.dt;
	exports.em = hyperscript_helpers_1.default.em;
	exports.embed = hyperscript_helpers_1.default.embed;
	exports.fieldset = hyperscript_helpers_1.default.fieldset;
	exports.figcaption = hyperscript_helpers_1.default.figcaption;
	exports.figure = hyperscript_helpers_1.default.figure;
	exports.footer = hyperscript_helpers_1.default.footer;
	exports.form = hyperscript_helpers_1.default.form;
	exports.h1 = hyperscript_helpers_1.default.h1;
	exports.h2 = hyperscript_helpers_1.default.h2;
	exports.h3 = hyperscript_helpers_1.default.h3;
	exports.h4 = hyperscript_helpers_1.default.h4;
	exports.h5 = hyperscript_helpers_1.default.h5;
	exports.h6 = hyperscript_helpers_1.default.h6;
	exports.head = hyperscript_helpers_1.default.head;
	exports.header = hyperscript_helpers_1.default.header;
	exports.hgroup = hyperscript_helpers_1.default.hgroup;
	exports.hr = hyperscript_helpers_1.default.hr;
	exports.html = hyperscript_helpers_1.default.html;
	exports.i = hyperscript_helpers_1.default.i;
	exports.iframe = hyperscript_helpers_1.default.iframe;
	exports.img = hyperscript_helpers_1.default.img;
	exports.input = hyperscript_helpers_1.default.input;
	exports.ins = hyperscript_helpers_1.default.ins;
	exports.kbd = hyperscript_helpers_1.default.kbd;
	exports.keygen = hyperscript_helpers_1.default.keygen;
	exports.label = hyperscript_helpers_1.default.label;
	exports.legend = hyperscript_helpers_1.default.legend;
	exports.li = hyperscript_helpers_1.default.li;
	exports.link = hyperscript_helpers_1.default.link;
	exports.main = hyperscript_helpers_1.default.main;
	exports.map = hyperscript_helpers_1.default.map;
	exports.mark = hyperscript_helpers_1.default.mark;
	exports.menu = hyperscript_helpers_1.default.menu;
	exports.meta = hyperscript_helpers_1.default.meta;
	exports.nav = hyperscript_helpers_1.default.nav;
	exports.noscript = hyperscript_helpers_1.default.noscript;
	exports.object = hyperscript_helpers_1.default.object;
	exports.ol = hyperscript_helpers_1.default.ol;
	exports.optgroup = hyperscript_helpers_1.default.optgroup;
	exports.option = hyperscript_helpers_1.default.option;
	exports.p = hyperscript_helpers_1.default.p;
	exports.param = hyperscript_helpers_1.default.param;
	exports.pre = hyperscript_helpers_1.default.pre;
	exports.progress = hyperscript_helpers_1.default.progress;
	exports.q = hyperscript_helpers_1.default.q;
	exports.rp = hyperscript_helpers_1.default.rp;
	exports.rt = hyperscript_helpers_1.default.rt;
	exports.ruby = hyperscript_helpers_1.default.ruby;
	exports.s = hyperscript_helpers_1.default.s;
	exports.samp = hyperscript_helpers_1.default.samp;
	exports.script = hyperscript_helpers_1.default.script;
	exports.section = hyperscript_helpers_1.default.section;
	exports.select = hyperscript_helpers_1.default.select;
	exports.small = hyperscript_helpers_1.default.small;
	exports.source = hyperscript_helpers_1.default.source;
	exports.span = hyperscript_helpers_1.default.span;
	exports.strong = hyperscript_helpers_1.default.strong;
	exports.style = hyperscript_helpers_1.default.style;
	exports.sub = hyperscript_helpers_1.default.sub;
	exports.sup = hyperscript_helpers_1.default.sup;
	exports.table = hyperscript_helpers_1.default.table;
	exports.tbody = hyperscript_helpers_1.default.tbody;
	exports.td = hyperscript_helpers_1.default.td;
	exports.textarea = hyperscript_helpers_1.default.textarea;
	exports.tfoot = hyperscript_helpers_1.default.tfoot;
	exports.th = hyperscript_helpers_1.default.th;
	exports.thead = hyperscript_helpers_1.default.thead;
	exports.title = hyperscript_helpers_1.default.title;
	exports.tr = hyperscript_helpers_1.default.tr;
	exports.u = hyperscript_helpers_1.default.u;
	exports.ul = hyperscript_helpers_1.default.ul;
	exports.video = hyperscript_helpers_1.default.video;
	//# sourceMappingURL=index.js.map

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var h = __webpack_require__(12);

	function copyToThunk(vnode, thunk) {
	  thunk.elm = vnode.elm;
	  vnode.data.fn = thunk.data.fn;
	  vnode.data.args = thunk.data.args;
	  thunk.data = vnode.data;
	  thunk.children = vnode.children;
	  thunk.text = vnode.text;
	  thunk.elm = vnode.elm;
	}

	function init(thunk) {
	  var i, cur = thunk.data;
	  var vnode = cur.fn.apply(undefined, cur.args);
	  copyToThunk(vnode, thunk);
	}

	function prepatch(oldVnode, thunk) {
	  var i, old = oldVnode.data, cur = thunk.data, vnode;
	  var oldArgs = old.args, args = cur.args;
	  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
	    copyToThunk(cur.fn.apply(undefined, args), thunk);
	  }
	  for (i = 0; i < args.length; ++i) {
	    if (oldArgs[i] !== args[i]) {
	      copyToThunk(cur.fn.apply(undefined, args), thunk);
	      return;
	    }
	  }
	  copyToThunk(oldVnode, thunk);
	}

	module.exports = function(sel, key, fn, args) {
	  if (args === undefined) {
	    args = fn;
	    fn = key;
	    key = undefined;
	  }
	  return h(sel, {
	    key: key,
	    hook: {init: init, prepatch: prepatch},
	    fn: fn,
	    args: args
	  });
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var VNode = __webpack_require__(13);
	var is = __webpack_require__(14);

	function addNS(data, children) {
	  data.ns = 'http://www.w3.org/2000/svg';
	  if (children !== undefined) {
	    for (var i = 0; i < children.length; ++i) {
	      addNS(children[i].data, children[i].children);
	    }
	  }
	}

	module.exports = function h(sel, b, c) {
	  var data = {}, children, text, i;
	  if (c !== undefined) {
	    data = b;
	    if (is.array(c)) { children = c; }
	    else if (is.primitive(c)) { text = c; }
	  } else if (b !== undefined) {
	    if (is.array(b)) { children = b; }
	    else if (is.primitive(b)) { text = b; }
	    else { data = b; }
	  }
	  if (is.array(children)) {
	    for (i = 0; i < children.length; ++i) {
	      if (is.primitive(children[i])) children[i] = VNode(undefined, undefined, undefined, children[i]);
	    }
	  }
	  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	    addNS(data, children);
	  }
	  return VNode(sel, data, children, text, undefined);
	};


/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = function(sel, data, children, text, elm) {
	  var key = data === undefined ? undefined : data.key;
	  return {sel: sel, data: data, children: children,
	          text: text, elm: elm, key: key};
	};


/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = {
	  array: Array.isArray,
	  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var snabbdom_1 = __webpack_require__(16);
	var xstream_1 = __webpack_require__(4);
	var MainDOMSource_1 = __webpack_require__(18);
	var VNodeWrapper_1 = __webpack_require__(28);
	var utils_1 = __webpack_require__(24);
	var modules_1 = __webpack_require__(33);
	var isolateModule_1 = __webpack_require__(40);
	var transposition_1 = __webpack_require__(94);
	var xstream_adapter_1 = __webpack_require__(3);
	var MapPolyfill = __webpack_require__(41);
	function makeDOMDriverInputGuard(modules) {
	    if (!Array.isArray(modules)) {
	        throw new Error("Optional modules option must be " +
	            "an array for snabbdom modules");
	    }
	}
	function domDriverInputGuard(view$) {
	    if (!view$
	        || typeof view$.addListener !== "function"
	        || typeof view$.fold !== "function") {
	        throw new Error("The DOM driver function expects as input a Stream of " +
	            "virtual DOM elements");
	    }
	}
	function makeDOMDriver(container, options) {
	    if (!options) {
	        options = {};
	    }
	    var transposition = options.transposition || false;
	    var modules = options.modules || modules_1.default;
	    var isolateModule = new isolateModule_1.IsolateModule((new MapPolyfill()));
	    var patch = snabbdom_1.init([isolateModule.createModule()].concat(modules));
	    var rootElement = utils_1.getElement(container);
	    var vnodeWrapper = new VNodeWrapper_1.VNodeWrapper(rootElement);
	    var delegators = new MapPolyfill();
	    makeDOMDriverInputGuard(modules);
	    function DOMDriver(vnode$, runStreamAdapter, name) {
	        domDriverInputGuard(vnode$);
	        var transposeVNode = transposition_1.makeTransposeVNode(runStreamAdapter);
	        var preprocessedVNode$ = (transposition ? vnode$.map(transposeVNode).flatten() : vnode$);
	        var sanitation$ = xstream_1.default.create();
	        var rootElement$ = xstream_1.default.merge(preprocessedVNode$.endWhen(sanitation$), sanitation$)
	            .map(function (vnode) { return vnodeWrapper.call(vnode); })
	            .fold(patch, rootElement)
	            .drop(1)
	            .map(function unwrapElementFromVNode(vnode) { return vnode.elm; })
	            .compose(function (stream) { return xstream_1.default.merge(stream, xstream_1.default.never()); }) // don't complete this stream
	            .startWith(rootElement);
	        rootElement$.addListener({ next: function () { }, error: function () { }, complete: function () { } });
	        return new MainDOMSource_1.MainDOMSource(rootElement$, sanitation$, runStreamAdapter, [], isolateModule, delegators, name);
	    }
	    ;
	    DOMDriver.streamAdapter = xstream_adapter_1.default;
	    return DOMDriver;
	}
	exports.makeDOMDriver = makeDOMDriver;
	//# sourceMappingURL=makeDOMDriver.js.map

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	// jshint newcap: false
	/* global require, module, document, Node */
	'use strict';

	var VNode = __webpack_require__(13);
	var is = __webpack_require__(14);
	var domApi = __webpack_require__(17);

	function isUndef(s) { return s === undefined; }
	function isDef(s) { return s !== undefined; }

	var emptyNode = VNode('', {}, [], undefined, undefined);

	function sameVnode(vnode1, vnode2) {
	  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
	}

	function createKeyToOldIdx(children, beginIdx, endIdx) {
	  var i, map = {}, key;
	  for (i = beginIdx; i <= endIdx; ++i) {
	    key = children[i].key;
	    if (isDef(key)) map[key] = i;
	  }
	  return map;
	}

	var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

	function init(modules, api) {
	  var i, j, cbs = {};

	  if (isUndef(api)) api = domApi;

	  for (i = 0; i < hooks.length; ++i) {
	    cbs[hooks[i]] = [];
	    for (j = 0; j < modules.length; ++j) {
	      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
	    }
	  }

	  function emptyNodeAt(elm) {
	    return VNode(api.tagName(elm).toLowerCase(), {}, [], undefined, elm);
	  }

	  function createRmCb(childElm, listeners) {
	    return function() {
	      if (--listeners === 0) {
	        var parent = api.parentNode(childElm);
	        api.removeChild(parent, childElm);
	      }
	    };
	  }

	  function createElm(vnode, insertedVnodeQueue) {
	    var i, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.init)) {
	        i(vnode);
	        data = vnode.data;
	      }
	    }
	    var elm, children = vnode.children, sel = vnode.sel;
	    if (isDef(sel)) {
	      // Parse selector
	      var hashIdx = sel.indexOf('#');
	      var dotIdx = sel.indexOf('.', hashIdx);
	      var hash = hashIdx > 0 ? hashIdx : sel.length;
	      var dot = dotIdx > 0 ? dotIdx : sel.length;
	      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
	      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
	                                                          : api.createElement(tag);
	      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
	      if (dotIdx > 0) elm.className = sel.slice(dot+1).replace(/\./g, ' ');
	      if (is.array(children)) {
	        for (i = 0; i < children.length; ++i) {
	          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
	        }
	      } else if (is.primitive(vnode.text)) {
	        api.appendChild(elm, api.createTextNode(vnode.text));
	      }
	      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
	      i = vnode.data.hook; // Reuse variable
	      if (isDef(i)) {
	        if (i.create) i.create(emptyNode, vnode);
	        if (i.insert) insertedVnodeQueue.push(vnode);
	      }
	    } else {
	      elm = vnode.elm = api.createTextNode(vnode.text);
	    }
	    return vnode.elm;
	  }

	  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
	    }
	  }

	  function invokeDestroyHook(vnode) {
	    var i, j, data = vnode.data;
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
	      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
	      if (isDef(i = vnode.children)) {
	        for (j = 0; j < vnode.children.length; ++j) {
	          invokeDestroyHook(vnode.children[j]);
	        }
	      }
	    }
	  }

	  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
	    for (; startIdx <= endIdx; ++startIdx) {
	      var i, listeners, rm, ch = vnodes[startIdx];
	      if (isDef(ch)) {
	        if (isDef(ch.sel)) {
	          invokeDestroyHook(ch);
	          listeners = cbs.remove.length + 1;
	          rm = createRmCb(ch.elm, listeners);
	          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
	          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
	            i(ch, rm);
	          } else {
	            rm();
	          }
	        } else { // Text node
	          api.removeChild(parentElm, ch.elm);
	        }
	      }
	    }
	  }

	  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
	    var oldStartIdx = 0, newStartIdx = 0;
	    var oldEndIdx = oldCh.length - 1;
	    var oldStartVnode = oldCh[0];
	    var oldEndVnode = oldCh[oldEndIdx];
	    var newEndIdx = newCh.length - 1;
	    var newStartVnode = newCh[0];
	    var newEndVnode = newCh[newEndIdx];
	    var oldKeyToIdx, idxInOld, elmToMove, before;

	    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
	      if (isUndef(oldStartVnode)) {
	        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
	      } else if (isUndef(oldEndVnode)) {
	        oldEndVnode = oldCh[--oldEndIdx];
	      } else if (sameVnode(oldStartVnode, newStartVnode)) {
	        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
	        oldStartVnode = oldCh[++oldStartIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else if (sameVnode(oldEndVnode, newEndVnode)) {
	        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
	        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
	        oldStartVnode = oldCh[++oldStartIdx];
	        newEndVnode = newCh[--newEndIdx];
	      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
	        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
	        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
	        oldEndVnode = oldCh[--oldEndIdx];
	        newStartVnode = newCh[++newStartIdx];
	      } else {
	        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
	        idxInOld = oldKeyToIdx[newStartVnode.key];
	        if (isUndef(idxInOld)) { // New element
	          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        } else {
	          elmToMove = oldCh[idxInOld];
	          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
	          oldCh[idxInOld] = undefined;
	          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
	          newStartVnode = newCh[++newStartIdx];
	        }
	      }
	    }
	    if (oldStartIdx > oldEndIdx) {
	      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
	      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
	    } else if (newStartIdx > newEndIdx) {
	      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
	    }
	  }

	  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
	    var i, hook;
	    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
	      i(oldVnode, vnode);
	    }
	    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
	    if (oldVnode === vnode) return;
	    if (!sameVnode(oldVnode, vnode)) {
	      var parentElm = api.parentNode(oldVnode.elm);
	      elm = createElm(vnode, insertedVnodeQueue);
	      api.insertBefore(parentElm, elm, oldVnode.elm);
	      removeVnodes(parentElm, [oldVnode], 0, 0);
	      return;
	    }
	    if (isDef(vnode.data)) {
	      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
	      i = vnode.data.hook;
	      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
	    }
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
	      } else if (isDef(ch)) {
	        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
	      } else if (isDef(oldCh)) {
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
	      } else if (isDef(oldVnode.text)) {
	        api.setTextContent(elm, '');
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      api.setTextContent(elm, vnode.text);
	    }
	    if (isDef(hook) && isDef(i = hook.postpatch)) {
	      i(oldVnode, vnode);
	    }
	  }

	  return function(oldVnode, vnode) {
	    var i, elm, parent;
	    var insertedVnodeQueue = [];
	    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

	    if (isUndef(oldVnode.sel)) {
	      oldVnode = emptyNodeAt(oldVnode);
	    }

	    if (sameVnode(oldVnode, vnode)) {
	      patchVnode(oldVnode, vnode, insertedVnodeQueue);
	    } else {
	      elm = oldVnode.elm;
	      parent = api.parentNode(elm);

	      createElm(vnode, insertedVnodeQueue);

	      if (parent !== null) {
	        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
	        removeVnodes(parent, [oldVnode], 0, 0);
	      }
	    }

	    for (i = 0; i < insertedVnodeQueue.length; ++i) {
	      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
	    }
	    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
	    return vnode;
	  };
	}

	module.exports = {init: init};


/***/ },
/* 17 */
/***/ function(module, exports) {

	function createElement(tagName){
	  return document.createElement(tagName);
	}

	function createElementNS(namespaceURI, qualifiedName){
	  return document.createElementNS(namespaceURI, qualifiedName);
	}

	function createTextNode(text){
	  return document.createTextNode(text);
	}


	function insertBefore(parentNode, newNode, referenceNode){
	  parentNode.insertBefore(newNode, referenceNode);
	}


	function removeChild(node, child){
	  node.removeChild(child);
	}

	function appendChild(node, child){
	  node.appendChild(child);
	}

	function parentNode(node){
	  return node.parentElement;
	}

	function nextSibling(node){
	  return node.nextSibling;
	}

	function tagName(node){
	  return node.tagName;
	}

	function setTextContent(node, text){
	  node.textContent = text;
	}

	module.exports = {
	  createElement: createElement,
	  createElementNS: createElementNS,
	  createTextNode: createTextNode,
	  appendChild: appendChild,
	  removeChild: removeChild,
	  insertBefore: insertBefore,
	  parentNode: parentNode,
	  nextSibling: nextSibling,
	  tagName: tagName,
	  setTextContent: setTextContent
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_adapter_1 = __webpack_require__(3);
	var DocumentDOMSource_1 = __webpack_require__(19);
	var BodyDOMSource_1 = __webpack_require__(21);
	var xstream_1 = __webpack_require__(4);
	var ElementFinder_1 = __webpack_require__(22);
	var fromEvent_1 = __webpack_require__(20);
	var isolate_1 = __webpack_require__(26);
	var EventDelegator_1 = __webpack_require__(27);
	var utils_1 = __webpack_require__(24);
	var matchesSelector;
	try {
	    matchesSelector = __webpack_require__(25);
	}
	catch (e) {
	    matchesSelector = Function.prototype;
	}
	var eventTypesThatDontBubble = [
	    "blur",
	    "canplay",
	    "canplaythrough",
	    "change",
	    "durationchange",
	    "emptied",
	    "ended",
	    "focus",
	    "load",
	    "loadeddata",
	    "loadedmetadata",
	    "mouseenter",
	    "mouseleave",
	    "pause",
	    "play",
	    "playing",
	    "ratechange",
	    "reset",
	    "scroll",
	    "seeked",
	    "seeking",
	    "stalled",
	    "submit",
	    "suspend",
	    "timeupdate",
	    "unload",
	    "volumechange",
	    "waiting",
	];
	function determineUseCapture(eventType, options) {
	    var result = false;
	    if (typeof options.useCapture === 'boolean') {
	        result = options.useCapture;
	    }
	    if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
	        result = true;
	    }
	    return result;
	}
	function filterBasedOnIsolation(domSource, scope) {
	    return function filterBasedOnIsolationOperator(rootElement$) {
	        return rootElement$
	            .fold(function shouldPass(state, element) {
	            var hasIsolated = !!domSource._isolateModule.getIsolatedElement(scope);
	            var shouldPass = hasIsolated && !state.hadIsolatedMutable;
	            return { hadIsolatedMutable: hasIsolated, shouldPass: shouldPass, element: element };
	        }, { hadIsolatedMutable: false, shouldPass: false, element: null })
	            .drop(1)
	            .filter(function (s) { return s.shouldPass; })
	            .map(function (s) { return s.element; });
	    };
	}
	var MainDOMSource = (function () {
	    function MainDOMSource(_rootElement$, _sanitation$, _runStreamAdapter, _namespace, _isolateModule, _delegators, _name) {
	        var _this = this;
	        if (_namespace === void 0) { _namespace = []; }
	        this._rootElement$ = _rootElement$;
	        this._sanitation$ = _sanitation$;
	        this._runStreamAdapter = _runStreamAdapter;
	        this._namespace = _namespace;
	        this._isolateModule = _isolateModule;
	        this._delegators = _delegators;
	        this._name = _name;
	        this.__JANI_EVAKALLIO_WE_WILL_MISS_YOU_PLEASE_COME_BACK_EVENTUALLY = false;
	        this.__JANI_EVAKALLIO_WE_WILL_MISS_YOU_PLEASE_COME_BACK_EVENTUALLY = true;
	        this.isolateSource = isolate_1.isolateSource;
	        this.isolateSink = function (sink, scope) {
	            var existingScope = utils_1.getScope(_this._namespace);
	            var deeperScope = [existingScope, scope].filter(function (x) { return !!x; }).join('-');
	            return isolate_1.isolateSink(sink, deeperScope);
	        };
	    }
	    MainDOMSource.prototype.elements = function () {
	        var output$;
	        if (this._namespace.length === 0) {
	            output$ = this._rootElement$;
	        }
	        else {
	            var elementFinder_1 = new ElementFinder_1.ElementFinder(this._namespace, this._isolateModule);
	            output$ = this._rootElement$.map(function (el) { return elementFinder_1.call(el); });
	        }
	        var runSA = this._runStreamAdapter;
	        var out = runSA.remember(runSA.adapt(output$, xstream_adapter_1.default.streamSubscribe));
	        out._isCycleSource = this._name;
	        return out;
	    };
	    Object.defineProperty(MainDOMSource.prototype, "namespace", {
	        get: function () {
	            return this._namespace;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    MainDOMSource.prototype.select = function (selector) {
	        if (typeof selector !== 'string') {
	            throw new Error("DOM driver's select() expects the argument to be a " +
	                "string as a CSS selector");
	        }
	        if (selector === 'document') {
	            return new DocumentDOMSource_1.DocumentDOMSource(this._runStreamAdapter, this._name);
	        }
	        if (selector === 'body') {
	            return new BodyDOMSource_1.BodyDOMSource(this._runStreamAdapter, this._name);
	        }
	        var trimmedSelector = selector.trim();
	        var childNamespace = trimmedSelector === ":root" ?
	            this._namespace :
	            this._namespace.concat(trimmedSelector);
	        return new MainDOMSource(this._rootElement$, this._sanitation$, this._runStreamAdapter, childNamespace, this._isolateModule, this._delegators, this._name);
	    };
	    MainDOMSource.prototype.events = function (eventType, options) {
	        if (options === void 0) { options = {}; }
	        if (typeof eventType !== "string") {
	            throw new Error("DOM driver's events() expects argument to be a " +
	                "string representing the event type to listen for.");
	        }
	        var useCapture = determineUseCapture(eventType, options);
	        var namespace = this._namespace;
	        var scope = utils_1.getScope(namespace);
	        var keyParts = [eventType, useCapture];
	        if (scope) {
	            keyParts.push(scope);
	        }
	        var key = keyParts.join('~');
	        var domSource = this;
	        var rootElement$;
	        if (scope) {
	            rootElement$ = this._rootElement$
	                .compose(filterBasedOnIsolation(domSource, scope));
	        }
	        else {
	            rootElement$ = this._rootElement$.take(2);
	        }
	        var event$ = rootElement$
	            .map(function setupEventDelegatorOnTopElement(rootElement) {
	            // Event listener just for the root element
	            if (!namespace || namespace.length === 0) {
	                return fromEvent_1.fromEvent(rootElement, eventType, useCapture);
	            }
	            // Event listener on the top element as an EventDelegator
	            var delegators = domSource._delegators;
	            var top = domSource._isolateModule.getIsolatedElement(scope) || rootElement;
	            var delegator;
	            if (delegators.has(key)) {
	                delegator = delegators.get(key);
	                delegator.updateTopElement(top);
	            }
	            else {
	                delegator = new EventDelegator_1.EventDelegator(top, eventType, useCapture, domSource._isolateModule);
	                delegators.set(key, delegator);
	            }
	            if (scope) {
	                domSource._isolateModule.addEventDelegator(scope, delegator);
	            }
	            var destinationId = delegator.createDestinationId();
	            var subject = xstream_1.default.create({
	                start: function () { },
	                stop: function () {
	                    if ('requestIdleCallback' in window) {
	                        requestIdleCallback(function () {
	                            delegator.removeDestinationId(destinationId);
	                        });
	                    }
	                    else {
	                        delegator.removeDestinationId(destinationId);
	                    }
	                },
	            });
	            delegator.addDestination(subject, namespace, destinationId);
	            return subject;
	        })
	            .flatten();
	        var out = this._runStreamAdapter.adapt(event$, xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = domSource._name;
	        return out;
	    };
	    MainDOMSource.prototype.dispose = function () {
	        this._sanitation$.shamefullySendNext('');
	        this._isolateModule.reset();
	    };
	    return MainDOMSource;
	}());
	exports.MainDOMSource = MainDOMSource;
	//# sourceMappingURL=MainDOMSource.js.map

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	var xstream_adapter_1 = __webpack_require__(3);
	var fromEvent_1 = __webpack_require__(20);
	var DocumentDOMSource = (function () {
	    function DocumentDOMSource(_runStreamAdapter, _name) {
	        this._runStreamAdapter = _runStreamAdapter;
	        this._name = _name;
	    }
	    DocumentDOMSource.prototype.select = function (selector) {
	        // This functionality is still undefined/undecided.
	        return this;
	    };
	    DocumentDOMSource.prototype.elements = function () {
	        var runSA = this._runStreamAdapter;
	        var out = runSA.remember(runSA.adapt(xstream_1.default.of(document), xstream_adapter_1.default.streamSubscribe));
	        out._isCycleSource = this._name;
	        return out;
	    };
	    DocumentDOMSource.prototype.events = function (eventType, options) {
	        if (options === void 0) { options = {}; }
	        var stream;
	        if (options && typeof options.useCapture === 'boolean') {
	            stream = fromEvent_1.fromEvent(document, eventType, options.useCapture);
	        }
	        else {
	            stream = fromEvent_1.fromEvent(document, eventType);
	        }
	        var out = this._runStreamAdapter.adapt(stream, xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = this._name;
	        return out;
	    };
	    return DocumentDOMSource;
	}());
	exports.DocumentDOMSource = DocumentDOMSource;
	//# sourceMappingURL=DocumentDOMSource.js.map

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	function fromEvent(element, eventName, useCapture) {
	    if (useCapture === void 0) { useCapture = false; }
	    return xstream_1.Stream.create({
	        element: element,
	        next: null,
	        start: function start(listener) {
	            this.next = function next(event) { listener.next(event); };
	            this.element.addEventListener(eventName, this.next, useCapture);
	        },
	        stop: function stop() {
	            this.element.removeEventListener(eventName, this.next, useCapture);
	        },
	    });
	}
	exports.fromEvent = fromEvent;
	//# sourceMappingURL=fromEvent.js.map

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	var xstream_adapter_1 = __webpack_require__(3);
	var fromEvent_1 = __webpack_require__(20);
	var BodyDOMSource = (function () {
	    function BodyDOMSource(_runStreamAdapter, _name) {
	        this._runStreamAdapter = _runStreamAdapter;
	        this._name = _name;
	    }
	    BodyDOMSource.prototype.select = function (selector) {
	        // This functionality is still undefined/undecided.
	        return this;
	    };
	    BodyDOMSource.prototype.elements = function () {
	        var runSA = this._runStreamAdapter;
	        var out = runSA.remember(runSA.adapt(xstream_1.default.of(document.body), xstream_adapter_1.default.streamSubscribe));
	        out._isCycleSource = this._name;
	        return out;
	    };
	    BodyDOMSource.prototype.events = function (eventType, options) {
	        if (options === void 0) { options = {}; }
	        var stream;
	        if (options && typeof options.useCapture === 'boolean') {
	            stream = fromEvent_1.fromEvent(document.body, eventType, options.useCapture);
	        }
	        else {
	            stream = fromEvent_1.fromEvent(document.body, eventType);
	        }
	        var out = this._runStreamAdapter.adapt(stream, xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = this._name;
	        return out;
	    };
	    return BodyDOMSource;
	}());
	exports.BodyDOMSource = BodyDOMSource;
	//# sourceMappingURL=BodyDOMSource.js.map

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ScopeChecker_1 = __webpack_require__(23);
	var utils_1 = __webpack_require__(24);
	var matchesSelector;
	try {
	    matchesSelector = __webpack_require__(25);
	}
	catch (e) {
	    matchesSelector = Function.prototype;
	}
	function toElArray(input) {
	    return Array.prototype.slice.call(input);
	}
	var ElementFinder = (function () {
	    function ElementFinder(namespace, isolateModule) {
	        this.namespace = namespace;
	        this.isolateModule = isolateModule;
	    }
	    ElementFinder.prototype.call = function (rootElement) {
	        var namespace = this.namespace;
	        if (namespace.join("") === "") {
	            return rootElement;
	        }
	        var scope = utils_1.getScope(namespace);
	        var scopeChecker = new ScopeChecker_1.ScopeChecker(scope, this.isolateModule);
	        var selector = utils_1.getSelectors(namespace);
	        var topNode = rootElement;
	        var topNodeMatches = [];
	        if (scope.length > 0) {
	            topNode = this.isolateModule.getIsolatedElement(scope) || rootElement;
	            if (selector && matchesSelector(topNode, selector)) {
	                topNodeMatches.push(topNode);
	            }
	        }
	        return toElArray(topNode.querySelectorAll(selector))
	            .filter(scopeChecker.isStrictlyInRootScope, scopeChecker)
	            .concat(topNodeMatches);
	    };
	    return ElementFinder;
	}());
	exports.ElementFinder = ElementFinder;
	//# sourceMappingURL=ElementFinder.js.map

/***/ },
/* 23 */
/***/ function(module, exports) {

	"use strict";
	var ScopeChecker = (function () {
	    function ScopeChecker(scope, isolateModule) {
	        this.scope = scope;
	        this.isolateModule = isolateModule;
	    }
	    ScopeChecker.prototype.isStrictlyInRootScope = function (leaf) {
	        for (var el = leaf; el; el = el.parentElement) {
	            var scope = this.isolateModule.isIsolatedElement(el);
	            if (scope && scope !== this.scope) {
	                return false;
	            }
	            if (scope) {
	                return true;
	            }
	        }
	        return true;
	    };
	    return ScopeChecker;
	}());
	exports.ScopeChecker = ScopeChecker;
	//# sourceMappingURL=ScopeChecker.js.map

/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	function isElement(obj) {
	    return typeof HTMLElement === "object" ?
	        obj instanceof HTMLElement || obj instanceof DocumentFragment :
	        obj && typeof obj === "object" && obj !== null &&
	            (obj.nodeType === 1 || obj.nodeType === 11) &&
	            typeof obj.nodeName === "string";
	}
	exports.SCOPE_PREFIX = "$$CYCLEDOM$$-";
	function getElement(selectors) {
	    var domElement = typeof selectors === 'string' ?
	        document.querySelector(selectors) :
	        selectors;
	    if (typeof selectors === 'string' && domElement === null) {
	        throw new Error("Cannot render into unknown element `" + selectors + "`");
	    }
	    else if (!isElement(domElement)) {
	        throw new Error("Given container is not a DOM element neither a " +
	            "selector string.");
	    }
	    return domElement;
	}
	exports.getElement = getElement;
	function getScope(namespace) {
	    return namespace
	        .filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) > -1; })
	        .map(function (c) { return c.replace(exports.SCOPE_PREFIX, ''); })
	        .join("-");
	}
	exports.getScope = getScope;
	function getSelectors(namespace) {
	    return namespace.filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) === -1; }).join(" ");
	}
	exports.getSelectors = getSelectors;
	//# sourceMappingURL=utils.js.map

/***/ },
/* 25 */
/***/ function(module, exports) {

	'use strict';

	var proto = Element.prototype;
	var vendor = proto.matches
	  || proto.matchesSelector
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (vendor) return vendor.call(el, selector);
	  var nodes = el.parentNode.querySelectorAll(selector);
	  for (var i = 0; i < nodes.length; i++) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(24);
	function isolateSource(source, scope) {
	    return source.select(utils_1.SCOPE_PREFIX + scope);
	}
	exports.isolateSource = isolateSource;
	function isolateSink(sink, scope) {
	    return sink.map(function (vTree) {
	        if (vTree.data && vTree.data.isolate) {
	            var existingScope = vTree.data.isolate.replace(/(cycle|\-)/g, '');
	            var _scope = scope.replace(/(cycle|\-)/g, '');
	            if (isNaN(parseInt(existingScope))
	                || isNaN(parseInt(_scope))
	                || existingScope > _scope) {
	                return vTree;
	            }
	        }
	        vTree.data = vTree.data || {};
	        vTree.data.isolate = scope;
	        if (typeof vTree.key === 'undefined') {
	            vTree.key = utils_1.SCOPE_PREFIX + scope;
	        }
	        return vTree;
	    });
	}
	exports.isolateSink = isolateSink;
	//# sourceMappingURL=isolate.js.map

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ScopeChecker_1 = __webpack_require__(23);
	var utils_1 = __webpack_require__(24);
	var matchesSelector;
	try {
	    matchesSelector = __webpack_require__(25);
	}
	catch (e) {
	    matchesSelector = Function.prototype;
	}
	var gDestinationId = 0;
	function findDestinationId(arr, searchId) {
	    var minIndex = 0;
	    var maxIndex = arr.length - 1;
	    var currentIndex;
	    var currentElement;
	    while (minIndex <= maxIndex) {
	        currentIndex = (minIndex + maxIndex) / 2 | 0; // tslint:disable-line:no-bitwise
	        currentElement = arr[currentIndex];
	        var currentId = currentElement.destinationId;
	        if (currentId < searchId) {
	            minIndex = currentIndex + 1;
	        }
	        else if (currentId > searchId) {
	            maxIndex = currentIndex - 1;
	        }
	        else {
	            return currentIndex;
	        }
	    }
	    return -1;
	}
	/**
	 * Attaches an actual event listener to the DOM root element,
	 * handles "destinations" (interested DOMSource output subjects), and bubbling.
	 */
	var EventDelegator = (function () {
	    function EventDelegator(topElement, eventType, useCapture, isolateModule) {
	        var _this = this;
	        this.topElement = topElement;
	        this.eventType = eventType;
	        this.useCapture = useCapture;
	        this.isolateModule = isolateModule;
	        this.destinations = [];
	        this.roof = topElement.parentElement;
	        if (useCapture) {
	            this.domListener = function (ev) { return _this.capture(ev); };
	        }
	        else {
	            this.domListener = function (ev) { return _this.bubble(ev); };
	        }
	        topElement.addEventListener(eventType, this.domListener, useCapture);
	    }
	    EventDelegator.prototype.bubble = function (rawEvent) {
	        if (!document.body.contains(rawEvent.currentTarget)) {
	            return;
	        }
	        var ev = this.patchEvent(rawEvent);
	        for (var el = ev.target; el && el !== this.roof; el = el.parentElement) {
	            if (!document.body.contains(el)) {
	                ev.stopPropagation();
	            }
	            if (ev.propagationHasBeenStopped) {
	                return;
	            }
	            this.matchEventAgainstDestinations(el, ev);
	        }
	    };
	    EventDelegator.prototype.matchEventAgainstDestinations = function (el, ev) {
	        for (var i = 0, n = this.destinations.length; i < n; i++) {
	            var dest = this.destinations[i];
	            if (!dest.scopeChecker.isStrictlyInRootScope(el)) {
	                continue;
	            }
	            if (matchesSelector(el, dest.selector)) {
	                this.mutateEventCurrentTarget(ev, el);
	                dest.subject._n(ev);
	            }
	        }
	    };
	    EventDelegator.prototype.capture = function (ev) {
	        for (var i = 0, n = this.destinations.length; i < n; i++) {
	            var dest = this.destinations[i];
	            if (matchesSelector(ev.target, dest.selector)) {
	                dest.subject._n(ev);
	            }
	        }
	    };
	    EventDelegator.prototype.addDestination = function (subject, namespace, destinationId) {
	        var scope = utils_1.getScope(namespace);
	        var selector = utils_1.getSelectors(namespace);
	        var scopeChecker = new ScopeChecker_1.ScopeChecker(scope, this.isolateModule);
	        this.destinations.push({ subject: subject, scopeChecker: scopeChecker, selector: selector, destinationId: destinationId });
	    };
	    EventDelegator.prototype.createDestinationId = function () {
	        return gDestinationId++;
	    };
	    EventDelegator.prototype.removeDestinationId = function (destinationId) {
	        var i = findDestinationId(this.destinations, destinationId);
	        if (i >= 0) {
	            this.destinations.splice(i, 1);
	        }
	    };
	    EventDelegator.prototype.patchEvent = function (event) {
	        var pEvent = event;
	        pEvent.propagationHasBeenStopped = false;
	        var oldStopPropagation = pEvent.stopPropagation;
	        pEvent.stopPropagation = function stopPropagation() {
	            oldStopPropagation.call(this);
	            this.propagationHasBeenStopped = true;
	        };
	        return pEvent;
	    };
	    EventDelegator.prototype.mutateEventCurrentTarget = function (event, currentTargetElement) {
	        try {
	            Object.defineProperty(event, "currentTarget", {
	                value: currentTargetElement,
	                configurable: true,
	            });
	        }
	        catch (err) {
	            console.log("please use event.ownerTarget");
	        }
	        event.ownerTarget = currentTargetElement;
	    };
	    EventDelegator.prototype.updateTopElement = function (newTopElement) {
	        this.topElement.removeEventListener(this.eventType, this.domListener, this.useCapture);
	        newTopElement.addEventListener(this.eventType, this.domListener, this.useCapture);
	        this.topElement = newTopElement;
	    };
	    return EventDelegator;
	}());
	exports.EventDelegator = EventDelegator;
	//# sourceMappingURL=EventDelegator.js.map

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var hyperscript_1 = __webpack_require__(29);
	var classNameFromVNode_1 = __webpack_require__(30);
	var selectorParser_1 = __webpack_require__(31);
	var VNodeWrapper = (function () {
	    function VNodeWrapper(rootElement) {
	        this.rootElement = rootElement;
	    }
	    VNodeWrapper.prototype.call = function (vnode) {
	        var _a = selectorParser_1.default(vnode.sel), selectorTagName = _a.tagName, selectorId = _a.id;
	        var vNodeClassName = classNameFromVNode_1.default(vnode);
	        var vNodeData = vnode.data || {};
	        var vNodeDataProps = vNodeData.props || {};
	        var _b = vNodeDataProps.id, vNodeId = _b === void 0 ? selectorId : _b;
	        var isVNodeAndRootElementIdentical = vNodeId.toUpperCase() === this.rootElement.id.toUpperCase() &&
	            selectorTagName.toUpperCase() === this.rootElement.tagName.toUpperCase() &&
	            vNodeClassName.toUpperCase() === this.rootElement.className.toUpperCase();
	        if (isVNodeAndRootElementIdentical) {
	            return vnode;
	        }
	        var _c = this.rootElement, tagName = _c.tagName, id = _c.id, className = _c.className;
	        var elementId = id ? "#" + id : "";
	        var elementClassName = className ?
	            "." + className.split(" ").join(".") : "";
	        return hyperscript_1.h("" + tagName.toLowerCase() + elementId + elementClassName, {}, [
	            vnode,
	        ]);
	    };
	    return VNodeWrapper;
	}());
	exports.VNodeWrapper = VNodeWrapper;
	//# sourceMappingURL=VNodeWrapper.js.map

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var is = __webpack_require__(14);
	var vnode = __webpack_require__(13);
	function isGenericStream(x) {
	    return !Array.isArray(x) && typeof x.map === "function";
	}
	function mutateStreamWithNS(vNode) {
	    addNS(vNode.data, vNode.children, vNode.sel);
	    return vNode;
	}
	function addNS(data, children, selector) {
	    data.ns = "http://www.w3.org/2000/svg";
	    if (selector !== "foreignObject" && typeof children !== 'undefined' && is.array(children)) {
	        for (var i = 0; i < children.length; ++i) {
	            if (isGenericStream(children[i])) {
	                children[i] = children[i].map(mutateStreamWithNS);
	            }
	            else {
	                addNS(children[i].data, children[i].children, children[i].sel);
	            }
	        }
	    }
	}
	function h(sel, b, c) {
	    var data = {};
	    var children;
	    var text;
	    if (arguments.length === 3) {
	        data = b;
	        if (is.array(c)) {
	            children = c;
	        }
	        else if (is.primitive(c)) {
	            text = c;
	        }
	    }
	    else if (arguments.length === 2) {
	        if (is.array(b)) {
	            children = b;
	        }
	        else if (is.primitive(b)) {
	            text = b;
	        }
	        else {
	            data = b;
	        }
	    }
	    if (is.array(children)) {
	        children = children.filter(function (x) { return x; });
	        for (var i = 0; i < children.length; ++i) {
	            if (is.primitive(children[i])) {
	                children[i] = vnode(undefined, undefined, undefined, children[i]);
	            }
	        }
	    }
	    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g') {
	        addNS(data, children, sel);
	    }
	    return vnode(sel, data, children, text, undefined);
	}
	exports.h = h;
	;
	//# sourceMappingURL=hyperscript.js.map

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = classNameFromVNode;

	var _selectorParser2 = __webpack_require__(31);

	var _selectorParser3 = _interopRequireDefault(_selectorParser2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function classNameFromVNode(vNode) {
	  var _selectorParser = (0, _selectorParser3.default)(vNode.sel);

	  var cn = _selectorParser.className;


	  if (!vNode.data) {
	    return cn;
	  }

	  var _vNode$data = vNode.data;
	  var dataClass = _vNode$data.class;
	  var props = _vNode$data.props;


	  if (dataClass) {
	    var c = Object.keys(vNode.data.class).filter(function (cl) {
	      return vNode.data.class[cl];
	    });
	    cn += ' ' + c.join(' ');
	  }

	  if (props && props.className) {
	    cn += ' ' + props.className;
	  }

	  return cn.trim();
	}

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = selectorParser;

	var _browserSplit = __webpack_require__(32);

	var _browserSplit2 = _interopRequireDefault(_browserSplit);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	function selectorParser() {
	  var selector = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

	  var tagName = void 0;
	  var id = '';
	  var classes = [];

	  var tagParts = (0, _browserSplit2.default)(selector, classIdSplit);

	  if (notClassId.test(tagParts[1]) || selector === '') {
	    tagName = 'div';
	  }

	  var part = void 0;
	  var type = void 0;
	  var i = void 0;

	  for (i = 0; i < tagParts.length; i++) {
	    part = tagParts[i];

	    if (!part) {
	      continue;
	    }

	    type = part.charAt(0);

	    if (!tagName) {
	      tagName = part;
	    } else if (type === '.') {
	      classes.push(part.substring(1, part.length));
	    } else if (type === '#') {
	      id = part.substring(1, part.length);
	    }
	  }

	  return {
	    tagName: tagName,
	    id: id,
	    className: classes.join(' ')
	  };
	}

/***/ },
/* 32 */
/***/ function(module, exports) {

	/*!
	 * Cross-Browser Split 1.1.1
	 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
	 * Available under the MIT License
	 * ECMAScript compliant, uniform cross-browser split method
	 */

	/**
	 * Splits a string into an array of strings using a regex or string separator. Matches of the
	 * separator are not included in the result array. However, if `separator` is a regex that contains
	 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
	 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
	 * cross-browser.
	 * @param {String} str String to split.
	 * @param {RegExp|String} separator Regex or string to use for separating the string.
	 * @param {Number} [limit] Maximum number of items to include in the result array.
	 * @returns {Array} Array of substrings.
	 * @example
	 *
	 * // Basic use
	 * split('a b c d', ' ');
	 * // -> ['a', 'b', 'c', 'd']
	 *
	 * // With limit
	 * split('a b c d', ' ', 2);
	 * // -> ['a', 'b']
	 *
	 * // Backreferences in result array
	 * split('..word1 word2..', /([a-z]+)(\d+)/i);
	 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
	 */
	module.exports = (function split(undef) {

	  var nativeSplit = String.prototype.split,
	    compliantExecNpcg = /()??/.exec("")[1] === undef,
	    // NPCG: nonparticipating capturing group
	    self;

	  self = function(str, separator, limit) {
	    // If `separator` is not a regex, use `nativeSplit`
	    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
	      return nativeSplit.call(str, separator, limit);
	    }
	    var output = [],
	      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
	      (separator.sticky ? "y" : ""),
	      // Firefox 3+
	      lastLastIndex = 0,
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      separator = new RegExp(separator.source, flags + "g"),
	      separator2, match, lastIndex, lastLength;
	    str += ""; // Type-convert
	    if (!compliantExecNpcg) {
	      // Doesn't need flags gy, but they don't hurt
	      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
	    }
	    /* Values for `limit`, per the spec:
	     * If undefined: 4294967295 // Math.pow(2, 32) - 1
	     * If 0, Infinity, or NaN: 0
	     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
	     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
	     * If other: Type-convert, then use the above rules
	     */
	    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
	    limit >>> 0; // ToUint32(limit)
	    while (match = separator.exec(str)) {
	      // `separator.lastIndex` is not reliable cross-browser
	      lastIndex = match.index + match[0].length;
	      if (lastIndex > lastLastIndex) {
	        output.push(str.slice(lastLastIndex, match.index));
	        // Fix browsers whose `exec` methods don't consistently return `undefined` for
	        // nonparticipating capturing groups
	        if (!compliantExecNpcg && match.length > 1) {
	          match[0].replace(separator2, function() {
	            for (var i = 1; i < arguments.length - 2; i++) {
	              if (arguments[i] === undef) {
	                match[i] = undef;
	              }
	            }
	          });
	        }
	        if (match.length > 1 && match.index < str.length) {
	          Array.prototype.push.apply(output, match.slice(1));
	        }
	        lastLength = match[0].length;
	        lastLastIndex = lastIndex;
	        if (output.length >= limit) {
	          break;
	        }
	      }
	      if (separator.lastIndex === match.index) {
	        separator.lastIndex++; // Avoid an infinite loop
	      }
	    }
	    if (lastLastIndex === str.length) {
	      if (lastLength || !separator.test("")) {
	        output.push("");
	      }
	    } else {
	      output.push(str.slice(lastLastIndex));
	    }
	    return output.length > limit ? output.slice(0, limit) : output;
	  };

	  return self;
	})();


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var ClassModule = __webpack_require__(34);
	exports.ClassModule = ClassModule;
	var PropsModule = __webpack_require__(35);
	exports.PropsModule = PropsModule;
	var AttrsModule = __webpack_require__(36);
	exports.AttrsModule = AttrsModule;
	var EventsModule = __webpack_require__(37);
	exports.EventsModule = EventsModule;
	var StyleModule = __webpack_require__(38);
	exports.StyleModule = StyleModule;
	var HeroModule = __webpack_require__(39);
	exports.HeroModule = HeroModule;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = [StyleModule, ClassModule, PropsModule, AttrsModule];
	//# sourceMappingURL=modules.js.map

/***/ },
/* 34 */
/***/ function(module, exports) {

	function updateClass(oldVnode, vnode) {
	  var cur, name, elm = vnode.elm,
	      oldClass = oldVnode.data.class || {},
	      klass = vnode.data.class || {};
	  for (name in oldClass) {
	    if (!klass[name]) {
	      elm.classList.remove(name);
	    }
	  }
	  for (name in klass) {
	    cur = klass[name];
	    if (cur !== oldClass[name]) {
	      elm.classList[cur ? 'add' : 'remove'](name);
	    }
	  }
	}

	module.exports = {create: updateClass, update: updateClass};


/***/ },
/* 35 */
/***/ function(module, exports) {

	function updateProps(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldProps = oldVnode.data.props || {}, props = vnode.data.props || {};
	  for (key in oldProps) {
	    if (!props[key]) {
	      delete elm[key];
	    }
	  }
	  for (key in props) {
	    cur = props[key];
	    old = oldProps[key];
	    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
	      elm[key] = cur;
	    }
	  }
	}

	module.exports = {create: updateProps, update: updateProps};


/***/ },
/* 36 */
/***/ function(module, exports) {

	var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare", 
	                "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable", 
	                "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple", 
	                "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly", 
	                "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate", 
	                "truespeed", "typemustmatch", "visible"];
	    
	var booleanAttrsDict = {};
	for(var i=0, len = booleanAttrs.length; i < len; i++) {
	  booleanAttrsDict[booleanAttrs[i]] = true;
	}
	    
	function updateAttrs(oldVnode, vnode) {
	  var key, cur, old, elm = vnode.elm,
	      oldAttrs = oldVnode.data.attrs || {}, attrs = vnode.data.attrs || {};
	  
	  // update modified attributes, add new attributes
	  for (key in attrs) {
	    cur = attrs[key];
	    old = oldAttrs[key];
	    if (old !== cur) {
	      // TODO: add support to namespaced attributes (setAttributeNS)
	      if(!cur && booleanAttrsDict[key])
	        elm.removeAttribute(key);
	      else
	        elm.setAttribute(key, cur);
	    }
	  }
	  //remove removed attributes
	  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
	  // the other option is to remove all attributes with value == undefined
	  for (key in oldAttrs) {
	    if (!(key in attrs)) {
	      elm.removeAttribute(key);
	    }
	  }
	}

	module.exports = {create: updateAttrs, update: updateAttrs};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	var is = __webpack_require__(14);

	function arrInvoker(arr) {
	  return function() {
	    if (!arr.length) return;
	    // Special case when length is two, for performance
	    arr.length === 2 ? arr[0](arr[1]) : arr[0].apply(undefined, arr.slice(1));
	  };
	}

	function fnInvoker(o) {
	  return function(ev) { 
	    if (o.fn === null) return;
	    o.fn(ev); 
	  };
	}

	function updateEventListeners(oldVnode, vnode) {
	  var name, cur, old, elm = vnode.elm,
	      oldOn = oldVnode.data.on || {}, on = vnode.data.on;
	  if (!on) return;
	  for (name in on) {
	    cur = on[name];
	    old = oldOn[name];
	    if (old === undefined) {
	      if (is.array(cur)) {
	        elm.addEventListener(name, arrInvoker(cur));
	      } else {
	        cur = {fn: cur};
	        on[name] = cur;
	        elm.addEventListener(name, fnInvoker(cur));
	      }
	    } else if (is.array(old)) {
	      // Deliberately modify old array since it's captured in closure created with `arrInvoker`
	      old.length = cur.length;
	      for (var i = 0; i < old.length; ++i) old[i] = cur[i];
	      on[name]  = old;
	    } else {
	      old.fn = cur;
	      on[name] = old;
	    }
	  }
	  if (oldOn) {
	    for (name in oldOn) {
	      if (on[name] === undefined) {
	        var old = oldOn[name];
	        if (is.array(old)) {
	          old.length = 0;
	        }
	        else {
	          old.fn = null;
	        }
	      }
	    }
	  }
	}

	module.exports = {create: updateEventListeners, update: updateEventListeners};


/***/ },
/* 38 */
/***/ function(module, exports) {

	var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
	var nextFrame = function(fn) { raf(function() { raf(fn); }); };

	function setNextFrame(obj, prop, val) {
	  nextFrame(function() { obj[prop] = val; });
	}

	function updateStyle(oldVnode, vnode) {
	  var cur, name, elm = vnode.elm,
	      oldStyle = oldVnode.data.style || {},
	      style = vnode.data.style || {},
	      oldHasDel = 'delayed' in oldStyle;
	  for (name in oldStyle) {
	    if (!style[name]) {
	      elm.style[name] = '';
	    }
	  }
	  for (name in style) {
	    cur = style[name];
	    if (name === 'delayed') {
	      for (name in style.delayed) {
	        cur = style.delayed[name];
	        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
	          setNextFrame(elm.style, name, cur);
	        }
	      }
	    } else if (name !== 'remove' && cur !== oldStyle[name]) {
	      elm.style[name] = cur;
	    }
	  }
	}

	function applyDestroyStyle(vnode) {
	  var style, name, elm = vnode.elm, s = vnode.data.style;
	  if (!s || !(style = s.destroy)) return;
	  for (name in style) {
	    elm.style[name] = style[name];
	  }
	}

	function applyRemoveStyle(vnode, rm) {
	  var s = vnode.data.style;
	  if (!s || !s.remove) {
	    rm();
	    return;
	  }
	  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
	      compStyle, style = s.remove, amount = 0, applied = [];
	  for (name in style) {
	    applied.push(name);
	    elm.style[name] = style[name];
	  }
	  compStyle = getComputedStyle(elm);
	  var props = compStyle['transition-property'].split(', ');
	  for (; i < props.length; ++i) {
	    if(applied.indexOf(props[i]) !== -1) amount++;
	  }
	  elm.addEventListener('transitionend', function(ev) {
	    if (ev.target === elm) --amount;
	    if (amount === 0) rm();
	  });
	}

	module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};


/***/ },
/* 39 */
/***/ function(module, exports) {

	var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
	var nextFrame = function(fn) { raf(function() { raf(fn); }); };

	function setNextFrame(obj, prop, val) {
	  nextFrame(function() { obj[prop] = val; });
	}

	function getTextNodeRect(textNode) {
	  var rect;
	  if (document.createRange) {
	    var range = document.createRange();
	    range.selectNodeContents(textNode);
	    if (range.getBoundingClientRect) {
	        rect = range.getBoundingClientRect();
	    }
	  }
	  return rect;
	}

	function calcTransformOrigin(isTextNode, textRect, boundingRect) {
	  if (isTextNode) {
	    if (textRect) {
	      //calculate pixels to center of text from left edge of bounding box
	      var relativeCenterX = textRect.left + textRect.width/2 - boundingRect.left;
	      var relativeCenterY = textRect.top + textRect.height/2 - boundingRect.top;
	      return relativeCenterX + 'px ' + relativeCenterY + 'px';
	    }
	  }
	  return '0 0'; //top left
	}

	function getTextDx(oldTextRect, newTextRect) {
	  if (oldTextRect && newTextRect) {
	    return ((oldTextRect.left + oldTextRect.width/2) - (newTextRect.left + newTextRect.width/2));
	  }
	  return 0;
	}
	function getTextDy(oldTextRect, newTextRect) {
	  if (oldTextRect && newTextRect) {
	    return ((oldTextRect.top + oldTextRect.height/2) - (newTextRect.top + newTextRect.height/2));
	  }
	  return 0;
	}

	function isTextElement(elm) {
	  return elm.childNodes.length === 1 && elm.childNodes[0].nodeType === 3;
	}

	var removed, created;

	function pre(oldVnode, vnode) {
	  removed = {};
	  created = [];
	}

	function create(oldVnode, vnode) {
	  var hero = vnode.data.hero;
	  if (hero && hero.id) {
	    created.push(hero.id);
	    created.push(vnode);
	  }
	}

	function destroy(vnode) {
	  var hero = vnode.data.hero;
	  if (hero && hero.id) {
	    var elm = vnode.elm;
	    vnode.isTextNode = isTextElement(elm); //is this a text node?
	    vnode.boundingRect = elm.getBoundingClientRect(); //save the bounding rectangle to a new property on the vnode
	    vnode.textRect = vnode.isTextNode ? getTextNodeRect(elm.childNodes[0]) : null; //save bounding rect of inner text node
	    var computedStyle = window.getComputedStyle(elm, null); //get current styles (includes inherited properties)
	    vnode.savedStyle = JSON.parse(JSON.stringify(computedStyle)); //save a copy of computed style values
	    removed[hero.id] = vnode;
	  }
	}

	function post() {
	  var i, id, newElm, oldVnode, oldElm, hRatio, wRatio,
	      oldRect, newRect, dx, dy, origTransform, origTransition,
	      newStyle, oldStyle, newComputedStyle, isTextNode,
	      newTextRect, oldTextRect;
	  for (i = 0; i < created.length; i += 2) {
	    id = created[i];
	    newElm = created[i+1].elm;
	    oldVnode = removed[id];
	    if (oldVnode) {
	      isTextNode = oldVnode.isTextNode && isTextElement(newElm); //Are old & new both text?
	      newStyle = newElm.style;
	      newComputedStyle = window.getComputedStyle(newElm, null); //get full computed style for new element
	      oldElm = oldVnode.elm;
	      oldStyle = oldElm.style;
	      //Overall element bounding boxes
	      newRect = newElm.getBoundingClientRect();
	      oldRect = oldVnode.boundingRect; //previously saved bounding rect
	      //Text node bounding boxes & distances
	      if (isTextNode) {
	        newTextRect = getTextNodeRect(newElm.childNodes[0]);
	        oldTextRect = oldVnode.textRect;
	        dx = getTextDx(oldTextRect, newTextRect);
	        dy = getTextDy(oldTextRect, newTextRect);
	      } else {
	        //Calculate distances between old & new positions
	        dx = oldRect.left - newRect.left;
	        dy = oldRect.top - newRect.top;
	      }
	      hRatio = newRect.height / (Math.max(oldRect.height, 1));
	      wRatio = isTextNode ? hRatio : newRect.width / (Math.max(oldRect.width, 1)); //text scales based on hRatio
	      // Animate new element
	      origTransform = newStyle.transform;
	      origTransition = newStyle.transition;
	      if (newComputedStyle.display === 'inline') //inline elements cannot be transformed
	        newStyle.display = 'inline-block';        //this does not appear to have any negative side effects
	      newStyle.transition = origTransition + 'transform 0s';
	      newStyle.transformOrigin = calcTransformOrigin(isTextNode, newTextRect, newRect);
	      newStyle.opacity = '0';
	      newStyle.transform = origTransform + 'translate('+dx+'px, '+dy+'px) ' +
	                               'scale('+1/wRatio+', '+1/hRatio+')';
	      setNextFrame(newStyle, 'transition', origTransition);
	      setNextFrame(newStyle, 'transform', origTransform);
	      setNextFrame(newStyle, 'opacity', '1');
	      // Animate old element
	      for (var key in oldVnode.savedStyle) { //re-apply saved inherited properties
	        if (parseInt(key) != key) {
	          var ms = key.substring(0,2) === 'ms';
	          var moz = key.substring(0,3) === 'moz';
	          var webkit = key.substring(0,6) === 'webkit';
	      	  if (!ms && !moz && !webkit) //ignore prefixed style properties
	        	  oldStyle[key] = oldVnode.savedStyle[key];
	        }
	      }
	      oldStyle.position = 'absolute';
	      oldStyle.top = oldRect.top + 'px'; //start at existing position
	      oldStyle.left = oldRect.left + 'px';
	      oldStyle.width = oldRect.width + 'px'; //Needed for elements who were sized relative to their parents
	      oldStyle.height = oldRect.height + 'px'; //Needed for elements who were sized relative to their parents
	      oldStyle.margin = 0; //Margin on hero element leads to incorrect positioning
	      oldStyle.transformOrigin = calcTransformOrigin(isTextNode, oldTextRect, oldRect);
	      oldStyle.transform = '';
	      oldStyle.opacity = '1';
	      document.body.appendChild(oldElm);
	      setNextFrame(oldStyle, 'transform', 'translate('+ -dx +'px, '+ -dy +'px) scale('+wRatio+', '+hRatio+')'); //scale must be on far right for translate to be correct
	      setNextFrame(oldStyle, 'opacity', '0');
	      oldElm.addEventListener('transitionend', function(ev) {
	        if (ev.propertyName === 'transform')
	          document.body.removeChild(ev.target);
	      });
	    }
	  }
	  removed = created = undefined;
	}

	module.exports = {pre: pre, create: create, destroy: destroy, post: post};


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var MapPolyfill = __webpack_require__(41);
	var IsolateModule = (function () {
	    function IsolateModule(isolatedElements) {
	        this.isolatedElements = isolatedElements;
	        this.eventDelegators = new MapPolyfill();
	    }
	    IsolateModule.prototype.setScope = function (elm, scope) {
	        this.isolatedElements.set(scope, elm);
	    };
	    IsolateModule.prototype.removeScope = function (scope) {
	        this.isolatedElements.delete(scope);
	    };
	    IsolateModule.prototype.cleanupVNode = function (_a) {
	        var data = _a.data, elm = _a.elm;
	        data = data || {};
	        var scope = data.isolate || '';
	        var isCurrentElm = this.isolatedElements.get(scope) === elm;
	        if (scope && isCurrentElm) {
	            this.removeScope(scope);
	            if (this.eventDelegators.get(scope)) {
	                this.eventDelegators.set(scope, []);
	            }
	        }
	    };
	    IsolateModule.prototype.getIsolatedElement = function (scope) {
	        return this.isolatedElements.get(scope);
	    };
	    IsolateModule.prototype.isIsolatedElement = function (elm) {
	        var iterator = this.isolatedElements.entries();
	        for (var result = iterator.next(); !!result.value; result = iterator.next()) {
	            var _a = result.value, scope = _a[0], element = _a[1];
	            if (elm === element) {
	                return scope;
	            }
	        }
	        return false;
	    };
	    IsolateModule.prototype.addEventDelegator = function (scope, eventDelegator) {
	        var delegators = this.eventDelegators.get(scope);
	        if (!delegators) {
	            delegators = [];
	            this.eventDelegators.set(scope, delegators);
	        }
	        delegators[delegators.length] = eventDelegator;
	    };
	    IsolateModule.prototype.reset = function () {
	        this.isolatedElements.clear();
	    };
	    IsolateModule.prototype.createModule = function () {
	        var self = this;
	        return {
	            create: function (oldVNode, vNode) {
	                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
	                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
	                var oldScope = oldData.isolate || "";
	                var scope = data.isolate || "";
	                if (scope) {
	                    if (oldScope) {
	                        self.removeScope(oldScope);
	                    }
	                    self.setScope(elm, scope);
	                    var delegators = self.eventDelegators.get(scope);
	                    if (delegators) {
	                        for (var i = 0, len = delegators.length; i < len; ++i) {
	                            delegators[i].updateTopElement(elm);
	                        }
	                    }
	                    else if (delegators === void 0) {
	                        self.eventDelegators.set(scope, []);
	                    }
	                }
	                if (oldScope && !scope) {
	                    self.removeScope(scope);
	                }
	            },
	            update: function (oldVNode, vNode) {
	                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
	                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
	                var oldScope = oldData.isolate || "";
	                var scope = data.isolate || "";
	                if (scope && scope !== oldScope) {
	                    if (oldScope) {
	                        self.removeScope(oldScope);
	                    }
	                    self.setScope(elm, scope);
	                }
	                if (oldScope && !scope) {
	                    self.removeScope(scope);
	                }
	            },
	            remove: function (vNode, cb) {
	                self.cleanupVNode(vNode);
	                cb();
	            },
	            destroy: function (vNode) {
	                self.cleanupVNode(vNode);
	            },
	        };
	    };
	    return IsolateModule;
	}());
	exports.IsolateModule = IsolateModule;
	//# sourceMappingURL=isolateModule.js.map

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(42)() ? Map : __webpack_require__(43);


/***/ },
/* 42 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var map, iterator, result;
		if (typeof Map !== 'function') return false;
		try {
			// WebKit doesn't support arguments and crashes
			map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
		} catch (e) {
			return false;
		}
		if (String(map) !== '[object Map]') return false;
		if (map.size !== 3) return false;
		if (typeof map.clear !== 'function') return false;
		if (typeof map.delete !== 'function') return false;
		if (typeof map.entries !== 'function') return false;
		if (typeof map.forEach !== 'function') return false;
		if (typeof map.get !== 'function') return false;
		if (typeof map.has !== 'function') return false;
		if (typeof map.keys !== 'function') return false;
		if (typeof map.set !== 'function') return false;
		if (typeof map.values !== 'function') return false;

		iterator = map.entries();
		result = iterator.next();
		if (result.done !== false) return false;
		if (!result.value) return false;
		if (result.value[0] !== 'raz') return false;
		if (result.value[1] !== 'one') return false;

		return true;
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear          = __webpack_require__(44)
	  , eIndexOf       = __webpack_require__(46)
	  , setPrototypeOf = __webpack_require__(52)
	  , callable       = __webpack_require__(57)
	  , validValue     = __webpack_require__(45)
	  , d              = __webpack_require__(58)
	  , ee             = __webpack_require__(70)
	  , Symbol         = __webpack_require__(71)
	  , iterator       = __webpack_require__(76)
	  , forOf          = __webpack_require__(80)
	  , Iterator       = __webpack_require__(90)
	  , isNative       = __webpack_require__(93)

	  , call = Function.prototype.call
	  , defineProperties = Object.defineProperties, getPrototypeOf = Object.getPrototypeOf
	  , MapPoly;

	module.exports = MapPoly = function (/*iterable*/) {
		var iterable = arguments[0], keys, values, self;
		if (!(this instanceof MapPoly)) throw new TypeError('Constructor requires \'new\'');
		if (isNative && setPrototypeOf && (Map !== MapPoly)) {
			self = setPrototypeOf(new Map(), getPrototypeOf(this));
		} else {
			self = this;
		}
		if (iterable != null) iterator(iterable);
		defineProperties(self, {
			__mapKeysData__: d('c', keys = []),
			__mapValuesData__: d('c', values = [])
		});
		if (!iterable) return self;
		forOf(iterable, function (value) {
			var key = validValue(value)[0];
			value = value[1];
			if (eIndexOf.call(keys, key) !== -1) return;
			keys.push(key);
			values.push(value);
		}, self);
		return self;
	};

	if (isNative) {
		if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
		MapPoly.prototype = Object.create(Map.prototype, {
			constructor: d(MapPoly)
		});
	}

	ee(defineProperties(MapPoly.prototype, {
		clear: d(function () {
			if (!this.__mapKeysData__.length) return;
			clear.call(this.__mapKeysData__);
			clear.call(this.__mapValuesData__);
			this.emit('_clear');
		}),
		delete: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return false;
			this.__mapKeysData__.splice(index, 1);
			this.__mapValuesData__.splice(index, 1);
			this.emit('_delete', index, key);
			return true;
		}),
		entries: d(function () { return new Iterator(this, 'key+value'); }),
		forEach: d(function (cb/*, thisArg*/) {
			var thisArg = arguments[1], iterator, result;
			callable(cb);
			iterator = this.entries();
			result = iterator._next();
			while (result !== undefined) {
				call.call(cb, thisArg, this.__mapValuesData__[result],
					this.__mapKeysData__[result], this);
				result = iterator._next();
			}
		}),
		get: d(function (key) {
			var index = eIndexOf.call(this.__mapKeysData__, key);
			if (index === -1) return;
			return this.__mapValuesData__[index];
		}),
		has: d(function (key) {
			return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
		}),
		keys: d(function () { return new Iterator(this, 'key'); }),
		set: d(function (key, value) {
			var index = eIndexOf.call(this.__mapKeysData__, key), emit;
			if (index === -1) {
				index = this.__mapKeysData__.push(key) - 1;
				emit = true;
			}
			this.__mapValuesData__[index] = value;
			if (emit) this.emit('_add', index, key);
			return this;
		}),
		size: d.gs(function () { return this.__mapKeysData__.length; }),
		values: d(function () { return new Iterator(this, 'value'); }),
		toString: d(function () { return '[object Map]'; })
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
		return this.entries();
	}));
	Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	// Inspired by Google Closure:
	// http://closure-library.googlecode.com/svn/docs/
	// closure_goog_array_array.js.html#goog.array.clear

	'use strict';

	var value = __webpack_require__(45);

	module.exports = function () {
		value(this).length = 0;
		return this;
	};


/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		if (value == null) throw new TypeError("Cannot use null or undefined");
		return value;
	};


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toPosInt = __webpack_require__(47)
	  , value    = __webpack_require__(45)

	  , indexOf = Array.prototype.indexOf
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (searchElement/*, fromIndex*/) {
		var i, l, fromIndex, val;
		if (searchElement === searchElement) { //jslint: ignore
			return indexOf.apply(this, arguments);
		}

		l = toPosInt(value(this).length);
		fromIndex = arguments[1];
		if (isNaN(fromIndex)) fromIndex = 0;
		else if (fromIndex >= 0) fromIndex = floor(fromIndex);
		else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

		for (i = fromIndex; i < l; ++i) {
			if (hasOwnProperty.call(this, i)) {
				val = this[i];
				if (val !== val) return i; //jslint: ignore
			}
		}
		return -1;
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var toInteger = __webpack_require__(48)

	  , max = Math.max;

	module.exports = function (value) { return max(0, toInteger(value)); };


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var sign = __webpack_require__(49)

	  , abs = Math.abs, floor = Math.floor;

	module.exports = function (value) {
		if (isNaN(value)) return 0;
		value = Number(value);
		if ((value === 0) || !isFinite(value)) return value;
		return sign(value) * floor(abs(value));
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(50)()
		? Math.sign
		: __webpack_require__(51);


/***/ },
/* 50 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var sign = Math.sign;
		if (typeof sign !== 'function') return false;
		return ((sign(10) === 1) && (sign(-20) === -1));
	};


/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (value) {
		value = Number(value);
		if (isNaN(value) || (value === 0)) return value;
		return (value > 0) ? 1 : -1;
	};


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(53)()
		? Object.setPrototypeOf
		: __webpack_require__(54);


/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';

	var create = Object.create, getPrototypeOf = Object.getPrototypeOf
	  , x = {};

	module.exports = function (/*customCreate*/) {
		var setPrototypeOf = Object.setPrototypeOf
		  , customCreate = arguments[0] || create;
		if (typeof setPrototypeOf !== 'function') return false;
		return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
	};


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	// Big thanks to @WebReflection for sorting this out
	// https://gist.github.com/WebReflection/5593554

	'use strict';

	var isObject      = __webpack_require__(55)
	  , value         = __webpack_require__(45)

	  , isPrototypeOf = Object.prototype.isPrototypeOf
	  , defineProperty = Object.defineProperty
	  , nullDesc = { configurable: true, enumerable: false, writable: true,
			value: undefined }
	  , validate;

	validate = function (obj, prototype) {
		value(obj);
		if ((prototype === null) || isObject(prototype)) return obj;
		throw new TypeError('Prototype must be null or an object');
	};

	module.exports = (function (status) {
		var fn, set;
		if (!status) return null;
		if (status.level === 2) {
			if (status.set) {
				set = status.set;
				fn = function (obj, prototype) {
					set.call(validate(obj, prototype), prototype);
					return obj;
				};
			} else {
				fn = function (obj, prototype) {
					validate(obj, prototype).__proto__ = prototype;
					return obj;
				};
			}
		} else {
			fn = function self(obj, prototype) {
				var isNullBase;
				validate(obj, prototype);
				isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
				if (isNullBase) delete self.nullPolyfill.__proto__;
				if (prototype === null) prototype = self.nullPolyfill;
				obj.__proto__ = prototype;
				if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
				return obj;
			};
		}
		return Object.defineProperty(fn, 'level', { configurable: false,
			enumerable: false, writable: false, value: status.level });
	}((function () {
		var x = Object.create(null), y = {}, set
		  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

		if (desc) {
			try {
				set = desc.set; // Opera crashes at this point
				set.call(x, y);
			} catch (ignore) { }
			if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
		}

		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 2 };

		x = {};
		x.__proto__ = y;
		if (Object.getPrototypeOf(x) === y) return { level: 1 };

		return false;
	}())));

	__webpack_require__(56);


/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';

	var map = { function: true, object: true };

	module.exports = function (x) {
		return ((x != null) && map[typeof x]) || false;
	};


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

	'use strict';

	var create = Object.create, shim;

	if (!__webpack_require__(53)()) {
		shim = __webpack_require__(54);
	}

	module.exports = (function () {
		var nullObject, props, desc;
		if (!shim) return create;
		if (shim.level !== 1) return create;

		nullObject = {};
		props = {};
		desc = { configurable: false, enumerable: false, writable: true,
			value: undefined };
		Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
			if (name === '__proto__') {
				props[name] = { configurable: true, enumerable: false, writable: true,
					value: undefined };
				return;
			}
			props[name] = desc;
		});
		Object.defineProperties(nullObject, props);

		Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
			enumerable: false, writable: false, value: nullObject });

		return function (prototype, props) {
			return create((prototype === null) ? nullObject : prototype, props);
		};
	}());


/***/ },
/* 57 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (fn) {
		if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
		return fn;
	};


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign        = __webpack_require__(59)
	  , normalizeOpts = __webpack_require__(65)
	  , isCallable    = __webpack_require__(66)
	  , contains      = __webpack_require__(67)

	  , d;

	d = module.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if ((arguments.length < 2) || (typeof dscr !== 'string')) {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (dscr == null) {
			c = w = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
			w = contains.call(dscr, 'w');
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== 'string') {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (get == null) {
			get = undefined;
		} else if (!isCallable(get)) {
			options = get;
			get = set = undefined;
		} else if (set == null) {
			set = undefined;
		} else if (!isCallable(set)) {
			options = set;
			set = undefined;
		}
		if (dscr == null) {
			c = true;
			e = false;
		} else {
			c = contains.call(dscr, 'c');
			e = contains.call(dscr, 'e');
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(60)()
		? Object.assign
		: __webpack_require__(61);


/***/ },
/* 60 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== 'function') return false;
		obj = { foo: 'raz' };
		assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
		return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var keys  = __webpack_require__(62)
	  , value = __webpack_require__(45)

	  , max = Math.max;

	module.exports = function (dest, src/*, …srcn*/) {
		var error, i, l = max(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try { dest[key] = src[key]; } catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < l; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(63)()
		? Object.keys
		: __webpack_require__(64);


/***/ },
/* 63 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
		try {
			Object.keys('primitive');
			return true;
		} catch (e) { return false; }
	};


/***/ },
/* 64 */
/***/ function(module, exports) {

	'use strict';

	var keys = Object.keys;

	module.exports = function (object) {
		return keys(object == null ? object : Object(object));
	};


/***/ },
/* 65 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	module.exports = function (options/*, …options*/) {
		var result = create(null);
		forEach.call(arguments, function (options) {
			if (options == null) return;
			process(Object(options), result);
		});
		return result;
	};


/***/ },
/* 66 */
/***/ function(module, exports) {

	// Deprecated

	'use strict';

	module.exports = function (obj) { return typeof obj === 'function'; };


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(68)()
		? String.prototype.contains
		: __webpack_require__(69);


/***/ },
/* 68 */
/***/ function(module, exports) {

	'use strict';

	var str = 'razdwatrzy';

	module.exports = function () {
		if (typeof str.contains !== 'function') return false;
		return ((str.contains('dwa') === true) && (str.contains('foo') === false));
	};


/***/ },
/* 69 */
/***/ function(module, exports) {

	'use strict';

	var indexOf = String.prototype.indexOf;

	module.exports = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var d        = __webpack_require__(58)
	  , callable = __webpack_require__(57)

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(72)() ? Symbol : __webpack_require__(73);


/***/ },
/* 72 */
/***/ function(module, exports) {

	'use strict';

	var validTypes = { object: true, symbol: true };

	module.exports = function () {
		var symbol;
		if (typeof Symbol !== 'function') return false;
		symbol = Symbol('test symbol');
		try { String(symbol); } catch (e) { return false; }

		// Return 'true' also for polyfills
		if (!validTypes[typeof Symbol.iterator]) return false;
		if (!validTypes[typeof Symbol.toPrimitive]) return false;
		if (!validTypes[typeof Symbol.toStringTag]) return false;

		return true;
	};


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	// ES2015 Symbol polyfill for environments that do not support it (or partially support it)

	'use strict';

	var d              = __webpack_require__(58)
	  , validateSymbol = __webpack_require__(74)

	  , create = Object.create, defineProperties = Object.defineProperties
	  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
	  , NativeSymbol, SymbolPolyfill, HiddenSymbol, globalSymbols = create(null)
	  , isNativeSafe;

	if (typeof Symbol === 'function') {
		NativeSymbol = Symbol;
		try {
			String(NativeSymbol());
			isNativeSafe = true;
		} catch (ignore) {}
	}

	var generateName = (function () {
		var created = create(null);
		return function (desc) {
			var postfix = 0, name, ie11BugWorkaround;
			while (created[desc + (postfix || '')]) ++postfix;
			desc += (postfix || '');
			created[desc] = true;
			name = '@@' + desc;
			defineProperty(objPrototype, name, d.gs(null, function (value) {
				// For IE11 issue see:
				// https://connect.microsoft.com/IE/feedbackdetail/view/1928508/
				//    ie11-broken-getters-on-dom-objects
				// https://github.com/medikoo/es6-symbol/issues/12
				if (ie11BugWorkaround) return;
				ie11BugWorkaround = true;
				defineProperty(this, name, d(value));
				ie11BugWorkaround = false;
			}));
			return name;
		};
	}());

	// Internal constructor (not one exposed) for creating Symbol instances.
	// This one is used to ensure that `someSymbol instanceof Symbol` always return false
	HiddenSymbol = function Symbol(description) {
		if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
		return SymbolPolyfill(description);
	};

	// Exposed `Symbol` constructor
	// (returns instances of HiddenSymbol)
	module.exports = SymbolPolyfill = function Symbol(description) {
		var symbol;
		if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
		if (isNativeSafe) return NativeSymbol(description);
		symbol = create(HiddenSymbol.prototype);
		description = (description === undefined ? '' : String(description));
		return defineProperties(symbol, {
			__description__: d('', description),
			__name__: d('', generateName(description))
		});
	};
	defineProperties(SymbolPolyfill, {
		for: d(function (key) {
			if (globalSymbols[key]) return globalSymbols[key];
			return (globalSymbols[key] = SymbolPolyfill(String(key)));
		}),
		keyFor: d(function (s) {
			var key;
			validateSymbol(s);
			for (key in globalSymbols) if (globalSymbols[key] === s) return key;
		}),

		// If there's native implementation of given symbol, let's fallback to it
		// to ensure proper interoperability with other native functions e.g. Array.from
		hasInstance: d('', (NativeSymbol && NativeSymbol.hasInstance) || SymbolPolyfill('hasInstance')),
		isConcatSpreadable: d('', (NativeSymbol && NativeSymbol.isConcatSpreadable) ||
			SymbolPolyfill('isConcatSpreadable')),
		iterator: d('', (NativeSymbol && NativeSymbol.iterator) || SymbolPolyfill('iterator')),
		match: d('', (NativeSymbol && NativeSymbol.match) || SymbolPolyfill('match')),
		replace: d('', (NativeSymbol && NativeSymbol.replace) || SymbolPolyfill('replace')),
		search: d('', (NativeSymbol && NativeSymbol.search) || SymbolPolyfill('search')),
		species: d('', (NativeSymbol && NativeSymbol.species) || SymbolPolyfill('species')),
		split: d('', (NativeSymbol && NativeSymbol.split) || SymbolPolyfill('split')),
		toPrimitive: d('', (NativeSymbol && NativeSymbol.toPrimitive) || SymbolPolyfill('toPrimitive')),
		toStringTag: d('', (NativeSymbol && NativeSymbol.toStringTag) || SymbolPolyfill('toStringTag')),
		unscopables: d('', (NativeSymbol && NativeSymbol.unscopables) || SymbolPolyfill('unscopables'))
	});

	// Internal tweaks for real symbol producer
	defineProperties(HiddenSymbol.prototype, {
		constructor: d(SymbolPolyfill),
		toString: d('', function () { return this.__name__; })
	});

	// Proper implementation of methods exposed on Symbol.prototype
	// They won't be accessible on produced symbol instances as they derive from HiddenSymbol.prototype
	defineProperties(SymbolPolyfill.prototype, {
		toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
		valueOf: d(function () { return validateSymbol(this); })
	});
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toPrimitive, d('', function () {
		var symbol = validateSymbol(this);
		if (typeof symbol === 'symbol') return symbol;
		return symbol.toString();
	}));
	defineProperty(SymbolPolyfill.prototype, SymbolPolyfill.toStringTag, d('c', 'Symbol'));

	// Proper implementaton of toPrimitive and toStringTag for returned symbol instances
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toStringTag,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toStringTag]));

	// Note: It's important to define `toPrimitive` as last one, as some implementations
	// implement `toPrimitive` natively without implementing `toStringTag` (or other specified symbols)
	// And that may invoke error in definition flow:
	// See: https://github.com/medikoo/es6-symbol/issues/13#issuecomment-164146149
	defineProperty(HiddenSymbol.prototype, SymbolPolyfill.toPrimitive,
		d('c', SymbolPolyfill.prototype[SymbolPolyfill.toPrimitive]));


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isSymbol = __webpack_require__(75);

	module.exports = function (value) {
		if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
		return value;
	};


/***/ },
/* 75 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function (x) {
		if (!x) return false;
		if (typeof x === 'symbol') return true;
		if (!x.constructor) return false;
		if (x.constructor.name !== 'Symbol') return false;
		return (x[x.constructor.toStringTag] === 'Symbol');
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isIterable = __webpack_require__(77);

	module.exports = function (value) {
		if (!isIterable(value)) throw new TypeError(value + " is not iterable");
		return value;
	};


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(78)
	  , isString       = __webpack_require__(79)
	  , iteratorSymbol = __webpack_require__(71).iterator

	  , isArray = Array.isArray;

	module.exports = function (value) {
		if (value == null) return false;
		if (isArray(value)) return true;
		if (isString(value)) return true;
		if (isArguments(value)) return true;
		return (typeof value[iteratorSymbol] === 'function');
	};


/***/ },
/* 78 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call((function () { return arguments; }()));

	module.exports = function (x) { return (toString.call(x) === id); };


/***/ },
/* 79 */
/***/ function(module, exports) {

	'use strict';

	var toString = Object.prototype.toString

	  , id = toString.call('');

	module.exports = function (x) {
		return (typeof x === 'string') || (x && (typeof x === 'object') &&
			((x instanceof String) || (toString.call(x) === id))) || false;
	};


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments = __webpack_require__(78)
	  , callable    = __webpack_require__(57)
	  , isString    = __webpack_require__(79)
	  , get         = __webpack_require__(81)

	  , isArray = Array.isArray, call = Function.prototype.call
	  , some = Array.prototype.some;

	module.exports = function (iterable, cb/*, thisArg*/) {
		var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
		if (isArray(iterable) || isArguments(iterable)) mode = 'array';
		else if (isString(iterable)) mode = 'string';
		else iterable = get(iterable);

		callable(cb);
		doBreak = function () { broken = true; };
		if (mode === 'array') {
			some.call(iterable, function (value) {
				call.call(cb, thisArg, value, doBreak);
				if (broken) return true;
			});
			return;
		}
		if (mode === 'string') {
			l = iterable.length;
			for (i = 0; i < l; ++i) {
				char = iterable[i];
				if ((i + 1) < l) {
					code = char.charCodeAt(0);
					if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
				}
				call.call(cb, thisArg, char, doBreak);
				if (broken) break;
			}
			return;
		}
		result = iterable.next();

		while (!result.done) {
			call.call(cb, thisArg, result.value, doBreak);
			if (broken) return;
			result = iterable.next();
		}
	};


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var isArguments    = __webpack_require__(78)
	  , isString       = __webpack_require__(79)
	  , ArrayIterator  = __webpack_require__(82)
	  , StringIterator = __webpack_require__(89)
	  , iterable       = __webpack_require__(76)
	  , iteratorSymbol = __webpack_require__(71).iterator;

	module.exports = function (obj) {
		if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
		if (isArguments(obj)) return new ArrayIterator(obj);
		if (isString(obj)) return new StringIterator(obj);
		return new ArrayIterator(obj);
	};


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf = __webpack_require__(52)
	  , contains       = __webpack_require__(67)
	  , d              = __webpack_require__(58)
	  , Iterator       = __webpack_require__(83)

	  , defineProperty = Object.defineProperty
	  , ArrayIterator;

	ArrayIterator = module.exports = function (arr, kind) {
		if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
		Iterator.call(this, arr);
		if (!kind) kind = 'value';
		else if (contains.call(kind, 'key+value')) kind = 'key+value';
		else if (contains.call(kind, 'key')) kind = 'key';
		else kind = 'value';
		defineProperty(this, '__kind__', d('', kind));
	};
	if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

	ArrayIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(ArrayIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__list__[i];
			if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
			return i;
		}),
		toString: d(function () { return '[object Array Iterator]'; })
	});


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var clear    = __webpack_require__(44)
	  , assign   = __webpack_require__(59)
	  , callable = __webpack_require__(57)
	  , value    = __webpack_require__(45)
	  , d        = __webpack_require__(58)
	  , autoBind = __webpack_require__(84)
	  , Symbol   = __webpack_require__(71)

	  , defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , Iterator;

	module.exports = Iterator = function (list, context) {
		if (!(this instanceof Iterator)) return new Iterator(list, context);
		defineProperties(this, {
			__list__: d('w', value(list)),
			__context__: d('w', context),
			__nextIndex__: d('w', 0)
		});
		if (!context) return;
		callable(context.on);
		context.on('_add', this._onAdd);
		context.on('_delete', this._onDelete);
		context.on('_clear', this._onClear);
	};

	defineProperties(Iterator.prototype, assign({
		constructor: d(Iterator),
		_next: d(function () {
			var i;
			if (!this.__list__) return;
			if (this.__redo__) {
				i = this.__redo__.shift();
				if (i !== undefined) return i;
			}
			if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
			this._unBind();
		}),
		next: d(function () { return this._createResult(this._next()); }),
		_createResult: d(function (i) {
			if (i === undefined) return { done: true, value: undefined };
			return { done: false, value: this._resolve(i) };
		}),
		_resolve: d(function (i) { return this.__list__[i]; }),
		_unBind: d(function () {
			this.__list__ = null;
			delete this.__redo__;
			if (!this.__context__) return;
			this.__context__.off('_add', this._onAdd);
			this.__context__.off('_delete', this._onDelete);
			this.__context__.off('_clear', this._onClear);
			this.__context__ = null;
		}),
		toString: d(function () { return '[object Iterator]'; })
	}, autoBind({
		_onAdd: d(function (index) {
			if (index >= this.__nextIndex__) return;
			++this.__nextIndex__;
			if (!this.__redo__) {
				defineProperty(this, '__redo__', d('c', [index]));
				return;
			}
			this.__redo__.forEach(function (redo, i) {
				if (redo >= index) this.__redo__[i] = ++redo;
			}, this);
			this.__redo__.push(index);
		}),
		_onDelete: d(function (index) {
			var i;
			if (index >= this.__nextIndex__) return;
			--this.__nextIndex__;
			if (!this.__redo__) return;
			i = this.__redo__.indexOf(index);
			if (i !== -1) this.__redo__.splice(i, 1);
			this.__redo__.forEach(function (redo, i) {
				if (redo > index) this.__redo__[i] = --redo;
			}, this);
		}),
		_onClear: d(function () {
			if (this.__redo__) clear.call(this.__redo__);
			this.__nextIndex__ = 0;
		})
	})));

	defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
		return this;
	}));
	defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var copy       = __webpack_require__(85)
	  , map        = __webpack_require__(86)
	  , callable   = __webpack_require__(57)
	  , validValue = __webpack_require__(45)

	  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , define;

	define = function (name, desc, bindTo) {
		var value = validValue(desc) && callable(desc.value), dgs;
		dgs = copy(desc);
		delete dgs.writable;
		delete dgs.value;
		dgs.get = function () {
			if (hasOwnProperty.call(this, name)) return value;
			desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
			defineProperty(this, name, desc);
			return this[name];
		};
		return dgs;
	};

	module.exports = function (props/*, bindTo*/) {
		var bindTo = arguments[1];
		return map(props, function (desc, name) {
			return define(name, desc, bindTo);
		});
	};


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var assign = __webpack_require__(59)
	  , value  = __webpack_require__(45);

	module.exports = function (obj) {
		var copy = Object(value(obj));
		if (copy !== obj) return copy;
		return assign({}, obj);
	};


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var callable = __webpack_require__(57)
	  , forEach  = __webpack_require__(87)

	  , call = Function.prototype.call;

	module.exports = function (obj, cb/*, thisArg*/) {
		var o = {}, thisArg = arguments[2];
		callable(cb);
		forEach(obj, function (value, key, obj, index) {
			o[key] = call.call(cb, thisArg, value, key, obj, index);
		});
		return o;
	};


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(88)('forEach');


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	// Internal method, used by iteration functions.
	// Calls a function for each key-value pair found in object
	// Optionally takes compareFn to iterate object in specific order

	'use strict';

	var callable = __webpack_require__(57)
	  , value    = __webpack_require__(45)

	  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
	  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

	module.exports = function (method, defVal) {
		return function (obj, cb/*, thisArg, compareFn*/) {
			var list, thisArg = arguments[2], compareFn = arguments[3];
			obj = Object(value(obj));
			callable(cb);

			list = keys(obj);
			if (compareFn) {
				list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
			}
			if (typeof method !== 'function') method = list[method];
			return call.call(method, list, function (key, index) {
				if (!propertyIsEnumerable.call(obj, key)) return defVal;
				return call.call(cb, thisArg, obj[key], key, obj, index);
			});
		};
	};


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	// Thanks @mathiasbynens
	// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

	'use strict';

	var setPrototypeOf = __webpack_require__(52)
	  , d              = __webpack_require__(58)
	  , Iterator       = __webpack_require__(83)

	  , defineProperty = Object.defineProperty
	  , StringIterator;

	StringIterator = module.exports = function (str) {
		if (!(this instanceof StringIterator)) return new StringIterator(str);
		str = String(str);
		Iterator.call(this, str);
		defineProperty(this, '__length__', d('', str.length));

	};
	if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

	StringIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(StringIterator),
		_next: d(function () {
			if (!this.__list__) return;
			if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
			this._unBind();
		}),
		_resolve: d(function (i) {
			var char = this.__list__[i], code;
			if (this.__nextIndex__ === this.__length__) return char;
			code = char.charCodeAt(0);
			if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
			return char;
		}),
		toString: d(function () { return '[object String Iterator]'; })
	});


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var setPrototypeOf    = __webpack_require__(52)
	  , d                 = __webpack_require__(58)
	  , Iterator          = __webpack_require__(83)
	  , toStringTagSymbol = __webpack_require__(71).toStringTag
	  , kinds             = __webpack_require__(91)

	  , defineProperties = Object.defineProperties
	  , unBind = Iterator.prototype._unBind
	  , MapIterator;

	MapIterator = module.exports = function (map, kind) {
		if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
		Iterator.call(this, map.__mapKeysData__, map);
		if (!kind || !kinds[kind]) kind = 'key+value';
		defineProperties(this, {
			__kind__: d('', kind),
			__values__: d('w', map.__mapValuesData__)
		});
	};
	if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

	MapIterator.prototype = Object.create(Iterator.prototype, {
		constructor: d(MapIterator),
		_resolve: d(function (i) {
			if (this.__kind__ === 'value') return this.__values__[i];
			if (this.__kind__ === 'key') return this.__list__[i];
			return [this.__list__[i], this.__values__[i]];
		}),
		_unBind: d(function () {
			this.__values__ = null;
			unBind.call(this);
		}),
		toString: d(function () { return '[object Map Iterator]'; })
	});
	Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
		d('c', 'Map Iterator'));


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(92)('key',
		'value', 'key+value');


/***/ },
/* 92 */
/***/ function(module, exports) {

	'use strict';

	var forEach = Array.prototype.forEach, create = Object.create;

	module.exports = function (arg/*, …args*/) {
		var set = create(null);
		forEach.call(arguments, function (name) { set[name] = true; });
		return set;
	};


/***/ },
/* 93 */
/***/ function(module, exports) {

	// Exports true if environment provides native `Map` implementation,
	// whatever that is.

	'use strict';

	module.exports = (function () {
		if (typeof Map === 'undefined') return false;
		return (Object.prototype.toString.call(new Map()) === '[object Map]');
	}());


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_adapter_1 = __webpack_require__(3);
	var xstream_1 = __webpack_require__(4);
	function createVTree(vnode, children) {
	    return {
	        sel: vnode.sel,
	        data: vnode.data,
	        text: vnode.text,
	        elm: vnode.elm,
	        key: vnode.key,
	        children: children,
	    };
	}
	function makeTransposeVNode(runStreamAdapter) {
	    function internalTransposeVNode(vnode) {
	        if (!vnode) {
	            return null;
	        }
	        else if (vnode && vnode.data && vnode.data.static) {
	            return xstream_1.default.of(vnode);
	        }
	        else if (runStreamAdapter.isValidStream(vnode)) {
	            var xsStream = xstream_adapter_1.default.adapt(vnode, runStreamAdapter.streamSubscribe);
	            return xsStream.map(internalTransposeVNode).flatten();
	        }
	        else if (typeof vnode === "object") {
	            if (!vnode.children || vnode.children.length === 0) {
	                return xstream_1.default.of(vnode);
	            }
	            var vnodeChildren = vnode.children
	                .map(internalTransposeVNode)
	                .filter(function (x) { return x !== null; });
	            if (vnodeChildren.length === 0) {
	                return xstream_1.default.of(createVTree(vnode, []));
	            }
	            else {
	                return xstream_1.default.combine.apply(xstream_1.default, vnodeChildren)
	                    .map(function (children) { return createVTree(vnode, children.slice()); });
	            }
	        }
	        else {
	            throw new Error("Unhandled vTree Value");
	        }
	    }
	    ;
	    return function transposeVNode(vnode) {
	        return internalTransposeVNode(vnode);
	    };
	}
	exports.makeTransposeVNode = makeTransposeVNode;
	//# sourceMappingURL=transposition.js.map

/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_adapter_1 = __webpack_require__(3);
	var transposition_1 = __webpack_require__(94);
	var HTMLSource_1 = __webpack_require__(96);
	var toHTML = __webpack_require__(97);
	var noop = function () { };
	function makeHTMLDriver(effect, options) {
	    if (!options) {
	        options = {};
	    }
	    var transposition = options.transposition || false;
	    function htmlDriver(vnode$, runStreamAdapter, name) {
	        var transposeVNode = transposition_1.makeTransposeVNode(runStreamAdapter);
	        var preprocessedVNode$ = (transposition ? vnode$.map(transposeVNode).flatten() : vnode$);
	        var html$ = preprocessedVNode$.map(toHTML);
	        html$.addListener({
	            next: effect || noop,
	            error: noop,
	            complete: noop,
	        });
	        return new HTMLSource_1.HTMLSource(html$, runStreamAdapter, name);
	    }
	    ;
	    htmlDriver.streamAdapter = xstream_adapter_1.default;
	    return htmlDriver;
	}
	exports.makeHTMLDriver = makeHTMLDriver;
	//# sourceMappingURL=makeHTMLDriver.js.map

/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	var xstream_adapter_1 = __webpack_require__(3);
	var HTMLSource = (function () {
	    function HTMLSource(html$, runSA, _name) {
	        this.runSA = runSA;
	        this._name = _name;
	        this._html$ = html$;
	        this._empty$ = runSA.adapt(xstream_1.default.empty(), xstream_adapter_1.default.streamSubscribe);
	    }
	    HTMLSource.prototype.elements = function () {
	        var out = this.runSA.adapt(this._html$, xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = this._name;
	        return out;
	    };
	    HTMLSource.prototype.select = function (selector) {
	        return new HTMLSource(xstream_1.default.empty(), this.runSA, this._name);
	    };
	    HTMLSource.prototype.events = function (eventType, options) {
	        var out = this._empty$;
	        out._isCycleSource = this._name;
	        return out;
	    };
	    return HTMLSource;
	}());
	exports.HTMLSource = HTMLSource;
	//# sourceMappingURL=HTMLSource.js.map

/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	
	var init = __webpack_require__(98);

	module.exports = init([__webpack_require__(102), __webpack_require__(119)]);

/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	
	var parseSelector = __webpack_require__(99);
	var VOID_ELEMENTS = __webpack_require__(100);
	var CONTAINER_ELEMENTS = __webpack_require__(101);

	module.exports = function init(modules) {
	  function parse(data) {
	    return modules.reduce(function (arr, fn) {
	      arr.push(fn(data));
	      return arr;
	    }, []).filter(function (result) {
	      return result !== '';
	    });
	  }

	  return function renderToString(vnode) {
	    if (!vnode.sel && vnode.text) {
	      return vnode.text;
	    }

	    vnode.data = vnode.data || {};

	    // Support thunks
	    if (typeof vnode.sel === 'string' && vnode.sel.slice(0, 5) === 'thunk') {
	      vnode = vnode.data.fn.apply(null, vnode.data.args);
	    }

	    var tagName = parseSelector(vnode.sel).tagName;
	    var attributes = parse(vnode);
	    var svg = vnode.data.ns === 'http://www.w3.org/2000/svg';
	    var tag = [];

	    // Open tag
	    tag.push('<' + tagName);
	    if (attributes.length) {
	      tag.push(' ' + attributes.join(' '));
	    }
	    if (svg && CONTAINER_ELEMENTS[tagName] !== true) {
	      tag.push(' /');
	    }
	    tag.push('>');

	    // Close tag, if needed
	    if (VOID_ELEMENTS[tagName] !== true && !svg || svg && CONTAINER_ELEMENTS[tagName] === true) {
	      if (vnode.data.props && vnode.data.props.innerHTML) {
	        tag.push(vnode.data.props.innerHTML);
	      } else if (vnode.text) {
	        tag.push(vnode.text);
	      } else if (vnode.children) {
	        vnode.children.forEach(function (child) {
	          tag.push(renderToString(child));
	        });
	      }
	      tag.push('</' + tagName + '>');
	    }

	    return tag.join('');
	  };
	};

/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	
	// https://github.com/Matt-Esch/virtual-dom/blob/master/virtual-hyperscript/parse-tag.js

	var split = __webpack_require__(32);

	var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
	var notClassId = /^\.|#/;

	module.exports = function parseSelector(selector, upper) {
	  selector = selector || '';
	  var tagName;
	  var id = '';
	  var classes = [];

	  var tagParts = split(selector, classIdSplit);

	  if (notClassId.test(tagParts[1]) || selector === '') {
	    tagName = 'div';
	  }

	  var part, type, i;

	  for (i = 0; i < tagParts.length; i++) {
	    part = tagParts[i];

	    if (!part) {
	      continue;
	    }

	    type = part.charAt(0);

	    if (!tagName) {
	      tagName = part;
	    } else if (type === '.') {
	      classes.push(part.substring(1, part.length));
	    } else if (type === '#') {
	      id = part.substring(1, part.length);
	    }
	  }

	  return {
	    tagName: upper === true ? tagName.toUpperCase() : tagName,
	    id: id,
	    className: classes.join(' ')
	  };
	};

/***/ },
/* 100 */
/***/ function(module, exports) {

	
	// http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements

	module.exports = {
	  area: true,
	  base: true,
	  br: true,
	  col: true,
	  embed: true,
	  hr: true,
	  img: true,
	  input: true,
	  keygen: true,
	  link: true,
	  meta: true,
	  param: true,
	  source: true,
	  track: true,
	  wbr: true
	};

/***/ },
/* 101 */
/***/ function(module, exports) {

	
	// All SVG children elements, not in this list, should self-close

	module.exports = {
	  // http://www.w3.org/TR/SVG/intro.html#TermContainerElement
	  'a': true,
	  'defs': true,
	  'glyph': true,
	  'g': true,
	  'marker': true,
	  'mask': true,
	  'missing-glyph': true,
	  'pattern': true,
	  'svg': true,
	  'switch': true,
	  'symbol': true,

	  // http://www.w3.org/TR/SVG/intro.html#TermDescriptiveElement
	  'desc': true,
	  'metadata': true,
	  'title': true
	};

/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	
	var forOwn = __webpack_require__(103);
	var escape = __webpack_require__(110);
	var union = __webpack_require__(112);

	var parseSelector = __webpack_require__(99);

	// data.attrs, data.props, data.class

	module.exports = function attributes(vnode) {
	  var selector = parseSelector(vnode.sel);
	  var parsedClasses = selector.className.split(' ');

	  var attributes = [];
	  var classes = [];
	  var values = {};

	  if (selector.id) {
	    values.id = selector.id;
	  }

	  setAttributes(vnode.data.props, values);
	  setAttributes(vnode.data.attrs, values); // `attrs` override `props`, not sure if this is good so

	  if (vnode.data.class) {
	    // Omit `className` attribute if `class` is set on vnode
	    values.class = undefined;
	  }
	  forOwn(vnode.data.class, function (value, key) {
	    if (value === true) {
	      classes.push(key);
	    }
	  });
	  classes = union(classes, values.class, parsedClasses).filter(function (x) {
	    return x !== '';
	  });

	  if (classes.length) {
	    values.class = classes.join(' ');
	  }

	  forOwn(values, function (value, key) {
	    attributes.push(value === true ? key : key + '="' + escape(value) + '"');
	  });

	  return attributes.length ? attributes.join(' ') : '';
	};

	function setAttributes(values, target) {
	  forOwn(values, function (value, key) {
	    if (key === 'htmlFor') {
	      target['for'] = value;
	      return;
	    }
	    if (key === 'className') {
	      target['class'] = value.split(' ');
	      return;
	    }
	    if (key === 'innerHTML') {
	      return;
	    }
	    target[key] = value;
	  });
	}

/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseFor = __webpack_require__(104),
	    bindCallback = __webpack_require__(105),
	    keys = __webpack_require__(106);

	/**
	 * The base implementation of `_.forOwn` without support for callback
	 * shorthands and `this` binding.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @returns {Object} Returns `object`.
	 */
	function baseForOwn(object, iteratee) {
	  return baseFor(object, iteratee, keys);
	}

	/**
	 * Creates a function for `_.forOwn` or `_.forOwnRight`.
	 *
	 * @private
	 * @param {Function} objectFunc The function to iterate over an object.
	 * @returns {Function} Returns the new each function.
	 */
	function createForOwn(objectFunc) {
	  return function(object, iteratee, thisArg) {
	    if (typeof iteratee != 'function' || thisArg !== undefined) {
	      iteratee = bindCallback(iteratee, thisArg, 3);
	    }
	    return objectFunc(object, iteratee);
	  };
	}

	/**
	 * Iterates over own enumerable properties of an object invoking `iteratee`
	 * for each property. The `iteratee` is bound to `thisArg` and invoked with
	 * three arguments: (value, key, object). Iteratee functions may exit iteration
	 * early by explicitly returning `false`.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to iterate over.
	 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	 * @param {*} [thisArg] The `this` binding of `iteratee`.
	 * @returns {Object} Returns `object`.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.forOwn(new Foo, function(value, key) {
	 *   console.log(key);
	 * });
	 * // => logs 'a' and 'b' (iteration order is not guaranteed)
	 */
	var forOwn = createForOwn(baseForOwn);

	module.exports = forOwn;


/***/ },
/* 104 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * The base implementation of `baseForIn` and `baseForOwn` which iterates
	 * over `object` properties returned by `keysFunc` invoking `iteratee` for
	 * each property. Iteratee functions may exit iteration early by explicitly
	 * returning `false`.
	 *
	 * @private
	 * @param {Object} object The object to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @returns {Object} Returns `object`.
	 */
	var baseFor = createBaseFor();

	/**
	 * Creates a base function for methods like `_.forIn`.
	 *
	 * @private
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {Function} Returns the new base function.
	 */
	function createBaseFor(fromRight) {
	  return function(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = Object(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (length--) {
	      var key = props[fromRight ? length : ++index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  };
	}

	module.exports = baseFor;


/***/ },
/* 105 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * A specialized version of `baseCallback` which only supports `this` binding
	 * and specifying the number of arguments to provide to `func`.
	 *
	 * @private
	 * @param {Function} func The function to bind.
	 * @param {*} thisArg The `this` binding of `func`.
	 * @param {number} [argCount] The number of arguments to provide to `func`.
	 * @returns {Function} Returns the callback.
	 */
	function bindCallback(func, thisArg, argCount) {
	  if (typeof func != 'function') {
	    return identity;
	  }
	  if (thisArg === undefined) {
	    return func;
	  }
	  switch (argCount) {
	    case 1: return function(value) {
	      return func.call(thisArg, value);
	    };
	    case 3: return function(value, index, collection) {
	      return func.call(thisArg, value, index, collection);
	    };
	    case 4: return function(accumulator, value, index, collection) {
	      return func.call(thisArg, accumulator, value, index, collection);
	    };
	    case 5: return function(value, other, key, object, source) {
	      return func.call(thisArg, value, other, key, object, source);
	    };
	  }
	  return function() {
	    return func.apply(thisArg, arguments);
	  };
	}

	/**
	 * This method returns the first argument provided to it.
	 *
	 * @static
	 * @memberOf _
	 * @category Utility
	 * @param {*} value Any value.
	 * @returns {*} Returns `value`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 *
	 * _.identity(object) === object;
	 * // => true
	 */
	function identity(value) {
	  return value;
	}

	module.exports = bindCallback;


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(107),
	    isArguments = __webpack_require__(108),
	    isArray = __webpack_require__(109);

	/** Used to detect unsigned integer values. */
	var reIsUint = /^\d+$/;

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeKeys = getNative(Object, 'keys');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
	  length = length == null ? MAX_SAFE_INTEGER : length;
	  return value > -1 && value % 1 == 0 && value < length;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * A fallback implementation of `Object.keys` which creates an array of the
	 * own enumerable property names of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function shimKeys(object) {
	  var props = keysIn(object),
	      propsLength = props.length,
	      length = propsLength && object.length;

	  var allowIndexes = !!length && isLength(length) &&
	    (isArray(object) || isArguments(object));

	  var index = -1,
	      result = [];

	  while (++index < propsLength) {
	    var key = props[index];
	    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	var keys = !nativeKeys ? shimKeys : function(object) {
	  var Ctor = object == null ? undefined : object.constructor;
	  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	      (typeof object != 'function' && isArrayLike(object))) {
	    return shimKeys(object);
	  }
	  return isObject(object) ? nativeKeys(object) : [];
	};

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  if (object == null) {
	    return [];
	  }
	  if (!isObject(object)) {
	    object = Object(object);
	  }
	  var length = object.length;
	  length = (length && isLength(length) &&
	    (isArray(object) || isArguments(object)) && length) || 0;

	  var Ctor = object.constructor,
	      index = -1,
	      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
	      result = Array(length),
	      skipIndexes = length > 0;

	  while (++index < length) {
	    result[index] = (index + '');
	  }
	  for (var key in object) {
	    if (!(skipIndexes && isIndex(key, length)) &&
	        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	module.exports = keys;


/***/ },
/* 107 */
/***/ function(module, exports) {

	/**
	 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = getNative;


/***/ },
/* 108 */
/***/ function(module, exports) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */

	/** Used as references for various `Number` constants. */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	function isArguments(value) {
	  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
	  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
	    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
	}

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	/**
	 * This method is like `_.isArrayLike` except that it also checks if `value`
	 * is an object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an array-like object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArrayLikeObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLikeObject(document.body.children);
	 * // => true
	 *
	 * _.isArrayLikeObject('abc');
	 * // => false
	 *
	 * _.isArrayLikeObject(_.noop);
	 * // => false
	 */
	function isArrayLikeObject(value) {
	  return isObjectLike(value) && isArrayLike(value);
	}

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8-9 which returns 'object' for typed array and other constructors.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	module.exports = isArguments;


/***/ },
/* 109 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** `Object#toString` result references. */
	var arrayTag = '[object Array]',
	    funcTag = '[object Function]';

	/** Used to detect host constructors (Safari > 5). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/** Used for native method references. */
	var objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var fnToString = Function.prototype.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objToString = objectProto.toString;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeIsArray = getNative(Array, 'isArray');

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object == null ? undefined : object[key];
	  return isNative(value) ? value : undefined;
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(function() { return arguments; }());
	 * // => false
	 */
	var isArray = nativeIsArray || function(value) {
	  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
	};

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in older versions of Chrome and Safari which return 'function' for regexes
	  // and Safari 8 equivalents which return 'object' for typed array constructors.
	  return isObject(value) && objToString.call(value) == funcTag;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (value == null) {
	    return false;
	  }
	  if (isFunction(value)) {
	    return reIsNative.test(fnToString.call(value));
	  }
	  return isObjectLike(value) && reIsHostCtor.test(value);
	}

	module.exports = isArray;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var root = __webpack_require__(111);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match HTML entities and HTML characters. */
	var reUnescapedHtml = /[&<>"'`]/g,
	    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

	/** Used to map characters to HTML entities. */
	var htmlEscapes = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#39;',
	  '`': '&#96;'
	};

	/**
	 * Used by `_.escape` to convert characters to HTML entities.
	 *
	 * @private
	 * @param {string} chr The matched character to escape.
	 * @returns {string} Returns the escaped character.
	 */
	function escapeHtmlChar(chr) {
	  return htmlEscapes[chr];
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var Symbol = root.Symbol;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = Symbol ? symbolProto.toString : undefined;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value == null) {
	    return '';
	  }
	  if (isSymbol(value)) {
	    return Symbol ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
	 * their corresponding HTML entities.
	 *
	 * **Note:** No other characters are escaped. To escape additional
	 * characters use a third-party library like [_he_](https://mths.be/he).
	 *
	 * Though the ">" character is escaped for symmetry, characters like
	 * ">" and "/" don't need escaping in HTML and have no special meaning
	 * unless they're part of a tag or unquoted attribute value.
	 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
	 * (under "semi-related fun fact") for more details.
	 *
	 * Backticks are escaped because in IE < 9, they can break out of
	 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
	 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
	 * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
	 * for more details.
	 *
	 * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
	 * to reduce XSS vectors.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to escape.
	 * @returns {string} Returns the escaped string.
	 * @example
	 *
	 * _.escape('fred, barney, & pebbles');
	 * // => 'fred, barney, &amp; pebbles'
	 */
	function escape(string) {
	  string = toString(string);
	  return (string && reHasUnescapedHtml.test(string))
	    ? string.replace(reUnescapedHtml, escapeHtmlChar)
	    : string;
	}

	module.exports = escape;


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};

	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;

	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;

	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);

	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);

	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();

	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}

	module.exports = root;

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)(module), (function() { return this; }())))

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseFlatten = __webpack_require__(113),
	    baseUniq = __webpack_require__(114),
	    restParam = __webpack_require__(118);

	/**
	 * Creates an array of unique values, in order, of the provided arrays using
	 * `SameValueZero` for equality comparisons.
	 *
	 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	 * comparisons are like strict equality comparisons, e.g. `===`, except that
	 * `NaN` matches `NaN`.
	 *
	 * @static
	 * @memberOf _
	 * @category Array
	 * @param {...Array} [arrays] The arrays to inspect.
	 * @returns {Array} Returns the new array of combined values.
	 * @example
	 *
	 * _.union([1, 2], [4, 2], [2, 1]);
	 * // => [1, 2, 4]
	 */
	var union = restParam(function(arrays) {
	  return baseUniq(baseFlatten(arrays, false, true));
	});

	module.exports = union;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var isArguments = __webpack_require__(108),
	    isArray = __webpack_require__(109);

	/**
	 * Checks if `value` is object-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
	 * of an array-like value.
	 */
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Appends the elements of `values` to `array`.
	 *
	 * @private
	 * @param {Array} array The array to modify.
	 * @param {Array} values The values to append.
	 * @returns {Array} Returns `array`.
	 */
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	/**
	 * The base implementation of `_.flatten` with added support for restricting
	 * flattening and specifying the start index.
	 *
	 * @private
	 * @param {Array} array The array to flatten.
	 * @param {boolean} [isDeep] Specify a deep flatten.
	 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
	 * @param {Array} [result=[]] The initial result value.
	 * @returns {Array} Returns the new flattened array.
	 */
	function baseFlatten(array, isDeep, isStrict, result) {
	  result || (result = []);

	  var index = -1,
	      length = array.length;

	  while (++index < length) {
	    var value = array[index];
	    if (isObjectLike(value) && isArrayLike(value) &&
	        (isStrict || isArray(value) || isArguments(value))) {
	      if (isDeep) {
	        // Recursively flatten arrays (susceptible to call stack limits).
	        baseFlatten(value, isDeep, isStrict, result);
	      } else {
	        arrayPush(result, value);
	      }
	    } else if (!isStrict) {
	      result[result.length] = value;
	    }
	  }
	  return result;
	}

	/**
	 * The base implementation of `_.property` without support for deep paths.
	 *
	 * @private
	 * @param {string} key The key of the property to get.
	 * @returns {Function} Returns the new function.
	 */
	function baseProperty(key) {
	  return function(object) {
	    return object == null ? undefined : object[key];
	  };
	}

	/**
	 * Gets the "length" property value of `object`.
	 *
	 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
	 * that affects Safari on at least iOS 8.1-8.3 ARM64.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {*} Returns the "length" value.
	 */
	var getLength = baseProperty('length');

	/**
	 * Checks if `value` is array-like.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 */
	function isArrayLike(value) {
	  return value != null && isLength(getLength(value));
	}

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 */
	function isLength(value) {
	  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	module.exports = baseFlatten;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var baseIndexOf = __webpack_require__(115),
	    cacheIndexOf = __webpack_require__(116),
	    createCache = __webpack_require__(117);

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * The base implementation of `_.uniq` without support for callback shorthands
	 * and `this` binding.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {Function} [iteratee] The function invoked per iteration.
	 * @returns {Array} Returns the new duplicate-value-free array.
	 */
	function baseUniq(array, iteratee) {
	  var index = -1,
	      indexOf = baseIndexOf,
	      length = array.length,
	      isCommon = true,
	      isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
	      seen = isLarge ? createCache() : null,
	      result = [];

	  if (seen) {
	    indexOf = cacheIndexOf;
	    isCommon = false;
	  } else {
	    isLarge = false;
	    seen = iteratee ? [] : result;
	  }
	  outer:
	  while (++index < length) {
	    var value = array[index],
	        computed = iteratee ? iteratee(value, index, array) : value;

	    if (isCommon && value === value) {
	      var seenIndex = seen.length;
	      while (seenIndex--) {
	        if (seen[seenIndex] === computed) {
	          continue outer;
	        }
	      }
	      if (iteratee) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	    else if (indexOf(seen, computed, 0) < 0) {
	      if (iteratee || isLarge) {
	        seen.push(computed);
	      }
	      result.push(value);
	    }
	  }
	  return result;
	}

	module.exports = baseUniq;


/***/ },
/* 115 */
/***/ function(module, exports) {

	/**
	 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * The base implementation of `_.indexOf` without support for binary searches.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} value The value to search for.
	 * @param {number} fromIndex The index to search from.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function baseIndexOf(array, value, fromIndex) {
	  if (value !== value) {
	    return indexOfNaN(array, fromIndex);
	  }
	  var index = fromIndex - 1,
	      length = array.length;

	  while (++index < length) {
	    if (array[index] === value) {
	      return index;
	    }
	  }
	  return -1;
	}

	/**
	 * Gets the index at which the first occurrence of `NaN` is found in `array`.
	 * If `fromRight` is provided elements of `array` are iterated from right to left.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {number} fromIndex The index to search from.
	 * @param {boolean} [fromRight] Specify iterating from right to left.
	 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	 */
	function indexOfNaN(array, fromIndex, fromRight) {
	  var length = array.length,
	      index = fromIndex + (fromRight ? 0 : -1);

	  while ((fromRight ? index-- : ++index < length)) {
	    var other = array[index];
	    if (other !== other) {
	      return index;
	    }
	  }
	  return -1;
	}

	module.exports = baseIndexOf;


/***/ },
/* 116 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/**
	 * Checks if `value` is in `cache` mimicking the return signature of
	 * `_.indexOf` by returning `0` if the value is found, else `-1`.
	 *
	 * @private
	 * @param {Object} cache The cache to search.
	 * @param {*} value The value to search for.
	 * @returns {number} Returns `0` if `value` is found, else `-1`.
	 */
	function cacheIndexOf(cache, value) {
	  var data = cache.data,
	      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

	  return result ? 0 : -1;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	module.exports = cacheIndexOf;


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var getNative = __webpack_require__(107);

	/** Native method references. */
	var Set = getNative(global, 'Set');

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeCreate = getNative(Object, 'create');

	/**
	 *
	 * Creates a cache object to store unique values.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var length = values ? values.length : 0;

	  this.data = { 'hash': nativeCreate(null), 'set': new Set };
	  while (length--) {
	    this.push(values[length]);
	  }
	}

	/**
	 * Adds `value` to the cache.
	 *
	 * @private
	 * @name push
	 * @memberOf SetCache
	 * @param {*} value The value to cache.
	 */
	function cachePush(value) {
	  var data = this.data;
	  if (typeof value == 'string' || isObject(value)) {
	    data.set.add(value);
	  } else {
	    data.hash[value] = true;
	  }
	}

	/**
	 * Creates a `Set` cache object to optimize linear searches of large arrays.
	 *
	 * @private
	 * @param {Array} [values] The values to cache.
	 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	 */
	function createCache(values) {
	  return (nativeCreate && Set) ? new SetCache(values) : null;
	}

	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}

	// Add functions to the `Set` cache.
	SetCache.prototype.push = cachePush;

	module.exports = createCache;

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 118 */
/***/ function(module, exports) {

	/**
	 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */

	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';

	/* Native method references for those with the same name as other `lodash` methods. */
	var nativeMax = Math.max;

	/**
	 * Creates a function that invokes `func` with the `this` binding of the
	 * created function and arguments from `start` and beyond provided as an array.
	 *
	 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
	 *
	 * @static
	 * @memberOf _
	 * @category Function
	 * @param {Function} func The function to apply a rest parameter to.
	 * @param {number} [start=func.length-1] The start position of the rest parameter.
	 * @returns {Function} Returns the new function.
	 * @example
	 *
	 * var say = _.restParam(function(what, names) {
	 *   return what + ' ' + _.initial(names).join(', ') +
	 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
	 * });
	 *
	 * say('hello', 'fred', 'barney', 'pebbles');
	 * // => 'hello fred, barney, & pebbles'
	 */
	function restParam(func, start) {
	  if (typeof func != 'function') {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
	  return function() {
	    var args = arguments,
	        index = -1,
	        length = nativeMax(args.length - start, 0),
	        rest = Array(length);

	    while (++index < length) {
	      rest[index] = args[start + index];
	    }
	    switch (start) {
	      case 0: return func.call(this, rest);
	      case 1: return func.call(this, args[0], rest);
	      case 2: return func.call(this, args[0], args[1], rest);
	    }
	    var otherArgs = Array(start + 1);
	    index = -1;
	    while (++index < start) {
	      otherArgs[index] = args[index];
	    }
	    otherArgs[start] = rest;
	    return func.apply(this, otherArgs);
	  };
	}

	module.exports = restParam;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var forOwn = __webpack_require__(103);
	var escape = __webpack_require__(110);
	var kebabCase = __webpack_require__(120);

	// data.style

	module.exports = function style(vnode) {
	  var styles = [];
	  var style = vnode.data.style || {};

	  // merge in `delayed` properties
	  if (style.delayed) {
	    _extends(style, style.delayed);
	  }

	  forOwn(style, function (value, key) {
	    // omit hook objects
	    if (typeof value === 'string') {
	      styles.push(kebabCase(key) + ': ' + escape(value));
	    }
	  });

	  return styles.length ? 'style="' + styles.join('; ') + '"' : '';
	};

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var deburr = __webpack_require__(121),
	    words = __webpack_require__(122);

	/**
	 * A specialized version of `_.reduce` for arrays without support for
	 * iteratee shorthands.
	 *
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} iteratee The function invoked per iteration.
	 * @param {*} [accumulator] The initial value.
	 * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
	 * @returns {*} Returns the accumulated value.
	 */
	function arrayReduce(array, iteratee, accumulator, initAccum) {
	  var index = -1,
	      length = array.length;

	  if (initAccum && length) {
	    accumulator = array[++index];
	  }
	  while (++index < length) {
	    accumulator = iteratee(accumulator, array[index], index, array);
	  }
	  return accumulator;
	}

	/**
	 * Creates a function like `_.camelCase`.
	 *
	 * @private
	 * @param {Function} callback The function to combine each word.
	 * @returns {Function} Returns the new compounder function.
	 */
	function createCompounder(callback) {
	  return function(string) {
	    return arrayReduce(words(deburr(string)), callback, '');
	  };
	}

	/**
	 * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to convert.
	 * @returns {string} Returns the kebab cased string.
	 * @example
	 *
	 * _.kebabCase('Foo Bar');
	 * // => 'foo-bar'
	 *
	 * _.kebabCase('fooBar');
	 * // => 'foo-bar'
	 *
	 * _.kebabCase('__foo_bar__');
	 * // => 'foo-bar'
	 */
	var kebabCase = createCompounder(function(result, word, index) {
	  return result + (index ? '-' : '') + word.toLowerCase();
	});

	module.exports = kebabCase;


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var root = __webpack_require__(111);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to match latin-1 supplementary letters (excluding mathematical operators). */
	var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

	/** Used to compose unicode character classes. */
	var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	    rsComboSymbolsRange = '\\u20d0-\\u20f0';

	/** Used to compose unicode capture groups. */
	var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';

	/**
	 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
	 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
	 */
	var reComboMark = RegExp(rsCombo, 'g');

	/** Used to map latin-1 supplementary letters to basic latin letters. */
	var deburredLetters = {
	  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
	  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
	  '\xc7': 'C',  '\xe7': 'c',
	  '\xd0': 'D',  '\xf0': 'd',
	  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
	  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
	  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
	  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
	  '\xd1': 'N',  '\xf1': 'n',
	  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
	  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
	  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
	  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
	  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
	  '\xc6': 'Ae', '\xe6': 'ae',
	  '\xde': 'Th', '\xfe': 'th',
	  '\xdf': 'ss'
	};

	/**
	 * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
	 *
	 * @private
	 * @param {string} letter The matched letter to deburr.
	 * @returns {string} Returns the deburred letter.
	 */
	function deburrLetter(letter) {
	  return deburredLetters[letter];
	}

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var Symbol = root.Symbol;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = Symbol ? symbolProto.toString : undefined;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value == null) {
	    return '';
	  }
	  if (isSymbol(value)) {
	    return Symbol ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
	 * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to deburr.
	 * @returns {string} Returns the deburred string.
	 * @example
	 *
	 * _.deburr('déjà vu');
	 * // => 'deja vu'
	 */
	function deburr(string) {
	  string = toString(string);
	  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
	}

	module.exports = deburr;


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	var root = __webpack_require__(111);

	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;

	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';

	/** Used to compose unicode character classes. */
	var rsAstralRange = '\\ud800-\\udfff',
	    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
	    rsComboSymbolsRange = '\\u20d0-\\u20f0',
	    rsDingbatRange = '\\u2700-\\u27bf',
	    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
	    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
	    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
	    rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
	    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
	    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
	    rsVarRange = '\\ufe0e\\ufe0f',
	    rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;

	/** Used to compose unicode capture groups. */
	var rsBreak = '[' + rsBreakRange + ']',
	    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
	    rsDigits = '\\d+',
	    rsDingbat = '[' + rsDingbatRange + ']',
	    rsLower = '[' + rsLowerRange + ']',
	    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
	    rsFitz = '\\ud83c[\\udffb-\\udfff]',
	    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
	    rsNonAstral = '[^' + rsAstralRange + ']',
	    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
	    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
	    rsUpper = '[' + rsUpperRange + ']',
	    rsZWJ = '\\u200d';

	/** Used to compose unicode regexes. */
	var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
	    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
	    reOptMod = rsModifier + '?',
	    rsOptVar = '[' + rsVarRange + ']?',
	    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
	    rsSeq = rsOptVar + reOptMod + rsOptJoin,
	    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

	/** Used to match non-compound words composed of alphanumeric characters. */
	var reBasicWord = /[a-zA-Z0-9]+/g;

	/** Used to match complex or compound words. */
	var reComplexWord = RegExp([
	  rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
	  rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
	  rsUpper + '?' + rsLowerMisc + '+',
	  rsUpper + '+',
	  rsDigits,
	  rsEmoji
	].join('|'), 'g');

	/** Used to detect strings that need a more robust regexp to match words. */
	var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;

	/** Built-in value references. */
	var Symbol = root.Symbol;

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = Symbol ? symbolProto.toString : undefined;

	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}

	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}

	/**
	 * Converts `value` to a string if it's not one. An empty string is returned
	 * for `null` and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (value == null) {
	    return '';
	  }
	  if (isSymbol(value)) {
	    return Symbol ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}

	/**
	 * Splits `string` into an array of its words.
	 *
	 * @static
	 * @memberOf _
	 * @category String
	 * @param {string} [string=''] The string to inspect.
	 * @param {RegExp|string} [pattern] The pattern to match words.
	 * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
	 * @returns {Array} Returns the words of `string`.
	 * @example
	 *
	 * _.words('fred, barney, & pebbles');
	 * // => ['fred', 'barney', 'pebbles']
	 *
	 * _.words('fred, barney, & pebbles', /[^, ]+/g);
	 * // => ['fred', 'barney', '&', 'pebbles']
	 */
	function words(string, pattern, guard) {
	  string = toString(string);
	  pattern = guard ? undefined : pattern;

	  if (pattern === undefined) {
	    pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
	  }
	  return string.match(pattern) || [];
	}

	module.exports = words;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_adapter_1 = __webpack_require__(3);
	var xstream_1 = __webpack_require__(4);
	var SCOPE_PREFIX = '___';
	var MockedDOMSource = (function () {
	    function MockedDOMSource(_streamAdapter, _mockConfig) {
	        this._streamAdapter = _streamAdapter;
	        this._mockConfig = _mockConfig;
	        if (_mockConfig.elements) {
	            this._elements = _mockConfig.elements;
	        }
	        else {
	            this._elements = _streamAdapter.adapt(xstream_1.default.empty(), xstream_adapter_1.default.streamSubscribe);
	        }
	    }
	    MockedDOMSource.prototype.elements = function () {
	        var out = this._elements;
	        out._isCycleSource = 'MockedDOM';
	        return out;
	    };
	    MockedDOMSource.prototype.events = function (eventType, options) {
	        var mockConfig = this._mockConfig;
	        var keys = Object.keys(mockConfig);
	        var keysLen = keys.length;
	        for (var i = 0; i < keysLen; i++) {
	            var key = keys[i];
	            if (key === eventType) {
	                var out_1 = mockConfig[key];
	                out_1._isCycleSource = 'MockedDOM';
	                return out_1;
	            }
	        }
	        var out = this._streamAdapter.adapt(xstream_1.default.empty(), xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = 'MockedDOM';
	        return out;
	    };
	    MockedDOMSource.prototype.select = function (selector) {
	        var mockConfig = this._mockConfig;
	        var keys = Object.keys(mockConfig);
	        var keysLen = keys.length;
	        for (var i = 0; i < keysLen; i++) {
	            var key = keys[i];
	            if (key === selector) {
	                return new MockedDOMSource(this._streamAdapter, mockConfig[key]);
	            }
	        }
	        return new MockedDOMSource(this._streamAdapter, {});
	    };
	    MockedDOMSource.prototype.isolateSource = function (source, scope) {
	        return source.select('.' + SCOPE_PREFIX + scope);
	    };
	    MockedDOMSource.prototype.isolateSink = function (sink, scope) {
	        return sink.map(function (vnode) {
	            if (vnode.sel && vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
	                return vnode;
	            }
	            else {
	                vnode.sel += "." + SCOPE_PREFIX + scope;
	                return vnode;
	            }
	        });
	    };
	    return MockedDOMSource;
	}());
	exports.MockedDOMSource = MockedDOMSource;
	function mockDOMSource(streamAdapter, mockConfig) {
	    return new MockedDOMSource(streamAdapter, mockConfig);
	}
	exports.mockDOMSource = mockDOMSource;
	//# sourceMappingURL=mockDOMSource.js.map

/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var hyperscript_1 = __webpack_require__(29);
	function isValidString(param) {
	    return typeof param === 'string' && param.length > 0;
	}
	function isSelector(param) {
	    return isValidString(param) && (param[0] === '.' || param[0] === '#');
	}
	function createTagFunction(tagName) {
	    return function hyperscript(first, b, c) {
	        if (isSelector(first)) {
	            if (typeof b !== 'undefined' && typeof c !== 'undefined') {
	                return hyperscript_1.h(tagName + first, b, c);
	            }
	            else if (typeof b !== 'undefined') {
	                return hyperscript_1.h(tagName + first, b);
	            }
	            else {
	                return hyperscript_1.h(tagName + first, {});
	            }
	        }
	        else if (!!b) {
	            return hyperscript_1.h(tagName, first, b);
	        }
	        else if (!!first) {
	            return hyperscript_1.h(tagName, first);
	        }
	        else {
	            return hyperscript_1.h(tagName, {});
	        }
	    };
	}
	var SVG_TAG_NAMES = [
	    'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
	    'animateMotion', 'animateTransform', 'circle', 'clipPath', 'colorProfile',
	    'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
	    'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
	    'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
	    'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
	    'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
	    'feSpotlight', 'feTile', 'feTurbulence', 'filter', 'font', 'fontFace',
	    'fontFaceFormat', 'fontFaceName', 'fontFaceSrc', 'fontFaceUri',
	    'foreignObject', 'g', 'glyph', 'glyphRef', 'hkern', 'image', 'line',
	    'linearGradient', 'marker', 'mask', 'metadata', 'missingGlyph', 'mpath',
	    'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'script',
	    'set', 'stop', 'style', 'switch', 'symbol', 'text', 'textPath', 'title',
	    'tref', 'tspan', 'use', 'view', 'vkern',
	];
	var svg = createTagFunction('svg');
	SVG_TAG_NAMES.forEach(function (tag) {
	    svg[tag] = createTagFunction(tag);
	});
	var TAG_NAMES = [
	    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
	    'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
	    'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl',
	    'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
	    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
	    'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
	    'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript',
	    'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'progress', 'q',
	    'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small',
	    'source', 'span', 'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td',
	    'textarea', 'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video',
	];
	var exported = { SVG_TAG_NAMES: SVG_TAG_NAMES, TAG_NAMES: TAG_NAMES, svg: svg, isSelector: isSelector, createTagFunction: createTagFunction };
	TAG_NAMES.forEach(function (n) {
	    exported[n] = createTagFunction(n);
	});
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = exported;
	//# sourceMappingURL=hyperscript-helpers.js.map

/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.DHExtension = exports.tab = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _dom = __webpack_require__(10);

	var _isolate = __webpack_require__(311);

	var _isolate2 = _interopRequireDefault(_isolate);

	var _collection = __webpack_require__(312);

	var _collection2 = _interopRequireDefault(_collection);

	var _xstream = __webpack_require__(4);

	var _xstream2 = _interopRequireDefault(_xstream);

	var _sniffer = __webpack_require__(317);

	var _memepool = __webpack_require__(318);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var constructSelectors = function constructSelectors(selected, data) {
	  return data.map(function (k, i) {
	    return (0, _dom.div)('.navBtn ' + (selected == i ? ".selected" : ""), { attrs: { ref: i } }, k.name);
	  });
	};

	var constructView = function constructView(selected, data) {
	  return [(0, _dom.div)("." + data[selected].name, data[selected].data)];
	};

	var tab = exports.tab = function tab(name, data) {
	  return {
	    name: name,
	    data: data
	  };
	};

	var Tab = function Tab(sources) {
	  console.log("new tab");
	  console.log(sources);

	  var state$ = sources.props.debug("props");

	  var selector$ = state$.map(function (state) {
	    return (0, _dom.div)({
	      class: {
	        navBtn: true,
	        selected: state.selected
	      },
	      attrs: {
	        ref: state.index
	      }
	    }, state.name);
	  });

	  var defaultView$ = state$.filter(function (state) {
	    return state.selected;
	  }).map(function (state) {
	    return (0, _dom.div)(state.name);
	  });

	  var snifferView$ = (0, _sniffer.Sniffer)(sources).DOM;

	  var view$ = _xstream2.default.combine(state$, defaultView$, snifferView$).filter(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 1),
	        state = _ref2[0];

	    return state.selected;
	  }).map(function (_ref3) {
	    var _ref4 = _slicedToArray(_ref3, 3),
	        state = _ref4[0],
	        def = _ref4[1],
	        sniffer = _ref4[2];

	    return state.type === "sniffer" ? sniffer : def;
	  });

	  // const selector$ = sources.props.map(_ => div("omg"));
	  return {
	    selector$: selector$, // TODO - better name
	    view$: view$
	    // select$
	  };
	};

	var DHExtension = exports.DHExtension = function DHExtension(sources) {
	  // Selected tab
	  var memepool = (0, _memepool.Memepool)(sources);

	  sources.memepool$ = memepool.state$;

	  var select$ = sources.DOM.select('.navBtn').events('click').map(function (e) {
	    return e.target.getAttribute('ref');
	  }).startWith("tab1").debug("select");

	  var state$ = select$.map(function (id) {
	    return [{
	      id: "tab1",
	      props: {
	        index: "tab1",
	        name: "address",
	        type: "asd",
	        selected: id === "tab1"
	      }
	    }, {
	      id: "tab2",
	      props: {
	        index: "tab2",
	        name: "sniffer",
	        type: "sniffer",
	        selected: id === "tab2"
	      }
	    }];
	  }).debug("state");

	  // console.log(selected$, xs.of("tab1"));
	  // sources.selected$ = selected$;
	  // sources.selected$ = xs.of("tab1")
	  // sources.selected = select$;

	  var tab$ = _collection2.default.gather(Tab, sources, state$);

	  var tabSelectors$ = _collection2.default.pluck(tab$, function (tab) {
	    return tab.selector$;
	  });

	  var mainView$ = _collection2.default.merge(tab$, function (tab) {
	    return tab.view$;
	  });

	  var vdom$ = _xstream2.default.combine(tabSelectors$, mainView$).map(function (_ref5) {
	    var _ref6 = _slicedToArray(_ref5, 2),
	        tabs = _ref6[0],
	        view = _ref6[1];

	    return (0, _dom.div)(".treeview", [(0, _dom.div)('.selectView', tabs), (0, _dom.div)('.mainView', [view])]);
	  });

	  return {
	    DOM: vdom$,
	    HTTP: memepool.HTTP
	  };
	};

/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * HTTP Driver factory.
	 *
	 * This is a function which, when called, returns a HTTP Driver for Cycle.js
	 * apps. The driver is also a function, and it takes a stream of requests as
	 * input, and outputs an HTTP Source, an object with some functions to query for
	 * response streams.
	 *
	 * **Requests**. The stream of requests should emit either strings or objects.
	 * If the stream emits strings, those should be the URL of the remote resource
	 * over HTTP. If the stream emits objects, these should be instructions how
	 * superagent should execute the request. These objects follow a structure
	 * similar to superagent's request API itself. `request` object properties:
	 *
	 * - `url` *(String)*: the remote resource path. **required**
	 * - `method` *(String)*: HTTP Method for the request (GET, POST, PUT, etc).
	 * - `category` *(String)*: an optional and arbitrary key that may be used in
	 * the HTTP Source when querying for the response. E.g.
	 * `sources.http.select(category)`
	 * - `query` *(Object)*: an object with the payload for `GET` or `POST`.
	 * - `send` *(Object)*: an object with the payload for `POST`.
	 * - `headers` *(Object)*: object specifying HTTP headers.
	 * - `accept` *(String)*: the Accept header.
	 * - `type` *(String)*: a short-hand for setting Content-Type.
	 * - `user` *(String)*: username for authentication.
	 * - `password` *(String)*: password for authentication.
	 * - `field` *(Object)*: object where key/values are Form fields.
	 * - `progress` *(Boolean)*: whether or not to detect and emit progress events
	 * on the response Observable.
	 * - `attach` *(Array)*: array of objects, where each object specifies `name`,
	 * `path`, and `filename` of a resource to upload.
	 * - `withCredentials` *(Boolean)*: enables the ability to send cookies from the
	 * origin.
	 * - `agent` *(Object)*: an object specifying `cert` and `key` for SSL
	 * certificate authentication.
	 * - `redirects` *(Number)*: number of redirects to follow.
	 * - `lazy` *(Boolean)*: whether or not this request runs lazily, which means
	 * the request happens if and only if its corresponding response stream from the
	 * HTTP Source is subscribed to. By default this value is false: requests run
	 * eagerly, even if their response is ignored by the application.
	 *
	 * **Responses**. A metastream is a stream that emits streams. The HTTP Source
	 * manages response metastreams. These streams of responses have a `request`
	 * field attached to them (to the stream object itself) indicating which request
	 * (from the driver input) generated this response streams. The HTTP Source has
	 * functions `filter()` and `select()`, but is not itself a stream. So you can
	 * call `sources.HTTP.filter(request => request.url === X)` to get a new HTTP
	 * Source object which is filtered for response streams that match the condition
	 * given, and may call `sources.HTTP.select(category)` to get a metastream of
	 * response that match the category key. With an HTTP Source, you can also call
	 * `httpSource.select()` with no param to get the metastream. You should flatten
	 * the metastream before consuming it, then the resulting response stream will
	 * emit the response object received through superagent.
	 *
	 * @return {Function} the HTTP Driver function
	 * @function makeHTTPDriver
	 */
	var http_driver_1 = __webpack_require__(127);
	exports.makeHTTPDriver = http_driver_1.makeHTTPDriver;
	//# sourceMappingURL=index.js.map

/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var xstream_1 = __webpack_require__(4);
	var MainHTTPSource_1 = __webpack_require__(128);
	var xstream_adapter_1 = __webpack_require__(3);
	var superagent = __webpack_require__(130);
	function preprocessReqOptions(reqOptions) {
	    reqOptions.withCredentials = reqOptions.withCredentials || false;
	    reqOptions.redirects = typeof reqOptions.redirects === 'number' ? reqOptions.redirects : 5;
	    reqOptions.method = reqOptions.method || "get";
	    return reqOptions;
	}
	function optionsToSuperagent(rawReqOptions) {
	    var reqOptions = preprocessReqOptions(rawReqOptions);
	    if (typeof reqOptions.url !== "string") {
	        throw new Error("Please provide a `url` property in the request options.");
	    }
	    var lowerCaseMethod = (reqOptions.method || 'GET').toLowerCase();
	    var sanitizedMethod = lowerCaseMethod === "delete" ? "del" : lowerCaseMethod;
	    var request = superagent[sanitizedMethod](reqOptions.url);
	    if (typeof request.redirects === "function") {
	        request = request.redirects(reqOptions.redirects);
	    }
	    if (reqOptions.type) {
	        request = request.type(reqOptions.type);
	    }
	    if (reqOptions.send) {
	        request = request.send(reqOptions.send);
	    }
	    if (reqOptions.accept) {
	        request = request.accept(reqOptions.accept);
	    }
	    if (reqOptions.query) {
	        request = request.query(reqOptions.query);
	    }
	    if (reqOptions.withCredentials) {
	        request = request.withCredentials();
	    }
	    if (reqOptions.agent) {
	        request = request.key(reqOptions.agent.key);
	        request = request.cert(reqOptions.agent.cert);
	    }
	    if (typeof reqOptions.user === 'string' && typeof reqOptions.password === 'string') {
	        request = request.auth(reqOptions.user, reqOptions.password);
	    }
	    if (reqOptions.headers) {
	        for (var key in reqOptions.headers) {
	            if (reqOptions.headers.hasOwnProperty(key)) {
	                request = request.set(key, reqOptions.headers[key]);
	            }
	        }
	    }
	    if (reqOptions.field) {
	        for (var key in reqOptions.field) {
	            if (reqOptions.field.hasOwnProperty(key)) {
	                request = request.field(key, reqOptions.field[key]);
	            }
	        }
	    }
	    if (reqOptions.attach) {
	        for (var i = reqOptions.attach.length - 1; i >= 0; i--) {
	            var a = reqOptions.attach[i];
	            request = request.attach(a.name, a.path, a.filename);
	        }
	    }
	    return request;
	}
	exports.optionsToSuperagent = optionsToSuperagent;
	function createResponse$(reqInput) {
	    return xstream_1.default.create({
	        start: function startResponseStream(listener) {
	            try {
	                var reqOptions_1 = normalizeRequestInput(reqInput);
	                this.request = optionsToSuperagent(reqOptions_1);
	                if (reqOptions_1.progress) {
	                    this.request = this.request.on('progress', function (res) {
	                        res.request = reqOptions_1;
	                        listener.next(res);
	                    });
	                }
	                this.request.end(function (err, res) {
	                    if (err) {
	                        listener.error(err);
	                    }
	                    else {
	                        res.request = reqOptions_1;
	                        listener.next(res);
	                        listener.complete();
	                    }
	                });
	            }
	            catch (err) {
	                listener.error(err);
	            }
	        },
	        stop: function stopResponseStream() {
	            if (this.request && this.request.abort) {
	                this.request.abort();
	            }
	        },
	    });
	}
	exports.createResponse$ = createResponse$;
	function softNormalizeRequestInput(reqInput) {
	    var reqOptions;
	    try {
	        reqOptions = normalizeRequestInput(reqInput);
	    }
	    catch (err) {
	        reqOptions = { url: 'Error', _error: err };
	    }
	    return reqOptions;
	}
	function normalizeRequestInput(reqOptions) {
	    if (typeof reqOptions === 'string') {
	        return { url: reqOptions };
	    }
	    else if (typeof reqOptions === 'object') {
	        return reqOptions;
	    }
	    else {
	        throw new Error("Observable of requests given to HTTP Driver must emit " +
	            "either URL strings or objects with parameters.");
	    }
	}
	function makeRequestInputToResponse$(runStreamAdapter) {
	    return function requestInputToResponse$(reqInput) {
	        var response$ = createResponse$(reqInput).remember();
	        var reqOptions = softNormalizeRequestInput(reqInput);
	        if (!reqOptions.lazy) {
	            response$.addListener({ next: function () { }, error: function () { }, complete: function () { } });
	        }
	        response$ = (runStreamAdapter) ?
	            runStreamAdapter.adapt(response$, xstream_adapter_1.default.streamSubscribe) :
	            response$;
	        Object.defineProperty(response$, 'request', {
	            value: reqOptions,
	            writable: false,
	        });
	        return response$;
	    };
	}
	function makeHTTPDriver() {
	    function httpDriver(request$, runSA, name) {
	        var response$$ = request$
	            .map(makeRequestInputToResponse$(runSA));
	        var httpSource = new MainHTTPSource_1.MainHTTPSource(response$$, runSA, name, []);
	        response$$.addListener({ next: function () { }, error: function () { }, complete: function () { } });
	        return httpSource;
	    }
	    httpDriver.streamAdapter = xstream_adapter_1.default;
	    return httpDriver;
	}
	exports.makeHTTPDriver = makeHTTPDriver;
	//# sourceMappingURL=http-driver.js.map

/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var isolate_1 = __webpack_require__(129);
	var xstream_adapter_1 = __webpack_require__(3);
	var MainHTTPSource = (function () {
	    function MainHTTPSource(_res$$, runStreamAdapter, _name, _namespace) {
	        if (_namespace === void 0) { _namespace = []; }
	        this._res$$ = _res$$;
	        this.runStreamAdapter = runStreamAdapter;
	        this._name = _name;
	        this._namespace = _namespace;
	        this.isolateSource = isolate_1.isolateSource;
	        this.isolateSink = isolate_1.isolateSink;
	    }
	    MainHTTPSource.prototype.filter = function (predicate) {
	        var filteredResponse$$ = this._res$$.filter(function (r$) { return predicate(r$.request); });
	        return new MainHTTPSource(filteredResponse$$, this.runStreamAdapter, this._name, this._namespace);
	    };
	    MainHTTPSource.prototype.select = function (category) {
	        var res$$ = this._res$$;
	        if (category) {
	            res$$ = this._res$$
	                .filter(function (res$) { return res$.request && res$.request.category === category; });
	        }
	        var out = this.runStreamAdapter.adapt(res$$, xstream_adapter_1.default.streamSubscribe);
	        out._isCycleSource = this._name;
	        return out;
	    };
	    return MainHTTPSource;
	}());
	exports.MainHTTPSource = MainHTTPSource;
	//# sourceMappingURL=MainHTTPSource.js.map

/***/ },
/* 129 */
/***/ function(module, exports) {

	"use strict";
	function isolateSource(httpSource, scope) {
	    return httpSource.filter(function (request) {
	        return Array.isArray(request._namespace) &&
	            request._namespace.indexOf(scope) !== -1;
	    });
	}
	exports.isolateSource = isolateSource;
	function isolateSink(request$, scope) {
	    return request$.map(function (req) {
	        if (typeof req === 'string') {
	            return { url: req, _namespace: [scope] };
	        }
	        req._namespace = req._namespace || [];
	        req._namespace.push(scope);
	        return req;
	    });
	}
	exports.isolateSink = isolateSink;
	//# sourceMappingURL=isolate.js.map

/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Root reference for iframes.
	 */

	var root;
	if (typeof window !== 'undefined') { // Browser window
	  root = window;
	} else if (typeof self !== 'undefined') { // Web Worker
	  root = self;
	} else { // Other environments
	  console.warn("Using browser-only version of superagent in non-browser environment");
	  root = this;
	}

	var Emitter = __webpack_require__(131);
	var requestBase = __webpack_require__(132);
	var isObject = __webpack_require__(133);

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Expose `request`.
	 */

	var request = module.exports = __webpack_require__(134).bind(null, Request);

	/**
	 * Determine XHR.
	 */

	request.getXHR = function () {
	  if (root.XMLHttpRequest
	      && (!root.location || 'file:' != root.location.protocol
	          || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  throw Error("Browser-only verison of superagent could not find XHR");
	};

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    pushEncodedKeyValuePair(pairs, key, obj[key]);
	  }
	  return pairs.join('&');
	}

	/**
	 * Helps 'serialize' with serializing arrays.
	 * Mutates the pairs array.
	 *
	 * @param {Array} pairs
	 * @param {String} key
	 * @param {Mixed} val
	 */

	function pushEncodedKeyValuePair(pairs, key, val) {
	  if (val != null) {
	    if (Array.isArray(val)) {
	      val.forEach(function(v) {
	        pushEncodedKeyValuePair(pairs, key, v);
	      });
	    } else if (isObject(val)) {
	      for(var subkey in val) {
	        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
	      }
	    } else {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(val));
	    }
	  } else if (val === null) {
	    pairs.push(encodeURIComponent(key));
	  }
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var pair;
	  var pos;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    pos = pair.indexOf('=');
	    if (pos == -1) {
	      obj[decodeURIComponent(pair)] = '';
	    } else {
	      obj[decodeURIComponent(pair.slice(0, pos))] =
	        decodeURIComponent(pair.slice(pos + 1));
	    }
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Check if `mime` is json or has +json structured syntax suffix.
	 *
	 * @param {String} mime
	 * @return {Boolean}
	 * @api private
	 */

	function isJSON(mime) {
	  return /[\/+]json\b/.test(mime);
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return str.split(/ *; */).reduce(function(obj, str){
	    var parts = str.split(/ *= */),
	        key = parts.shift(),
	        val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  // responseText is accessible only if responseType is '' or 'text' and on older browsers
	  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
	     ? this.xhr.responseText
	     : null;
	  this.statusText = this.req.xhr.statusText;
	  this._setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this._setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this._parseBody(this.text ? this.text : this.xhr.response)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype._setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype._parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!parse && isJSON(this.type)) {
	    parse = request.parse['application/json'];
	  }
	  return parse && str && (str.length || str instanceof Object)
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype._setStatusProperties = function(status){
	  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
	  if (status === 1223) {
	    status = 204;
	  }

	  var type = status / 100 | 0;

	  // status / class
	  this.status = this.statusCode = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {}; // preserves header name case
	  this._header = {}; // coerces header names to lowercase
	  this.on('end', function(){
	    var err = null;
	    var res = null;

	    try {
	      res = new Response(self);
	    } catch(e) {
	      err = new Error('Parser is unable to parse the response');
	      err.parse = true;
	      err.original = e;
	      // issue #675: return the raw response if the response parsing fails
	      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
	      // issue #876: return the http status code if the response parsing fails
	      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
	      return self.callback(err);
	    }

	    self.emit('response', res);

	    var new_err;
	    try {
	      if (res.status < 200 || res.status >= 300) {
	        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
	        new_err.original = err;
	        new_err.response = res;
	        new_err.status = res.status;
	      }
	    } catch(e) {
	      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
	    }

	    // #1000 don't catch errors from the callback to avoid double calling it
	    if (new_err) {
	      self.callback(new_err, res);
	    } else {
	      self.callback(null, res);
	    }
	  });
	}

	/**
	 * Mixin `Emitter` and `requestBase`.
	 */

	Emitter(Request.prototype);
	for (var key in requestBase) {
	  Request.prototype[key] = requestBase[key];
	}

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
	 * 'arraybuffer'.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .responseType('blob')
	 *        .end(callback);
	 *
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.responseType = function(val){
	  this._responseType = val;
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass, options){
	  if (!options) {
	    options = {
	      type: 'basic'
	    }
	  }

	  switch (options.type) {
	    case 'basic':
	      var str = btoa(user + ':' + pass);
	      this.set('Authorization', 'Basic ' + str);
	    break;

	    case 'auto':
	      this.username = user;
	      this.password = pass;
	    break;
	  }
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  this._getFormData().append(field, file, filename || file.name);
	  return this;
	};

	Request.prototype._getFormData = function(){
	  if (!this._formData) {
	    this._formData = new root.FormData();
	  }
	  return this._formData;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  this.clearTimeout();
	  fn(err, res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
	  err.crossDomain = true;

	  err.status = this.status;
	  err.method = this.method;
	  err.url = this.url;

	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype._timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Compose querystring to append to req.url
	 *
	 * @api private
	 */

	Request.prototype._appendQueryString = function(){
	  var query = this._query.join('&');
	  if (query) {
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = request.getXHR();
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;

	    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
	    // result in the error "Could not complete the operation due to error c00c023f"
	    var status;
	    try { status = xhr.status } catch(e) { status = 0; }

	    if (0 == status) {
	      if (self.timedout) return self._timeoutError();
	      if (self._aborted) return;
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  var handleProgress = function(direction, e) {
	    if (e.total > 0) {
	      e.percent = e.loaded / e.total * 100;
	    }
	    e.direction = direction;
	    self.emit('progress', e);
	  }
	  if (this.hasListeners('progress')) {
	    try {
	      xhr.onprogress = handleProgress.bind(null, 'download');
	      if (xhr.upload) {
	        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
	      }
	    } catch(e) {
	      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
	      // Reported here:
	      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
	    }
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.timedout = true;
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  this._appendQueryString();

	  // initiate request
	  if (this.username && this.password) {
	    xhr.open(this.method, this.url, true, this.username, this.password);
	  } else {
	    xhr.open(this.method, this.url, true);
	  }

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
	    // serialize stuff
	    var contentType = this._header['content-type'];
	    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
	    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  if (this._responseType) {
	    xhr.responseType = this._responseType;
	  }

	  // send stuff
	  this.emit('request', this);

	  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
	  // We need null here if data is undefined
	  xhr.send(typeof data !== 'undefined' ? data : null);
	  return this;
	};


	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * OPTIONS query to `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.options = function(url, data, fn){
	  var req = request('OPTIONS', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	function del(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	request['del'] = del;
	request['delete'] = del;

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} [data]
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} [data] or fn
	 * @param {Function} [fn]
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Module of mixed-in functions shared between node and client code
	 */
	var isObject = __webpack_require__(133);

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.clearTimeout = function _clearTimeout(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Override default response body parser
	 *
	 * This function will be called to convert incoming data into request.body
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.parse = function parse(fn){
	  this._parser = fn;
	  return this;
	};

	/**
	 * Override default request body serializer
	 *
	 * This function will be called to convert data set via .send or .attach into payload to send
	 *
	 * @param {Function}
	 * @api public
	 */

	exports.serialize = function serialize(fn){
	  this._serializer = fn;
	  return this;
	};

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.timeout = function timeout(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Promise support
	 *
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @return {Request}
	 */

	exports.then = function then(resolve, reject) {
	  if (!this._fullfilledPromise) {
	    var self = this;
	    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
	      self.end(function(err, res){
	        if (err) innerReject(err); else innerResolve(res);
	      });
	    });
	  }
	  return this._fullfilledPromise.then(resolve, reject);
	}

	exports.catch = function(cb) {
	  return this.then(undefined, cb);
	};

	/**
	 * Allow for extension
	 */

	exports.use = function use(fn) {
	  fn(this);
	  return this;
	}


	/**
	 * Get request header `field`.
	 * Case-insensitive.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	exports.get = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Get case-insensitive header `field` value.
	 * This is a deprecated internal API. Use `.get(field)` instead.
	 *
	 * (getHeader is no longer used internally by the superagent code base)
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 * @deprecated
	 */

	exports.getHeader = exports.get;

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 * Case-insensitive.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Remove header `field`.
	 * Case-insensitive.
	 *
	 * Example:
	 *
	 *      req.get('/')
	 *        .unset('User-Agent')
	 *        .end(callback);
	 *
	 * @param {String} field
	 */
	exports.unset = function(field){
	  delete this._header[field.toLowerCase()];
	  delete this.header[field];
	  return this;
	};

	/**
	 * Write the field `name` and `val`, or multiple fields with one object
	 * for "multipart/form-data" request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 *
	 * request.post('/upload')
	 *   .field({ foo: 'bar', baz: 'qux' })
	 *   .end(callback);
	 * ```
	 *
	 * @param {String|Object} name
	 * @param {String|Blob|File|Buffer|fs.ReadStream} val
	 * @return {Request} for chaining
	 * @api public
	 */
	exports.field = function(name, val) {

	  // name should be either a string or an object.
	  if (null === name ||  undefined === name) {
	    throw new Error('.field(name, val) name can not be empty');
	  }

	  if (isObject(name)) {
	    for (var key in name) {
	      this.field(key, name[key]);
	    }
	    return this;
	  }

	  // val should be defined now
	  if (null === val || undefined === val) {
	    throw new Error('.field(name, val) val can not be empty');
	  }
	  this._getFormData().append(name, val);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */
	exports.abort = function(){
	  if (this._aborted) {
	    return this;
	  }
	  this._aborted = true;
	  this.xhr && this.xhr.abort(); // browser
	  this.req && this.req.abort(); // node
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	exports.withCredentials = function(){
	  // This is browser-only functionality. Node side is no-op.
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Set the max redirects to `n`. Does noting in browser XHR implementation.
	 *
	 * @param {Number} n
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.redirects = function(n){
	  this._maxRedirects = n;
	  return this;
	};

	/**
	 * Convert to a plain javascript object (not JSON string) of scalar properties.
	 * Note as this method is designed to return a useful non-this value,
	 * it cannot be chained.
	 *
	 * @return {Object} describing method, url, and data of this request
	 * @api public
	 */

	exports.toJSON = function(){
	  return {
	    method: this.method,
	    url: this.url,
	    data: this._data,
	    headers: this._header
	  };
	};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	exports._isHost = function _isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Send `data` as the request body, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"}')
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	 *      request.post('/user')
	 *        .send('name=tobi')
	 *        .send('species=ferret')
	 *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	exports.send = function(data){
	  var obj = isObject(data);
	  var type = this._header['content-type'];

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    // default to x-www-form-urlencoded
	    if (!type) this.type('form');
	    type = this._header['content-type'];
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj || this._isHost(data)) return this;

	  // default to json
	  if (!type) this.type('json');
	  return this;
	};


/***/ },
/* 133 */
/***/ function(module, exports) {

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return null !== obj && 'object' === typeof obj;
	}

	module.exports = isObject;


/***/ },
/* 134 */
/***/ function(module, exports) {

	// The node and browser modules expose versions of this with the
	// appropriate constructor function bound as first argument
	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(RequestConstructor, method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new RequestConstructor('GET', method).end(url);
	  }

	  // url first
	  if (2 == arguments.length) {
	    return new RequestConstructor('GET', method);
	  }

	  return new RequestConstructor(method, url);
	}

	module.exports = request;


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(136);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(138)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(137)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Lato:100,400,300,500);", ""]);
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Source+Code+Pro);", ""]);

	// module
	exports.push([module.id, "@charset \"UTF-8\";\nbody {\n  margin: 0;\n  font-size: 12px;\n  font-size: calculateRem(12px);\n  background: #e7e7e7;\n  font-family: 'proxima-nova', sans-serif;\n  color: #27243F; }\n  body #app {\n    height: 100%; }\n\n.treeview {\n  height: 100%;\n  display: flex;\n  flex-direction: row;\n  align-content: flex-start;\n  flex: 1; }\n  .treeview .selectView {\n    flex: 1;\n    overflow-y: auto;\n    position: relative;\n    background: #27243F;\n    color: #fff;\n    min-width: 15%;\n    width: 15%; }\n    .treeview .selectView .navBtn {\n      padding: 6px 15px;\n      font-size: 12px;\n      font-weight: 300;\n      letter-spacing: 1px;\n      background-color: #27243F;\n      color: #fff; }\n      .treeview .selectView .navBtn:hover {\n        background-color: #4f4980; }\n      .treeview .selectView .navBtn.selected {\n        border-left: 4px solid #725AC1;\n        background: #4f4980;\n        padding-left: 11px; }\n  .treeview .mainView {\n    flex: 8;\n    overflow: auto;\n    display: flex; }\n    .treeview .mainView .sniffer {\n      font-family: monospace;\n      width: 100%;\n      overflow-wrap: break-word; }\n      .treeview .mainView .sniffer ul {\n        padding: 0; }\n        .treeview .mainView .sniffer ul li.sniffline {\n          cursor: default;\n          width: 100%;\n          list-style: none; }\n          .treeview .mainView .sniffer ul li.sniffline.success {\n            background: #f00; }\n          .treeview .mainView .sniffer ul li.sniffline span.req {\n            padding: 4px 15px;\n            display: block;\n            border-bottom: 1px solid #cdcdcd; }\n            .treeview .mainView .sniffer ul li.sniffline span.req:hover, .treeview .mainView .sniffer ul li.sniffline span.req.open {\n              background: rgba(255, 255, 255, 0.3); }\n          .treeview .mainView .sniffer ul li.sniffline span.resp {\n            display: block;\n            padding: 5px 35px;\n            background: rgba(0, 0, 0, 0.1);\n            white-space: pre-wrap; }\n          .treeview .mainView .sniffer ul li.sniffline::before {\n            content: \"\\25B8\";\n            font-size: 10px;\n            line-height: 10px;\n            float: left;\n            margin: 5px 10px; }\n          .treeview .mainView .sniffer ul li.sniffline.open::before {\n            content: \"\\25BE\"; }\n", ""]);

	// exports


/***/ },
/* 137 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 139 */,
/* 140 */,
/* 141 */,
/* 142 */,
/* 143 */,
/* 144 */,
/* 145 */,
/* 146 */,
/* 147 */,
/* 148 */,
/* 149 */,
/* 150 */,
/* 151 */,
/* 152 */,
/* 153 */,
/* 154 */,
/* 155 */,
/* 156 */,
/* 157 */,
/* 158 */,
/* 159 */,
/* 160 */,
/* 161 */,
/* 162 */,
/* 163 */,
/* 164 */,
/* 165 */,
/* 166 */,
/* 167 */,
/* 168 */,
/* 169 */,
/* 170 */,
/* 171 */,
/* 172 */,
/* 173 */,
/* 174 */,
/* 175 */,
/* 176 */,
/* 177 */,
/* 178 */,
/* 179 */,
/* 180 */,
/* 181 */,
/* 182 */,
/* 183 */,
/* 184 */,
/* 185 */,
/* 186 */,
/* 187 */,
/* 188 */,
/* 189 */,
/* 190 */,
/* 191 */,
/* 192 */,
/* 193 */,
/* 194 */,
/* 195 */,
/* 196 */,
/* 197 */,
/* 198 */,
/* 199 */,
/* 200 */,
/* 201 */,
/* 202 */,
/* 203 */,
/* 204 */,
/* 205 */,
/* 206 */,
/* 207 */,
/* 208 */,
/* 209 */,
/* 210 */,
/* 211 */,
/* 212 */,
/* 213 */,
/* 214 */,
/* 215 */,
/* 216 */,
/* 217 */,
/* 218 */,
/* 219 */,
/* 220 */,
/* 221 */,
/* 222 */,
/* 223 */,
/* 224 */,
/* 225 */,
/* 226 */,
/* 227 */,
/* 228 */,
/* 229 */,
/* 230 */,
/* 231 */,
/* 232 */,
/* 233 */,
/* 234 */,
/* 235 */,
/* 236 */,
/* 237 */,
/* 238 */,
/* 239 */,
/* 240 */,
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */,
/* 246 */,
/* 247 */,
/* 248 */,
/* 249 */,
/* 250 */,
/* 251 */,
/* 252 */,
/* 253 */,
/* 254 */,
/* 255 */,
/* 256 */,
/* 257 */,
/* 258 */,
/* 259 */,
/* 260 */,
/* 261 */,
/* 262 */,
/* 263 */,
/* 264 */,
/* 265 */,
/* 266 */,
/* 267 */,
/* 268 */,
/* 269 */,
/* 270 */,
/* 271 */,
/* 272 */,
/* 273 */,
/* 274 */,
/* 275 */,
/* 276 */,
/* 277 */,
/* 278 */,
/* 279 */,
/* 280 */,
/* 281 */,
/* 282 */,
/* 283 */,
/* 284 */,
/* 285 */,
/* 286 */,
/* 287 */,
/* 288 */,
/* 289 */,
/* 290 */,
/* 291 */,
/* 292 */,
/* 293 */,
/* 294 */,
/* 295 */,
/* 296 */,
/* 297 */,
/* 298 */,
/* 299 */,
/* 300 */,
/* 301 */,
/* 302 */,
/* 303 */,
/* 304 */,
/* 305 */,
/* 306 */,
/* 307 */,
/* 308 */,
/* 309 */,
/* 310 */,
/* 311 */
/***/ function(module, exports) {

	"use strict";
	var counter = 0;
	function newScope() {
	    return "cycle" + ++counter;
	}
	function checkIsolateArgs(dataflowComponent, scope) {
	    if (typeof dataflowComponent !== "function") {
	        throw new Error("First argument given to isolate() must be a " +
	            "'dataflowComponent' function");
	    }
	    if (scope === null) {
	        throw new Error("Second argument given to isolate() must not be null");
	    }
	}
	function isolateAllSources(sources, scope) {
	    var scopedSources = {};
	    for (var key in sources) {
	        if (sources.hasOwnProperty(key) && sources[key]
	            && typeof sources[key].isolateSource === "function") {
	            scopedSources[key] = sources[key].isolateSource(sources[key], scope);
	        }
	        else if (sources.hasOwnProperty(key)) {
	            scopedSources[key] = sources[key];
	        }
	    }
	    return scopedSources;
	}
	function isolateAllSinks(sources, sinks, scope) {
	    var scopedSinks = {};
	    for (var key in sinks) {
	        if (sinks.hasOwnProperty(key)
	            && sources[key]
	            && typeof sources[key].isolateSink === "function") {
	            scopedSinks[key] = sources[key].isolateSink(sinks[key], scope);
	        }
	        else if (sinks.hasOwnProperty(key)) {
	            scopedSinks[key] = sinks[key];
	        }
	    }
	    return scopedSinks;
	}
	/**
	 * Takes a `dataflowComponent` function and an optional `scope` string, and
	 * returns a scoped version of the `dataflowComponent` function.
	 *
	 * When the scoped dataflow component is invoked, each source provided to the
	 * scoped dataflowComponent is isolated to the scope using
	 * `source.isolateSource(source, scope)`, if possible. Likewise, the sinks
	 * returned from the scoped dataflow component are isolate to the scope using
	 * `source.isolateSink(sink, scope)`.
	 *
	 * If the `scope` is not provided, a new scope will be automatically created.
	 * This means that while **`isolate(dataflowComponent, scope)` is pure**
	 * (referentially transparent), **`isolate(dataflowComponent)` is impure**
	 * (not referentially transparent). Two calls to `isolate(Foo, bar)` will
	 * generate two indistinct dataflow components. But, two calls to `isolate(Foo)`
	 * will generate two distinct dataflow components.
	 *
	 * Note that both `isolateSource()` and `isolateSink()` are static members of
	 * `source`. The reason for this is that drivers produce `source` while the
	 * application produces `sink`, and it's the driver's responsibility to
	 * implement `isolateSource()` and `isolateSink()`.
	 *
	 * @param {Function} dataflowComponent a function that takes `sources` as input
	 * and outputs a collection of `sinks`.
	 * @param {String} scope an optional string that is used to isolate each
	 * `sources` and `sinks` when the returned scoped dataflow component is invoked.
	 * @return {Function} the scoped dataflow component function that, as the
	 * original `dataflowComponent` function, takes `sources` and returns `sinks`.
	 * @function isolate
	 */
	function isolate(component, scope) {
	    if (scope === void 0) { scope = newScope(); }
	    checkIsolateArgs(component, scope);
	    var convertedScope = typeof scope === 'string' ? scope : scope.toString();
	    return function scopedComponent(sources) {
	        var rest = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            rest[_i - 1] = arguments[_i];
	        }
	        var scopedSources = isolateAllSources(sources, convertedScope);
	        var sinks = component.apply(void 0, [scopedSources].concat(rest));
	        var scopedSinks = isolateAllSinks(sources, sinks, convertedScope);
	        return scopedSinks;
	    };
	}
	isolate.reset = function () { return counter = 0; };
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = isolate;
	//# sourceMappingURL=index.js.map

/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.makeCollection = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _xstream = __webpack_require__(313);

	var _xstream2 = _interopRequireDefault(_xstream);

	var _delay = __webpack_require__(315);

	var _delay2 = _interopRequireDefault(_delay);

	var _dropRepeats = __webpack_require__(316);

	var _dropRepeats2 = _interopRequireDefault(_dropRepeats);

	var _isolate = __webpack_require__(311);

	var _isolate2 = _interopRequireDefault(_isolate);

	var _xstreamAdapter = __webpack_require__(3);

	var _xstreamAdapter2 = _interopRequireDefault(_xstreamAdapter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var noop = Function.prototype;

	function isVtree(x) {
	  return x && typeof x.sel === 'string';
	}

	var _id = 0;

	function id() {
	  return _id++;
	}

	function makeItem(component, sources) {
	  var newId = id();

	  var newItem = (0, _isolate2.default)(component, newId.toString())(sources);

	  newItem._id = newId;
	  newItem._name = component.name;

	  return newItem;
	}

	function convert(stream, sourceSA, targetSA) {
	  return targetSA.isValidStream(stream) ? stream : targetSA.adapt(stream, sourceSA.streamSubscribe);
	}

	function makeCollection() {
	  var externalSA = arguments.length <= 0 || arguments[0] === undefined ? _xstreamAdapter2.default : arguments[0];

	  function collection(options) {
	    var items = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
	    var component = options.component;
	    var sources = options.sources;
	    var removeSelector = options.removeSelector;


	    return {
	      add: function add() {
	        var additionalSources = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	        var newItem = makeItem(component, _extends({}, sources, additionalSources));
	        var selectedSink = removeSelector(newItem) || _xstream2.default.empty();
	        var removeSink = convert(selectedSink, externalSA, _xstreamAdapter2.default);
	        newItem._remove$ = removeSink.take(1).mapTo(newItem);

	        return collection(options, [].concat(_toConsumableArray(items), [newItem]));
	      },
	      remove: function remove(itemForRemoval) {
	        return collection(options, items.filter(function (item) {
	          return item !== itemForRemoval;
	        }));
	      },
	      asArray: function asArray() {
	        return items.slice(); // returns a copy of items to avoid mutation
	      }
	    };
	  }

	  function Collection(component) {
	    var sources = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	    var sourceAdd$ = arguments.length <= 2 || arguments[2] === undefined ? _xstream2.default.empty() : arguments[2];
	    var removeSelector = arguments.length <= 3 || arguments[3] === undefined ? noop : arguments[3];

	    var removeProxy$ = _xstream2.default.create();
	    var add$ = convert(sourceAdd$, externalSA, _xstreamAdapter2.default);
	    var addReducer$ = add$.map(function (sourcesList) {
	      return function (collection) {
	        if (Array.isArray(sourcesList)) {
	          // multiple items
	          return sourcesList.reduce(function (collection, sources) {
	            return collection.add(sources);
	          }, collection);
	        } else {
	          // single item
	          return collection.add(sourcesList);
	        }
	      };
	    });
	    var removeReducer$ = removeProxy$.map(function (item) {
	      return function (collection) {
	        return collection.remove(item);
	      };
	    });
	    var reducer$ = _xstream2.default.merge(addReducer$, removeReducer$);

	    var emptyCollection = collection({ component: component, sources: sources, removeSelector: removeSelector });
	    var collection$ = reducer$.fold(function (collection, reducer) {
	      return reducer(collection);
	    }, emptyCollection).map(function (collection) {
	      return collection.asArray();
	    });

	    var remove$ = Collection.merge(collection$, function (item) {
	      return item._remove$;
	    }, true);
	    removeProxy$.imitate(remove$);

	    return convert(collection$, _xstreamAdapter2.default, externalSA);
	  }

	  Collection.pluck = function pluck(sourceCollection$, pluckSelector) {
	    var sinks = {};

	    function sink$(item) {
	      var key = item._id;

	      if (sinks[key] === undefined) {
	        var selectedSink = convert(pluckSelector(item), externalSA, _xstreamAdapter2.default);
	        var sink = selectedSink.map(function (x) {
	          return isVtree(x) && x.key == null ? _extends({}, x, { key: key }) : x;
	        });
	        sinks[key] = sink.remember();
	      }

	      return sinks[key];
	    }

	    var collection$ = convert(sourceCollection$, externalSA, _xstreamAdapter2.default);
	    var outputCollection$ = collection$.map(function (items) {
	      return items.map(function (item) {
	        return sink$(item);
	      });
	    }).map(function (sinkStreams) {
	      return _xstream2.default.combine.apply(_xstream2.default, _toConsumableArray(sinkStreams));
	    }).flatten().startWith([]);
	    return convert(outputCollection$, _xstreamAdapter2.default, externalSA);
	  };

	  Collection.merge = function merge(sourceCollection$, mergeSelector) {
	    var internal = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

	    var sinks = {};

	    function sink$(item) {
	      var key = item._id;

	      if (sinks[key] === undefined) {
	        var selectedSink = convert(mergeSelector(item), externalSA, _xstreamAdapter2.default);
	        var sink = selectedSink.map(function (x) {
	          return isVtree(x) && x.key == null ? _extends({}, x, { key: key }) : x;
	        });
	        // prevent sink from early completion and reinitialization
	        sinks[key] = _xstream2.default.merge(sink, _xstream2.default.never());
	      }

	      return sinks[key];
	    }

	    var collection$ = convert(sourceCollection$, externalSA, _xstreamAdapter2.default);
	    var outputCollection$ = collection$.map(function (items) {
	      return items.map(function (item) {
	        return sink$(item);
	      });
	    }).map(function (sinkStreams) {
	      return _xstream2.default.merge.apply(_xstream2.default, _toConsumableArray(sinkStreams));
	    }).flatten();
	    return internal ? outputCollection$ : convert(outputCollection$, _xstreamAdapter2.default, externalSA);
	  };

	  // convert a stream of items' sources snapshots into a stream of collections
	  Collection.gather = function gather(component, sources, sourceItems$) {
	    var idAttribute = arguments.length <= 3 || arguments[3] === undefined ? 'id' : arguments[3];

	    function makeDestroyable(component) {
	      return function (sources) {
	        return _extends({}, component(sources), {
	          _destroy$: sources._destroy$
	        });
	      };
	    }

	    // finds items not present in previous snapshot
	    function findNewItems(_ref, items) {
	      var prevIds = _ref.prevIds;

	      return {
	        prevIds: items.map(function (item) {
	          return item[idAttribute];
	        }),
	        addedItems: items.filter(function (item) {
	          return prevIds.indexOf(item[idAttribute]) === -1;
	        })
	      };
	    }

	    function compareJSON(value, nextValue) {
	      if (value === nextValue) {
	        return true;
	      }
	      try {
	        if (JSON.stringify(value) === JSON.stringify(nextValue)) {
	          return true;
	        }
	      } catch (e) {}
	      // if not equal or not serializable
	      return false;
	    }

	    // turn a new item into a hash of source streams, tracking all the future updates
	    function itemToSourceStreams(addedItem, itemsState$) {
	      var itemStateInfinite$ = itemsState$.map(function (items) {
	        return items.find(function (item) {
	          return item[idAttribute] === addedItem[idAttribute];
	        });
	      });
	      // if an item isn't present if a new snapshot, it shall be destroyed
	      var _destroy$ = itemStateInfinite$.filter(function (item) {
	        return !item;
	      }).take(1);
	      var itemState$ = itemStateInfinite$.endWhen(_destroy$.compose((0, _delay2.default)()));

	      return Object.keys(addedItem).reduce(function (sources, key) {
	        // skip idAttribute
	        if (key === idAttribute) {
	          return sources;
	        }

	        var stream$ = itemState$.map(function (state) {
	          return state[key];
	        }).startWith(addedItem[key])
	        // skip the snapshot if the value didn't change
	        .compose((0, _dropRepeats2.default)(compareJSON)).remember();

	        return _extends({}, sources, _defineProperty({}, key, convert(stream$, _xstreamAdapter2.default, externalSA)));
	      }, {
	        _destroy$: _destroy$
	      });
	    }

	    var items$ = convert(sourceItems$, externalSA, _xstreamAdapter2.default);
	    var itemsState$ = items$.remember();

	    var add$ = itemsState$
	    // get the added items at each step
	    .fold(findNewItems, { prevIds: [], addedItems: [] }).map(function (_ref2) {
	      var addedItems = _ref2.addedItems;
	      return addedItems;
	    }).filter(function (addedItems) {
	      return addedItems.length;
	    }).map(function (addedItems) {
	      return addedItems.map(function (item) {
	        return itemToSourceStreams(item, itemsState$);
	      });
	    });

	    return Collection(makeDestroyable(component), sources, add$, function (item) {
	      return item._destroy$;
	    });
	  };

	  return Collection;
	}

	var Collection = makeCollection();

	exports.default = Collection;
	exports.makeCollection = makeCollection;

/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(314);
	exports.Stream = core_1.Stream;
	exports.MemoryStream = core_1.MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = core_1.Stream;
	//# sourceMappingURL=index.js.map

/***/ },
/* 314 */
/***/ function(module, exports) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var NO = {};
	function noop() { }
	function copy(a) {
	    var l = a.length;
	    var b = Array(l);
	    for (var i = 0; i < l; ++i) {
	        b[i] = a[i];
	    }
	    return b;
	}
	exports.NO_IL = {
	    _n: noop,
	    _e: noop,
	    _c: noop,
	};
	// mutates the input
	function internalizeProducer(producer) {
	    producer._start =
	        function _start(il) {
	            il.next = il._n;
	            il.error = il._e;
	            il.complete = il._c;
	            this.start(il);
	        };
	    producer._stop = producer.stop;
	}
	function compose2(f1, f2) {
	    return function composedFn(arg) {
	        return f1(f2(arg));
	    };
	}
	function and(f1, f2) {
	    return function andFn(t) {
	        return f1(t) && f2(t);
	    };
	}
	var MergeProducer = (function () {
	    function MergeProducer(insArr) {
	        this.type = 'merge';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ac = 0;
	    }
	    MergeProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var L = s.length;
	        this.ac = L;
	        for (var i = 0; i < L; i++) {
	            s[i]._add(this);
	        }
	    };
	    MergeProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var L = s.length;
	        for (var i = 0; i < L; i++) {
	            s[i]._remove(this);
	        }
	        this.out = NO;
	    };
	    MergeProducer.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    MergeProducer.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MergeProducer.prototype._c = function () {
	        if (--this.ac <= 0) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    return MergeProducer;
	}());
	exports.MergeProducer = MergeProducer;
	var CombineListener = (function () {
	    function CombineListener(i, out, p) {
	        this.i = i;
	        this.out = out;
	        this.p = p;
	        p.ils.push(this);
	    }
	    CombineListener.prototype._n = function (t) {
	        var p = this.p, out = this.out;
	        if (!out)
	            return;
	        if (p.up(t, this.i)) {
	            out._n(p.vals);
	        }
	    };
	    CombineListener.prototype._e = function (err) {
	        var out = this.out;
	        if (!out)
	            return;
	        out._e(err);
	    };
	    CombineListener.prototype._c = function () {
	        var p = this.p;
	        if (!p.out)
	            return;
	        if (--p.Nc === 0) {
	            p.out._c();
	        }
	    };
	    return CombineListener;
	}());
	exports.CombineListener = CombineListener;
	var CombineProducer = (function () {
	    function CombineProducer(insArr) {
	        this.type = 'combine';
	        this.insArr = insArr;
	        this.out = NO;
	        this.ils = [];
	        this.Nc = this.Nn = 0;
	        this.vals = [];
	    }
	    CombineProducer.prototype.up = function (t, i) {
	        var v = this.vals[i];
	        var Nn = !this.Nn ? 0 : v === NO ? --this.Nn : this.Nn;
	        this.vals[i] = t;
	        return Nn === 0;
	    };
	    CombineProducer.prototype._start = function (out) {
	        this.out = out;
	        var s = this.insArr;
	        var n = this.Nc = this.Nn = s.length;
	        var vals = this.vals = new Array(n);
	        if (n === 0) {
	            out._n([]);
	            out._c();
	        }
	        else {
	            for (var i = 0; i < n; i++) {
	                vals[i] = NO;
	                s[i]._add(new CombineListener(i, out, this));
	            }
	        }
	    };
	    CombineProducer.prototype._stop = function () {
	        var s = this.insArr;
	        var n = s.length;
	        for (var i = 0; i < n; i++) {
	            s[i]._remove(this.ils[i]);
	        }
	        this.out = NO;
	        this.ils = [];
	        this.vals = [];
	    };
	    return CombineProducer;
	}());
	exports.CombineProducer = CombineProducer;
	var FromArrayProducer = (function () {
	    function FromArrayProducer(a) {
	        this.type = 'fromArray';
	        this.a = a;
	    }
	    FromArrayProducer.prototype._start = function (out) {
	        var a = this.a;
	        for (var i = 0, l = a.length; i < l; i++) {
	            out._n(a[i]);
	        }
	        out._c();
	    };
	    FromArrayProducer.prototype._stop = function () {
	    };
	    return FromArrayProducer;
	}());
	exports.FromArrayProducer = FromArrayProducer;
	var FromPromiseProducer = (function () {
	    function FromPromiseProducer(p) {
	        this.type = 'fromPromise';
	        this.on = false;
	        this.p = p;
	    }
	    FromPromiseProducer.prototype._start = function (out) {
	        var prod = this;
	        this.on = true;
	        this.p.then(function (v) {
	            if (prod.on) {
	                out._n(v);
	                out._c();
	            }
	        }, function (e) {
	            out._e(e);
	        }).then(null, function (err) {
	            setTimeout(function () { throw err; });
	        });
	    };
	    FromPromiseProducer.prototype._stop = function () {
	        this.on = false;
	    };
	    return FromPromiseProducer;
	}());
	exports.FromPromiseProducer = FromPromiseProducer;
	var PeriodicProducer = (function () {
	    function PeriodicProducer(period) {
	        this.type = 'periodic';
	        this.period = period;
	        this.intervalID = -1;
	        this.i = 0;
	    }
	    PeriodicProducer.prototype._start = function (stream) {
	        var self = this;
	        function intervalHandler() { stream._n(self.i++); }
	        this.intervalID = setInterval(intervalHandler, this.period);
	    };
	    PeriodicProducer.prototype._stop = function () {
	        if (this.intervalID !== -1)
	            clearInterval(this.intervalID);
	        this.intervalID = -1;
	        this.i = 0;
	    };
	    return PeriodicProducer;
	}());
	exports.PeriodicProducer = PeriodicProducer;
	var DebugOperator = (function () {
	    function DebugOperator(arg, ins) {
	        this.type = 'debug';
	        this.ins = ins;
	        this.out = NO;
	        this.s = noop;
	        this.l = '';
	        if (typeof arg === 'string') {
	            this.l = arg;
	        }
	        else if (typeof arg === 'function') {
	            this.s = arg;
	        }
	    }
	    DebugOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    DebugOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DebugOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var s = this.s, l = this.l;
	        if (s !== noop) {
	            try {
	                s(t);
	            }
	            catch (e) {
	                u._e(e);
	            }
	        }
	        else if (l) {
	            console.log(l + ':', t);
	        }
	        else {
	            console.log(t);
	        }
	        u._n(t);
	    };
	    DebugOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DebugOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DebugOperator;
	}());
	exports.DebugOperator = DebugOperator;
	var DropOperator = (function () {
	    function DropOperator(max, ins) {
	        this.type = 'drop';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.dropped = 0;
	    }
	    DropOperator.prototype._start = function (out) {
	        this.out = out;
	        this.dropped = 0;
	        this.ins._add(this);
	    };
	    DropOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    DropOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.dropped++ >= this.max)
	            u._n(t);
	    };
	    DropOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    DropOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return DropOperator;
	}());
	exports.DropOperator = DropOperator;
	var OtherIL = (function () {
	    function OtherIL(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    OtherIL.prototype._n = function (t) {
	        this.op.end();
	    };
	    OtherIL.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    OtherIL.prototype._c = function () {
	        this.op.end();
	    };
	    return OtherIL;
	}());
	var EndWhenOperator = (function () {
	    function EndWhenOperator(o, ins) {
	        this.type = 'endWhen';
	        this.ins = ins;
	        this.out = NO;
	        this.o = o;
	        this.oil = exports.NO_IL;
	    }
	    EndWhenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.o._add(this.oil = new OtherIL(out, this));
	        this.ins._add(this);
	    };
	    EndWhenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.o._remove(this.oil);
	        this.out = NO;
	        this.oil = exports.NO_IL;
	    };
	    EndWhenOperator.prototype.end = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    EndWhenOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    EndWhenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    EndWhenOperator.prototype._c = function () {
	        this.end();
	    };
	    return EndWhenOperator;
	}());
	exports.EndWhenOperator = EndWhenOperator;
	var FilterOperator = (function () {
	    function FilterOperator(passes, ins) {
	        this.type = 'filter';
	        this.ins = ins;
	        this.out = NO;
	        this.passes = passes;
	    }
	    FilterOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    FilterOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    FilterOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            if (this.passes(t))
	                u._n(t);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FilterOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FilterOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FilterOperator;
	}());
	exports.FilterOperator = FilterOperator;
	var FlattenListener = (function () {
	    function FlattenListener(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    FlattenListener.prototype._n = function (t) {
	        this.out._n(t);
	    };
	    FlattenListener.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    FlattenListener.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return FlattenListener;
	}());
	var FlattenOperator = (function () {
	    function FlattenOperator(ins) {
	        this.type = 'flatten';
	        this.ins = ins;
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    }
	    FlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.ins._add(this);
	    };
	    FlattenOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.open = true;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    FlattenOperator.prototype.less = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (!this.open && this.inner === NO)
	            u._c();
	    };
	    FlattenOperator.prototype._n = function (s) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new FlattenListener(u, this));
	    };
	    FlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return FlattenOperator;
	}());
	exports.FlattenOperator = FlattenOperator;
	var FoldOperator = (function () {
	    function FoldOperator(f, seed, ins) {
	        this.type = 'fold';
	        this.ins = ins;
	        this.out = NO;
	        this.f = f;
	        this.acc = this.seed = seed;
	    }
	    FoldOperator.prototype._start = function (out) {
	        this.out = out;
	        this.acc = this.seed;
	        out._n(this.acc);
	        this.ins._add(this);
	    };
	    FoldOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.acc = this.seed;
	    };
	    FoldOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.acc = this.f(this.acc, t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    FoldOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    FoldOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return FoldOperator;
	}());
	exports.FoldOperator = FoldOperator;
	var LastOperator = (function () {
	    function LastOperator(ins) {
	        this.type = 'last';
	        this.ins = ins;
	        this.out = NO;
	        this.has = false;
	        this.val = NO;
	    }
	    LastOperator.prototype._start = function (out) {
	        this.out = out;
	        this.has = false;
	        this.ins._add(this);
	    };
	    LastOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	        this.val = NO;
	    };
	    LastOperator.prototype._n = function (t) {
	        this.has = true;
	        this.val = t;
	    };
	    LastOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    LastOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.has) {
	            u._n(this.val);
	            u._c();
	        }
	        else {
	            u._e('TODO show proper error');
	        }
	    };
	    return LastOperator;
	}());
	exports.LastOperator = LastOperator;
	var MapFlattenInner = (function () {
	    function MapFlattenInner(out, op) {
	        this.out = out;
	        this.op = op;
	    }
	    MapFlattenInner.prototype._n = function (r) {
	        this.out._n(r);
	    };
	    MapFlattenInner.prototype._e = function (err) {
	        this.out._e(err);
	    };
	    MapFlattenInner.prototype._c = function () {
	        this.op.inner = NO;
	        this.op.less();
	    };
	    return MapFlattenInner;
	}());
	var MapFlattenOperator = (function () {
	    function MapFlattenOperator(mapOp) {
	        this.type = mapOp.type + "+flatten";
	        this.ins = mapOp.ins;
	        this.out = NO;
	        this.mapOp = mapOp;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	    }
	    MapFlattenOperator.prototype._start = function (out) {
	        this.out = out;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	        this.open = true;
	        this.mapOp.ins._add(this);
	    };
	    MapFlattenOperator.prototype._stop = function () {
	        this.mapOp.ins._remove(this);
	        if (this.inner !== NO)
	            this.inner._remove(this.il);
	        this.out = NO;
	        this.inner = NO;
	        this.il = exports.NO_IL;
	    };
	    MapFlattenOperator.prototype.less = function () {
	        if (!this.open && this.inner === NO) {
	            var u = this.out;
	            if (u === NO)
	                return;
	            u._c();
	        }
	    };
	    MapFlattenOperator.prototype._n = function (v) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        var _a = this, inner = _a.inner, il = _a.il;
	        var s;
	        try {
	            s = this.mapOp.project(v);
	        }
	        catch (e) {
	            u._e(e);
	            return;
	        }
	        if (inner !== NO && il !== exports.NO_IL)
	            inner._remove(il);
	        (this.inner = s)._add(this.il = new MapFlattenInner(u, this));
	    };
	    MapFlattenOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapFlattenOperator.prototype._c = function () {
	        this.open = false;
	        this.less();
	    };
	    return MapFlattenOperator;
	}());
	exports.MapFlattenOperator = MapFlattenOperator;
	var MapOperator = (function () {
	    function MapOperator(project, ins) {
	        this.type = 'map';
	        this.ins = ins;
	        this.out = NO;
	        this.project = project;
	    }
	    MapOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    MapOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    MapOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            u._n(this.project(t));
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    MapOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    MapOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return MapOperator;
	}());
	exports.MapOperator = MapOperator;
	var FilterMapOperator = (function (_super) {
	    __extends(FilterMapOperator, _super);
	    function FilterMapOperator(passes, project, ins) {
	        _super.call(this, project, ins);
	        this.type = 'filter+map';
	        this.passes = passes;
	    }
	    FilterMapOperator.prototype._n = function (v) {
	        if (this.passes(v)) {
	            _super.prototype._n.call(this, v);
	        }
	        ;
	    };
	    return FilterMapOperator;
	}(MapOperator));
	exports.FilterMapOperator = FilterMapOperator;
	var RememberOperator = (function () {
	    function RememberOperator(ins) {
	        this.type = 'remember';
	        this.ins = ins;
	        this.out = NO;
	    }
	    RememberOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(out);
	    };
	    RememberOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return RememberOperator;
	}());
	exports.RememberOperator = RememberOperator;
	var ReplaceErrorOperator = (function () {
	    function ReplaceErrorOperator(fn, ins) {
	        this.type = 'replaceError';
	        this.ins = ins;
	        this.out = NO;
	        this.fn = fn;
	    }
	    ReplaceErrorOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    ReplaceErrorOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    ReplaceErrorOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._n(t);
	    };
	    ReplaceErrorOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        try {
	            this.ins._remove(this);
	            (this.ins = this.fn(err))._add(this);
	        }
	        catch (e) {
	            u._e(e);
	        }
	    };
	    ReplaceErrorOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return ReplaceErrorOperator;
	}());
	exports.ReplaceErrorOperator = ReplaceErrorOperator;
	var StartWithOperator = (function () {
	    function StartWithOperator(ins, val) {
	        this.type = 'startWith';
	        this.ins = ins;
	        this.out = NO;
	        this.val = val;
	    }
	    StartWithOperator.prototype._start = function (out) {
	        this.out = out;
	        this.out._n(this.val);
	        this.ins._add(out);
	    };
	    StartWithOperator.prototype._stop = function () {
	        this.ins._remove(this.out);
	        this.out = NO;
	    };
	    return StartWithOperator;
	}());
	exports.StartWithOperator = StartWithOperator;
	var TakeOperator = (function () {
	    function TakeOperator(max, ins) {
	        this.type = 'take';
	        this.ins = ins;
	        this.out = NO;
	        this.max = max;
	        this.taken = 0;
	    }
	    TakeOperator.prototype._start = function (out) {
	        this.out = out;
	        this.taken = 0;
	        if (this.max <= 0) {
	            out._c();
	        }
	        else {
	            this.ins._add(this);
	        }
	    };
	    TakeOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = NO;
	    };
	    TakeOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        if (this.taken++ < this.max - 1) {
	            u._n(t);
	        }
	        else {
	            u._n(t);
	            u._c();
	        }
	    };
	    TakeOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._e(err);
	    };
	    TakeOperator.prototype._c = function () {
	        var u = this.out;
	        if (u === NO)
	            return;
	        u._c();
	    };
	    return TakeOperator;
	}());
	exports.TakeOperator = TakeOperator;
	var Stream = (function () {
	    function Stream(producer) {
	        this._prod = producer || NO;
	        this._ils = [];
	        this._stopID = NO;
	        this._target = NO;
	        this._err = NO;
	    }
	    Stream.prototype._n = function (t) {
	        var a = this._ils;
	        var L = a.length;
	        if (L == 1)
	            a[0]._n(t);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._n(t);
	        }
	    };
	    Stream.prototype._e = function (err) {
	        if (this._err !== NO)
	            return;
	        this._err = err;
	        var a = this._ils;
	        var L = a.length;
	        if (L == 1)
	            a[0]._e(err);
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._e(err);
	        }
	        this._x();
	    };
	    Stream.prototype._c = function () {
	        var a = this._ils;
	        var L = a.length;
	        if (L == 1)
	            a[0]._c();
	        else {
	            var b = copy(a);
	            for (var i = 0; i < L; i++)
	                b[i]._c();
	        }
	        this._x();
	    };
	    Stream.prototype._x = function () {
	        if (this._ils.length === 0)
	            return;
	        if (this._prod !== NO)
	            this._prod._stop();
	        this._err = NO;
	        this._ils = [];
	    };
	    Stream.prototype._stopNow = function () {
	        // WARNING: code that calls this method should
	        // first check if this._prod is valid (not `NO`)
	        this._prod._stop();
	        this._err = NO;
	        this._stopID = NO;
	    };
	    Stream.prototype._add = function (il) {
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._add(il);
	        var a = this._ils;
	        a.push(il);
	        if (a.length === 1) {
	            if (this._stopID !== NO) {
	                clearTimeout(this._stopID);
	                this._stopID = NO;
	            }
	            var p = this._prod;
	            if (p !== NO)
	                p._start(this);
	        }
	    };
	    Stream.prototype._remove = function (il) {
	        var _this = this;
	        var ta = this._target;
	        if (ta !== NO)
	            return ta._remove(il);
	        var a = this._ils;
	        var i = a.indexOf(il);
	        if (i > -1) {
	            a.splice(i, 1);
	            if (this._prod !== NO && a.length <= 0) {
	                this._err = NO;
	                this._stopID = setTimeout(function () { return _this._stopNow(); });
	            }
	            else if (a.length === 1) {
	                this._pruneCycles();
	            }
	        }
	    };
	    // If all paths stemming from `this` stream eventually end at `this`
	    // stream, then we remove the single listener of `this` stream, to
	    // force it to end its execution and dispose resources. This method
	    // assumes as a precondition that this._ils has just one listener.
	    Stream.prototype._pruneCycles = function () {
	        if (this._hasNoSinks(this, [])) {
	            this._remove(this._ils[0]);
	        }
	    };
	    // Checks whether *there is no* path starting from `x` that leads to an end
	    // listener (sink) in the stream graph, following edges A->B where B is a
	    // listener of A. This means these paths constitute a cycle somehow. Is given
	    // a trace of all visited nodes so far.
	    Stream.prototype._hasNoSinks = function (x, trace) {
	        if (trace.indexOf(x) !== -1) {
	            return true;
	        }
	        else if (x.out === this) {
	            return true;
	        }
	        else if (x.out && x.out !== NO) {
	            return this._hasNoSinks(x.out, trace.concat(x));
	        }
	        else if (x._ils) {
	            for (var i = 0, N = x._ils.length; i < N; i++) {
	                if (!this._hasNoSinks(x._ils[i], trace.concat(x))) {
	                    return false;
	                }
	            }
	            return true;
	        }
	        else {
	            return false;
	        }
	    };
	    Stream.prototype.ctor = function () {
	        return this instanceof MemoryStream ? MemoryStream : Stream;
	    };
	    /**
	     * Adds a Listener to the Stream.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.addListener = function (listener) {
	        if (typeof listener.next !== 'function'
	            || typeof listener.error !== 'function'
	            || typeof listener.complete !== 'function') {
	            throw new Error('stream.addListener() requires all three next, error, ' +
	                'and complete functions.');
	        }
	        listener._n = listener.next;
	        listener._e = listener.error;
	        listener._c = listener.complete;
	        this._add(listener);
	    };
	    /**
	     * Removes a Listener from the Stream, assuming the Listener was added to it.
	     *
	     * @param {Listener<T>} listener
	     */
	    Stream.prototype.removeListener = function (listener) {
	        this._remove(listener);
	    };
	    /**
	     * Creates a new Stream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {Stream}
	     */
	    Stream.create = function (producer) {
	        if (producer) {
	            if (typeof producer.start !== 'function'
	                || typeof producer.stop !== 'function') {
	                throw new Error('producer requires both start and stop functions');
	            }
	            internalizeProducer(producer); // mutates the input
	        }
	        return new Stream(producer);
	    };
	    /**
	     * Creates a new MemoryStream given a Producer.
	     *
	     * @factory true
	     * @param {Producer} producer An optional Producer that dictates how to
	     * start, generate events, and stop the Stream.
	     * @return {MemoryStream}
	     */
	    Stream.createWithMemory = function (producer) {
	        if (producer) {
	            internalizeProducer(producer); // mutates the input
	        }
	        return new MemoryStream(producer);
	    };
	    /**
	     * Creates a Stream that does nothing when started. It never emits any event.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *          never
	     * -----------------------
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.never = function () {
	        return new Stream({ _start: noop, _stop: noop });
	    };
	    /**
	     * Creates a Stream that immediately emits the "complete" notification when
	     * started, and that's it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * empty
	     * -|
	     * ```
	     *
	     * @factory true
	     * @return {Stream}
	     */
	    Stream.empty = function () {
	        return new Stream({
	            _start: function (il) { il._c(); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a Stream that immediately emits an "error" notification with the
	     * value you passed as the `error` argument when the stream starts, and that's
	     * it.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * throw(X)
	     * -X
	     * ```
	     *
	     * @factory true
	     * @param error The error event to emit on the created stream.
	     * @return {Stream}
	     */
	    Stream.throw = function (error) {
	        return new Stream({
	            _start: function (il) { il._e(error); },
	            _stop: noop,
	        });
	    };
	    /**
	     * Creates a Stream that immediately emits the arguments that you give to
	     * *of*, then completes.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * of(1,2,3)
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param a The first value you want to emit as an event on the stream.
	     * @param b The second value you want to emit as an event on the stream. One
	     * or more of these values may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.of = function () {
	        var items = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            items[_i - 0] = arguments[_i];
	        }
	        return Stream.fromArray(items);
	    };
	    /**
	     * Converts an array to a stream. The returned stream will emit synchronously
	     * all the items in the array, and then complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromArray([1,2,3])
	     * 123|
	     * ```
	     *
	     * @factory true
	     * @param {Array} array The array to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromArray = function (array) {
	        return new Stream(new FromArrayProducer(array));
	    };
	    /**
	     * Converts a promise to a stream. The returned stream will emit the resolved
	     * value of the promise, and then complete. However, if the promise is
	     * rejected, the stream will emit the corresponding error.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * fromPromise( ----42 )
	     * -----------------42|
	     * ```
	     *
	     * @factory true
	     * @param {Promise} promise The promise to be converted as a stream.
	     * @return {Stream}
	     */
	    Stream.fromPromise = function (promise) {
	        return new Stream(new FromPromiseProducer(promise));
	    };
	    /**
	     * Creates a stream that periodically emits incremental numbers, every
	     * `period` milliseconds.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     *     periodic(1000)
	     * ---0---1---2---3---4---...
	     * ```
	     *
	     * @factory true
	     * @param {number} period The interval in milliseconds to use as a rate of
	     * emission.
	     * @return {Stream}
	     */
	    Stream.periodic = function (period) {
	        return new Stream(new PeriodicProducer(period));
	    };
	    Stream.prototype._map = function (project) {
	        var p = this._prod;
	        var ctor = this.ctor();
	        if (p instanceof FilterOperator) {
	            return new ctor(new FilterMapOperator(p.passes, project, p.ins));
	        }
	        if (p instanceof FilterMapOperator) {
	            return new ctor(new FilterMapOperator(p.passes, compose2(project, p.project), p.ins));
	        }
	        if (p instanceof MapOperator) {
	            return new ctor(new MapOperator(compose2(project, p.project), p.ins));
	        }
	        return new ctor(new MapOperator(project, this));
	    };
	    /**
	     * Transforms each event from the input Stream through a `project` function,
	     * to get a Stream that emits those transformed events.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7------
	     *    map(i => i * 10)
	     * --10--30-50----70-----
	     * ```
	     *
	     * @param {Function} project A function of type `(t: T) => U` that takes event
	     * `t` of type `T` from the input Stream and produces an event of type `U`, to
	     * be emitted on the output Stream.
	     * @return {Stream}
	     */
	    Stream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    /**
	     * It's like `map`, but transforms each input event to always the same
	     * constant value on the output Stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---3--5-----7-----
	     *       mapTo(10)
	     * --10--10-10----10----
	     * ```
	     *
	     * @param projectedValue A value to emit on the output Stream whenever the
	     * input Stream emits any value.
	     * @return {Stream}
	     */
	    Stream.prototype.mapTo = function (projectedValue) {
	        var s = this.map(function () { return projectedValue; });
	        var op = s._prod;
	        op.type = op.type.replace('map', 'mapTo');
	        return s;
	    };
	    /**
	     * Only allows events that pass the test given by the `passes` argument.
	     *
	     * Each event from the input stream is given to the `passes` function. If the
	     * function returns `true`, the event is forwarded to the output stream,
	     * otherwise it is ignored and not forwarded.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2--3-----4-----5---6--7-8--
	     *     filter(i => i % 2 === 0)
	     * ------2--------4---------6----8--
	     * ```
	     *
	     * @param {Function} passes A function of type `(t: T) +> boolean` that takes
	     * an event from the input stream and checks if it passes, by returning a
	     * boolean.
	     * @return {Stream}
	     */
	    Stream.prototype.filter = function (passes) {
	        var p = this._prod;
	        if (p instanceof FilterOperator) {
	            return new Stream(new FilterOperator(and(p.passes, passes), p.ins));
	        }
	        return new Stream(new FilterOperator(passes, this));
	    };
	    /**
	     * Lets the first `amount` many events from the input stream pass to the
	     * output stream, then makes the output stream complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *    take(3)
	     * --a---b--c|
	     * ```
	     *
	     * @param {number} amount How many events to allow from the input stream
	     * before completing the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.take = function (amount) {
	        return new (this.ctor())(new TakeOperator(amount, this));
	    };
	    /**
	     * Ignores the first `amount` many events from the input stream, and then
	     * after that starts forwarding events from the input stream to the output
	     * stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c----d---e--
	     *       drop(3)
	     * --------------d---e--
	     * ```
	     *
	     * @param {number} amount How many events to ignore from the input stream
	     * before forwarding all events from the input stream to the output stream.
	     * @return {Stream}
	     */
	    Stream.prototype.drop = function (amount) {
	        return new Stream(new DropOperator(amount, this));
	    };
	    /**
	     * When the input stream completes, the output stream will emit the last event
	     * emitted by the input stream, and then will also complete.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --a---b--c--d----|
	     *       last()
	     * -----------------d|
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.last = function () {
	        return new Stream(new LastOperator(this));
	    };
	    /**
	     * Prepends the given `initial` value to the sequence of events emitted by the
	     * input stream. The returned stream is a MemoryStream, which means it is
	     * already `remember()`'d.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3---
	     *   startWith(0)
	     * 0--1---2-----3---
	     * ```
	     *
	     * @param initial The value or event to prepend.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.startWith = function (initial) {
	        return new MemoryStream(new StartWithOperator(this, initial));
	    };
	    /**
	     * Uses another stream to determine when to complete the current stream.
	     *
	     * When the given `other` stream emits an event or completes, the output
	     * stream will complete. Before that happens, the output stream will behaves
	     * like the input stream.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ---1---2-----3--4----5----6---
	     *   endWhen( --------a--b--| )
	     * ---1---2-----3--4--|
	     * ```
	     *
	     * @param other Some other stream that is used to know when should the output
	     * stream of this operator complete.
	     * @return {Stream}
	     */
	    Stream.prototype.endWhen = function (other) {
	        return new (this.ctor())(new EndWhenOperator(other, this));
	    };
	    /**
	     * "Folds" the stream onto itself.
	     *
	     * Combines events from the past throughout
	     * the entire execution of the input stream, allowing you to accumulate them
	     * together. It's essentially like `Array.prototype.reduce`. The returned
	     * stream is a MemoryStream, which means it is already `remember()`'d.
	     *
	     * The output stream starts by emitting the `seed` which you give as argument.
	     * Then, when an event happens on the input stream, it is combined with that
	     * seed value through the `accumulate` function, and the output value is
	     * emitted on the output stream. `fold` remembers that output value as `acc`
	     * ("accumulator"), and then when a new input event `t` happens, `acc` will be
	     * combined with that to produce the new `acc` and so forth.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * ------1-----1--2----1----1------
	     *   fold((acc, x) => acc + x, 3)
	     * 3-----4-----5--7----8----9------
	     * ```
	     *
	     * @param {Function} accumulate A function of type `(acc: R, t: T) => R` that
	     * takes the previous accumulated value `acc` and the incoming event from the
	     * input stream and produces the new accumulated value.
	     * @param seed The initial accumulated value, of type `R`.
	     * @return {MemoryStream}
	     */
	    Stream.prototype.fold = function (accumulate, seed) {
	        return new MemoryStream(new FoldOperator(accumulate, seed, this));
	    };
	    /**
	     * Replaces an error with another stream.
	     *
	     * When (and if) an error happens on the input stream, instead of forwarding
	     * that error to the output stream, *replaceError* will call the `replace`
	     * function which returns the stream that the output stream will replicate.
	     * And, in case that new stream also emits an error, `replace` will be called
	     * again to get another stream to start replicating.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1---2-----3--4-----X
	     *   replaceError( () => --10--| )
	     * --1---2-----3--4--------10--|
	     * ```
	     *
	     * @param {Function} replace A function of type `(err) => Stream` that takes
	     * the error that occurred on the input stream or on the previous replacement
	     * stream and returns a new stream. The output stream will behave like the
	     * stream that this function returns.
	     * @return {Stream}
	     */
	    Stream.prototype.replaceError = function (replace) {
	        return new (this.ctor())(new ReplaceErrorOperator(replace, this));
	    };
	    /**
	     * Flattens a "stream of streams", handling only one nested stream at a time
	     * (no concurrency).
	     *
	     * If the input stream is a stream that emits streams, then this operator will
	     * return an output stream which is a flat stream: emits regular events. The
	     * flattening happens without concurrency. It works like this: when the input
	     * stream emits a nested stream, *flatten* will start imitating that nested
	     * one. However, as soon as the next nested stream is emitted on the input
	     * stream, *flatten* will forget the previous nested one it was imitating, and
	     * will start imitating the new nested one.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --+--------+---------------
	     *   \        \
	     *    \       ----1----2---3--
	     *    --a--b----c----d--------
	     *           flatten
	     * -----a--b------1----2---3--
	     * ```
	     *
	     * @return {Stream}
	     */
	    Stream.prototype.flatten = function () {
	        var p = this._prod;
	        return new Stream(p instanceof MapOperator && !(p instanceof FilterMapOperator) ?
	            new MapFlattenOperator(p) :
	            new FlattenOperator(this));
	    };
	    /**
	     * Passes the input stream to a custom operator, to produce an output stream.
	     *
	     * *compose* is a handy way of using an existing function in a chained style.
	     * Instead of writing `outStream = f(inStream)` you can write
	     * `outStream = inStream.compose(f)`.
	     *
	     * @param {function} operator A function that takes a stream as input and
	     * returns a stream as well.
	     * @return {Stream}
	     */
	    Stream.prototype.compose = function (operator) {
	        return operator(this);
	    };
	    /**
	     * Returns an output stream that behaves like the input stream, but also
	     * remembers the most recent event that happens on the input stream, so that a
	     * newly added listener will immediately receive that memorised event.
	     *
	     * @return {MemoryStream}
	     */
	    Stream.prototype.remember = function () {
	        return new MemoryStream(new RememberOperator(this));
	    };
	    /**
	     * Returns an output stream that identically behaves like the input stream,
	     * but also runs a `spy` function fo each event, to help you debug your app.
	     *
	     * *debug* takes a `spy` function as argument, and runs that for each event
	     * happening on the input stream. If you don't provide the `spy` argument,
	     * then *debug* will just `console.log` each event. This helps you to
	     * understand the flow of events through some operator chain.
	     *
	     * Please note that if the output stream has no listeners, then it will not
	     * start, which means `spy` will never run because no actual event happens in
	     * that case.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3-----4--
	     *         debug
	     * --1----2-----3-----4--
	     * ```
	     *
	     * @param {function} labelOrSpy A string to use as the label when printing
	     * debug information on the console, or a 'spy' function that takes an event
	     * as argument, and does not need to return anything.
	     * @return {Stream}
	     */
	    Stream.prototype.debug = function (labelOrSpy) {
	        return new (this.ctor())(new DebugOperator(labelOrSpy, this));
	    };
	    /**
	     * *imitate* changes this current Stream to emit the same events that the
	     * `other` given Stream does. This method returns nothing.
	     *
	     * This method exists to allow one thing: **circular dependency of streams**.
	     * For instance, let's imagine that for some reason you need to create a
	     * circular dependency where stream `first$` depends on stream `second$`
	     * which in turn depends on `first$`:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var first$ = second$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * ```
	     *
	     * However, that is invalid JavaScript, because `second$` is undefined
	     * on the first line. This is how *imitate* can help solve it:
	     *
	     * ```js
	     * import delay from 'xstream/extra/delay'
	     *
	     * var secondProxy$ = xs.create();
	     * var first$ = secondProxy$.map(x => x * 10).take(3);
	     * var second$ = first$.map(x => x + 1).startWith(1).compose(delay(100));
	     * secondProxy$.imitate(second$);
	     * ```
	     *
	     * We create `secondProxy$` before the others, so it can be used in the
	     * declaration of `first$`. Then, after both `first$` and `second$` are
	     * defined, we hook `secondProxy$` with `second$` with `imitate()` to tell
	     * that they are "the same". `imitate` will not trigger the start of any
	     * stream, it just binds `secondProxy$` and `second$` together.
	     *
	     * The following is an example where `imitate()` is important in Cycle.js
	     * applications. A parent component contains some child components. A child
	     * has an action stream which is given to the parent to define its state:
	     *
	     * <!-- skip-example -->
	     * ```js
	     * const childActionProxy$ = xs.create();
	     * const parent = Parent({...sources, childAction$: childActionProxy$});
	     * const childAction$ = parent.state$.map(s => s.child.action$).flatten();
	     * childActionProxy$.imitate(childAction$);
	     * ```
	     *
	     * Note, though, that **`imitate()` does not support MemoryStreams**. If we
	     * would attempt to imitate a MemoryStream in a circular dependency, we would
	     * either get a race condition (where the symptom would be "nothing happens")
	     * or an infinite cyclic emission of values. It's useful to think about
	     * MemoryStreams as cells in a spreadsheet. It doesn't make any sense to
	     * define a spreadsheet cell `A1` with a formula that depends on `B1` and
	     * cell `B1` defined with a formula that depends on `A1`.
	     *
	     * If you find yourself wanting to use `imitate()` with a
	     * MemoryStream, you should rework your code around `imitate()` to use a
	     * Stream instead. Look for the stream in the circular dependency that
	     * represents an event stream, and that would be a candidate for creating a
	     * proxy Stream which then imitates the target Stream.
	     *
	     * @param {Stream} target The other stream to imitate on the current one. Must
	     * not be a MemoryStream.
	     */
	    Stream.prototype.imitate = function (target) {
	        if (target instanceof MemoryStream) {
	            throw new Error('A MemoryStream was given to imitate(), but it only ' +
	                'supports a Stream. Read more about this restriction here: ' +
	                'https://github.com/staltz/xstream#faq');
	        }
	        this._target = target;
	        for (var ils = this._ils, N = ils.length, i = 0; i < N; i++) {
	            target._add(ils[i]);
	        }
	        this._ils = [];
	    };
	    /**
	     * Forces the Stream to emit the given value to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param value The "next" value you want to broadcast to all listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendNext = function (value) {
	        this._n(value);
	    };
	    /**
	     * Forces the Stream to emit the given error to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     *
	     * @param {any} error The error you want to broadcast to all the listeners of
	     * this Stream.
	     */
	    Stream.prototype.shamefullySendError = function (error) {
	        this._e(error);
	    };
	    /**
	     * Forces the Stream to emit the "completed" event to its listeners.
	     *
	     * As the name indicates, if you use this, you are most likely doing something
	     * The Wrong Way. Please try to understand the reactive way before using this
	     * method. Use it only when you know what you are doing.
	     */
	    Stream.prototype.shamefullySendComplete = function () {
	        this._c();
	    };
	    /**
	     * Blends multiple streams together, emitting events from all of them
	     * concurrently.
	     *
	     * *merge* takes multiple streams as arguments, and creates a stream that
	     * behaves like each of the argument streams, in parallel.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b----c---d------
	     *            merge
	     * --1-a--2--b--3-c---d--4---
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to merge together with other streams.
	     * @param {Stream} stream2 A stream to merge together with other streams. Two
	     * or more streams may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.merge = function merge() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new MergeProducer(streams));
	    };
	    /**
	     * Combines multiple input streams together to return a stream whose events
	     * are arrays that collect the latest events from each input stream.
	     *
	     * *combine* internally remembers the most recent event from each of the input
	     * streams. When any of the input streams emits an event, that event together
	     * with all the other saved events are combined into an array. That array will
	     * be emitted on the output stream. It's essentially a way of joining together
	     * the events from multiple streams.
	     *
	     * Marble diagram:
	     *
	     * ```text
	     * --1----2-----3--------4---
	     * ----a-----b-----c--d------
	     *          combine
	     * ----1a-2a-2b-3b-3c-3d-4d--
	     * ```
	     *
	     * @factory true
	     * @param {Stream} stream1 A stream to combine together with other streams.
	     * @param {Stream} stream2 A stream to combine together with other streams.
	     * Multiple streams, not just two, may be given as arguments.
	     * @return {Stream}
	     */
	    Stream.combine = function combine() {
	        var streams = [];
	        for (var _i = 0; _i < arguments.length; _i++) {
	            streams[_i - 0] = arguments[_i];
	        }
	        return new Stream(new CombineProducer(streams));
	    };
	    return Stream;
	}());
	exports.Stream = Stream;
	var MemoryStream = (function (_super) {
	    __extends(MemoryStream, _super);
	    function MemoryStream(producer) {
	        _super.call(this, producer);
	        this._has = false;
	    }
	    MemoryStream.prototype._n = function (x) {
	        this._v = x;
	        this._has = true;
	        _super.prototype._n.call(this, x);
	    };
	    MemoryStream.prototype._add = function (il) {
	        if (this._has) {
	            il._n(this._v);
	        }
	        _super.prototype._add.call(this, il);
	    };
	    MemoryStream.prototype._stopNow = function () {
	        this._has = false;
	        _super.prototype._stopNow.call(this);
	    };
	    MemoryStream.prototype._x = function () {
	        this._has = false;
	        _super.prototype._x.call(this);
	    };
	    MemoryStream.prototype.map = function (project) {
	        return this._map(project);
	    };
	    MemoryStream.prototype.mapTo = function (projectedValue) {
	        return _super.prototype.mapTo.call(this, projectedValue);
	    };
	    MemoryStream.prototype.take = function (amount) {
	        return _super.prototype.take.call(this, amount);
	    };
	    MemoryStream.prototype.endWhen = function (other) {
	        return _super.prototype.endWhen.call(this, other);
	    };
	    MemoryStream.prototype.replaceError = function (replace) {
	        return _super.prototype.replaceError.call(this, replace);
	    };
	    MemoryStream.prototype.remember = function () {
	        return this;
	    };
	    MemoryStream.prototype.debug = function (labelOrSpy) {
	        return _super.prototype.debug.call(this, labelOrSpy);
	    };
	    return MemoryStream;
	}(Stream));
	exports.MemoryStream = MemoryStream;
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Stream;
	//# sourceMappingURL=core.js.map

/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(314);
	var DelayOperator = (function () {
	    function DelayOperator(dt, ins) {
	        this.dt = dt;
	        this.ins = ins;
	        this.type = 'delay';
	        this.out = null;
	    }
	    DelayOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    DelayOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = null;
	    };
	    DelayOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (!u)
	            return;
	        var id = setInterval(function () {
	            u._n(t);
	            clearInterval(id);
	        }, this.dt);
	    };
	    DelayOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (!u)
	            return;
	        var id = setInterval(function () {
	            u._e(err);
	            clearInterval(id);
	        }, this.dt);
	    };
	    DelayOperator.prototype._c = function () {
	        var u = this.out;
	        if (!u)
	            return;
	        var id = setInterval(function () {
	            u._c();
	            clearInterval(id);
	        }, this.dt);
	    };
	    return DelayOperator;
	}());
	/**
	 * Delays periodic events by a given time period.
	 *
	 * Marble diagram:
	 *
	 * ```text
	 * 1----2--3--4----5|
	 *     delay(60)
	 * ---1----2--3--4----5|
	 * ```
	 *
	 * Example:
	 *
	 * ```js
	 * import fromDiagram from 'xstream/extra/fromDiagram'
	 * import delay from 'xstream/extra/delay'
	 *
	 * const stream = fromDiagram('1----2--3--4----5|')
	 *  .compose(delay(60))
	 *
	 * stream.addListener({
	 *   next: i => console.log(i),
	 *   error: err => console.error(err),
	 *   complete: () => console.log('completed')
	 * })
	 * ```
	 *
	 * ```text
	 * > 1  (after 60 ms)
	 * > 2  (after 160 ms)
	 * > 3  (after 220 ms)
	 * > 4  (after 280 ms)
	 * > 5  (after 380 ms)
	 * > completed
	 * ```
	 *
	 * @param {number} period The amount of silence required in milliseconds.
	 * @return {Stream}
	 */
	function delay(period) {
	    return function delayOperator(ins) {
	        return new core_1.Stream(new DelayOperator(period, ins));
	    };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = delay;
	//# sourceMappingURL=delay.js.map

/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(314);
	var empty = {};
	var DropRepeatsOperator = (function () {
	    function DropRepeatsOperator(fn, ins) {
	        this.fn = fn;
	        this.ins = ins;
	        this.type = 'dropRepeats';
	        this.out = null;
	        this.v = empty;
	    }
	    DropRepeatsOperator.prototype._start = function (out) {
	        this.out = out;
	        this.ins._add(this);
	    };
	    DropRepeatsOperator.prototype._stop = function () {
	        this.ins._remove(this);
	        this.out = null;
	        this.v = empty;
	    };
	    DropRepeatsOperator.prototype.isEq = function (x, y) {
	        return this.fn ? this.fn(x, y) : x === y;
	    };
	    DropRepeatsOperator.prototype._n = function (t) {
	        var u = this.out;
	        if (!u)
	            return;
	        var v = this.v;
	        if (v !== empty && this.isEq(t, v))
	            return;
	        this.v = Array.isArray(t) ? t.slice() : t;
	        u._n(t);
	    };
	    DropRepeatsOperator.prototype._e = function (err) {
	        var u = this.out;
	        if (!u)
	            return;
	        u._e(err);
	    };
	    DropRepeatsOperator.prototype._c = function () {
	        var u = this.out;
	        if (!u)
	            return;
	        u._c();
	    };
	    return DropRepeatsOperator;
	}());
	exports.DropRepeatsOperator = DropRepeatsOperator;
	/**
	 * Drops consecutive duplicate values in a stream.
	 *
	 * Marble diagram:
	 *
	 * ```text
	 * --1--2--1--1--1--2--3--4--3--3|
	 *     dropRepeats
	 * --1--2--1--------2--3--4--3---|
	 * ```
	 *
	 * Example:
	 *
	 * ```js
	 * import dropRepeats from 'xstream/extra/dropRepeats'
	 *
	 * const stream = xs.of(1, 2, 1, 1, 1, 2, 3, 4, 3, 3)
	 *   .compose(dropRepeats())
	 *
	 * stream.addListener({
	 *   next: i => console.log(i),
	 *   error: err => console.error(err),
	 *   complete: () => console.log('completed')
	 * })
	 * ```
	 *
	 * ```text
	 * > 1
	 * > 2
	 * > 1
	 * > 2
	 * > 3
	 * > 4
	 * > 3
	 * > completed
	 * ```
	 *
	 * Example with a custom isEqual function:
	 *
	 * ```js
	 * import dropRepeats from 'xstream/extra/dropRepeats'
	 *
	 * const stream = xs.of('a', 'b', 'a', 'A', 'B', 'b')
	 *   .compose(dropRepeats((x, y) => x.toLowerCase() === y.toLowerCase()))
	 *
	 * stream.addListener({
	 *   next: i => console.log(i),
	 *   error: err => console.error(err),
	 *   complete: () => console.log('completed')
	 * })
	 * ```
	 *
	 * ```text
	 * > a
	 * > b
	 * > a
	 * > B
	 * > completed
	 * ```
	 *
	 * @param {Function} isEqual An optional function of type
	 * `(x: T, y: T) => boolean` that takes an event from the input stream and
	 * checks if it is equal to previous event, by returning a boolean.
	 * @return {Stream}
	 */
	function dropRepeats(isEqual) {
	    if (isEqual === void 0) { isEqual = null; }
	    return function dropRepeatsOperator(ins) {
	        return new core_1.Stream(new DropRepeatsOperator(isEqual, ins));
	    };
	}
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = dropRepeats;
	//# sourceMappingURL=dropRepeats.js.map

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Sniffer = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _dom = __webpack_require__(10);

	var _collection = __webpack_require__(312);

	var _collection2 = _interopRequireDefault(_collection);

	var _xstream = __webpack_require__(4);

	var _xstream2 = _interopRequireDefault(_xstream);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	var formatSniffLine = function formatSniffLine(data) {
	  var _class;

	  var selected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  var memep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  var line = [(0, _dom.span)({
	    class: { req: true, open: selected != 0 },
	    attrs: { _id: data.req.id }
	  }, data.req.method + '(' + data.req.params.map(function (e) {
	    return JSON.stringify(e);
	  }).join(", ") + ')')];
	  if (selected != 0) {
	    line.push((0, _dom.span)(".resp", JSON.stringify(data.resp, false, 2)));
	  }
	  var succ = false;
	  if (data.req.method === "eth_call" && "addrs" in memep && data.req.params[0].to in memep.addrs) succ = true;

	  return (0, _dom.li)({
	    class: (_class = {
	      sniffline: true,
	      open: selected != 0
	    }, _defineProperty(_class, "id" + data.req.id, true), _defineProperty(_class, 'success', succ), _class)
	  }, line);
	};

	var Line = function Line(sources) {
	  var expanded$ = sources.DOM.select(".req").events("click").fold(function (acc) {
	    return !acc;
	  }, false);

	  var vdom$ = expanded$.map(function (isExpanded) {
	    return formatSniffLine(sources.comm, isExpanded, sources.memp);
	  });

	  return {
	    DOM: vdom$
	  };
	};

	var Sniffer = exports.Sniffer = function Sniffer(sources) {

	  var logState$ = _xstream2.default.combine(sources.Sniffer, sources.memepool$).map(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        comm = _ref2[0],
	        memp = _ref2[1];

	    return { comm: comm, memp: memp };
	  });

	  var lineList$ = (0, _collection2.default)(Line, sources, logState$);
	  var lines$ = _collection2.default.pluck(lineList$, function (item) {
	    return item.DOM;
	  });

	  var vdom$ = lines$.map(function (lines) {
	    return (0, _dom.div)(".sniffer", [(0, _dom.div)(".controllBar", []), (0, _dom.ul)("", lines)]);
	  });

	  return {
	    DOM: vdom$
	  };
	};

/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Memepool = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

	var _xstream = __webpack_require__(4);

	var _xstream2 = _interopRequireDefault(_xstream);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Memepool = exports.Memepool = function Memepool(sources) {

	  var memepool$ = sources.HTTP.select('expert').flatten().debug("res").map(function (res) {
	    return JSON.parse(res.text);
	  }).fold(function (acc, meme) {
	    acc.addrs[meme.address] = meme;
	    return acc;
	  }, { addrs: {} }).debug("meme");

	  var discoveredAddrs$ = sources.Sniffer.filter(function (comm) {
	    return comm.req.method === "eth_call";
	  }).map(function (comm) {
	    return comm.req.params[0].to;
	  });

	  var request$ = _xstream2.default.combine(discoveredAddrs$, memepool$).filter(function (_ref) {
	    var _ref2 = _slicedToArray(_ref, 2),
	        addr = _ref2[0],
	        memepool = _ref2[1];

	    return !(addr in memepool.addrs);
	  }).map(function (_ref3) {
	    var _ref4 = _slicedToArray(_ref3, 2),
	        addr = _ref4[0],
	        _ = _ref4[1];

	    return {
	      url: 'https://4zgkma87x3.execute-api.us-east-1.amazonaws.com/dev/get',
	      method: 'GET',
	      query: { "address": addr },
	      category: 'expert'
	    };
	  });

	  return {
	    state$: memepool$,
	    HTTP: request$
	  };
	};

/***/ }
/******/ ]);