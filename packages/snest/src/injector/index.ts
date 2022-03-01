const injectableClassSet = new Set<Function>();

function Injectable() {
  return function (_constructor: Function) {
    if (injectableClassSet.has(_constructor)) {
      return;
    } else {
      injectableClassSet.add(_constructor);
    }
  }
}

export { Injectable, injectableClassSet };
