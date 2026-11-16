import React from 'react';
import { createRoot } from 'react-dom/client';
import GameBox from './GameBox.js';

export function mountGameBoxApp(containerEl, props = {}) {
  const root = createRoot(containerEl);
  root.render(<GameBox {...props} />);
  return () => root.unmount();
}

if (typeof document !== 'undefined') {
  const autoRoot = document.getElementById('game-box-root');
  if (autoRoot) {
    mountGameBoxApp(autoRoot);
  }
}
