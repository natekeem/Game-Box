(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search);
  var mode = params.get('mode') || 'single';
  var roomCode = (params.get('room') || '').trim().toUpperCase();
  var playerId = (params.get('player') || '').trim();
  var playerName = (params.get('name') || 'Player').trim().slice(0, 24);
  var socket = null;
  var slot = null;
  var heldActions = {};
  var started = false;

  function seededRandom(seed) {
    var value = seed >>> 0;
    return function () {
      value += 0x6D2B79F5;
      var result = value;
      result = Math.imul(result ^ result >>> 15, result | 1);
      result ^= result + Math.imul(result ^ result >>> 7, result | 61);
      return ((result ^ result >>> 14) >>> 0) / 4294967296;
    };
  }

  function ensureOverlay() {
    var game = document.getElementById('game');
    if (!game) return null;
    var overlay = document.getElementById('game-box-online-overlay');
    if (overlay) return overlay;
    game.style.position = 'relative';
    overlay = document.createElement('div');
    overlay.id = 'game-box-online-overlay';
    overlay.innerHTML = '<strong>Bombergirl Online</strong><span>연결 중...</span>';
    game.appendChild(overlay);
    return overlay;
  }

  function setOverlay(title, detail, visible) {
    var overlay = ensureOverlay();
    if (!overlay) return;
    overlay.querySelector('strong').textContent = title;
    overlay.querySelector('span').textContent = detail;
    overlay.style.display = visible === false ? 'none' : 'flex';
  }

  function waitForOriginalReady(callback) {
    if (window.gGameEngine && gGameEngine.stage && gGameEngine.menu && gGameEngine.playerGirlImg) {
      callback();
      return;
    }
    window.setTimeout(function () { waitForOriginalReady(callback); }, 50);
  }

  function applyNetworkInput(message) {
    if (!window.gInputEngine || message.slot == null) return;
    var suffix = message.slot === 0 ? '' : '2';
    var actionName = message.action + suffix;
    gInputEngine.actions[actionName] = Boolean(message.pressed);
    if (!message.pressed) {
      var listeners = gInputEngine.listeners[actionName] || [];
      for (var i = 0; i < listeners.length; i += 1) listeners[i]();
    }
  }

  function startOnlineGame(message) {
    if (started) return;
    started = true;
    slot = message.slot;
    var delay = Math.max(0, Number(message.startAt || Date.now()) - Date.now());
    setOverlay('상대 연결 완료', '동일한 원본 맵을 준비하고 있습니다.', true);
    window.setTimeout(function () {
      waitForOriginalReady(function () {
        Math.random = seededRandom(Number(message.seed) || 1);
        gGameEngine.menu.hide();
        gGameEngine.botsCount = 0;
        gGameEngine.playersCount = 2;
        gGameEngine.playing = true;
        gGameEngine.restart();
        setOverlay('', '', false);
      });
    }, delay);
  }

  function sendInput(action, pressed) {
    if (!socket || socket.readyState !== WebSocket.OPEN || slot == null || !started) return;
    socket.send(JSON.stringify({ type: 'input', action: action, pressed: pressed }));
  }

  function patchOnlineInput() {
    if (!window.gInputEngine || gInputEngine.__gameBoxOnlinePatched) return;
    gInputEngine.__gameBoxOnlinePatched = true;
    var originalSetup = gInputEngine.setup;
    var localKeyMap = {
      38: 'up', 87: 'up',
      37: 'left', 65: 'left',
      40: 'down', 83: 'down',
      39: 'right', 68: 'right',
      32: 'bomb', 18: 'bomb', 16: 'bomb'
    };

    gInputEngine.setup = function () {
      if (this.__gameBoxDocumentListenersAttached) return;
      originalSetup.call(this);
      this.__gameBoxDocumentListenersAttached = true;
    };

    gInputEngine.onKeyDown = function (event) {
      var action = localKeyMap[event.keyCode];
      if (action) {
        if (!heldActions[action]) {
          heldActions[action] = true;
          sendInput(action, true);
        }
        event.preventDefault();
        return false;
      }
      var localAction = gInputEngine.bindings[event.keyCode];
      if (localAction === 'escape' || localAction === 'mute') {
        gInputEngine.actions[localAction] = true;
        event.preventDefault();
      }
      return false;
    };

    gInputEngine.onKeyUp = function (event) {
      var action = localKeyMap[event.keyCode];
      if (action) {
        if (heldActions[action]) {
          heldActions[action] = false;
          sendInput(action, false);
        }
        event.preventDefault();
        return false;
      }
      var localAction = gInputEngine.bindings[event.keyCode];
      if (localAction === 'escape' || localAction === 'mute') {
        gInputEngine.actions[localAction] = false;
        var listeners = gInputEngine.listeners[localAction] || [];
        for (var i = 0; i < listeners.length; i += 1) listeners[i]();
        event.preventDefault();
      }
      return false;
    };

    window.addEventListener('blur', function () {
      Object.keys(heldActions).forEach(function (action) {
        if (heldActions[action]) sendInput(action, false);
        heldActions[action] = false;
      });
    });
  }

  function connectOnline() {
    if (!roomCode || !playerId) {
      setOverlay('온라인 방 정보 없음', '플랫폼 온라인 방에서 다시 시작해 주세요.', true);
      return;
    }
    patchOnlineInput();
    var protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    var query = new URLSearchParams({ room: roomCode, player: playerId, name: playerName });
    socket = new WebSocket(protocol + '//' + window.location.host + '/original-bombergirl/ws?' + query.toString());
    socket.addEventListener('open', function () {
      setOverlay('온라인 방 ' + roomCode, '상대 플레이어를 기다리고 있습니다.', true);
    });
    socket.addEventListener('message', function (event) {
      var message;
      try { message = JSON.parse(event.data); } catch (error) { return; }
      if (message.type === 'waiting') {
        slot = message.slot;
        setOverlay('온라인 방 ' + roomCode, '상대 플레이어를 기다리고 있습니다.', true);
      } else if (message.type === 'start') {
        startOnlineGame(message);
      } else if (message.type === 'input') {
        applyNetworkInput(message);
      } else if (message.type === 'peer-left') {
        started = false;
        slot = null;
        setOverlay('상대 연결 종료', '온라인 방을 나간 플레이어가 있습니다.', true);
      } else if (message.type === 'error') {
        setOverlay('온라인 연결 오류', message.message || '방에 입장하지 못했습니다.', true);
      }
    });
    socket.addEventListener('close', function () {
      if (started) setOverlay('서버 연결 종료', '플랫폼 로비에서 다시 시작해 주세요.', true);
    });
  }

  window.addEventListener('load', function () {
    if (mode === 'online') {
      connectOnline();
      return;
    }
    waitForOriginalReady(function () {
      gGameEngine.menu.setMode('single');
    });
  });
}());
