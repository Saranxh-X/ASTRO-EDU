/**
 * GRAPH BLASTER - GAME LOGIC & CANVAS ENGINE
 */

// --- Canvas Setup ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const CAN_SIZE = 500;
// Coordinate space from -10 to +10 on both axes
const MIN_AXIS = -10;
const MAX_AXIS = 10;
const RANGE = MAX_AXIS - MIN_AXIS;
const SCALE = CAN_SIZE / RANGE;
const ORIGIN_X = CAN_SIZE / 2;
const ORIGIN_Y = CAN_SIZE / 2;

// --- Elements ---
const screens = {
    home: document.getElementById('home-screen'),
    topic: document.getElementById('topic-screen'),
    game: document.getElementById('game-screen'),
    over: document.getElementById('game-over-screen')
};
const ui = {
    score: document.getElementById('score-display'),
    level: document.getElementById('level-display'),
    timer: document.getElementById('timer-display'),
    input: document.getElementById('equation-input'),
    tCoords: document.getElementById('target-coords'),
    tFeedback: document.getElementById('target-feedback'),
    hintBox: document.getElementById('hints-box'),
    hintTxt: document.getElementById('hint-text'),
    shootBtn: document.getElementById('shoot-btn'),
    startLvlBtn: document.getElementById('start-level-btn')
};

// --- Game State ---
let gameState = {
    topic: 'linear',
    level: 1,
    score: 0,
    time: 0,
    timerInt: null,
    target: { x: 0, y: 0, radius: 0.5 }, // Logic radius
    bullets: [], // Projectiles animating on graph
    explosions: [], // Particles for hits
    drawnGraph: null // Points of the last fired graph [{x,y}, ...]
};

// --- View Logic ---
function switchScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

window.selectTopic = function(tId) {
    document.querySelectorAll('.topic-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    gameState.topic = tId;
    ui.startLvlBtn.disabled = false;
};

window.startGame = function() {
    gameState.level = 1;
    gameState.score = 0;
    gameState.drawnGraph = null;
    gameState.bullets = [];
    document.getElementById('equation-input').value = '';
    
    updateHUD();
    generateTarget();
    switchScreen('game-screen');
    
    clearInterval(gameState.timerInt);
    gameState.time = 0;
    ui.timer.textContent = '00:00';
    gameState.timerInt = setInterval(() => {
        gameState.time++;
        const m = Math.floor(gameState.time / 60).toString().padStart(2, '0');
        const s = (gameState.time % 60).toString().padStart(2, '0');
        ui.timer.textContent = `${m}:${s}`;
    }, 1000);
    
    requestAnimationFrame(renderLoop);
};

window.quitGame = function() {
    clearInterval(gameState.timerInt);
    switchScreen('home-screen');
};

function endGame() {
    clearInterval(gameState.timerInt);
    document.getElementById('end-levels').textContent = gameState.level;
    document.getElementById('end-score').textContent = gameState.score;
    let title = document.getElementById('end-title');
    if(gameState.score > 2000) { title.textContent = "ABSOLUTE LEGEND"; title.className = "game-title glow-text text-gold mb-1 glitch"; }
    else { title.textContent = "MISSION COMPLETE"; title.className = "game-title glow-text text-pink mb-1"; }
    switchScreen('game-over-screen');
}

// --- Topic Target Generation ---
function generateTarget() {
    let x, y;
    
    // Create sensible integers for the targets based on topic
    if(gameState.topic === 'linear') {
        x = getRandomInt(-8, 8, [0]);
        let m = getRandomInt(-3, 3, [0]);
        y = m * x; 
        if(Math.abs(y) > 9) y = getRandomInt(-9, 9);
    } 
    else if(gameState.topic === 'quadratic') {
        x = getRandomInt(-3, 3, [0]);
        y = (x * x) - Math.floor(Math.random() * 5);
    }
    else if(gameState.topic === 'cubic') {
        x = getRandomInt(-2, 2, [0]);
        y = (x * x * x);
    }
    else if(gameState.topic === 'trigonometric') {
        // Special mapping: make target lay on common sin/cos intervals like x=PI/2
        const intervals = [-Math.PI, -Math.PI/2, Math.PI/2, Math.PI];
        x = intervals[Math.floor(Math.random() * intervals.length)];
        y = Math.sin(x) > 0 ? 1 : (Math.sin(x) < 0 ? -1 : 0);
        // Perturb it for challenge
        y = y * getRandomInt(1, 3);
    }
    else {
        // Mixed/Expo
        x = getRandomInt(-9, 9, [0]);
        y = getRandomInt(-9, 9, [0]);
    }
    
    // Ensure bounds
    y = Math.max(-9.5, Math.min(9.5, y));
    x = Math.max(-9.5, Math.min(9.5, x));

    gameState.target = { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)), radius: 0.6 };
    ui.tCoords.textContent = `(${gameState.target.x}, ${gameState.target.y})`;
    
    // Clear old state
    ui.hintBox.style.display = 'none';
    ui.input.value = '';
    gameState.bullets = [];
    gameState.drawnGraph = null;
    gameState.explosions = [];
}

function getRandomInt(min, max, exclude=[]) {
    let r;
    do { r = Math.floor(Math.random() * (max - min + 1)) + min; } while(exclude.includes(r));
    return r;
}

// --- Parser Logic ---
function parseUserEquation(eqStr) {
    // Basic sanitization and conversion for JS eval
    let s = eqStr.toLowerCase().replace(/\s+/g, '');
    
    // Implicit multiplication: 2x -> 2*x, x2 -> x*2
    s = s.replace(/(\d)(x)/g, '$1*$2');
    s = s.replace(/(x)(\d)/g, '$1*$2');
    
    // Handle exponents: x^2 -> x**2
    s = s.replace(/\^/g, '**');

    // Handle math functions
    s = s.replace(/sin/g, 'Math.sin');
    s = s.replace(/cos/g, 'Math.cos');
    s = s.replace(/tan/g, 'Math.tan');
    s = s.replace(/abs/g, 'Math.abs');
    s = s.replace(/sqrt/g, 'Math.sqrt');
    s = s.replace(/pi/g, 'Math.PI');
    s = s.replace(/e/g, 'Math.E');

    return s;
}

function evaluateEq(parsedEq, xValue) {
    try {
        // Create a fast function from string
        const f = new Function('x', `return ${parsedEq};`);
        return f(xValue);
    } catch(e) {
        return NaN;
    }
}

// --- Firing ---
window.fireGraph = function() {
    let rawEq = ui.input.value;
    if(!rawEq) { showFeedback("NO EQUATION ENTERED", "var(--neon-yellow)"); return; }
    
    let parsed = parseUserEquation(rawEq);
    
    // Generate graph points
    let points = [];
    let resolution = 0.1; // step size in math coords
    for(let curX = MIN_AXIS; curX <= MAX_AXIS; curX += resolution) {
        let curY = evaluateEq(parsed, curX);
        if(!isNaN(curY) && Math.abs(curY) <= 100) { // Limit crazy Y values internally
            points.push({x: curX, y: curY});
        }
    }
    
    if(points.length === 0) {
        showFeedback("INVALID FUNCTION SYNTAX", "var(--neon-red)");
        ui.input.classList.add('shake');
        setTimeout(() => ui.input.classList.remove('shake'), 400);
        return;
    }
    
    gameState.drawnGraph = points;
    
    // Fire bullet along the path
    gameState.bullets.push({
        pathIdx: 0,
        speed: 2, // path indices per frame
        active: true,
        tailInfo: points.slice() 
    });
};

function checkCollision(px, py) {
    // Math distance
    const dx = px - gameState.target.x;
    const dy = py - gameState.target.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    return dist;
}

function showFeedback(msg, col) {
    ui.tFeedback.textContent = msg;
    ui.tFeedback.style.color = col;
    ui.tFeedback.classList.remove('show');
    void ui.tFeedback.offsetWidth; // trigger reflow
    ui.tFeedback.classList.add('show');
}

function handleHit() {
    showFeedback("IMPOSTER EJECTED! +100", "var(--neon-green)");
    gameState.score += 100;
    updateHUD();
    
    // Create explosion
    for(let i=0; i<30; i++) {
        gameState.explosions.push({
            x: gameState.target.x, y: gameState.target.y,
            vx: (Math.random()-0.5)*0.5, vy: (Math.random()-0.5)*0.5,
            life: 1.0, col: (Math.random() > 0.5) ? '#ffffff' : '#c51111'
        });
    }
    
    // Next level logic
    gameState.target.radius = 0; // hide Target
    setTimeout(() => {
        gameState.level++;
        if(gameState.level > 5 && gameState.topic !== 'mixed') {
            endGame();
        } else {
            updateHUD();
            generateTarget();
        }
    }, 1500);
}

window.showHint = function() {
    ui.hintTxt.textContent = "Graph a line: Try slope-intercept form y = mx + b. Adjust m to change steepness.";
    if(gameState.topic === 'quadratic') ui.hintTxt.textContent = "Quadratic: Use x^2. Add/subtract constants to shift up/down.";
    if(gameState.topic === 'trigonometric') ui.hintTxt.textContent = "Try sin(x) or cos(x). Multiply x to stretch horizontally.";
    ui.hintBox.style.display = 'flex';
    gameState.score = Math.max(0, gameState.score - 10);
    updateHUD();
}

function updateHUD() {
    ui.score.textContent = gameState.score.toString().padStart(4, '0');
    ui.level.textContent = `LEVEL ${gameState.level}`;
}

// --- Canvas Coordinate Mapping ---
function mapX(x) { return ORIGIN_X + (x * SCALE); }
function mapY(y) { return ORIGIN_Y - (y * SCALE); /* Y is inverted on canvas */ }

// --- Render Loop ---
function renderLoop() {
    if(!document.getElementById('game-screen').classList.contains('active')) return;
    
    // Clear and draw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, CAN_SIZE, CAN_SIZE);
    
    drawAxes();
    drawTarget();
    drawGraph();
    updateAndDrawProjectiles();
    updateAndDrawExplosions();
    
    requestAnimationFrame(renderLoop);
}

function drawAxes() {
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    // Grid Lines
    for(let i=MIN_AXIS; i<=MAX_AXIS; i++) {
        let cx = mapX(i); let cy = mapY(i);
        // Vertical
        ctx.moveTo(cx, 0); ctx.lineTo(cx, CAN_SIZE);
        // Horizontal
        ctx.moveTo(0, cy); ctx.lineTo(CAN_SIZE, cy);
    }
    ctx.stroke();
    
    // Main Axes
    ctx.strokeStyle = 'rgba(188, 19, 254, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(mapX(0), 0); ctx.lineTo(mapX(0), CAN_SIZE);
    ctx.moveTo(0, mapY(0)); ctx.lineTo(CAN_SIZE, mapY(0));
    ctx.stroke();
}

function drawTarget() {
    if(gameState.target.radius <= 0) return; // Destroyed
    
    let cx = mapX(gameState.target.x);
    let cy = mapY(gameState.target.y);
    let w = gameState.target.radius * SCALE * 2;
    let h = w * 1.2;

    // Draw Among Us Character (Simplified)
    ctx.save();
    ctx.translate(cx, cy);
    
    // Body (Red)
    ctx.fillStyle = '#c51111';
    ctx.beginPath();
    ctx.roundRect(-w/2, -h/2, w, h, 10);
    ctx.fill();
    
    // Backpack
    ctx.beginPath();
    ctx.roundRect(-w/2 - 5, -h/4, 8, h/1.5, 4);
    ctx.fill();
    
    // Visor (Cyan/Blue)
    ctx.fillStyle = '#9bd0e0';
    ctx.beginPath();
    ctx.roundRect(-w/4, -h/4, w/1.2, h/2.5, 6);
    ctx.fill();
    
    // Visor Glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(-w/6, -h/5, w/3, h/8, 2);
    ctx.fill();
    
    // Legs
    ctx.fillStyle = '#c51111';
    ctx.fillRect(-w/2 + 2, h/2 - 2, w/3, 8);
    ctx.fillRect(w/2 - w/3 - 2, h/2 - 2, w/3, 8);

    ctx.restore();
    
    // Crosshair
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy); ctx.lineTo(cx + 20, cy);
    ctx.moveTo(cx, cy - 20); ctx.lineTo(cx, cy + 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'; ctx.lineWidth = 1;
    ctx.stroke();
}

function drawGraph() {
    if(!gameState.drawnGraph) return;
    
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.7)'; // Glow cyan
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f3ff';
    
    for(let i=0; i<gameState.drawnGraph.length; i++) {
        let p = gameState.drawnGraph[i];
        let cx = mapX(p.x); let cy = mapY(p.y);
        if(i===0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    
    // reset shadow
    ctx.shadowBlur = 0;
}

function updateAndDrawProjectiles() {
    gameState.bullets.forEach(b => {
        if(!b.active) return;
        
        b.pathIdx += b.speed;
        let pIdx = Math.floor(b.pathIdx);
        
        if(pIdx >= b.tailInfo.length-1) {
            b.active = false;
            // Evaluated false hit if didn't hit and disappeared out of bounds
            if(gameState.target.radius > 0) {
                 showFeedback("WAS NOT THE IMPOSTER", "var(--neon-yellow)");
            }
            return;
        }
        
        let p = b.tailInfo[pIdx];
        let d = checkCollision(p.x, p.y);
        
        if(d < gameState.target.radius) {
            b.active = false;
            handleHit();
            return;
        }
        
        // Draw Projectile Head
        ctx.beginPath();
        ctx.arc(mapX(p.x), mapY(p.y), 6, 0, Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#fff';
        ctx.fill();
        ctx.shadowBlur = 0;
    });
}

function updateAndDrawExplosions() {
    for(let i = gameState.explosions.length - 1; i >= 0; i--) {
        let e = gameState.explosions[i];
        e.x += e.vx; e.y += e.vy;
        e.life -= 0.02;
        
        if(e.life <= 0) {
            gameState.explosions.splice(i, 1);
            continue;
        }
        
        ctx.beginPath();
        let s = e.life * 4;
        ctx.arc(mapX(e.x), mapY(e.y), s, 0, Math.PI*2);
        ctx.fillStyle = e.col;
        ctx.globalAlpha = e.life;
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }
}
