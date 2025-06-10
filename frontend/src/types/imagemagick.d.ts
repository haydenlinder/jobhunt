/* eslint-disable */

declare module 'imagemagick' {
  export function convert(args: string[], callback: (err: any, stdout: string) => void): void;
  export function identify(args: string[], callback: (err: any, features: any) => void): void;
  export function identify(path: string, callback: (err: any, features: any) => void): void;
  export function readMetadata(path: string, callback: (err: any, metadata: any) => void): void;
  export function resize(options: any, callback: (err: any, features: any) => void): void;
}
