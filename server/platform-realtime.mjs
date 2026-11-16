import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import {
  SnakeDuelEngine,
  SNAKE_GRID_WIDTH,
  SNAKE_GRID_HEIGHT,
  SNAKE_TICK_MS,
} from './original-engines/snake-duel-engine.mjs';

const require = createRequire(import.meta.url);
const { definitions, modules, initialGameStates, getGame: getBattleboxGame } = require('../battlebox/games/registry.js');
const { clearAllGameTimers, buildScores } = require('../battlebox/games/utils.js');

export const BOT_NAMES = [
  '🤖 BOT 민수',
  '🤖 BOT 지수',
  '🤖 BOT 철수',
  '🤖 BOT 영희',
  '🤖 BOT 현우',
  '🤖 BOT 서연',
  '🤖 BOT 준호',
];

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// WordChain dictionary extracted for BOTs
const WORDCHAIN_WORDS = [
  'apple','ample','elder','erode','eagle','angle','enter','elite','eight','elect',
  'about','above','abuse','actor','acute','admit','adopt','adult','after','again',
  'agent','agree','ahead','alarm','album','alert','alien','align','alive','alley',
  'allow','alone','along','alter','angel','anger','angry','ankle','annex','apart',
  'apply','arena','argue','arise','armor','army','aroma','arose','array','arrow',
  'asset','atlas','attic','audio','audit','aunty','avail','avoid','award','aware',
  'awful','badly','baker','basic','basis','batch','beach','began','begin','being',
  'below','bench','bible','birth','black','blade','blame','bland','blank','blast',
  'blaze','bleed','blend','bless','blind','block','blood','bloom','blown','board',
  'boast','bonus','boost','booth','bound','boxer','brain','brand','brave','bread',
  'break','breed','brick','bride','brief','bring','broad','broke','brook','brown',
  'brush','built','bunch','burst','buyer','cabin','cable','camel','candy','carry',
  'catch','cause','chain','chair','chalk','chaos','charm','chart','chase','cheap',
  'check','cheek','chest','chief','child','china','choir','civic','civil','claim',
  'class','clean','clear','clerk','click','cliff','climb','cling','clock','clone',
  'close','cloth','cloud','coach','coast','color','comet','comic','comma','coral',
  'could','count','court','cover','craft','crash','crazy','cream','creek','crime',
  'cross','crowd','crown','cruel','crush','curve','cycle','daily','dance','death',
  'delay','delta','depth','devil','digit','dirty','disco','doubt','dough','draft',
  'drain','drama','drank','drawn','dream','dress','dried','drive','drone','drove',
  'drink','drugs','drums','drunk','dryer','dying','eager','early','earth','empty',
  'enemy','enjoy','entry','equal','error','essay','event','every','exact','exist',
  'extra','fable','faced','faith','false','fancy','fatal','fault','feast','fence',
  'fever','field','fifty','fight','final','first','fixed','flame','flash','fleet',
  'flesh','flick','fling','float','flood','floor','flour','fluid','flute','focus',
  'force','forge','forth','forum','found','frame','frank','fraud','fresh','front',
  'frost','fruit','funny','ghost','giant','given','glass','globe','gloom','glory',
  'glove','going','grace','grade','grain','grand','grant','grasp','grass','grave',
  'great','green','greet','grief','grind','groan','groin','group','guard','guess',
  'guide','guild','guile','guilt','guitar','habit','harsh','heard','heart','heavy',
  'hedge','hello','hence','hertz','honey','honor','horse','hotel','house','human',
  'humor','hurry','hyena','ideal','image','imply','inbox','index','indie','inner',
  'input','inter','intro','issue','ivory','label','lance','large','laser','later',
  'laugh','layer','learn','lease','least','legal','level','light','limit','linen',
  'liver','local','loose','lower','lucky','lunar','magic','major','maker','manor',
  'maple','march','match','mayor','media','mercy','merge','metal','meter','minor',
  'model','money','month','moral','motor','mount','mouse','mouth','moved','movie',
  'music','naval','nerve','never','night','noble','north','noted','novel','nurse',
  'oasis','occur','ocean','offer','often','olive','omega','onset','opera','orbit',
  'order','organ','other','ought','outer','oxide','ozone','paint','panel','panic',
  'paper','patch','pause','peace','pearl','penny','phase','phone','photo','piano',
  'piece','pilot','pitch','pixel','pizza','place','plain','plane','plant','plaza',
  'plead','pluck','plumb','plume','point','poker','polar','poppy','pound','power',
  'press','price','pride','prime','print','prior','prize','probe','prone','proof',
  'proud','prove','psalm','pulse','punch','pupil','purse','queen','query','queue',
  'quick','quiet','quota','quote','radar','radio','raise','rally','ranch','range',
  'rapid','ratio','reach','ready','realm','rebel','rebus','recap','relay','reply',
  'repay','rerun','reset','ridge','rifle','right','risky','rival','river','robot',
  'rocky','roman','rouge','rough','round','route','royal','rugby','ruler','rural',
  'saint','salad','sauce','scale','scene','scent','scope','score','scout','seize',
  'sense','serve','setup','seven','shade','shall','shame','shape','share','shark',
  'sharp','sheep','sheer','shelf','shell','shift','shirt','shock','shoot','short',
  'shout','sight','sigma','silly','since','sixth','sixty','skill','skull','slate',
  'sleep','slide','slope','small','smart','smell','smile','smoke','solar','solid',
  'solve','sorry','south','space','spare','spark','speak','spear','speed','spend',
  'spice','spike','spine','spite','split','spoke','spoon','sport','spray','squad',
  'stack','staff','stage','stain','stake','stand','stark','start','state','stays',
  'steam','steel','steep','steer','stern','stick','still','stock','stone','stood',
  'store','storm','story','strap','straw','strip','study','stuff','style','sugar',
  'super','surge','swamp','swear','sweep','sweet','swift','swing','swipe','sword',
  'sworn','table','taken','talon','taste','teach','tense','thank','theme','thick',
  'thing','think','third','thorn','those','three','threw','throw','tiger','tight',
  'timer','tired','title','today','token','total','touch','tough','tower','toxic',
  'trace','track','trade','trail','train','trait','trash','treat','trend','trial',
  'tribe','trick','tried','troop','truck','truly','trunk','trust','truth','tumor',
  'tuner','twice','twist','ultra','under','union','unity','until','upper','upset',
  'urban','usage','using','usual','utter','valid','value','valve','vapor','vault',
  'video','vigor','viola','viral','virus','visit','vista','vital','vivid','vocal',
  'voice','voter','vague','waste','watch','water','weary','wedge','weird','whale',
  'wheat','wheel','where','which','while','white','whole','wider','woman','women',
  'world','worry','worth','would','wound','wrath','write','yacht','yield','young',
  'youth','zebra','zonal'
];

// Drawing game preset words and vector stroke paths for BOT drawing
export const DRAWING_PRESETS = [
  {
    word: '사과',
    category: '과일',
    hint: 'ㅅㄱ',
    strokes: [
      { color: '#ff3344', width: 5, points: [[200,130],[160,120],[125,150],[120,200],[140,255],[195,275],[200,270],[205,275],[260,255],[280,200],[275,150],[240,120],[200,130]] },
      { color: '#7a4b2a', width: 5, points: [[200,130],[205,95]] },
      { color: '#2ecc71', width: 4, points: [[205,105],[235,90],[225,115],[205,105]] },
    ],
  },
  {
    word: '자동차',
    category: '탈것',
    hint: 'ㅈㄷㅊ',
    strokes: [
      { color: '#3498db', width: 5, points: [[90,210],[120,210],[145,160],[255,160],[285,210],[320,210],[320,250],[90,250],[90,210]] },
      { color: '#2c3e50', width: 6, points: [[140,250],[130,265],[140,280],[155,265],[140,250]] },
      { color: '#2c3e50', width: 6, points: [[270,250],[260,265],[270,280],[285,265],[270,250]] },
    ],
  },
  {
    word: '우산',
    category: '사물',
    hint: 'ㅇㅅ',
    strokes: [
      { color: '#9b59b6', width: 5, points: [[100,190],[130,130],[200,105],[270,130],[300,190],[100,190]] },
      { color: '#7f8c8d', width: 5, points: [[200,105],[200,275],[185,290],[170,275]] },
    ],
  },
  {
    word: '피자',
    category: '음식',
    hint: 'ㅍㅈ',
    strokes: [
      { color: '#f39c12', width: 5, points: [[200,90],[115,265],[285,265],[200,90]] },
      { color: '#d35400', width: 6, points: [[115,265],[200,280],[285,265]] },
      { color: '#e74c3c', width: 6, points: [[195,160],[205,165],[195,170]] },
      { color: '#e74c3c', width: 6, points: [[170,220],[180,225],[170,230]] },
      { color: '#e74c3c', width: 6, points: [[225,225],[235,230],[225,235]] },
    ],
  },
  {
    word: '로켓',
    category: '우주',
    hint: 'ㄹㅋ',
    strokes: [
      { color: '#ecf0f1', width: 5, points: [[200,75],[165,140],[165,245],[235,245],[235,140],[200,75]] },
      { color: '#e74c3c', width: 5, points: [[165,205],[135,255],[165,245]] },
      { color: '#e74c3c', width: 5, points: [[235,205],[265,255],[235,245]] },
      { color: '#f1c40f', width: 5, points: [[180,245],[200,300],[220,245]] },
    ],
  },
  {
    word: '고양이',
    category: '동물',
    hint: 'ㄱㅇㅇ',
    strokes: [
      { color: '#f39c12', width: 5, points: [[140,160],[140,105],[175,140],[225,140],[260,105],[260,160],[270,220],[230,260],[170,260],[130,220],[140,160]] },
      { color: '#2c3e50', width: 4, points: [[175,185],[180,185]] },
      { color: '#2c3e50', width: 4, points: [[220,185],[225,185]] },
      { color: '#e74c3c', width: 4, points: [[195,210],[205,210],[200,220],[195,210]] },
    ],
  },
  {
    word: '커피',
    category: '음료',
    hint: 'ㅋㅍ',
    strokes: [
      { color: '#8d6e63', width: 5, points: [[135,150],[145,265],[245,265],[255,150],[135,150]] },
      { color: '#8d6e63', width: 5, points: [[255,170],[285,175],[285,220],[250,225]] },
      { color: '#bdc3c7', width: 3, points: [[175,130],[185,110],[175,90]] },
      { color: '#bdc3c7', width: 3, points: [[215,130],[225,110],[215,90]] },
    ],
  },
  {
    word: '별',
    category: '자연',
    hint: 'ㅂ',
    strokes: [
      { color: '#f1c40f', width: 5, points: [[200,85],[228,160],[305,160],[242,208],[265,285],[200,238],[135,285],[158,208],[95,160],[172,160],[200,85]] },
    ],
  },
];

// ─── TicTacToe Minimax & Strategy ─────────────────────────────────────────────
function getTicTacToeBotMove(board, botMark, difficulty) {
  const empty = board.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
  if (!empty.length) return 0;
  if (difficulty === 'easy' && Math.random() < 0.65) {
    return empty[Math.floor(Math.random() * empty.length)];
  }
  if (difficulty === 'normal' && Math.random() < 0.25) {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  const oppMark = botMark === 'X' ? 'O' : 'X';
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const checkWin = (b, m) => wins.some(c => c.every(i => b[i] === m));

  // Immediate win or block
  for (const idx of empty) {
    const copy = [...board]; copy[idx] = botMark;
    if (checkWin(copy, botMark)) return idx;
  }
  for (const idx of empty) {
    const copy = [...board]; copy[idx] = oppMark;
    if (checkWin(copy, oppMark)) return idx;
  }

  if (difficulty === 'hard') {
    const minimax = (b, isMax) => {
      if (checkWin(b, botMark)) return 10;
      if (checkWin(b, oppMark)) return -10;
      const avail = b.map((v, i) => v === null ? i : -1).filter(i => i >= 0);
      if (!avail.length) return 0;
      let best = isMax ? -Infinity : Infinity;
      for (const i of avail) {
        b[i] = isMax ? botMark : oppMark;
        const val = minimax(b, !isMax);
        b[i] = null;
        best = isMax ? Math.max(best, val) : Math.min(best, val);
      }
      return best;
    };
    let bestMove = empty[0];
    let bestVal = -Infinity;
    for (const i of empty) {
      const copy = [...board];
      copy[i] = botMark;
      const val = minimax(copy, false);
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
    return bestMove;
  }

  if (board[4] === null) return 4;
  const corners = [0, 2, 6, 8].filter(i => board[i] === null);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  return empty[Math.floor(Math.random() * empty.length)];
}

// ─── ConnectFour Heuristic / Minimax ──────────────────────────────────────────
function getConnectFourBotMove(board, botToken, difficulty) {
  const ROWS = 6, COLS = 7;
  const validCols = [];
  for (let c = 0; c < COLS; c++) {
    if (board[c] === null) validCols.push(c);
  }
  if (!validCols.length) return 0;
  if (difficulty === 'easy' && Math.random() < 0.65) {
    return validCols[Math.floor(Math.random() * validCols.length)];
  }

  const dropRow = (b, col) => {
    for (let r = ROWS - 1; r >= 0; r--) {
      if (b[r * COLS + col] === null) return r;
    }
    return -1;
  };

  const checkWin = (b, row, col, tok) => {
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    for (const [dr, dc] of dirs) {
      let count = 1;
      for (const s of [1, -1]) {
        let r = row + dr * s, c = col + dc * s;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && b[r * COLS + c] === tok) {
          count++; r += dr * s; c += dc * s;
        }
      }
      if (count >= 4) return true;
    }
    return false;
  };

  const oppToken = botToken === 'R' ? 'Y' : 'R';

  // 1. Check immediate win
  for (const col of validCols) {
    const r = dropRow(board, col);
    const copy = [...board]; copy[r * COLS + col] = botToken;
    if (checkWin(copy, r, col, botToken)) return col;
  }
  // 2. Block opponent immediate win
  for (const col of validCols) {
    const r = dropRow(board, col);
    const copy = [...board]; copy[r * COLS + col] = oppToken;
    if (checkWin(copy, r, col, oppToken)) return col;
  }

  if (difficulty === 'hard') {
    // Avoid giving opponent a winning move on the row above
    const safeCols = validCols.filter(col => {
      const r = dropRow(board, col);
      if (r <= 0) return true;
      const copy = [...board];
      copy[r * COLS + col] = botToken;
      copy[(r - 1) * COLS + col] = oppToken;
      return !checkWin(copy, r - 1, col, oppToken);
    });
    const pool = safeCols.length ? safeCols : validCols;
    // Prefer center columns
    const order = [3, 2, 4, 1, 5, 0, 6].filter(c => pool.includes(c));
    return order[0] ?? pool[0];
  }

  // Normal: slight preference for center
  if (validCols.includes(3) && Math.random() < 0.5) return 3;
  return validCols[Math.floor(Math.random() * validCols.length)];
}

export class PlatformRealtimeHub {
  constructor({ store }) {
    this.store = store;
    this.rooms = Object.create(null);
    this.clients = new Map(); // clientId -> Set<res> (SSE streams)
    this.ioProxy = this.createIoProxy();
  }

  // SSE subscription
  subscribe(clientId, res) {
    if (!this.clients.has(clientId)) this.clients.set(clientId, new Set());
    this.clients.get(clientId).add(res);
    res.on('close', () => {
      const set = this.clients.get(clientId);
      if (set) {
        set.delete(res);
        if (set.size === 0) {
          this.clients.delete(clientId);
        }
      }
    });
  }

  sendToClient(clientId, event, data) {
    const streams = this.clients.get(clientId);
    if (!streams || !streams.size) return;
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of streams) {
      try { res.write(payload); } catch { /* ignore closed */ }
    }
  }

  broadcastToRoom(roomCode, event, data) {
    const room = this.rooms[roomCode];
    if (!room) return;
    for (const p of room.players) {
      if (!p.isBot) {
        this.sendToClient(p.id, event, data);
      }
    }
  }

  createIoProxy() {
    const self = this;
    return {
      to(target) {
        return {
          emit(event, data) {
            if (self.rooms[target]) {
              self.handleRoomEmit(target, event, data);
            } else {
              self.sendToClient(target, event, data);
            }
          },
        };
      },
    };
  }

  handleRoomEmit(roomCode, event, data) {
    const room = this.rooms[roomCode];
    if (!room) return;

    if (event === 'updateGameState') {
      room.lastPublicGameState = data;
      this.broadcastToRoom(roomCode, 'updateGameState', {
        ...data,
        roomCode,
        game: room.game,
        players: this.safePlayers(room),
      });
      this.scheduleBattleboxBots(roomCode, data);
      return;
    }

    if (event === 'updatePlayers') {
      this.broadcastToRoom(roomCode, 'roomUpdated', this.serializeRoom(room));
      return;
    }

    if (event === 'gameOver') {
      this.finalizeMatch(roomCode, data);
      // Some preserved BattleBox modules reset their own room to `lobby`
      // immediately after emitting gameOver. Restore the platform result state
      // after that original synchronous handler returns.
      queueMicrotask(() => {
        const finishedRoom = this.rooms[roomCode];
        if (finishedRoom?.lastResult && finishedRoom.state === 'lobby') {
          finishedRoom.state = 'finished';
          this.broadcastToRoom(roomCode, 'roomUpdated', this.serializeRoom(finishedRoom));
        }
      });
      return;
    }

    this.broadcastToRoom(roomCode, event, data);
  }

  generateRoomCode() {
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 4; i++) {
        code += ROOM_CODE_CHARS[crypto.randomInt(0, ROOM_CODE_CHARS.length)];
      }
    } while (this.rooms[code]);
    return code;
  }

  safePlayers(room) {
    return room.players.map(p => ({
      id: p.id,
      userId: p.userId || null,
      name: p.name,
      departmentId: p.departmentId || null,
      departmentName: p.departmentName || null,
      score: p.score || 0,
      ready: !!p.ready,
      isBot: !!p.isBot,
      botDifficulty: p.botDifficulty || null,
      isHost: p.id === room.host,
    }));
  }

  serializeRoom(room) {
    if (!room) return null;
    const hostPlayer = room.players.find(p => p.id === room.host);
    return {
      code: room.code,
      game: room.game,
      mode: room.mode,
      eventId: room.eventId || null,
      hostId: room.host,
      hostName: hostPlayer?.name || null,
      state: room.state,
      players: this.safePlayers(room),
      lastPublicGameState: room.lastPublicGameState || null,
      lastResult: room.lastResult || null,
      createdAt: room.createdAt,
      startedAt: room.startedAt,
    };
  }

  listPublicRooms(gameId = null) {
    return Object.values(this.rooms)
      .filter(r => r.mode === 'online' && (!gameId || r.game === gameId))
      .map(r => this.serializeRoom(r));
  }

  createRoom({ user, gameId, mode = 'online', botCount = 0, botDifficulty = 'normal', eventId = null }) {
    const code = this.generateRoomCode();
    const hostParticipant = {
      id: user.id,
      userId: user.id,
      name: user.name,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      score: 0,
      ready: true,
      isBot: false,
      botDifficulty: null,
    };

    const room = {
      code,
      game: gameId,
      mode,
      eventId: eventId || null,
      host: hostParticipant.id,
      players: [hostParticipant],
      state: 'lobby', // lobby | playing | finished
      gameState: {},
      timers: {},
      botMemory: {}, // for memorymatch / simonsays / etc.
      createdAt: Date.now(),
      startedAt: null,
      lastPublicGameState: null,
      lastResult: null,
    };

    this.rooms[code] = room;

    const maxBots = Math.max(0, this.getMaxPlayers(gameId) - 1);
    const needsPartnerInSolo = ['tictactoe', 'connectfour', 'rpsarena', 'wordchain', 'snakeduel', 'bomberman', 'drawing'].includes(gameId);
    const requestedBots = Number(botCount) || (mode === 'solo' && needsPartnerInSolo ? 1 : 0);
    const count = Math.max(0, Math.min(maxBots, requestedBots));
    for (let i = 0; i < count; i++) {
      this.addBot(code, hostParticipant.id, mode === 'solo' && !botCount ? 'easy' : botDifficulty);
    }

    return this.serializeRoom(room);
  }

  joinRoom(code, user) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');

    const existing = room.players.find(p => !p.isBot && p.userId === user.id);
    if (existing) {
      return this.serializeRoom(room);
    }

    if (room.state === 'playing') throw new Error('이미 게임이 진행 중인 방입니다.');
    const maxPlayers = this.getMaxPlayers(room.game);
    if (room.players.length >= maxPlayers) throw new Error(`방 정원(${maxPlayers}명)이 가득 찼습니다.`);

    room.players.push({
      id: user.id,
      userId: user.id,
      name: user.name,
      departmentId: user.departmentId,
      departmentName: user.departmentName,
      score: 0,
      ready: true,
      isBot: false,
      botDifficulty: null,
    });

    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  leaveRoom(code, userId) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) return null;
    const wasHost = room.host === userId;
    room.players = room.players.filter(p => p.id !== userId);

    const remainingHumans = room.players.filter(p => !p.isBot);
    if (remainingHumans.length === 0) {
      this.cleanupRoomTimers(room);
      delete this.rooms[room.code];
      return { deleted: true, code: room.code };
    }

    if (wasHost) {
      room.host = remainingHumans[0].id;
    }

    if (room.state === 'playing' && room.players.length < this.getMinPlayers(room.game)) {
      this.cleanupRoomTimers(room);
      room.state = 'lobby';
      this.broadcastToRoom(room.code, 'gameAborted', { reason: '참가자가 퇴장하여 대기실로 돌아갑니다.' });
    }

    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  setReady(code, userId, ready) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');
    const p = room.players.find(pl => pl.id === userId);
    if (!p) throw new Error('방 참가자가 아닙니다.');
    p.ready = !!ready;
    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  addBot(code, actorUserId, difficulty = 'normal') {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');
    if (room.host !== actorUserId) throw new Error('방장만 BOT을 추가할 수 있습니다.');
    if (room.state === 'playing') throw new Error('게임 진행 중에는 BOT을 추가할 수 없습니다.');

    const maxPlayers = this.getMaxPlayers(room.game);
    if (room.players.length >= maxPlayers) throw new Error(`최대 인원(${maxPlayers}명)을 초과할 수 없습니다.`);

    const usedNames = new Set(room.players.map(p => p.name));
    const botName = BOT_NAMES.find(n => !usedNames.has(n)) || `🤖 BOT #${room.players.length + 1}`;
    const botId = `bot-${crypto.randomUUID().slice(0, 8)}`;
    const validDiff = ['easy', 'normal', 'hard'].includes(difficulty) ? difficulty : 'normal';

    room.players.push({
      id: botId,
      userId: null,
      name: botName,
      departmentId: null,
      departmentName: 'AI BOT',
      score: 0,
      ready: true,
      isBot: true,
      botDifficulty: validDiff,
    });

    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  removeBot(code, actorUserId, botId) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');
    if (room.host !== actorUserId) throw new Error('방장만 BOT을 제거할 수 있습니다.');
    if (room.state === 'playing') throw new Error('게임 진행 중에는 BOT을 제거할 수 없습니다.');

    if (botId) {
      room.players = room.players.filter(p => !(p.isBot && p.id === botId));
    } else {
      for (let i = room.players.length - 1; i >= 0; i--) {
        if (room.players[i].isBot) {
          room.players.splice(i, 1);
          break;
        }
      }
    }

    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  getMinPlayers(gameId) {
    if (gameId === 'drawing') return 2; // allows 1 human + 1+ bots or 2+ humans
    return 2;
  }

  getMaxPlayers(gameId) {
    const bb = getBattleboxGame(gameId);
    if (bb) return bb.maxPlayers;
    if (gameId === 'snakeduel') return 2;
    if (gameId === 'bomberman') return 4;
    if (gameId === 'bombergirl') return 2;
    if (gameId === 'drawing') return 8;
    return 8;
  }

  cleanupRoomTimers(room) {
    if (!room) return;
    clearAllGameTimers(room);
    if (room.botTimers) {
      for (const t of Object.values(room.botTimers)) {
        clearTimeout(t);
        clearInterval(t);
      }
    }
    room.botTimers = {};
    room.snakeEngine = null;
    room.snakeRoleByPlayerId = null;
  }

  startGame(code, actorUserId) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');
    if (room.host !== actorUserId) throw new Error('방장만 게임을 시작할 수 있습니다.');
    if (room.state === 'playing') throw new Error('이미 게임이 진행 중입니다.');

    // Solo mode allows 1 player for single-player practice, otherwise min 2
    const minReq = room.mode === 'solo' ? 1 : this.getMinPlayers(room.game);
    if (room.players.length < minReq) {
      throw new Error(`게임을 시작하려면 최소 ${minReq}명이 필요합니다. (BOT을 추가하거나 혼자/컴퓨터 모드를 이용하세요)`);
    }

    this.cleanupRoomTimers(room);
    room.state = 'playing';
    room.startedAt = Date.now();
    room.lastResult = null;
    room.botMemory = { revealedCards: {} };
    room.players.forEach(p => { p.score = 0; p.ready = false; });

    const bbGame = getBattleboxGame(room.game);
    if (bbGame) {
      room.gameState = initialGameStates[bbGame.id]?.() || {};
      this.broadcastToRoom(room.code, 'gameStarted', this.serializeRoom(room));
      if (room.game === 'tictactoe') {
        this.ioProxy.to(room.code).emit('updateGameState', {
          board: room.gameState.board,
          currentPlayer: room.players[0]?.name || '',
          currentPlayerId: room.players[0]?.id || '',
          scores: buildScores(room),
          status: `${room.players[0]?.name || '플레이어 1'}님의 차례 (X)`,
        });
      } else if (room.game === 'wordchain') {
        this.ioProxy.to(room.code).emit('updateGameState', {
          wordChain: room.gameState.wordChain,
          currentPlayer: room.players[0]?.name || '',
          currentPlayerId: room.players[0]?.id || '',
          scores: buildScores(room),
          status: `${room.players[0]?.name || '플레이어 1'}님이 첫 영어 단어를 입력하세요!`,
        });
      } else {
        modules[room.game](room.code, this.ioProxy, this.rooms);
      }
      return this.serializeRoom(room);
    }

    if (room.game === 'snakeduel') {
      this.startSnakeDuel(room);
    } else if (room.game === 'bomberman') {
      this.startBomberman(room);
    } else if (room.game === 'bombergirl') {
      room.gameState = { externalOriginal: true };
      room.lastPublicGameState = {
        roomCode: room.code,
        status: '원본 Bombergirl 온라인 연결 중...',
        gameState: room.gameState,
      };
    } else if (room.game === 'drawing') {
      this.startDrawingGame(room);
    } else {
      throw new Error(`지원하지 않는 실시간 게임: ${room.game}`);
    }

    this.broadcastToRoom(room.code, 'gameStarted', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  rematch(code, actorUserId) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room) throw new Error('방을 찾을 수 없습니다.');
    this.cleanupRoomTimers(room);
    room.state = 'lobby';
    room.gameState = {};
    room.lastPublicGameState = null;
    room.players.forEach(p => { p.score = 0; p.ready = true; });
    this.broadcastToRoom(room.code, 'rematchReady', this.serializeRoom(room));
    this.broadcastToRoom(room.code, 'roomUpdated', this.serializeRoom(room));
    return this.serializeRoom(room);
  }

  // ─── Action Dispatch (Human or Bot) ───────────────────────────────────────────
  handleAction(code, playerId, action) {
    const room = this.rooms[String(code || '').toUpperCase()];
    if (!room || room.state !== 'playing') return { ok: false, error: '게임이 진행 중이 아닙니다.' };
    const player = room.players.find(p => p.id === playerId);
    if (!player) return { ok: false, error: '참가자가 아닙니다.' };

    const g = room.game;

    // 1. Reaction click
    if (g === 'reaction') {
      if (!room.gameState.canClick || room.gameState.waiting || room.gameState.clicked) {
        return { ok: false, error: '아직 클릭할 수 없습니다.' };
      }
      room.gameState.clicked = true;
      if (room.timers?.reactionMiss) {
        clearTimeout(room.timers.reactionMiss);
        room.timers.reactionMiss = null;
      }
      const reactionTime = Math.max(10, Date.now() - room.gameState.clickTime);
      const points = Math.max(5, Math.round(100 - reactionTime / 10));
      room.gameState.canClick = false;
      player.score += points;
      player.lastMetric = reactionTime;
      this.ioProxy.to(room.code).emit('updateGameState', {
        scores: buildScores(room),
        status: `⚡ ${player.name} 반응 속도: ${reactionTime}ms! (+${points}점)`,
        gameState: { round: room.gameState.round, reactionTime, winnerName: player.name },
      });
      const round = room.gameState.round;
      room.timers.reactionNext = setTimeout(() => modules.reaction.nextRound?.(room.code, this.ioProxy, this.rooms, round), 1400);
      return { ok: true };
    }

    // 2. Other BattleBox games
    if (getBattleboxGame(g)) {
      const gs = room.gameState;
      switch (g) {
        case 'tictactoe':
          modules.tictactoe(room.code, Number(action.pos), this.ioProxy, this.rooms, playerId);
          break;
        case 'wordchain':
          modules.wordchain(room.code, String(action.word || ''), this.ioProxy, this.rooms, playerId);
          break;
        case 'mathduel':
          if (room.players[gs.currentPlayer ?? 0]?.id !== playerId) return { ok: false, error: '본인 차례가 아닙니다.' };
          modules.mathduel(room.code, this.ioProxy, this.rooms, Number(action.answer));
          break;
        case 'rpsarena':
          modules.rpsarena(room.code, this.ioProxy, this.rooms, { playerId, choice: action.choice });
          break;
        case 'anagram':
          if (room.players[gs.currentPlayer ?? 0]?.id !== playerId) return { ok: false, error: '본인 차례가 아닙니다.' };
          modules.anagram(room.code, this.ioProxy, this.rooms, String(action.guess || ''));
          break;
        case 'numberhunt':
          modules.numberhunt(room.code, this.ioProxy, this.rooms, { playerId, guess: Number(action.guess) });
          break;
        case 'memorymatch':
          modules.memorymatch(room.code, this.ioProxy, this.rooms, { playerId, cardIndex: Number(action.cardIndex) });
          break;
        case 'speedtyping':
          modules.speedtyping(room.code, this.ioProxy, this.rooms, { playerId, typed: String(action.typed || '') });
          break;
        case 'colormatch':
          modules.colormatch(room.code, this.ioProxy, this.rooms, { playerId, color: action.color });
          break;
        case 'simonsays':
          modules.simonsays(room.code, this.ioProxy, this.rooms, { playerId, sequence: action.sequence });
          break;
        case 'trivia':
          modules.trivia(room.code, this.ioProxy, this.rooms, { playerId, option: Number(action.option) });
          break;
        case 'connectfour':
          modules.connectfour(room.code, this.ioProxy, this.rooms, { playerId, column: Number(action.column) });
          break;
        case 'higherlower':
          modules.higherlower(room.code, this.ioProxy, this.rooms, { playerId, choice: action.choice });
          break;
        case 'oddoneout':
          modules.oddoneout(room.code, this.ioProxy, this.rooms, { playerId, index: Number(action.index) });
          break;
      }
      return { ok: true };
    }

    // 3. New online/bot games
    if (g === 'snakeduel') return this.handleSnakeAction(room, player, action);
    if (g === 'bomberman') return this.handleBombermanAction(room, player, action);
    if (g === 'drawing') return this.handleDrawingAction(room, player, action);

    return { ok: false, error: '알 수 없는 게임 액션입니다.' };
  }

  // ─── BattleBox BOT Scheduler ──────────────────────────────────────────────────
  scheduleBattleboxBots(roomCode, emittedData) {
    const room = this.rooms[roomCode];
    if (!room || room.state !== 'playing') return;
    const bots = room.players.filter(p => p.isBot);
    if (!bots.length) return;
    if (!room.botTimers) room.botTimers = {};

    const g = room.game;
    const gs = room.gameState;

    const delayFor = (diff, baseMs, spreadMs) => {
      const mult = diff === 'hard' ? 0.55 : diff === 'normal' ? 1.0 : 1.55;
      return Math.round(baseMs * mult + Math.random() * spreadMs);
    };
    const accuracyFor = diff => (diff === 'hard' ? 0.92 : diff === 'normal' ? 0.72 : 0.45);

    // Track revealed memory cards when flipped
    if (g === 'memorymatch' && Array.isArray(gs.flipped) && Array.isArray(gs.cards)) {
      if (!room.botMemory.revealedCards) room.botMemory.revealedCards = {};
      for (const idx of gs.flipped) {
        if (gs.cards[idx]) room.botMemory.revealedCards[idx] = gs.cards[idx];
      }
    }

    // 1. Reaction Battle: bots react when canClick becomes true
    if (g === 'reaction' && gs.canClick && !gs.waiting && !gs.clicked) {
      bots.forEach(bot => {
        const key = `react_${bot.id}_${gs.round}`;
        if (room.botTimers[key]) return;
        const ms = bot.botDifficulty === 'hard'
          ? 180 + Math.random() * 140
          : bot.botDifficulty === 'normal'
            ? 290 + Math.random() * 220
            : 450 + Math.random() * 350;
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          this.handleAction(roomCode, bot.id, { type: 'click' });
        }, ms);
      });
      return;
    }

    // 2. Turn-based games where currentPlayerId or currentTurn / currentPlayer indicates whose turn it is
    const turnGames = new Set(['tictactoe', 'connectfour', 'wordchain', 'mathduel', 'anagram', 'memorymatch', 'higherlower', 'oddoneout']);
    if (turnGames.has(g)) {
      const turnIdx = g === 'tictactoe' ? (gs.currentTurn ?? 0) : (gs.currentPlayer ?? 0);
      const activePlayer = room.players[turnIdx];
      if (!activePlayer || !activePlayer.isBot) return;

      const turnKey = `turn_${g}_${activePlayer.id}_${gs.round || gs.turn || gs.moves || 0}_${gs.flipped?.length || 0}`;
      if (room.botTimers[turnKey]) return;

      const wait = delayFor(activePlayer.botDifficulty, 650, 450);
      room.botTimers[turnKey] = setTimeout(() => {
        delete room.botTimers[turnKey];
        if (!this.rooms[roomCode] || room.state !== 'playing') return;

        if (g === 'tictactoe') {
          const mark = turnIdx === 0 ? 'X' : 'O';
          const pos = getTicTacToeBotMove(gs.board || Array(9).fill(null), mark, activePlayer.botDifficulty);
          this.handleAction(roomCode, activePlayer.id, { pos });
        } else if (g === 'connectfour') {
          const token = turnIdx === 0 ? 'R' : 'Y';
          const col = getConnectFourBotMove(gs.board || Array(42).fill(null), token, activePlayer.botDifficulty);
          this.handleAction(roomCode, activePlayer.id, { column: col });
        } else if (g === 'wordchain') {
          const startChar = gs.lastLetter || 'a';
          const used = new Set(gs.usedWords || []);
          const candidates = WORDCHAIN_WORDS.filter(w => w[0] === startChar && !used.has(w));
          const pass = Math.random() < accuracyFor(activePlayer.botDifficulty);
          const word = (pass && candidates.length) ? candidates[Math.floor(Math.random() * candidates.length)] : 'invalidxyz';
          this.handleAction(roomCode, activePlayer.id, { word });
        } else if (g === 'mathduel') {
          const q = gs.questions?.[(gs.turn || 1) - 1];
          if (!q) return;
          const correct = Math.random() < accuracyFor(activePlayer.botDifficulty);
          const ans = correct ? q.a : q.a + (Math.random() < 0.5 ? 1 : -2);
          this.handleAction(roomCode, activePlayer.id, { answer: ans });
        } else if (g === 'anagram') {
          const word = gs.roundWords?.[(gs.round || 1) - 1];
          if (!word) return;
          const correct = Math.random() < accuracyFor(activePlayer.botDifficulty);
          this.handleAction(roomCode, activePlayer.id, { guess: correct ? word : `${word}x` });
        } else if (g === 'higherlower') {
          if (gs.answered) return;
          const cur = gs.current || 50;
          let choice = cur <= 50 ? 'higher' : 'lower';
          if (activePlayer.botDifficulty === 'easy' && Math.random() < 0.4) {
            choice = choice === 'higher' ? 'lower' : 'higher';
          }
          this.handleAction(roomCode, activePlayer.id, { choice });
        } else if (g === 'oddoneout') {
          if (gs.answered) return;
          const correct = Math.random() < accuracyFor(activePlayer.botDifficulty);
          const idx = correct ? gs.answer : Math.floor(Math.random() * 9);
          this.handleAction(roomCode, activePlayer.id, { index: idx });
        } else if (g === 'memorymatch') {
          if (gs.lockBoard) return;
          const matched = new Set(gs.matched || []);
          const flipped = new Set(gs.flipped || []);
          const avail = [];
          for (let i = 0; i < 16; i++) {
            if (!matched.has(i) && !flipped.has(i)) avail.push(i);
          }
          if (!avail.length) return;

          const mem = room.botMemory.revealedCards || {};
          const rememberChance = activePlayer.botDifficulty === 'hard' ? 0.9 : activePlayer.botDifficulty === 'normal' ? 0.55 : 0.2;
          let pick = avail[Math.floor(Math.random() * avail.length)];

          if (Math.random() < rememberChance) {
            if (gs.flipped?.length === 1) {
              const firstIdx = gs.flipped[0];
              const targetSym = gs.cards?.[firstIdx];
              const matchIdx = avail.find(i => mem[i] === targetSym);
              if (matchIdx !== undefined) pick = matchIdx;
            } else if (gs.flipped?.length === 0) {
              // Look for any known pair in memory
              const bySym = {};
              for (const i of avail) {
                if (mem[i]) {
                  bySym[mem[i]] = bySym[mem[i]] || [];
                  bySym[mem[i]].push(i);
                }
              }
              const pair = Object.values(bySym).find(arr => arr.length >= 2);
              if (pair) pick = pair[0];
            }
          }
          this.handleAction(roomCode, activePlayer.id, { cardIndex: pick });
        }
      }, wait);
      return;
    }

    // 3. Simultaneous round games (speedtyping, colormatch, simonsays, numberhunt, rpsarena, trivia)
    bots.forEach(bot => {
      if (g === 'speedtyping' && gs.words) {
        const wIdx = gs.currentWordIndex || 0;
        if ((gs.completed?.[bot.id] || 0) > wIdx) return;
        const key = `st_${bot.id}_${wIdx}`;
        if (room.botTimers[key]) return;
        const word = gs.words[wIdx] || '';
        const wait = delayFor(bot.botDifficulty, 1400, 900);
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          this.handleAction(roomCode, bot.id, { typed: word });
        }, wait);
      } else if (g === 'colormatch' && gs.currentDisplay) {
        if (gs.answered?.[bot.id] !== undefined) return;
        const key = `cm_${bot.id}_${gs.round}`;
        if (room.botTimers[key]) return;
        const wait = delayFor(bot.botDifficulty, 800, 600);
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          const colors = ['red', 'blue', 'green', 'yellow'];
          const isCorr = Math.random() < accuracyFor(bot.botDifficulty);
          const ans = isCorr ? gs.currentDisplay._correctAnswer : colors[Math.floor(Math.random() * colors.length)];
          this.handleAction(roomCode, bot.id, { color: ans });
        }, wait);
      } else if (g === 'rpsarena') {
        if (gs.choices?.[bot.id] !== undefined) return;
        const key = `rps_${bot.id}_${gs.round}`;
        if (room.botTimers[key]) return;
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          const choices = ['rock', 'paper', 'scissors'];
          this.handleAction(roomCode, bot.id, { choice: choices[Math.floor(Math.random() * 3)] });
        }, delayFor(bot.botDifficulty, 500, 400));
      } else if (g === 'numberhunt') {
        if (gs.guesses?.[bot.id] !== undefined) return;
        const key = `nh_${bot.id}_${gs.round}`;
        if (room.botTimers[key]) return;
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          const guess = Math.floor(Math.random() * 21) + 10;
          this.handleAction(roomCode, bot.id, { guess });
        }, delayFor(bot.botDifficulty, 600, 500));
      } else if (g === 'trivia' && gs.questions) {
        const qIdx = gs.currentQuestion || 0;
        if (gs.answered?.[bot.id] !== undefined) return;
        const key = `tr_${bot.id}_${qIdx}`;
        if (room.botTimers[key]) return;
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          const q = gs.questions?.[qIdx];
          if (!q) return;
          const isCorr = Math.random() < accuracyFor(bot.botDifficulty);
          const opt = isCorr ? q.a : Math.floor(Math.random() * 4);
          this.handleAction(roomCode, bot.id, { option: opt });
        }, delayFor(bot.botDifficulty, 1200, 1200));
      } else if (g === 'simonsays' && Array.isArray(gs.sequence) && !gs.showingSequence) {
        if (gs.eliminated?.[bot.id]) return;
        const pSeq = gs.playerSequence?.[bot.id] || [];
        if (pSeq.length >= gs.sequence.length) return;
        const key = `ss_${bot.id}_${gs.round}_${pSeq.length}`;
        if (room.botTimers[key]) return;
        room.botTimers[key] = setTimeout(() => {
          delete room.botTimers[key];
          const colors = ['red', 'blue', 'green', 'yellow'];
          const isCorr = Math.random() < (bot.botDifficulty === 'hard' ? 0.96 : bot.botDifficulty === 'normal' ? 0.85 : 0.68);
          const nextStep = gs.sequence[pSeq.length];
          const pick = isCorr ? nextStep : colors[Math.floor(Math.random() * 4)];
          this.handleAction(roomCode, bot.id, { sequence: [pick] });
        }, delayFor(bot.botDifficulty, 350, 250));
      }
    });
  }

  // ─── Snake Duel: original PawelN93/snake-duel engine + platform adapter ──────
  startSnakeDuel(room) {
    const p1 = room.players[0];
    const p2 = room.players[1] || { id: 'bot-auto', name: '🤖 BOT 민수', isBot: true, botDifficulty: 'normal', score: 0 };
    if (room.players.length === 1) room.players.push(p2);
    room.snakeEngine = new SnakeDuelEngine({ 1: p1.name, 2: p2.name });
    room.snakeRoleByPlayerId = { [p1.id]: 1, [p2.id]: 2 };
    room.gameState = this.serializeOriginalSnakeState(room, 0);

    this.ioProxy.to(room.code).emit('updateGameState', {
      gameState: room.gameState,
      scores: buildScores(room),
      status: 'Snake Duel 원본 규칙 · 2초 후 시작! WASD 또는 방향키로 조작하세요.',
    });

    room.timers.snakeStart = setTimeout(() => {
      delete room.timers.snakeStart;
      if (room.state !== 'playing') return;
      room.timers.snakeLoop = setInterval(() => {
        if (room.state !== 'playing') return;
        const snapshot = room.snakeEngine.getSnapshot();
        for (const player of room.players) {
          if (!player.isBot) continue;
          const role = room.snakeRoleByPlayerId[player.id];
          const snake = snapshot.snakes.find(item => item.role === role);
          if (snake?.alive) {
            room.snakeEngine.setDirection(role, this.computeSnakeBotDirection(snapshot, snake, player.botDifficulty));
          }
        }

        const result = room.snakeEngine.tick();
        room.gameState = this.serializeOriginalSnakeState(room, (room.gameState.tick || 0) + 1);
        const originalScores = room.snakeEngine.getScores();
        room.players.forEach(player => {
          const role = room.snakeRoleByPlayerId[player.id];
          player.score = originalScores[role] || 0;
        });

        if (result.gameOver) {
          clearInterval(room.timers.snakeLoop);
          const winnerPlayer = room.players.find(player => room.snakeRoleByPlayerId[player.id] === result.winner);
          if (winnerPlayer) winnerPlayer.score += 1;
          const reasonText = {
            wall: '벽 충돌', self: '자기 몸 충돌', opponent: '상대 충돌', draw: '정면 충돌',
          }[result.reason] || '경기 종료';
        this.ioProxy.to(room.code).emit('updateGameState', {
            gameState: room.gameState,
            scores: buildScores(room),
            status: winnerPlayer ? `${winnerPlayer.name} 승리 · ${reasonText}` : `무승부 · ${reasonText}`,
          });
          this.ioProxy.to(room.code).emit('gameOver', {
            winner: winnerPlayer ? winnerPlayer.name : null,
          });
          return;
        }
        this.ioProxy.to(room.code).emit('updateGameState', {
          gameState: room.gameState,
          scores: buildScores(room),
          status: '원본 Snake Duel 진행 중 · 먹이를 먹고 벽과 상대를 피하세요.',
        });
      }, SNAKE_TICK_MS);
    }, 1800);
  }

  serializeOriginalSnakeState(room, tick) {
    const snapshot = room.snakeEngine.getSnapshot();
    const playersByRole = Object.fromEntries(
      room.players.map(player => [room.snakeRoleByPlayerId[player.id], player]),
    );
    return {
      originalSource: 'PawelN93/snake-duel',
      gridWidth: SNAKE_GRID_WIDTH,
      gridHeight: SNAKE_GRID_HEIGHT,
      gridSize: SNAKE_GRID_WIDTH,
      tick,
      food: snapshot.food,
      snakes: Object.fromEntries(snapshot.snakes.map(snake => {
        const player = playersByRole[snake.role];
        return [player.id, { ...snake, id: player.id, isBot: !!player.isBot }];
      })),
    };
  }

  computeSnakeBotDirection(snapshot, me, difficulty = 'normal') {
    const head = me.body[0];
    const opposite = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
    const candidates = [
      ['UP', 0, -1], ['DOWN', 0, 1], ['LEFT', -1, 0], ['RIGHT', 1, 0],
    ].filter(([direction]) => direction !== opposite[me.direction]);

    const blocked = new Set();
    for (const snake of snapshot.snakes) {
      for (let index = 0; index < snake.body.length - 1; index++) blocked.add(`${snake.body[index].x},${snake.body[index].y}`);
    }

    const isSafe = (x, y) => x >= 0 && x < SNAKE_GRID_WIDTH && y >= 0 && y < SNAKE_GRID_HEIGHT && !blocked.has(`${x},${y}`);
    const safe = candidates.filter(([, dx, dy]) => isSafe(head.x + dx, head.y + dy));
    if (!safe.length) return candidates[0]?.[0] || me.direction;

    if (difficulty === 'easy' && Math.random() < 0.35) return safe[Math.floor(Math.random() * safe.length)][0];

    safe.sort((a, b) => {
      const ax = head.x + a[1], ay = head.y + a[2];
      const bx = head.x + b[1], by = head.y + b[2];
      const distA = Math.abs(ax - snapshot.food.x) + Math.abs(ay - snapshot.food.y);
      const distB = Math.abs(bx - snapshot.food.x) + Math.abs(by - snapshot.food.y);
      if (difficulty === 'hard') {
        const freeA = [[-1,0],[1,0],[0,-1],[0,1]].filter(([dx,dy]) => isSafe(ax+dx, ay+dy)).length;
        const freeB = [[-1,0],[1,0],[0,-1],[0,1]].filter(([dx,dy]) => isSafe(bx+dx, by+dy)).length;
        if (freeA !== freeB && (freeA === 0 || freeB === 0)) return freeB - freeA;
      }
      return distA - distB;
    });
    return safe[0][0];
  }

  handleSnakeAction(room, player, action) {
    const role = room.snakeRoleByPlayerId?.[player.id];
    if (!role || !room.snakeEngine) return { ok: false, error: '조작할 수 없는 상태입니다.' };
    const dirMap = {
      up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT',
    };
    const next = dirMap[String(action.dir || action.direction || '').toLowerCase()];
    if (!next) return { ok: false, error: '올바르지 않은 방향입니다.' };
    room.snakeEngine.setDirection(role, next);
    return { ok: true };
  }

  // ─── Bomberman Engine (2~4 Players + BOT AI) ──────────────────────────────────
  startBomberman(room) {
    // Blast Arena uses a wide arena and 15ms simulation. The platform adapter
    // keeps that layout readable inside the portal while retaining the same
    // power-up, fuse and movement rules.
    const W = 15, H = 13;
    const spawnSeeds = [
      { x: 1, y: 1, dx: 1, dy: 1, color: '#00f0ff' },
      { x: W - 2, y: H - 2, dx: -1, dy: -1, color: '#ff3366' },
      { x: W - 2, y: 1, dx: -1, dy: 1, color: '#00ff88' },
      { x: 1, y: H - 2, dx: 1, dy: -1, color: '#ffea00' },
    ];
    const spawnSafeCells = new Set();
    for (const spawn of spawnSeeds) {
      // Two mirrored L-shaped exits let every player move beyond a range-2
      // blast without relying on a randomly empty crate cell.
      const safeOffsets = [
        [0, 0], [1, 0], [2, 0], [2, 1],
        [0, 1], [0, 2], [1, 2],
      ];
      for (const [forward, side] of safeOffsets) {
        spawnSafeCells.add(`${spawn.x + spawn.dx * forward},${spawn.y + spawn.dy * side}`);
      }
    }

    // 0: empty, 1: solid wall, 2: destructible crate
    const grid = Array.from({ length: H }, (_, y) =>
      Array.from({ length: W }, (__, x) => {
        if (x === 0 || y === 0 || x === W - 1 || y === H - 1) return 1;
        if (x % 2 === 0 && y % 2 === 0) return 1;
        if (spawnSafeCells.has(`${x},${y}`)) return 0;
        return Math.random() < 0.65 ? 2 : 0;
      })
    );

    const spawns = spawnSeeds.map(({ x, y, color }) => ({ x, y, color }));

    const fighters = {};
    room.players.slice(0, 4).forEach((p, idx) => {
      const sp = spawns[idx];
      fighters[p.id] = {
        id: p.id,
        name: p.name,
        x: sp.x,
        y: sp.y,
        spawnX: sp.x,
        spawnY: sp.y,
        color: sp.color,
        alive: true,
        lives: 3,
        bombCapacity: 1,
        bombRange: 1,
        speed: 1,
        lastMoveAt: 0,
        lastHitAt: 0,
        isBot: !!p.isBot,
        botDifficulty: p.botDifficulty || 'normal',
      };
    });

    room.gameState = {
      width: W,
      height: H,
      grid,
      fighters,
      bombs: [], // { id, ownerId, x, y, ticksLeft, range }
      explosions: [], // { x, y, ticksLeft }
      powerUps: [], // Blast Arena: bomb capacity, flame range, speed
      tick: 0,
      originalSource: 'sahmedhusain/blast-arena',
    };

    // Guarantee that every round visibly demonstrates all three original
    // pickup types, in addition to the 40% crate-drop rule.
    const pickupKinds = ['bomb', 'flame', 'speed'];
    const candidateCells = [];
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        if (grid[y][x] === 0 && !Object.values(fighters).some(f => f.x === x && f.y === y)) candidateCells.push({ x, y });
      }
    }
    pickupKinds.forEach((kind, index) => {
      const cell = candidateCells[Math.floor((candidateCells.length - 1) * ((index + 1) / 4))];
      if (cell) room.gameState.powerUps.push({ id: `power-${kind}-${index}`, kind, ...cell });
    });

    this.ioProxy.to(room.code).emit('updateGameState', {
      gameState: room.gameState,
      scores: buildScores(room),
      status: '💣 봄버맨 아레나 · 2초 후 시작! 방향키로 이동, Space로 폭탄 설치!',
    });

    room.timers.bomberStart = setTimeout(() => {
      delete room.timers.bomberStart;
      if (room.state !== 'playing') return;
      room.timers.bomberLoop = setInterval(() => {
        if (room.state !== 'playing') return;
        const gs = room.gameState;
        gs.tick++;

      // Clear expired explosions
      gs.explosions = gs.explosions.filter(ex => {
        ex.ticksLeft -= 1;
        return ex.ticksLeft > 0;
      });

      // Bot movement follows Blast Arena's 150ms base movement interval.
      if (gs.tick % 2 === 0) {
        for (const p of room.players) {
          if (p.isBot && gs.fighters[p.id]?.alive) {
            this.stepBombermanBot(room, p);
          }
        }
      }

      // Tick bombs
      const remainingBombs = [];
      for (const b of gs.bombs) {
        b.ticksLeft -= 1;
        if (b.ticksLeft <= 0) {
          this.detonateBomb(room, b);
        } else {
          remainingBombs.push(b);
        }
      }
      gs.bombs = remainingBombs;

      // Check win condition
      const aliveList = Object.values(gs.fighters).filter(f => f.alive);
      if (aliveList.length <= 1 || gs.tick >= 2250) {
        clearInterval(room.timers.bomberLoop);
        let winnerName = null;
        if (aliveList.length === 1) {
          winnerName = aliveList[0].name;
          const wp = room.players.find(p => p.id === aliveList[0].id);
          if (wp) wp.score += 50;
        }
        this.ioProxy.to(room.code).emit('updateGameState', {
          gameState: gs,
          scores: buildScores(room),
          status: winnerName ? `🏆 ${winnerName} 최후의 생존 승리!` : '무승부!',
        });
        this.ioProxy.to(room.code).emit('gameOver', {
          winner: winnerName ? `${winnerName} wins Bomberman!` : null,
        });
        return;
      }

        this.ioProxy.to(room.code).emit('updateGameState', {
          gameState: gs,
          scores: buildScores(room),
          status: `생존자 ${aliveList.length}명 — 폭탄을 설치해 블록과 상대를 제압하세요!`,
        });
      }, 80);
    }, 1800);
  }

  detonateBomb(room, bomb) {
    const gs = room.gameState;
    const owner = room.players.find(p => p.id === bomb.ownerId);
    const affected = [{ x: bomb.x, y: bomb.y }];
    const dirs = [[0,-1],[0,1],[-1,0],[1,0]];

    for (const [dx, dy] of dirs) {
      for (let step = 1; step <= (bomb.range || 2); step++) {
        const nx = bomb.x + dx * step;
        const ny = bomb.y + dy * step;
        if (nx < 0 || ny < 0 || nx >= gs.width || ny >= gs.height) break;
        const cell = gs.grid[ny][nx];
        if (cell === 1) break; // solid wall stops blast
        affected.push({ x: nx, y: ny });
        if (cell === 2) {
          gs.grid[ny][nx] = 0; // destroy crate
          if (owner) owner.score += 5;
          // Exact Blast Arena drop rate and three pickup kinds.
          if (Math.random() <= 0.4 && !gs.powerUps.some(power => power.x === nx && power.y === ny)) {
            const kinds = ['bomb', 'flame', 'speed'];
            const kind = kinds[Math.floor(Math.random() * kinds.length)];
            gs.powerUps.push({ id: `power-${Date.now()}-${nx}-${ny}`, kind, x: nx, y: ny });
          }
          break;
        }
      }
    }

    for (const pos of affected) {
      gs.explosions.push({ x: pos.x, y: pos.y, ticksLeft: 8 });
      for (const f of Object.values(gs.fighters)) {
        if (f.alive && f.x === pos.x && f.y === pos.y && Date.now() - (f.lastHitAt || 0) > 900) {
          f.lives = Math.max(0, (f.lives || 1) - 1);
          f.lastHitAt = Date.now();
          f.alive = f.lives > 0;
          if (f.alive) {
            f.x = f.spawnX;
            f.y = f.spawnY;
          }
          if (owner && owner.id !== f.id) owner.score += f.alive ? 10 : 30;
        }
      }
    }
  }

  stepBombermanBot(room, botPlayer) {
    const gs = room.gameState;
    const me = gs.fighters[botPlayer.id];
    if (!me || !me.alive) return;

    // Danger cells from active bombs
    const danger = new Set();
    for (const b of gs.bombs) {
      danger.add(`${b.x},${b.y}`);
      for (const [dx, dy] of [[0,-1],[0,1],[-1,0],[1,0]]) {
        for (let s = 1; s <= (b.range || 1); s++) {
          danger.add(`${b.x + dx * s},${b.y + dy * s}`);
        }
      }
    }

    const canWalk = (x, y) => {
      if (x < 0 || y < 0 || x >= gs.width || y >= gs.height) return false;
      if (gs.grid[y][x] !== 0) return false;
      if (gs.bombs.some(b => b.x === x && b.y === y)) return false;
      return true;
    };

    const adjDirs = [
      { dir: 'up', x: me.x, y: me.y - 1 },
      { dir: 'down', x: me.x, y: me.y + 1 },
      { dir: 'left', x: me.x - 1, y: me.y },
      { dir: 'right', x: me.x + 1, y: me.y },
    ].filter(d => canWalk(d.x, d.y));

    // If standing in danger, prioritize moving to non-danger cell
    if (danger.has(`${me.x},${me.y}`)) {
      const safe = adjDirs.find(d => !danger.has(`${d.x},${d.y}`)) || adjDirs[0];
      if (safe) {
        this.handleBombermanAction(room, botPlayer, { dir: safe.dir });
      }
      return;
    }

    // Check if adjacent to crate or enemy fighter -> place bomb if we have escape route
    const nearCrate = [[0,-1],[0,1],[-1,0],[1,0]].some(([dx,dy]) => gs.grid[me.y + dy]?.[me.x + dx] === 2);
    const nearEnemy = Object.values(gs.fighters).some(f => f.id !== me.id && f.alive && (Math.abs(f.x - me.x) + Math.abs(f.y - me.y) <= 2));
    const alreadyHasBomb = gs.bombs.filter(b => b.ownerId === me.id).length >= (me.bombCapacity || 1);

    if ((nearCrate || nearEnemy) && !alreadyHasBomb && adjDirs.length > 0 && Math.random() < (botPlayer.botDifficulty === 'easy' ? 0.35 : 0.75)) {
      this.handleBombermanAction(room, botPlayer, { type: 'bomb' });
      return;
    }

    // Move toward nearest enemy or crate
    const safeMoves = adjDirs.filter(d => !danger.has(`${d.x},${d.y}`));
    const pool = safeMoves.length ? safeMoves : adjDirs;
    if (pool.length) {
      const enemies = Object.values(gs.fighters).filter(f => f.id !== me.id && f.alive);
      if (enemies.length && botPlayer.botDifficulty !== 'easy') {
        const target = enemies[0];
        pool.sort((a, b) => (Math.abs(a.x - target.x) + Math.abs(a.y - target.y)) - (Math.abs(b.x - target.x) + Math.abs(b.y - target.y)));
        const pick = Math.random() < 0.7 ? pool[0] : pool[Math.floor(Math.random() * pool.length)];
        this.handleBombermanAction(room, botPlayer, { dir: pick.dir });
      } else {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        this.handleBombermanAction(room, botPlayer, { dir: pick.dir });
      }
    }
  }

  handleBombermanAction(room, player, action) {
    const gs = room.gameState;
    const f = gs.fighters?.[player.id];
    if (!f || !f.alive) return { ok: false, error: '생존 상태가 아닙니다.' };

    if (action.type === 'bomb' || action.bomb) {
      if (!gs.bombs.some(b => b.x === f.x && b.y === f.y) && gs.bombs.filter(b => b.ownerId === player.id).length < (f.bombCapacity || 1)) {
        gs.bombs.push({
          id: `b-${Date.now()}-${Math.random()}`,
          ownerId: player.id,
          x: f.x,
          y: f.y,
          // Blast Arena original: 2.5 second fuse and player-owned flame range.
          ticksLeft: 32,
          range: f.bombRange || 1,
        });
      }
      if (!action.dir && !action.move) return { ok: true };
    }

    const dirKey = String(action.dir || action.move || '').toLowerCase();
    const delta = { up: [0,-1], down: [0,1], left: [-1,0], right: [1,0] }[dirKey];
    if (!delta) return { ok: Boolean(action.type === 'bomb' || action.bomb) };
    const now = Date.now();
    const moveIntervalMs = Math.max(40, Math.floor(150 / Math.max(0.1, f.speed || 1)));
    if (now - (f.lastMoveAt || 0) < moveIntervalMs) return { ok: true };
    const nx = f.x + delta[0];
    const ny = f.y + delta[1];
    if (nx >= 0 && ny >= 0 && nx < gs.width && ny < gs.height && gs.grid[ny][nx] === 0 && !gs.bombs.some(b => b.x === nx && b.y === ny)) {
      f.x = nx;
      f.y = ny;
      f.lastMoveAt = now;
      const powerIndex = gs.powerUps.findIndex(power => power.x === nx && power.y === ny);
      if (powerIndex >= 0) {
        const [power] = gs.powerUps.splice(powerIndex, 1);
        if (power.kind === 'bomb') f.bombCapacity = (f.bombCapacity || 1) + 1;
        if (power.kind === 'flame') f.bombRange = (f.bombRange || 1) + 1;
        if (power.kind === 'speed') f.speed = (f.speed || 1) + 0.5;
        player.score += 8;
      }
    }
    return { ok: true };
  }

  // ─── Drawing Game (CatchMind / DoodleDash) ────────────────────────────────────
  startDrawingGame(room) {
    const presets = [...DRAWING_PRESETS].sort(() => Math.random() - 0.5);
    const maxRounds = Math.min(4, Math.max(2, room.players.length));
    room.gameState = {
      round: 1,
      maxRounds,
      drawerIndex: 0,
      presets,
      currentPreset: null,
      strokes: [],
      chat: [],
      guessedIds: {},
      timer: 35,
    };

    this.beginDrawingRound(room);
  }

  beginDrawingRound(room) {
    this.cleanupRoomTimers(room);
    const gs = room.gameState;
    const drawer = room.players[gs.drawerIndex % room.players.length];
    const preset = gs.presets[(gs.round - 1) % gs.presets.length];
    gs.currentPreset = preset;
    gs.strokes = [];
    gs.guessedIds = {};
    gs.timer = 35;

    this.broadcastDrawingState(room, `🎨 라운드 ${gs.round}/${gs.maxRounds} — 출제자: ${drawer.name} (카테고리: ${preset.category})`);

    // If drawer is BOT, progressively emit vector strokes over time
    if (drawer.isBot) {
      let sIdx = 0;
      room.botTimers.botDraw = setInterval(() => {
        if (room.state !== 'playing') return;
        if (sIdx < preset.strokes.length) {
          gs.strokes.push(preset.strokes[sIdx]);
          sIdx++;
          this.broadcastDrawingState(room, `🤖 ${drawer.name}님이 그림을 그리고 있습니다... (초성 힌트: ${preset.hint})`);
        } else {
          clearInterval(room.botTimers.botDraw);
        }
      }, 1100);
    }

    // Schedule other BOTs to make simulated guesses based on hints & elapsed time
    room.players.filter(p => p.isBot && p.id !== drawer.id).forEach(bot => {
      const waitMs = bot.botDifficulty === 'hard'
        ? 5000 + Math.random() * 5000
        : bot.botDifficulty === 'normal'
          ? 9000 + Math.random() * 8000
          : 14000 + Math.random() * 10000;

      room.botTimers[`guess_${bot.id}`] = setTimeout(() => {
        if (room.state !== 'playing') return;
        const willBeCorrect = Math.random() < (bot.botDifficulty === 'hard' ? 0.85 : bot.botDifficulty === 'normal' ? 0.65 : 0.4);
        const wrongPool = DRAWING_PRESETS.filter(p => p.word !== preset.word).map(p => p.word);
        const text = willBeCorrect ? preset.word : wrongPool[Math.floor(Math.random() * wrongPool.length)];
        this.handleDrawingAction(room, bot, { type: 'guess', text });
      }, waitMs);
    });

    room.timers.drawTick = setInterval(() => {
      if (room.state !== 'playing') return;
      gs.timer -= 1;
      if (gs.timer <= 0) {
        this.advanceDrawingRound(room, `⏰ 시간 종료! 정답은 "${preset.word}"였습니다.`);
        return;
      }
      this.broadcastDrawingState(room);
    }, 1000);
  }

  broadcastDrawingState(room, customStatus = null) {
    const gs = room.gameState;
    const drawer = room.players[gs.drawerIndex % room.players.length];
    const preset = gs.currentPreset;

    for (const p of room.players) {
      if (p.isBot) continue;
      const isDrawer = p.id === drawer.id;
      this.sendToClient(p.id, 'updateGameState', {
        roomCode: room.code,
        game: room.game,
        players: this.safePlayers(room),
        scores: buildScores(room),
        status: customStatus || (isDrawer ? `✏️ 제시어 [${preset.word}]를 그려주세요! (${gs.timer}초)` : `💡 그림을 보고 정답을 맞혀보세요! 카테고리: ${preset.category} / 초성: ${preset.hint} (${gs.timer}초)`),
        gameState: {
          round: gs.round,
          maxRounds: gs.maxRounds,
          drawerId: drawer.id,
          drawerName: drawer.name,
          isDrawer,
          word: isDrawer ? preset.word : null, // NEVER leak answer to guessers
          category: preset.category,
          hint: preset.hint,
          timer: gs.timer,
          strokes: gs.strokes,
          chat: gs.chat.slice(-20),
          guessedIds: gs.guessedIds,
        },
      });
    }
  }

  handleDrawingAction(room, player, action) {
    const gs = room.gameState;
    const drawer = room.players[gs.drawerIndex % room.players.length];
    const preset = gs.currentPreset;

    if (action.type === 'stroke') {
      if (player.id !== drawer.id) return { ok: false, error: '출제자만 그릴 수 있습니다.' };
      if (action.stroke) gs.strokes.push(action.stroke);
      this.broadcastDrawingState(room);
      return { ok: true };
    }

    if (action.type === 'clear') {
      if (player.id !== drawer.id) return { ok: false, error: '출제자만 지울 수 있습니다.' };
      gs.strokes = [];
      this.broadcastDrawingState(room);
      return { ok: true };
    }

    if (action.type === 'guess') {
      const text = String(action.text || '').trim();
      if (!text) return { ok: false };
      if (player.id === drawer.id) return { ok: false, error: '출제자는 정답을 입력할 수 없습니다.' };
      if (gs.guessedIds[player.id]) return { ok: false, error: '이미 정답을 맞혔습니다.' };

      if (text === preset.word) {
        gs.guessedIds[player.id] = true;
        const bonus = Math.max(10, gs.timer);
        player.score += bonus;
        drawer.score += 10;
        gs.chat.push({ id: `${Date.now()}-${Math.random()}`, sender: 'SYSTEM', text: `🎉 ${player.name}님이 정답을 맞혔습니다! (+${bonus}점)`, isCorrect: true });

        const guessers = room.players.filter(p => p.id !== drawer.id);
        const allGuessed = guessers.every(g => gs.guessedIds[g.id]);
        if (allGuessed) {
          this.advanceDrawingRound(room, `🎉 전원 정답! 정답은 "${preset.word}"였습니다.`);
        } else {
          this.broadcastDrawingState(room, `🎉 ${player.name} 정답!`);
        }
      } else {
        gs.chat.push({ id: `${Date.now()}-${Math.random()}`, sender: player.name, text, isCorrect: false });
        this.broadcastDrawingState(room);
      }
      return { ok: true };
    }

    return { ok: false };
  }

  advanceDrawingRound(room, message) {
    this.cleanupRoomTimers(room);
    const gs = room.gameState;
    gs.chat.push({ id: `${Date.now()}`, sender: 'SYSTEM', text: message, isCorrect: true });

    if (gs.round >= gs.maxRounds) {
      endGameForRoom(this, room, 'Drawing Challenge');
      return;
    }

    gs.round += 1;
    gs.drawerIndex = (gs.drawerIndex + 1) % room.players.length;
    this.broadcastDrawingState(room, message);

    room.timers.nextRoundDelay = setTimeout(() => {
      if (room.state === 'playing') this.beginDrawingRound(room);
    }, 2200);
  }

  // ─── Finalize Match & Save to Store ───────────────────────────────────────────
  finalizeMatch(roomCode, data) {
    const room = this.rooms[roomCode];
    if (!room) return;
    this.cleanupRoomTimers(room);

    const durationMs = room.startedAt ? Date.now() - room.startedAt : 0;
    let recorded = null;
    try {
      recorded = this.store.recordMatchResult({
        gameId: room.game,
        mode: room.mode,
        roomCode: room.code,
        eventId: room.eventId || null,
        durationMs,
        participants: room.players.map(p => ({
          id: p.id,
          userId: p.userId,
          name: p.name,
          isBot: p.isBot,
          botDifficulty: p.botDifficulty,
          score: p.score || 0,
          metricValue: p.lastMetric ?? p.score ?? 0,
        })),
      });
    } catch (e) {
      console.error('[finalizeMatch]', e);
    }

    // Keep the result screen mounted. Returning to the lobby here made rapid
    // arcade matches look as if the whole page had refreshed; rematch() is the
    // explicit transition back to the lobby.
    room.state = 'finished';
    room.lastResult = {
      winner: data?.winner || null,
      isOfficial: !!recorded?.isOfficial,
      standings: recorded?.participants || [],
      scores: buildScores(room),
      recorded,
    };

    this.broadcastToRoom(roomCode, 'gameOver', {
      ...data,
      roomCode,
      game: room.game,
      isOfficial: !!recorded?.isOfficial,
      standings: recorded?.participants || [],
      scores: buildScores(room),
      players: this.safePlayers(room),
      recorded,
    });
    this.broadcastToRoom(roomCode, 'roomUpdated', this.serializeRoom(room));
  }
}

function endGameForRoom(hub, room, label) {
  const maxScore = Math.max(...room.players.map(p => p.score || 0));
  const leaders = room.players.filter(p => (p.score || 0) === maxScore);
  const winner = leaders.length === 1 ? `${leaders[0].name} wins ${label}!` : null;
  hub.finalizeMatch(room.code, { winner });
}
