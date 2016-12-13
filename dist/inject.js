function injectScript(file_path, tag) {
    var asd = document.getElementsByTagName(tag);
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.insertBefore(script, node.firstChild);
}
injectScript(chrome.extension.getURL('testrpc.bundle.js'), 'html');
injectScript(chrome.extension.getURL('content.js'), 'html');

//Listening to messages from DOM
window.addEventListener("message", function(event) {
  if(event.data.type != "WEB3_SNIFFER") return null;
  // console.log("send msg from content script");
  chrome.extension.sendMessage(event.data);
});
