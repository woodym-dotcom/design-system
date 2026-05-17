/**
 * Kbd stories — single key, combos, sizes.
 */
import * as React from 'react';
import { Kbd } from '../react/Kbd';

export default {
  title: 'Foundation/Kbd',
  component: Kbd,
};

export function Default() {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16 }}>
      <div>Single: <Kbd keys="K" /></div>
      <div>Combo: <Kbd keys={['mod', 'K']} /></div>
      <div>Small: <Kbd keys={['shift', 'enter']} size="sm" /></div>
      <div>Arrows: <Kbd keys="up" /> <Kbd keys="down" /> <Kbd keys="left" /> <Kbd keys="right" /></div>
    </div>
  );
}
