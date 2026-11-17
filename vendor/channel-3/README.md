<div align="center">

<a href="https://channelthree.vercel.app/">
<img src="docs/media/banner.gif" width="620" alt="Channel 3: the shelf, over colour bars" />
</a>

# Channel 3

**A Nintendo Entertainment System that lives in a browser tab, and behaves like a television.**

Boot it and you get static. Tune past it and there's a shelf of cartridges,
a CRT that warms up when you switch it on and collapses to a line when you
switch it off, and a friend one room code away.

### [Play it at channelthree.vercel.app](https://channelthree.vercel.app/)

<p>
<a href="https://channelthree.vercel.app/"><img alt="Live demo" src="https://img.shields.io/badge/demo-live-e0362c?style=flat-square&labelColor=120806" /></a>
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-e0362c?style=flat-square&labelColor=120806" />
<img alt="WebGL" src="https://img.shields.io/badge/WebGL-CRT%20shader-ffc24b?style=flat-square&labelColor=120806" />
<img alt="WebRTC" src="https://img.shields.io/badge/WebRTC-netplay-e0362c?style=flat-square&labelColor=120806" />
<img alt="PWA" src="https://img.shields.io/badge/PWA-plays%20offline-ffc24b?style=flat-square&labelColor=120806" />
<img alt="License" src="https://img.shields.io/badge/license-AGPL--3.0-a5836a?style=flat-square&labelColor=120806" />
</p>

</div>

---

## <img src="docs/media/icons/tv.png" width="22" align="top" alt="" /> The set

|  |  |  |
| :-: | :-: | :-: |
| <img src="docs/media/smb3.gif" width="260" alt="" /> | <img src="docs/media/spiderman.gif" width="260" alt="" /> | <img src="docs/media/batman.gif" width="260" alt="" /> |
| **Famicom**, curved tube | **Twilight Purple**, RGB monitor | **Ghost Slate**, scanlines |
| <img src="docs/media/ddragon3.gif" width="260" alt="" /> | <img src="docs/media/advisland.gif" width="260" alt="" /> | <img src="docs/media/excitebike.gif" width="260" alt="" /> |
| **Ice & Neon**, worn VHS | **Phosphor Green**, raw pixels | **Famicom**, scanlines |

Five themes, six CRT presets, and none of it is a filter over a screenshot:
the shader runs on the live framebuffer at 60 fps.

<sub>The commercial games above are shown running in the emulator; none of them
ship with it. What's bundled is twelve freely distributable homebrew titles;
bring your own cartridges for everything else.</sub>

---

## <img src="docs/media/icons/cart.png" width="22" align="top" alt="" /> What's in it

**A headless core.** [jsnes](https://github.com/bfirsh/jsnes) runs detached
from any UI. Video goes from the framebuffer straight into a WebGL texture;
audio goes to an AudioWorklet. Nothing about the emulator knows a DOM exists.

**A real CRT pipeline.** Barrel curvature, scanlines, an aperture-grille mask,
phosphor glow, chromatic aberration and vignette, every parameter live from
the CONFIG panel, with five presets and a custom mode. Overscan is cropped 8px
top and bottom, the way a television did it.

**Netplay that only sends a byte.** WebRTC through peerjs, in deterministic
frame lockstep. Each peer sends one controller byte per frame and nothing else.
Before the first frame the host pings the line and picks an input delay (two
to ten frames) that covers half the round trip, so a fast connection plays
tight and a slow one does not stall. The host ships the ROM to the guest over
the data channel, so both sides start from identical memory, and every two
seconds the two compare a fingerprint of the game's RAM: if they ever part
ways, the set says so instead of letting it pass for lag. Room codes are six
letters, shown like a NES password screen.

**Rewind.** Hold <kbd>Backspace</kbd>, or either shoulder on a pad, and
travel back about sixty seconds, over a ring of 120 state snapshots taken
twice a second. The picture wobbles like a VHS while you do it. Save states
are a bookmark you have to remember to place; this is the one that works when
you did not see it coming.

**Twelve games, no ROM hunting.** All freely distributable, all credited in-app
under GAME CREDITS in CONFIG with their license and source. Drag in your own and
they persist to IndexedDB, keyed by SHA-256 so a rename doesn't orphan the save.

**It works with the lights off.** The service worker precaches everything the
emulator needs, ROMs included, so offline it behaves like a console. Only
netplay needs the network.

**Cartridge art nobody drew.** Each cart's label is a screenshot of that game
actually being played: the ROM runs headless in a Web Worker until it finds a
lively frame, then that frame becomes the label. The capture point is
randomised, so no two installs have the same shelf.

**A whole television, not a canvas.** Boot static, a power ramp that opens the
picture from a bright line, a 3D cartridge carousel, ambient room light sampled
from the framebuffer, square-wave UI blips synthesised in the APU's idiom, and
a power button that genuinely switches the set off.

**Touch, keyboard, gamepad.** An on-screen NES pad appears when you're playing
on a touch device with no controller attached. Every action is rebindable, for
both players, keys and pad buttons alike.

---

## <img src="docs/media/icons/power.png" width="22" align="top" alt="" /> Run it

```sh
npm install
npm run dev
```

Then drop any `.nes` file onto the screen, or pick one off the shelf.

```sh
npm run build      # tsc --noEmit && vite build
npm run preview    # serve the production build
npm test           # vitest: lockstep determinism, netplay sync, the pure modules
```

### Netplay

1. Player 1 starts a game and hits **LINK UP**, then **HOST GAME**. A six-letter room
   code appears.
2. Player 2 opens the app anywhere, types the code, hits **JOIN**.
3. The ROM transfers and both sides restart in lockstep. Host is P1.

---

## <img src="docs/media/icons/pad.png" width="22" align="top" alt="" /> Controls

### The console

|  | Player 1 | Player 2 | Gamepad |
| --- | --- | --- | --- |
| D-pad | Arrows | <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> | D-pad, or either stick |
| A | <kbd>X</kbd> | <kbd>E</kbd> | East / north face buttons |
| B | <kbd>Z</kbd> | <kbd>Q</kbd> | South / west face buttons |
| Start | <kbd>Enter</kbd> | <kbd>2</kbd> | Start |
| Select | <kbd>Shift</kbd> | <kbd>1</kbd> | Select |

### The emulator

These are not console buttons: they drive the machine the console is running
on, so on a gamepad they live where a NES pad had nothing.

|  |  | Gamepad |
| --- | --- | --- |
| **Rewind** (hold) | <kbd>Backspace</kbd> | Either shoulder |
| Save state | <kbd>K</kbd> | Left stick click |
| Load state | <kbd>L</kbd> | Right stick click |
| Pause | <kbd>P</kbd> | |
| Link up | <kbd>V</kbd> | |
| Fullscreen | <kbd>F</kbd> | |

**If you only try one thing, make it rewind.** Hold it and the game runs
backwards, up to a minute, and you carry on from wherever you let go. It is
the one feature nobody finds by accident.

Everything above is rebindable on the CONTROLS page of CONFIG, where the
console buttons sit on a drawn pad rather than in a table. Pick the button you mean
and press what you want it to be. Controllers that do not report a standard
layout say so there, and their d-pad can be bound even when it arrives as an
axis rather than as buttons.

---

## <img src="docs/media/icons/chip.png" width="22" align="top" alt="" /> Architecture

```
src/
  main.ts           view state machine, main loop, carousel, game session, netplay wiring
  core.ts           the one emulator, renderer, audio pipe and input map everything shares
  emulator.ts       jsnes wrapper: ROM loading, pad bitmasks, snapshots, state fingerprint
  video.ts          WebGL renderer + CRT shader (power ramp, VHS, static)
  audio.ts          AudioWorklet ring buffer, ScriptProcessor fallback
  input.ts          keyboard + gamepad + touch, as a 1-byte pad bitmask
  netplay.ts        peerjs lockstep (input delay, ROM transfer, room codes, desync check)
  rewind.ts         snapshot ring buffer
  library.ts        IndexedDB store for added ROMs and save states, backup/restore
  roms.ts           bundled-library manifest, fetching, names for dropped ROMs
  ines.ts           iNES header: is it a ROM, and does jsnes have its mapper
  nesdb.ts          CRC32 to real title/author/year for dropped ROMs
  labels.ts         cart label cache + Worker orchestration
  labelScan.ts      the headless run that finds a label frame (pure)
  labelWorker.ts    runs labelScan off the main thread
  signals.ts        what the tube shows with no game: snow, colour bars, nothing
  settings.ts       the persisted CONFIG choices
  configPanel.ts    CONFIG: picture, set, room, touch pad, credits
  controlsPanel.ts  CONFIG, CONTROLS page: the drawn pad and input capture
  binds.ts          bindings as data: labels, storage keys, validation (pure)
  touch.ts          the on-screen pad
  volume.ts         the knob on the chin and its on-screen bar
  platform.ts       fullscreen, iOS quirks, touch detection
  dom.ts            `$` and the hint that fades over the picture
  sfx.ts            square-wave UI sounds, no assets
```

### Things worth knowing

**The pad is one byte.** Bit *i* is jsnes button *i*. That single byte is the
entire netplay payload per frame; everything else follows from the core being
deterministic. `npm test` holds the project to that: two cores fed the same
input must agree on every frame, including after a ROM is reloaded with a
button held down.

**Audio sets the pace, not video.** The loop runs a frame when the AudioWorklet's
queue is draining, not when rAF says so. Underruns degrade to silence rather
than to clicks, and the emulator quietly catches up instead of drifting.

**The power ramp is not a CRT effect.** It's a geometric transform of the tube
itself, so it applies whether or not the shader is on. Otherwise switching the
set off would do nothing in the default preset.

**Label generation is off-thread.** It emulates roughly three thousand frames
per game, which on the main thread dropped the gallery to 20 fps on a first
visit. In a Worker it costs the UI nothing and the shelf holds 60.

**Every theme owns its whole palette.** Nothing borrows a colour from another
theme, including what NES.css hardcodes, which is overridden so the library's
white borders and blue button edges don't leak through.

---

## <img src="docs/media/icons/heart.png" width="22" align="top" alt="" /> Credits

- **Emulation core**: [jsnes](https://github.com/bfirsh/jsnes), by Ben Firshman
  and contributors.
- **P2P transport**: [peerjs](https://peerjs.com).
- **UI components**: [NES.css](https://nostalgic-css.github.io/NES.css/).
  **Font**: Silkscreen, by Jason Kottke.
- **Title database**: CRC32 lookup built from
  [libretro-database](https://github.com/libretro/libretro-database) No-Intro
  and metadat sets.
- **The bundled games remain their authors'.** Every entry in
  [`public/roms/manifest.json`](public/roms/manifest.json) records its license
  and where it came from, and the same list is in the app under GAME CREDITS
  in CONFIG.

Built from scratch here: the CRT pipeline, the lockstep netplay protocol, the
rewind system over jsnes serialisation, the label generator, and the whole
diegetic interface.

---

## <img src="docs/media/icons/warn.png" width="22" align="top" alt="" /> Known limitations

**Mappers.** jsnes implements 0, 1, 2, 3, 4, 5, 7, 11, 34, 38, 66, 94, 140 and
180. Modern homebrew often ships as mapper 30 (UNROM 512) for its flash saving,
and those render black. *Alter Ego* and *Zooming Secretary* (Shiru) are two
that don't run and were left out of the shelf for that reason.

**Netplay needs the public peerjs broker** to introduce the two peers. The game
traffic is direct once they're connected, but the handshake depends on a
third-party service being up.

**Saves live in this browser.** Save states and added ROMs are kept in
IndexedDB, and the app asks the browser not to evict them, but clearing the
site's data still erases them. MY ROMS & DATA in CONFIG exports a backup file
and reads one back.

---

## <img src="docs/media/icons/license.png" width="22" align="top" alt="" /> License

[AGPL-3.0](LICENSE). Take it apart, rebuild it, put it on your own domain: all
of that is fine. The one string attached is that whoever tunes in to your
version can get at the schematics the same way you got at these.

The bundled games are not part of that deal: each keeps its own licence,
recorded in [`public/roms/manifest.json`](public/roms/manifest.json).
