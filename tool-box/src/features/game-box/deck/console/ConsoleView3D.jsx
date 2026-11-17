import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { createGameDeckConsoleScene } from './GameDeckConsoleScene.js';

/**
 * ConsoleView3D
 * React wrapper hosting the Three.js procedural GAME DECK 3D console.
 */
const ConsoleView3D = forwardRef(function ConsoleView3D(
  {
    onLoaded,
    className = '',
    style = {},
  },
  ref
) {
  const mountRef = useRef(null);
  const sceneApiRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = createGameDeckConsoleScene(container, {
      antialias: true,
      shadows: true,
      maxPixelRatio: 2,
    });
    sceneApiRef.current = scene;

    if (onLoaded) {
      onLoaded(scene);
    }

    return () => {
      scene.dispose();
      sceneApiRef.current = null;
    };
  }, []);

  useImperativeHandle(ref, () => ({
    insertDisc: async (game) => {
      if (sceneApiRef.current) {
        return sceneApiRef.current.insertDisc(game);
      }
    },
    ejectDisc: async () => {
      if (sceneApiRef.current) {
        return sceneApiRef.current.ejectDisc();
      }
    },
    openTray: async () => {
      if (sceneApiRef.current) {
        return sceneApiRef.current.openTray();
      }
    },
    closeTray: async () => {
      if (sceneApiRef.current) {
        return sceneApiRef.current.closeTray();
      }
    },
    setPower: async (on) => {
      if (sceneApiRef.current) {
        return sceneApiRef.current.setPower(on);
      }
    },
    hasDisc: () => {
      return sceneApiRef.current ? sceneApiRef.current.hasDisc() : false;
    },
    invalidate: () => {
      if (sceneApiRef.current) {
        sceneApiRef.current.invalidate();
      }
    },
  }));

  return (
    <div
      ref={mountRef}
      className={`gb-console-3d-mount ${className}`}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '260px',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    />
  );
});

export default ConsoleView3D;
