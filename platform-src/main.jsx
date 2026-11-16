import React from 'react';
import { createRoot } from 'react-dom/client';
import { GamePlatformApp } from './GamePlatformApp.jsx';
import { createUserProvider } from './user-provider.js';
import './platform.css';

export function mountGamePlatform(container, options = {}) {
  const hostConfig = (typeof window !== 'undefined' && window.__GAMEBOX_PLATFORM_CONFIG__) || {};
  const merged = { ...hostConfig, ...options };

  const userProvider =
    merged.userProvider ||
    createUserProvider({
      mode: merged.mode || 'mock',
      externalUser: merged.externalUser || null,
      getUserFn: merged.getUserFn || null,
      initialUserId: merged.initialUserId || null,
    });

  const root = createRoot(container);
  root.render(
    <GamePlatformApp
      userProvider={userProvider}
      apiBaseUrl={merged.apiBaseUrl || '/api/platform'}
    />
  );
  return { root, userProvider };
}

if (typeof document !== 'undefined') {
  const el = document.getElementById('gamebox-platform-root');
  if (el) {
    mountGamePlatform(el);
  }
}
