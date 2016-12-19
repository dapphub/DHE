import {span} from '@cycle/dom';

export var json = (json) => span(".jsonDisplay", JSON.stringify(json, false, 2))
