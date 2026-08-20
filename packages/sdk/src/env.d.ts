// Ambient type declarations for Node.js cryptographic and binary primitives
declare module 'crypto' {
  export function randomBytes(size: number): { toString(encoding: string): string };
  export function createHmac(algorithm: string, key: any): {
    update(data: any): any;
    digest(encoding?: string): any;
  };
  export function timingSafeEqual(a: any, b: any): boolean;
  export function createHash(algorithm: string): {
    update(data: any): any;
    digest(encoding?: string): any;
  };
}

declare class Buffer {
  static from(data: any, encoding?: string): any;
  static isBuffer(obj: any): boolean;
  toString(encoding?: string): string;
  length: number;
}
