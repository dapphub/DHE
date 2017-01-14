function injectScript(file_path, tag) {
    var asd = document.getElementsByTagName(tag);
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.insertBefore(script, node.firstChild);
}
// injectScript(chrome.extension.getURL('testrpc.bundle.js'), 'html');
injectScript(chrome.extension.getURL('content.bundle.js'), 'html');

//Listening to messages from DOM
window.addEventListener("message", function(event) {
  if(["BRIDGE_OUT"].indexOf(event.data.type) === -1) return null;
  chrome.extension.sendMessage(event.data.msg);
});

chrome.extension.onMessage.addListener((msg, sender) => {
  window.postMessage({msg, type: "BRIDGE_IN"}, "*");
})
