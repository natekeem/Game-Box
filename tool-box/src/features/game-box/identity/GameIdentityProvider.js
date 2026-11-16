import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  loadGuestIdentity,
  saveGuestNickname,
  sanitizeAndValidateNickname,
} from './guestIdentity.js';
import { registerOrSyncPlayerApi, updatePlayerNicknameApi } from '../ranking/rankingApi.js';

/**
 * Identity Adapter Interface:
 * - getIdentity(): { playerId, guestId, nickname, createdAt, updatedAt, isRegistered, identityType }
 * - updateNickname(nickname): Promise<Identity>
 */
export class GuestIdentityAdapter {
  getIdentity() {
    const data = loadGuestIdentity();
    return {
      playerId: data.guestId,
      guestId: data.guestId,
      nickname: data.nickname,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      isRegistered: data.isRegistered,
      identityType: 'guest',
    };
  }

  async updateNickname(newNickname) {
    const saved = saveGuestNickname(newNickname);
    const identity = {
      playerId: saved.guestId,
      guestId: saved.guestId,
      nickname: saved.nickname,
      createdAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      isRegistered: true,
      identityType: 'guest',
    };
    const synced = await registerOrSyncPlayerApi(identity);
    return {
      ...identity,
      ...(synced?.player ? {
        nickname: synced.player.nickname,
        createdAt: synced.player.createdAt,
        updatedAt: synced.player.updatedAt,
      } : {}),
    };
  }
}

/**
 * Future Host Login Account Adapter:
 * Pass an instance of this adapter to <GameIdentityProvider adapter={...}> when
 * integrating into the Tool Box authenticated environment.
 */
export class AuthenticatedIdentityAdapter {
  constructor({ userId, nickname, createdAt = null, onUpdateNickname = null }) {
    this.userId = String(userId);
    this.nickname = String(nickname || '');
    this.createdAt = createdAt || new Date().toISOString();
    this.onUpdateNickname = onUpdateNickname;
  }

  getIdentity() {
    return {
      playerId: this.userId,
      guestId: this.userId,
      nickname: this.nickname,
      createdAt: this.createdAt,
      updatedAt: this.createdAt,
      isRegistered: Boolean(this.nickname),
      identityType: 'authenticated',
    };
  }

  async updateNickname(newNickname) {
    const check = sanitizeAndValidateNickname(newNickname);
    if (!check.valid) throw new Error(check.error);
    this.nickname = check.value;
    if (typeof this.onUpdateNickname === 'function') {
      await this.onUpdateNickname(check.value);
    }
    const identity = this.getIdentity();
    await updatePlayerNicknameApi(identity.playerId, identity.nickname);
    return identity;
  }
}

const GameIdentityContext = createContext(null);

export function GameIdentityProvider({ adapter = null, children }) {
  const activeAdapter = useMemo(() => adapter || new GuestIdentityAdapter(), [adapter]);
  const [identity, setIdentity] = useState(() => activeAdapter.getIdentity());
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [syncError, setSyncError] = useState(null);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState(() => !activeAdapter.getIdentity().isRegistered);

  // Sync existing registered identity with backend on mount
  useEffect(() => {
    let cancelled = false;
    const current = activeAdapter.getIdentity();
    setIdentity(current);
    if (!current.isRegistered) {
      setIsNicknameModalOpen(true);
      return;
    }

    setSyncStatus('syncing');
    registerOrSyncPlayerApi(current)
      .then(res => {
        if (cancelled) return;
        if (res?.player) {
          setIdentity(prev => ({
            ...prev,
            nickname: res.player.nickname || prev.nickname,
            createdAt: res.player.createdAt || prev.createdAt,
            updatedAt: res.player.updatedAt || prev.updatedAt,
            isRegistered: true,
          }));
        }
        setSyncStatus('synced');
        setSyncError(null);
      })
      .catch(err => {
        if (cancelled) return;
        setSyncStatus('error');
        setSyncError(err.message || '서버와 사용자 정보를 동기화하지 못했습니다.');
      });

    return () => {
      cancelled = true;
    };
  }, [activeAdapter]);

  const registerOrChangeNickname = useCallback(async (rawNickname) => {
    setSyncStatus('syncing');
    setSyncError(null);
    try {
      const updated = await activeAdapter.updateNickname(rawNickname);
      setIdentity(updated);
      setSyncStatus('synced');
      setIsNicknameModalOpen(false);
      // Broadcast identity change to any embedded Windows 98 / game iframes
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('game-box:identity-changed', { detail: updated }));
      }
      return { ok: true, identity: updated };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setSyncStatus('error');
      setSyncError(message);
      return { ok: false, error: message };
    }
  }, [activeAdapter]);

  const openNicknameModal = useCallback(() => {
    setSyncError(null);
    setIsNicknameModalOpen(true);
  }, []);

  const closeNicknameModal = useCallback(() => {
    if (identity.isRegistered) {
      setIsNicknameModalOpen(false);
    }
  }, [identity.isRegistered]);

  const value = useMemo(() => ({
    identity,
    syncStatus,
    syncError,
    isNicknameModalOpen,
    openNicknameModal,
    closeNicknameModal,
    registerOrChangeNickname,
    validateNickname: sanitizeAndValidateNickname,
  }), [
    identity,
    syncStatus,
    syncError,
    isNicknameModalOpen,
    openNicknameModal,
    closeNicknameModal,
    registerOrChangeNickname,
  ]);

  return (
    <GameIdentityContext.Provider value={value}>
      {children}
    </GameIdentityContext.Provider>
  );
}

export function useGameIdentity() {
  const ctx = useContext(GameIdentityContext);
  if (!ctx) {
    throw new Error('useGameIdentity must be used within a <GameIdentityProvider>');
  }
  return ctx;
}
