let py = 8;
let a = 0;
let open1 = false;
let open2 = false;
let yellow = false;
//var timer = null
let game = "start";
let result = [];
let final = [];
let balls = [];
let startPos = [];
//let ballName = []
let model = null;
let tmpTxt = [];
let breakDeterminism = true;
let ballCount = 45;

let text = null;
const MAX_BALLS = 99;
let isRunning = false;
let preselectedNumbers = [];
let leftNumbers = [];
let letfBall;
let tmpMat;
let ballGeo;
let hidepos = [10000000,10000000,10000000];
let readyStart = false;


let tmpCanvas = document.createElement("canvas");
tmpCanvas.width = tmpCanvas.height = 128;

let bigCanvas = document.createElement("canvas");
bigCanvas.width = bigCanvas.height = 1280;
//bigCanvas.style.cssText = 'position:absolute;'
//document.body.appendChild( bigCanvas )

demo = () => {
  phy.log("SPACE to restart");

  phy.view({
    envmap: "royal_esplanade_1k",
    //ground:false,
    distance: 20,
    x: 0,
    y: 8,
    z: 0,
  });

  // setting and start
  phy.set({
    substep: engine === "OIMO" || engine === "AMMO" ? 8 : 1,
    gravity: [0, -9.81, 0],
    determinism: false,
    //averagePoint:false,
    ccd: true,
  });

  // add static ground
  phy.add({ type: "plane", size: [300, 1, 300], visible: false });

  phy.load(["./three/models/million.glb"], onComplete);
};

onComplete = () => {
  model = phy.getMesh("million");

  model.L_roll.renderOrder = 1;
  model.L_front.renderOrder = 2;
  model.L_back.renderOrder = 3;

  let m = phy.getMat("chrome");
  model.L_pale2_base.material = m;
  m = phy.getMat("plexi2");
  model.L_pale2.material = m;
  model.L_pale1.material = m;

  makeMachine();
  initControllEvents();
  makeBall();
};

activeBall = () => {
  if(!isRunning) return;
  let i = ballCount,
    r = [];
  while (i--) {
    r.push({ name: balls[i].name, wake:  true });
  }

  phy.change(r);
  isRunning = true;

  phy.setTimeout(startSimulation, 3000);
};

replay = () => {
  phy.setPostUpdate(null);

  game = "start";
  // text.set("Win Millions");

  a = 0;
  yellow = false;
  open1 = false;

  let r = [
    { name: "L_pale1", rot: [0, 0, a + 45], reset: true },
    { name: "L_pale2", rot: [0, 0, -a], reset: true },
    // { name:'M_pale1', rot:[0,0,a+45], reset:true },
    // { name:'M_pale2', rot:[0,0,-a],   reset:true },

    { name: "block1", pos: [0, -4.87 + py, open1 ? -1 : 0] },
    // { name:'block2', pos:[ 8.5, -4.87+py, open2 ? -1 : 0  ]}
  ];

  result = [];
  final = [];
  onReset();

  let i = balls.length;
  while (i--) {
    r.push({
      name: balls[i].name,
      sleep: true,
      pos: startPos[i],
      rot: [0, 0, 0],
      reset: true,
    });
  }

  phy.change(r);

  phy.setTimeout(activeBall, 3000);
};

async function update() {
  if (!isRunning) return;
  // let key = phy.getKey();
  // if (key[4] === 1) replay();

  a += 1;

  let r = [
    { name: "L_pale1", rot: [0, 0, a + 45] /*reset:true*/ },
    { name: "L_pale2", rot: [0, 0, -a] /*reset:true*/ },

    { name: "block1", pos: [0, -4.87 + py, open1 ? -1 : 0] },
  ];

  phy.change(r);

  if (game !== "wantBall") return;

  let i = balls.length,
    b;
  while (i--) {
    b = balls[i];
    if (result.indexOf(b.name) === -1) {
      if (b.position.y < -5.4 + py) {
        const ball = await detectOutBall(b);
        haveBall(ball.name);
      }
    }
  }
}

async function detectOutBall(ball) {
  let ballNumber = Number(ball.name.substring(4)) + 1;
  if (leftNumbers.findIndex((number) => number === ballNumber) === -1) {
    const randomIndex = Math.floor(Math.random() * leftNumbers.length);
    const randomNumber = leftNumbers[randomIndex] - 1;
    const left = balls.find(
      (item) => Number(item.name.substring(4)) === randomNumber
    );
    if (left) {
      letfBall = left;
      let r = [
        {
          name: left.name,
          pos: Object.values(ball.position),
          reset: true /*reset:true*/,
        },
        {
          name: ball.name,
          pos: Object.values(left.position),
          reset: true /*reset:true*/,
        },
      ];

      phy.change(r, true);
      leftNumbers.splice(randomIndex, 1);
      return left;
    }
  }
  return ball;
  // ball.isEnd = true;
}

startSimulation = () => {
  phy.setPostUpdate(update);
  phy.setTimeout(wantBall, 12000);
  // timer = setTimeout( wantBall, 12000 );
};

wantBall = () => {
  game = "wantBall";
  open1 = true;
};

haveBall = (name) => {
  game = "haveBall";

  open1 = false;

  displaySelectedBall(name);
  result.push(name);

  if (result.length < 5) {
    phy.setTimeout(wantBall, 6000);
  } else if (result.length >= 5) {
    let r = [{ name: "block1", pos: [0, -4.87 + py, 0] }];
    phy.change(r);
    setTimeout(() => {
      showResultDialog(preselectedNumbers, result);
    }, 1000); // Optional delay to show last ball before result
  }

  // text.set(final.join(" "));
};

makeMachine = () => {
  let friction = 0.4;
  let bounce = 0.0;

  /*let meshs = [ 
	    'L_roll', 'L_back', 'L_front', 'L_rampe', 'L_pale1', 'L_pale2',
	    'M_roll', 'M_back', 'M_front', 'M_rampe', 'M_pale1', 'M_pale2'
    ]*/

  let meshs = [
    "L_roll",
    "L_rampe",
    "L_pale1",
    "L_pale2",
    // 'M_roll', 'M_rampe', 'M_pale1', 'M_pale2'
  ];
  let i = meshs.length,
    name,
    p,
    d,
    m,
    br,
    k,
    shape;

  phy.add({
    name: "block1",
    type: "box",
    density: 0, //material:'glass',
    size: [1, 0.2, 1],
    pos: [0, -4.87 + py, 0],
    // pos: [0, -5.4 + py, 0],
    friction: 0,
    restitution: 0,
    //renderOrder:2,
    shadow: false,
    //visible:false,
    kinematic: true,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0, // Glass is non-metallic
    roughness: 0, // Perfectly smooth for clear glass
    transmission: 1.0, // Enables transparency using real refraction
    thickness: 0.1, // Thickness of the glass (in world units)
    ior: 1.0, // Index of Refraction for glass
    transparent: true,
    opacity: 0.9, // Combined with transmission
    envMapIntensity: 2.0, // Environment reflection intensity
    clearcoat: 0.7, // For extra shine
    clearcoatRoughness: 0.0,
  });

  while (i--) {
    name = meshs[i];
    br = name === "L_pale1" || name === "L_pale2";
    p = name === "L_pale1" || name === "M_pale1";
    d = name === "M_rampe" ? 0 : -1.8;
    k = br ? true : false;
    glasseffect =
      (name === "L_back" || name === "L_front" || name === "L_roll") && !name === "L_rampe"
        ? glassMat
        : "glassX";

    shape = model[name].geometry;
    if (name === "L_roll") shape = model["L_shape"].geometry;
    if (name === "M_roll") shape = model["M_shape"].geometry;

    //if(!br){

    phy.add({
      name: name,
      type: "mesh",
      size: [10],
      meshScale: [10],
      mesh: model[name],
      shape: shape,
      noClone: true,
      //material:br?'silver':'glass',
      material: br ? undefined : glasseffect,
      friction: friction,
      restitution: bounce,
      //pos: i>5 ? [8.5,d+py,0] : [0,py,0],
      pos: i > 3 ? [8.5, d + py, 0] : [0, py, 0],
      rot: p ? [0, 0, 45] : [0, 0, 0],
      //renderOrder:br?4:8,
      kinematic: k,
      ray: false,
      //debug:true,

      //shadow: false,
    });

    //}
  }
};

makeBall = () => {
  ctx2 = bigCanvas.getContext("2d");
  ctx2.clearRect(0, 0, 1024, 1024);
  let ballGeo = model.ball.geometry.clone();
  ballGeo.scale(100, 100, 100);

  let uvs = [];
  let i,
    x,
    y,
    l,
    b,
    tmpMat,
    j = 0;

  // red ball

  for (i = 0; i < MAX_BALLS; i++) {
    l = Math.floor(i / 10);
    x = -27 + j * 6;
    y = 100 - l * 5;
    uvs.push(createBallTexture(i + 1));
    startPos.push([x * 0.1, y * 0.1 + py, -1.16]);
    j++;
    if (j === 10) j = 0;
  }

  var t = new THREE.CanvasTexture(bigCanvas);
  t.needsUpdate = true;
  t.flipY = false;
  t.repeat.set(1 / 10, 1 / 10);
  t.colorSpace = THREE.SRGBColorSpace;

  tmpMat = phy.material({
    name: "lotoball",
    roughness: 0.4,
    metalness: 0.6,
    map: t,
  });

  if (!tmpMat) {
    tmpMat = phy.getMaterial('lotoball');
  }

  tmpMat.onBeforeCompile = function (shader) {
    // use color as uv move
    let fragment = shader.fragmentShader;
    fragment = fragment.replace("#include <color_fragment>", "");
    fragment = fragment.replace(
      "#include <map_fragment>",
      `
        #ifdef USE_MAP
            diffuseColor *= texture2D( map, vMapUv+vColor.rg );
        #endif
        `
    );
    shader.fragmentShader = fragment;
  };
 
  for (i = 0; i < MAX_BALLS; i++) {
    b = phy.add({
      instance: "ball",
      material: tmpMat,
      geometry: ballGeo,
      type: "sphere",
      size: [0.25],
      //pos:startPos[i],
      pos: math.addArray(startPos[i], [
        math.rand(-0.03, 0.03),
        math.rand(-0.03, 0.03),
        math.rand(-0.03, 0.03),
      ]),
      color: uvs[i],
      density: 0.3,
      friction: 0.4,
      restitution: 0.1,
      sleep: true,
      useCCD: true,
      startSleep:true,
    });

    balls.push(b);
    //ballName.push( 'ball'+(i) )
  }
  hideBalls();
  chageStartButtonText();

  //phy.add(tmp)
};

function generateValidBalls() {
  let r = [];
  balls.forEach((ball, index) => {
    const wake = index >= 0 && index < ballCount;
    const action = {
      name: ball.name,
      pos: wake ? startPos[index] : hidepos,
      rot: [0, 0, 0],
      reset: true,
    }
    if (wake)
      r.push({...action, wake: true});
    else
      r.push({...action, sleep: true});
    // r.push({
    //   name: ball.name,
    //   sleep: (index >= 0 && index < ballCount),
    //   pos: startPos[i],
    //   rot: [0, 0, 0],
    //   reset: true,
    // });
  })
  phy.change(r);
  isRunning = true;
  phy.setTimeout(activeBall, 3000);
  chageStartButtonText();
}

onReset = () => {
  for (let m in tmpTxt) tmpTxt[m].dispose();
};

let tmpN = 0;

createBallTexture = (n, y) => {
  const ctx = tmpCanvas.getContext("2d");
  const ctx2 = bigCanvas.getContext("2d");

  // Clear temporary canvas
  ctx.clearRect(0, 0, 128, 128);

  // Billiard ball colors (standard 1-15 balls)
  const colors = [
    "#FFFFFF", // 1: White (cue ball, optional)
    "#FFFF00", // 2: Yellow
    "#0000FF", // 3: Blue
    "#FF0000", // 4: Red
    "#800080", // 5: Purple
    "#FFA500", // 6: Orange
    "#008000", // 7: Green
    "#800000", // 8: Maroon
    "#FFFF00", // 9: Yellow (striped)
    "#0000FF", // 10: Blue (striped)
    "#FF0000", // 11: Red (striped)
    "#800080", // 12: Purple (striped)
    "#FFA500", // 13: Orange (striped)
    "#008000", // 14: Green (striped)
    "#800000", // 15: Maroon (striped)
  ];
  const ballColor = colors[n % colors.length];

  // Draw ball with radial gradient for glossy effect
  const gradient = ctx.createRadialGradient(40, 40, 10, 64, 64, 60);
  gradient.addColorStop(0, "#FFFFFF"); // Highlight
  gradient.addColorStop(0.7, ballColor); // Main color
  gradient.addColorStop(1, ballColor); // Edge
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw white circle for number background
  ctx.beginPath();
  ctx.arc(64, 64, 20, 0, 2 * Math.PI);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  // Draw number
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 36px Arial"; // Smaller font for clarity
  ctx.fillText(n, 64, 64);

  // Copy to atlas
  const ny = Math.floor(tmpN / 10);
  const nx = tmpN - ny * 10;
  ctx2.drawImage(tmpCanvas, nx * 128, ny * 128);
  tmpN++;

  return [nx / 10, ny / 10, 0];

  /*let img = new Image(128, 128);
    img.src = tmpCanvas.toDataURL( 'image/png' );

	let t = new THREE.Texture( img );
	t.needsUpdate = true;
	t.flipY = false;
    t.name = 'ball_' + n + (y ? 'R':'Y');
    t.colorSpace = THREE.SRGBColorSpace;

    tmpTxt.push( t )
	return t;*/
};

function initControllEvents() {
  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");

  increaseBtn.addEventListener("click", addBallScene);
  decreaseBtn.addEventListener("click", removeBallScene);
  addHoldClickBehavior(increaseBtn, addBallScene);
  addHoldClickBehavior(decreaseBtn, removeBallScene);

  document.getElementById("start-btn").addEventListener("click", () => {
    if (!isRunning) {
      showDrawDialog(ballCount, function (selectedNumbers) {
        preselectedNumbers = selectedNumbers;
        leftNumbers = [...selectedNumbers];
        // lotteryStartTime = performance.now();
        // drawnBalls.length = 0;
        generateValidBalls();
        // You can store selectedNumbers if needed
      });
    } else {
      clear();
      chageStartButtonText();
    }
  });
}

function chageStartButtonText() {
  document.getElementById("start-btn").textContent = isRunning
    ? "Stop"
    : "🎲 Start Lottery";
}

function showDrawDialog(totalBalls, onConfirm) {
  const dialog = document.getElementById("draw-dialog");
  const numbersContainer = document.getElementById("draw-numbers");

  // Generate 5 unique random numbers
  const selectedNumbers = [];
  const numbersPool = Array.from({ length: totalBalls }, (_, i) => i + 1);
  for (let i = 0; i < 5; i++) {
    const index = Math.floor(Math.random() * numbersPool.length);
    selectedNumbers.push(numbersPool.splice(index, 1)[0]);
  }

  // Populate numbers visually
  numbersContainer.innerHTML = "";
  selectedNumbers.forEach((n) => {
    const span = document.createElement("span");
    span.textContent = n;
    numbersContainer.appendChild(span);
  });

  // Show the dialog
  dialog.classList.remove("hidden");

  // Event handlers
  document.getElementById("confirm-draw-btn").onclick = () => {
    dialog.classList.add("hidden");
    onConfirm(selectedNumbers); // Pass numbers to your startDraw logic
  };

  document.getElementById("cancel-draw-btn").onclick = () => {
    dialog.classList.add("hidden");
  };
}

function addBallScene() {
  if (ballCount < MAX_BALLS && !isRunning) {
    ballCount++;
    document.getElementById("ball-count").textContent = ballCount;
  }
}

function removeBallScene() {
  if (ballCount > 0 && !isRunning) {
    //   const ball = balls.pop();
    //   scene.remove(ball.sphere);
    //   world.remove(ball.sphereBody);
    ballCount--;
    //   document.getElementById("ball-count").textContent = balls.length;
    document.getElementById("ball-count").textContent = ballCount;
  }
}

function addHoldClickBehavior(button, onHoldCallback) {
  let interval = null;
  let timeout = null;

  const startHolding = () => {
    // onHoldCallback(); // trigger immediately
    timeout = setTimeout(() => {
      interval = setInterval(onHoldCallback, 100); // repeat every 100ms
    }, 500); // start repeating after 500ms
  };

  const stopHolding = () => {
    clearTimeout(timeout);
    clearInterval(interval);
  };

  button.addEventListener("mousedown", startHolding);
  button.addEventListener("touchstart", startHolding);

  button.addEventListener("mouseup", stopHolding);
  button.addEventListener("mouseleave", stopHolding);
  button.addEventListener("touchend", stopHolding);
}

async function displaySelectedBall(name) {
  if (result.indexOf(name) >= 0) return; // Avoid duplicates
  const number = Number(name.substring(4)) + 1;
  // drawnBalls.push(ball);

  if (result.length === 5) {
    isRunning = false;
    setTimeout(() => {
      showResultDialog(preselectedNumbers, result);
    }, 1000); // Optional delay to show last ball before result
  }

  const container = document.getElementById("selected-balls-container");

  const ballDiv = document.createElement("div");
  ballDiv.className = "selected-ball";
  ballDiv.textContent = number;
  container.appendChild(ballDiv);
}

function showResultDialog(expectedNumbers, drawnBalls) {
  const dialog = document.getElementById("result-dialog");
  const expectedContainer = document.getElementById("expected-numbers");
  const drawnContainer = document.getElementById("drawn-numbers");

  expectedContainer.innerHTML = "";
  drawnContainer.innerHTML = "";

  // Normalize both lists for comparison
  const expectedSet = new Set(expectedNumbers);
  const drawnNumbers = drawnBalls.map((number) => number); // You must store number on each ball

  expectedNumbers.forEach((n) => {
    const span = document.createElement("span");
    span.textContent = n;
    expectedContainer.appendChild(span);
  });

  drawnNumbers.forEach((name) => {
    n = Number(name.substring(4)) + 1;
    const span = document.createElement("span");
    span.textContent = n;
    if (expectedSet.has(n)) span.classList.add("match");
    drawnContainer.appendChild(span);
  });

  dialog.classList.remove("hidden");

  document.getElementById("close-result-btn").onclick = () => {
    clear();
    dialog.classList.add("hidden");
  };
}

function clear() {
  const container = document.getElementById("selected-balls-container");
  container.innerHTML = "";
  result = [];
  final = [];
  preselectedNumbers = [];
  isRunning = false;
  chageStartButtonText();
  // balls.forEach((ball) => {
  //   phy.remove(ball.name, true);
  // });
  // // phy.reset(demo);
  // console.log('---------instance------------');
  // // phy.clearGarbage();
  
  // const removeItems = phy.garbage.reduce((items, cur) => {
  //   if (cur.slice(0,4) === 'ball') {
  //     items.push(cur);
  //   }
  //   return items;
  // }, [])

  // phy.remove(removeItems);
  // phy.clearInstance();
  // phy.garbage = phy.garbage.reduce((items, cur) => {
  //   if (cur.slice(0,4) !== 'ball') {
  //     items.push(cur);
  //   }
  //   return items;
  // }, [])
 
  hideBalls();
  // phy.clearGarbage();
  // balls.length = 0;
}

hideBalls = () => { 
  let r = [];
  balls.forEach((ball, index) => {
    const action = {
      name: ball.name,
      pos: hidepos,
      sleep: true,
    }
      r.push(action);
  })
  phy.change(r);
}