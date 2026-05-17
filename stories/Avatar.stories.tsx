/**
 * Avatar stories — initials, image, sizes, shapes.
 */
import * as React from 'react';
import { Avatar } from '../react/Avatar';

export default {
  title: 'Foundation/Avatar',
  component: Avatar,
};

export function Default() {
  return (
    <div style={{ padding: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar name="Jane Doe" size="xs" />
      <Avatar name="Jane Doe" size="sm" />
      <Avatar name="Jane Doe" size="md" />
      <Avatar name="Jane Doe" size="lg" />
      <Avatar name="Jane Doe" size="xl" />
    </div>
  );
}

export function Roster() {
  const names = ['Jane Doe', 'Sam Patel', 'Chen Wei', 'Olu Kuti', 'Marta Ortiz', 'Aiyana Bear'];
  return (
    <div style={{ padding: 24, display: 'flex', gap: 8 }}>
      {names.map((n) => <Avatar key={n} name={n} size="md" />)}
    </div>
  );
}

export function Square() {
  return (
    <div style={{ padding: 24, display: 'flex', gap: 12 }}>
      <Avatar name="Acme Co" shape="square" size="lg" />
      <Avatar name="Beta Ltd" shape="square" size="lg" />
    </div>
  );
}
