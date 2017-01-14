import xs from 'xstream';

// TODO - improve SnifferDriver
// * rename to Bridge/ DHEBridge
// * include isolateSource/isolateSink functions
// * allow filter on namespaces according to
//    https://github.com/cyclejs/cyclejs/blob/master/http/src/isolate.ts
export default function DHEBridge({
  onout,
  in$
}) {
  return function dheBridgeDriver(out$) {
    out$
    .addListener({
      next: (cmd) => {
        onout && onout(cmd);
      },
      error: e => console.error(e),
      complete: e => console.log(e)
    })

    return xs.merge(in$ || xs.of());
  }
}
