// Minimal type shim for react-dom — @ds/core only depends on createPortal,
// and we don't want to make @types/react-dom a hard build dependency.
declare module 'react-dom' {
  import type { ReactNode, ReactPortal } from 'react';
  export function createPortal(
    children: ReactNode,
    container: Element,
  ): ReactPortal;
}
