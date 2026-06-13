const { TextEncoder, TextDecoder } = require('util');
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;
require('whatwg-fetch');
const { TransformStream } = require('stream/web');
globalThis.TransformStream = TransformStream;

if (typeof globalThis.BroadcastChannel === 'undefined') {
  class FakeBroadcastChannel {
    constructor(channel) { this.name = channel; }
    postMessage() {}
    close() {}
    addEventListener() {}
    removeEventListener() {}
  }
  globalThis.BroadcastChannel = FakeBroadcastChannel;
}
