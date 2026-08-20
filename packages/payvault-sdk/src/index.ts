// Runtime deprecation notification
if (typeof console !== 'undefined' && typeof console.warn === 'function') {
  console.warn(
    '\n[DEPRECATED] payvault-sdk is deprecated and has been rebranded to quirk-sdk.\n' +
    'Please migrate your dependencies:\n' +
    '  npm uninstall payvault-sdk\n' +
    '  npm install quirk-sdk\n' +
    'For documentation and migration notes, visit: https://github.com/T9ner/quirk\n'
  );
}

// Re-export everything from quirk-sdk
export * from 'quirk-sdk';

// Legacy compatibility aliases
import { Quirk } from 'quirk-sdk';
export const Payvault = Quirk;
export const PayvaultClient = Quirk;
export default Quirk;
