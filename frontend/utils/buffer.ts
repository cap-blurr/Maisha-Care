export const initializeBuffer = () => {
    if (typeof window !== 'undefined' && !window.Buffer) {
      window.Buffer = require('buffer/').Buffer;
    }
  };