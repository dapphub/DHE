import {setupPanel} from './devtools.js'

chrome.devtools.panels.create("DappHub","chrome.png", "panel.html", setupPanel)
