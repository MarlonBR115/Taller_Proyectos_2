import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
import { beforeAll, afterAll, afterEach } from '@jest/globals';
import { server } from './mocks/server';
import { cleanup } from '@testing-library/react';

globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder;

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => { cleanup(); server.resetHandlers() });
afterAll(() => server.close());
