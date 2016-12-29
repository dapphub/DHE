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
/***/ function(module, exports) {

	"use strict";

	////////
	////////
	var forkMode = true;
	var debug = false;
	////////
	////////


	var knownWeb3 = [];
	var injected = false;
	var cbBuffer = {};
	var injectingMiddleware = function injectingMiddleware(web3) {
	  if (injected) return true;
	  injected = true;
	  // knownWeb3.push(web3.currentProvider);

	  var _sendAsync = web3.currentProvider.sendAsync.bind(web3.currentProvider);

	  function injectedDapphub(payload, callback) {

	    if (!forkMode) {
	      _sendAsync(payload, function (err, res) {
	        window.postMessage({ type: "REQ", req: payload, res: res }, "*");
	        callback(err, res);
	      });
	    } else {

	      // Remember the callbacks from local web3
	      if (Array.isArray(payload)) {
	        if (debug) console.log(">", payload[0].id, payload[0].method);
	        cbBuffer[payload[0].id] = callback;
	      } else {
	        if (debug) console.log(">", payload.id, payload.method);
	        cbBuffer[payload.id] = callback;
	      }
	      window.postMessage({ type: "REQ", req: payload }, "*");
	    }
	  }
	  injectedDapphub.__DappHub = true;
	  // web3._requestManager.sendAsync = injectedDapphub.bind(web3._requestManager);
	  web3.currentProvider.sendAsync = injectedDapphub.bind(web3.currentProvider);
	  if (forkMode) {
	    window.addEventListener("message", function (msg) {
	      if (["RES"].indexOf(msg.data.type) === -1) {
	        return null;
	      }

	      // console.log(Object.keys(cbBuffer));
	      if (Array.isArray(msg.data.res)) {
	        if (debug) console.log("<", msg.data.res[0].id);
	        // msg.data.res[0].id in cbBuffer &&
	        cbBuffer[msg.data.res[0].id](null, msg.data.res);
	        delete cbBuffer[msg.data.res[0].id];
	      } else {
	        if (debug) console.log("<", msg.data.res.id);
	        // msg.data.res[0].id in cbBuffer &&
	        // console.log("id", msg.data.res.id);
	        // msg.data.res.id in cbBuffer &&
	        cbBuffer[msg.data.res.id](null, msg.data.res);
	        delete cbBuffer[msg.data.res.id];
	      }
	    });
	  }
	};

	if (window.web3) {
	  injectingMiddleware(window.web3);
	} else {
	  console.log("Injecting DappHub - no web3 found");

	  var _web3;
	  Object.defineProperty(window, 'web3', {
	    set: function set(web3) {
	      console.log("SETTING WEB3", web3);
	      injectingMiddleware(web3);
	      _web3 = web3;
	    },
	    get: function get() {
	      return _web3;
	    }
	  });
	}

/***/ }
/******/ ]);