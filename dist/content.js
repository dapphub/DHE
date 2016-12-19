// if(window.web3) {
//   var a = window.web3.currentProvider.sendAsync;
//   window.web3.currentProvider.sendAsync = function () {
//     var args = Array.prototype.slice.call(arguments);
//     console.log(args);
//     a.bind(window.web3.currentProvider, args)
//   }
// }

// var _web3;
// Object.defineProperty(window, 'web3', {
//   set: (web3) => {
//     console.log("SETTING WEB3");
//     if(!_web3) {
//       var a = web3.currentProvider.sendAsync;
//       web3.currentProvider.sendAsync = function () {
//         var args = Array.prototype.slice.call(arguments);
//         console.log(args);
//         a.bind(web3.currentProvider, args)
//       }
//     }
//     _web3 = web3;
//   },
//   get: () => {
//     console.log("getting web3");
//     return _web3;
//   }
// });
//
//
// window.onload = function () {
//   // var filter = web3.eth.filter("latest");
//   //
//   // filter.watch((err, obj) => {
//   //   window.postMessage({ type: "FROM_PAGE", block: obj }, "*");
//   // })
//
// }
