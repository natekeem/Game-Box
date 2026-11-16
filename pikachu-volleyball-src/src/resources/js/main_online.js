/**
 * This is the main script which executes the p2p online version game & offline vs computer/local game.
 */
'use strict';
import { settings } from '@pixi/settings';
import { SCALE_MODES } from '@pixi/constants';
import { Renderer, BatchRenderer, autoDetectRenderer } from '@pixi/core';
import { Prepare } from '@pixi/prepare';
import { Container } from '@pixi/display';
import { Loader } from '@pixi/loaders';
import { SpritesheetLoader } from '@pixi/spritesheet';
import { Ticker } from '@pixi/ticker';
import { CanvasRenderer } from '@pixi/canvas-renderer';
import { CanvasSpriteRenderer } from '@pixi/canvas-sprite';
import { CanvasPrepare } from '@pixi/canvas-prepare';
import '@pixi/canvas-display';
import { PikachuVolleyballOnline } from './pikavolley_online.js';
import { PikachuVolleyball } from './offline_version_js/pikavolley.js';
import { PikaKeyboard } from './offline_version_js/keyboard.js';
import { ASSETS_PATH } from './offline_version_js/assets_path.js';
import { channel } from './data_channel/data_channel.js';
import { setUpUI, setUpUIAfterLoadingGameAssets } from './ui_online.js';
import { setUpUIForBlockingOtherUsers } from './block_other_players/ui.js';
import { setUpUIForManagingBadWords } from './bad_words_filtering/ui.js';
import { setGetSpeechBubbleNeeded } from './chat_display.js';
import '../style.css';

// Keep reference to original with-computer texture
const TEXTURES = ASSETS_PATH.TEXTURES;
const ORIGINAL_WITH_COMPUTER_TEXTURE = TEXTURES.WITH_COMPUTER;

// Pixi plugin registrations
Renderer.registerPlugin('prepare', Prepare);
Renderer.registerPlugin('batch', BatchRenderer);
CanvasRenderer.registerPlugin('prepare', CanvasPrepare);
CanvasRenderer.registerPlugin('sprite', CanvasSpriteRenderer);
Loader.registerPlugin(SpritesheetLoader);

settings.RESOLUTION = 2;
settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = true;

const renderer = autoDetectRenderer({
  width: 432,
  height: 304,
  antialias: false,
  backgroundColor: 0x000000,
  backgroundAlpha: 1,
  forceCanvas: true,
});

const stage = new Container();
const ticker = new Ticker();
const loader = new Loader();

let currentLoop = null;
let activeGame = null;

ticker.add(() => {
  if (currentLoop) {
    currentLoop();
  }
});

document.querySelector('#game-canvas-container').appendChild(renderer.view);
renderer.render(stage);

loader.add(ASSETS_PATH.SPRITE_SHEET);
for (const prop in ASSETS_PATH.SOUNDS) {
  loader.add(ASSETS_PATH.SOUNDS[prop]);
}
setUpLoaderProgressBar();

// Start preloading assets immediately
loader.load();

/**
 * Ensures game assets are fully loaded and textures are parsed before callback
 */
function ensureLoader(callback) {
  const sheet = loader.resources[ASSETS_PATH.SPRITE_SHEET];
  if (sheet && sheet.textures && Object.keys(sheet.textures).length > 0) {
    callback();
    return;
  }
  if (loader.loading) {
    loader.onComplete.once(() => {
      ensureLoader(callback);
    });
    return;
  }
  try {
    loader.load(() => {
      ensureLoader(callback);
    });
  } catch (err) {
    console.warn('Loader already completed or errored:', err);
    callback();
  }
}

channel.callbackAfterDataChannelOpened = () => {
  TEXTURES.WITH_COMPUTER = TEXTURES.WITH_FRIEND;
  ensureLoader(setupOnline);
};

try {
  setUpUI();
} catch (e) {
  console.error('setUpUI error:', e);
}
try {
  setUpUIForBlockingOtherUsers();
} catch (e) {
  console.error('setUpUIForBlockingOtherUsers error:', e);
}
try {
  setUpUIForManagingBadWords();
} catch (e) {
  console.error('setUpUIForManagingBadWords error:', e);
}
try {
  setUpOfflineControls();
} catch (e) {
  console.error('setUpOfflineControls error:', e);
}
try {
  updateLobbyBestScoreDisplay();
} catch (e) {
  console.error('updateLobbyBestScoreDisplay error:', e);
}

/**
 * Set up the loader progress bar.
 */
function setUpLoaderProgressBar() {
  const loadingBox = document.getElementById('loading-box');
  const progressBar = document.getElementById('progress-bar');

  loader.onProgress.add(() => {
    progressBar.style.width = `${loader.progress}%`;
  });
  loader.onComplete.add(() => {
    loadingBox.classList.add('hidden');
  });
}

/**
 * Set up online P2P match
 */
function setupOnline() {
  stage.removeChildren();
  const pikaVolley = new PikachuVolleyballOnline(stage, loader.resources);
  activeGame = pikaVolley;
  setUpUIAfterLoadingGameAssets(pikaVolley, ticker);
  setGetSpeechBubbleNeeded(pikaVolley);
  startOnline(pikaVolley);
}

function startOnline(pikaVolley) {
  ticker.maxFPS = pikaVolley.normalFPS;
  currentLoop = () => {
    renderer.render(stage);
    pikaVolley.gameLoop();
  };
  ticker.start();
}

/**
 * Dual keyboard for 1-player vs Computer:
 * allows using either Arrow keys + Enter OR RDFG + Z seamlessly
 */
class DualInputKeyboard {
  constructor() {
    this.kb1 = new PikaKeyboard('KeyD', 'KeyG', 'KeyR', 'KeyV', 'KeyZ', 'KeyF');
    this.kb2 = new PikaKeyboard('ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter');
    this.xDirection = 0;
    this.yDirection = 0;
    this.powerHit = 0;
  }
  subscribe() {
    this.kb1.subscribe();
    this.kb2.subscribe();
  }
  unsubscribe() {
    this.kb1.unsubscribe();
    this.kb2.unsubscribe();
  }
  getInput() {
    this.kb1.getInput();
    this.kb2.getInput();
    this.xDirection = this.kb2.xDirection !== 0 ? this.kb2.xDirection : this.kb1.xDirection;
    this.yDirection = this.kb2.yDirection !== 0 ? this.kb2.yDirection : this.kb1.yDirection;
    this.powerHit = this.kb2.powerHit !== 0 ? this.kb2.powerHit : this.kb1.powerHit;
  }
}

/**
 * Display stored best AI match score in the lobby
 */
function updateLobbyBestScoreDisplay() {
  const best = localStorage.getItem('gameBox_pikachu_best_score') || '0';
  const el = document.getElementById('lobby-best-score');
  if (el) {
    el.textContent = parseInt(best, 10) > 0 ? `${Number(best).toLocaleString('ko-KR')}점` : '0점 (기록 없음)';
  }
}

/**
 * Handle game end for vs Computer match:
 * calculates score, updates best score, shows result modal, and submits to Game Box rankings
 */
async function handleGameEnd(pikaVolley, startTime) {
  const p1Score = pikaVolley.scores[0];
  const comScore = pikaVolley.scores[1];
  const isWinner = Boolean(pikaVolley.physics?.player1?.isWinner || p1Score > comScore);
  const elapsedMs = Math.max(1000, Date.now() - startTime);
  const elapsedSeconds = Math.round(elapsedMs / 1000);

  // Score calculation:
  // Win: 10,000 base + (15 - comScore) * 500 (shutout bonus) + (300 - elapsedSeconds) * 20 (speed bonus)
  // Loss: p1Score * 500 + time bonus
  let finalScore = 0;
  if (isWinner) {
    const baseWin = 10000;
    const shutoutBonus = Math.max(0, 15 - comScore) * 500;
    const timeBonus = Math.max(0, 300 - elapsedSeconds) * 20;
    finalScore = baseWin + shutoutBonus + timeBonus;
  } else {
    finalScore = Math.max(0, p1Score * 500) + Math.min(1000, elapsedSeconds * 5);
  }

  // Update local best score
  const currentBest = parseInt(localStorage.getItem('gameBox_pikachu_best_score') || '0', 10);
  if (finalScore > currentBest) {
    localStorage.setItem('gameBox_pikachu_best_score', String(finalScore));
    updateLobbyBestScoreDisplay();
  }

  // Show result modal
  const modal = document.getElementById('game-result-modal');
  const statusBadge = document.getElementById('result-status-badge');
  const scoreDetail = document.getElementById('result-score-detail');
  const scorePoints = document.getElementById('result-score-points');
  const rankingStatus = document.getElementById('result-ranking-status');

  if (statusBadge) {
    statusBadge.textContent = isWinner ? '🎉 AI 대전 승리!' : '😢 아쉬운 패배!';
    statusBadge.style.color = isWinner ? '#3fb950' : '#ff7b72';
  }
  if (scoreDetail) {
    scoreDetail.textContent = `플레이어 ${p1Score} : ${comScore} 컴퓨터`;
  }
  if (scorePoints) {
    scorePoints.textContent = `최종 점수: ${finalScore.toLocaleString('ko-KR')}점 (${elapsedSeconds}초 소요)`;
  }
  if (rankingStatus) {
    rankingStatus.textContent = '⏳ Game Box 명예의 전당 랭킹 등록 중...';
    rankingStatus.style.color = '#e3b341';
  }
  if (modal) {
    modal.classList.remove('hidden');
  }

  // Wire modal buttons
  const retryBtn = document.getElementById('result-retry-btn');
  if (retryBtn) {
    retryBtn.onclick = () => {
      if (modal) modal.classList.add('hidden');
      startOfflineGame(true);
    };
  }
  const lobbyBtn = document.getElementById('result-lobby-btn');
  if (lobbyBtn) {
    lobbyBtn.onclick = () => {
      location.reload();
    };
  }

  // Submit attempt to Game Box ranking API
  try {
    let token = localStorage.getItem('gameBoxAuthToken');
    if (!token) {
      const nicknameInput = document.getElementById('nickname-input');
      const nickname = nicknameInput?.value?.trim() || '피카츄마스터';
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: nickname }),
      });
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData?.token) {
          token = userData.token;
          localStorage.setItem('gameBoxAuthToken', token);
        }
      }
    }

    const attemptRes = await fetch('/api/attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        category: 'pikachu-vs-com',
        score: finalScore,
        elapsedMs: elapsedMs,
        source: 'pikachu-volleyball',
      }),
    });

    if (attemptRes.ok) {
      if (rankingStatus) {
        rankingStatus.textContent = '🏆 Game Box 명예의 전당 랭킹 등록 완료!';
        rankingStatus.style.color = '#3fb950';
      }
    } else {
      const errJson = await attemptRes.json().catch(() => ({}));
      if (rankingStatus) {
        rankingStatus.textContent = `로컬 기록 완료 (${errJson.error || '오프라인'})`;
        rankingStatus.style.color = '#8b949e';
      }
    }
  } catch (err) {
    if (rankingStatus) {
      rankingStatus.textContent = '로컬 기록 완료 (오프라인 모드)';
      rankingStatus.style.color = '#8b949e';
    }
  }
}

/**
 * Set up offline mode (vs Computer AI or 2-player local)
 */
function startOfflineGame(vsComputer = true) {
  TEXTURES.WITH_COMPUTER = ORIGINAL_WITH_COMPUTER_TEXTURE;

  const resultModal = document.getElementById('game-result-modal');
  if (resultModal) resultModal.classList.add('hidden');

  const loadingBox = document.getElementById('loading-box');
  const sheet = loader.resources[ASSETS_PATH.SPRITE_SHEET];
  if (!sheet || !sheet.textures || Object.keys(sheet.textures).length === 0) {
    if (loadingBox) loadingBox.classList.remove('hidden');
  }

  ensureLoader(() => {
    if (loadingBox) loadingBox.classList.add('hidden');

    const beforeConnection = document.getElementById('before-connection');
    const flexContainer = document.getElementById('flex-container');
    if (beforeConnection) beforeConnection.classList.add('hidden');
    if (flexContainer) flexContainer.classList.remove('hidden');

    const nickLeft = document.getElementById('player1-nickname');
    const nickRight = document.getElementById('player2-nickname');
    if (nickLeft) nickLeft.textContent = vsComputer ? '플레이어 (1P)' : '1P (왼쪽)';
    if (nickRight) nickRight.textContent = vsComputer ? '컴퓨터 (AI)' : '2P (오른쪽)';

    const pingBox = document.getElementById('ping-box');
    if (pingBox) pingBox.classList.add('hidden');
    const peerLoadingBox = document.getElementById('peer-loading-box');
    if (peerLoadingBox) peerLoadingBox.classList.add('hidden');

    stage.removeChildren();

    const pikaVolley = new PikachuVolleyball(stage, loader.resources);
    activeGame = pikaVolley;
    pikaVolley.selectedWithWho = vsComputer ? 0 : 1;

    if (vsComputer) {
      pikaVolley.keyboardArray[0].unsubscribe();
      pikaVolley.keyboardArray[1].unsubscribe();
      const soloKeyboard = new DualInputKeyboard();
      soloKeyboard.subscribe();
      pikaVolley.keyboardArray = [
        soloKeyboard,
        new PikaKeyboard('', '', '', '', '')
      ];
    } else {
      pikaVolley.keyboardArray[0].subscribe();
      pikaVolley.keyboardArray[1].subscribe();
    }

    setUpUIAfterLoadingGameAssets(pikaVolley, ticker);

    const matchStartTime = Date.now();
    let resultHandled = false;

    ticker.maxFPS = pikaVolley.normalFPS;
    currentLoop = () => {
      pikaVolley.gameLoop();
      renderer.render(stage);
      if (vsComputer && pikaVolley.gameEnded && !resultHandled) {
        resultHandled = true;
        handleGameEnd(pikaVolley, matchStartTime);
      }
    };
    if (!ticker.started) {
      ticker.start();
    }
  });
}

function setUpOfflineControls() {
  const vsComputerBtn = document.getElementById('vs-computer-btn');
  if (vsComputerBtn) {
    vsComputerBtn.addEventListener('click', () => {
      startOfflineGame(true);
    });
  }

  const vsLocalBtn = document.getElementById('vs-local-btn');
  if (vsLocalBtn) {
    vsLocalBtn.addEventListener('click', () => {
      startOfflineGame(false);
    });
  }
}
