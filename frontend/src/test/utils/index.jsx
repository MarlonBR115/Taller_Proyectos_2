import { render } from '@testing-library/react';


const AllTheProviders = ({ children }) => children;

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export const createMockPointerEvent = () => {
  const original = window.PointerEvent;
  window.PointerEvent = jest.fn().mockImplementation((type, init) => {
    return new MouseEvent(type, init);
  });
  window.PointerEvent.prototype = MouseEvent.prototype;
  return () => { window.PointerEvent = original };
};

export * from '@testing-library/react';
export { customRender as render };
