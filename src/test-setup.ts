// Test setup file for Jest

import '@testing-library/jest-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock as any;

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    onLine: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
    credentials: {
      create: jest.fn(),
      get: jest.fn(),
      isUserVerifyingPlatformAuthenticatorAvailable: jest.fn().mockResolvedValue(false)
    }
  },
  writable: true
});

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true
});

// Mock console methods to reduce noise in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is deprecated')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillMount') ||
       args[0].includes('componentWillReceiveProps'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Clear all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  (global.fetch as jest.Mock).mockClear();
});

// Add custom matchers for mobile testing
expect.extend({
  toHaveMinimumTouchTarget(received: HTMLElement) {
    const rect = received.getBoundingClientRect();
    const minSize = 44; // 44px minimum touch target size
    
    const pass = rect.width >= minSize && rect.height >= minSize;
    
    if (pass) {
      return {
        message: () => `Expected element not to have minimum touch target size of ${minSize}px`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected element to have minimum touch target size of ${minSize}px, but got ${rect.width}x${rect.height}`,
        pass: false,
      };
    }
  },
  
  toBeAccessible(received: HTMLElement) {
    const hasAriaLabel = received.hasAttribute('aria-label');
    const hasAriaLabelledBy = received.hasAttribute('aria-labelledby');
    const hasAriaDescribedBy = received.hasAttribute('aria-describedby');
    const hasRole = received.hasAttribute('role');
    const hasTabIndex = received.hasAttribute('tabindex');
    
    const isAccessible = hasAriaLabel || hasAriaLabelledBy || hasAriaDescribedBy || hasRole || hasTabIndex;
    
    if (isAccessible) {
      return {
        message: () => `Expected element not to be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected element to have accessibility attributes (aria-label, aria-labelledby, aria-describedby, role, or tabindex)`,
        pass: false,
      };
    }
  }
});

// Extend Jest matchers type
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveMinimumTouchTarget(): R;
      toBeAccessible(): R;
    }
  }
}

// Mock CSS modules
const mockCSSModules = new Proxy({}, {
  get: (target, prop) => {
    return prop;
  }
});

// Mock image imports
jest.mock('\\.(jpg|jpeg|png|gif|svg)$', () => 'test-file-stub');

// Mock CSS imports
jest.mock('\\.(css|less|scss|sass)$', () => mockCSSModules);

// Setup viewport for mobile testing
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 375, // iPhone width
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 667, // iPhone height
});

// Mock touch events
const createTouchEvent = (type: string, touches: any[] = []) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'touches', {
    value: touches,
    enumerable: true
  });
  return event;
};

global.TouchEvent = createTouchEvent as any;

// Helper function to simulate mobile viewport
export const setMobileViewport = (width = 375, height = 667) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Helper function to simulate desktop viewport
export const setDesktopViewport = (width = 1024, height = 768) => {
  setMobileViewport(width, height);
};

// Helper function to simulate network status
export const setNetworkStatus = (online: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: online,
  });
  
  // Trigger online/offline event
  window.dispatchEvent(new Event(online ? 'online' : 'offline'));
};
