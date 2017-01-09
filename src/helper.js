import {span, div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import xs from 'xstream';

export const json = (json) => span(".jsonDisplay", JSON.stringify(json, false, 2))


export const member = (C, sources) => in$ =>
in$.fold((parent, state) => {
  let arr = new Array(state.length);
  state.forEach((e,i) => {
    if(i in parent) {
      arr[i] = parent[i];
    } else {
      arr[i] = isolate(C, i)(sources);
    }
  })
  return arr;
}, [])

// ------ {etwas}
//         \____ case 1: etwas === 1 ----- >
//          \___ case 2: etwas === 3 --- >
export const componentSwitch = (keyf, C, sources) => (in$) =>
in$.fold((old, state) => {
  // Remember Atom if the type didn't change
  if(old.type === keyf(state)) return old;
  // Default component in case nothing is found
  const _default = () => ({
    DOM: xs.of(div("component not found")),
    onion: xs.of()
  })
  // List of components we can display atomically
  return {
    c: (C[keyf(state)] || _default)(sources),
    type: keyf(state)
  }
}, {
  c: {
    DOM: xs.of(),
    onion: xs.of()
  },
  type: ""
})
