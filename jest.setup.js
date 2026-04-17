// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock CSS.supports for jsdom environment
if (typeof CSS === 'undefined') {
  global.CSS = {
    supports: (property, value) => {
      // Mock basic support for common CSS properties
      const supportedProperties = {
        'animation': ['none'],
        'transform': ['translate3d(0,0,0)', 'translateX(0)', 'translateY(0)', 'scale(1)'],
        'opacity': ['0', '1'],
      };
      
      return supportedProperties[property]?.includes(value) || false;
    }
  };
} else if (typeof CSS.supports !== 'function') {
  CSS.supports = (property, value) => {
    const supportedProperties = {
      'animation': ['none'],
      'transform': ['translate3d(0,0,0)', 'translateX(0)', 'translateY(0)', 'scale(1)'],
      'opacity': ['0', '1'],
    };
    
    return supportedProperties[property]?.includes(value) || false;
  };
}

// Mock window.matchMedia for jsdom environment
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Mock IntersectionObserver for Framer Motion animations
if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      // Immediately trigger the callback with isIntersecting: true
      this.callback([{ isIntersecting: true, intersectionRatio: 1 }]);
    }
    unobserve() {}
    disconnect() {}
  };
}

// Mock fetch for API calls in tests
if (typeof global.fetch === 'undefined') {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: [] }),
    })
  );
}
