const JsdomEnvironment = require('jest-environment-jsdom').default;

class CustomEnvironment extends JsdomEnvironment {
  async setup() {
    await super.setup();
    const nodeGlobals = [
      'TextEncoder', 'TextDecoder',
      'TransformStream', 'WritableStream', 'ReadableStream',
      'BroadcastChannel',
      'fetch', 'Request', 'Response', 'Headers',
    ];
    for (const name of nodeGlobals) {
      if (typeof globalThis[name] !== 'undefined' && typeof this.global[name] === 'undefined') {
        this.global[name] = globalThis[name];
      }
    }
  }
}

module.exports = CustomEnvironment;
