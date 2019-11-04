/*
 Base Game Code: 191°
 by Colin Thil
 */
var press;
var Hue = 191;
var increm = 0;
var vitesse = 0;
var stage = 0;
var slct = 0;
var crash = false;
var pathLength = 1000;
var step = 20;
var inc = 0;
var profondeur = 0;
var vGoal = 0.008;
var maxspeed = 0;
var player;
var explosion;
var seconds = 0;



function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  init();
  player = createVector(0, 0);
  carrier = new p5.Oscillator('sine');
  carrier.freq(carrierBaseFreq);
  carrier.start();
  modulator = new p5.Oscillator('triangle');
  modulator.start();
  modulator.disconnect();
  carrier.freq(modulator);
  setInterval(function () {
    seconds++;
  }, 1000);
 }



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  var b = color(Hue, 10, 70 + sin(increm * vitesse) * 30);
  background(b);
  increm++;
  modulator.amp(100+(25*stage));
  textAlign(LEFT, TOP);
  noStroke();
  textSize(20);
  textFont('Georgia');
  fill(360);
  var t;
  var s = [];
  

  if (stage === 0) {
    t = "            Vortex             ";
    s = ["  press space to play "];
    MenukeyControler(t, s, b);
  }  else if (stage == 1) {
    init();
    stage++;
  } else if (stage == 2) run(1, 2);

  else if (stage == 3) {
    t = "your maximum speed was " + int(maxspeed * 1000);
    s = ["    press space to try again"];
    MenukeyControler(t, s, b);
  } else {
    increm = 0;
    vitesse = 0;
    stage = 0;
    slct = 0;
    crash = false;
    step = 20;
    inc = 0;
    profondeur = 0;
    vGoal = 0.008;
    maxspeed = 0;
    trafic = [];
    seconds = 0
  }
}

var spdx = 0.00;

function keyControler() {
  var maxSpdx = 0.01 * vitesse + 0.012;
  var spdy = 0.0002;

  if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW)) {
    if (spdx >= 0) spdx = -maxSpdx*2;
    else spdx = -maxSpdx;
    player.x += spdx;
  } 
  
  else if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW)) {
    if (spdx <= 0) spdx = maxSpdx*2;
    else spdx = maxSpdx;
    player.x += spdx;
  } 
  else {spdx = 0;}
  player.x = ARR(player.x);
  vitesse = vitesse + spdy;
}


function ARR(f) {
  while (f >= 1) f -= 1;
  while (f < 0) f += 1;
  return f;
}

function MenukeyControler(t, s, b) {
  var l = textWidth(t);
  var x = (width - l) / 2;
  var y = height / 2 - 100;
  text(t, x, y);
  for (var i = 0; i < s.length; i++) {
    if (slct == i) {
      fill(360);
      rect(x - 2, y + 40 + 40 * i, l, 20);
      fill(b);
    } else fill(360);
    text(s[i], x, y + 40 + 40 * i);
  }

  if (!press && !(keyIsDown(38) && keyIsDown(40))) {
    if (keyIsDown(38)) {
      slct--;
    }
    if (keyIsDown(40)) {
      slct++;
    }
    if (keyIsDown(10) || keyIsDown(32)) {
      slct = 0;
      stage++;
      
    }
    slct = constrain(slct, 0, s.length - 1);
  }
  if (keyIsDown(38) || keyIsDown(40) || keyIsDown(10) || keyIsDown(32)) press = true;
  else press = false;
  if(s.length>1)toggleAudio(true);
  else toggleAudio(false);
  modulator.freq((slct/s.length)*100+20);
}

var path;
var pathR;

function init() {
  var playerPosL = 3;
  playerLastPos = [playerPosL];
  crash = false;
  path = [pathLength];
  pathR = [pathLength];
  for (var i = 0; i < pathLength; i++) pathR[i] = 0;
  for (var j = 0; j < pathLength; j++) path[j] = newPath(j);
  for (var k = 0; k < playerPosL; k++) playerLastPos[k] = 0;
}


var cercleX = 0.00;
var cercleY = 0.00;
var angl = 0.00;
var angl1 = 0.00;
var angl2 = 0.00;
var anglCourt = 0.00;
var direct = 0.00;
var direct1 = 0.00;
var vt = 4;
var vtRotat = vt / 200000;
var rotat = 0;
var targetX = 0.00;
var targetY = 0.00;

function newPath(i) {

  var target = createVector(targetX, targetY); // !!!
  var rad = 180 / PI;
  if (abs(target.x - cercleX) < 10 && abs(target.y - cercleY) < 10) {
    target = newTarget(target);
  }
  angl = angl1 - angl2;
  if (abs(angl) > PI) {
    anglCourt = TWO_PI - abs(angl);
    if (angl > 0) anglCourt = -anglCourt;
  } else {
    anglCourt = angl;
  }
  rotat += vtRotat;
  if (direct < anglCourt + (rotat * vt)) direct += rotat * vt;
  if (direct >= anglCourt) direct -= rotat * vt;
  if (direct === 0) rotat = 0;
  if (direct == direct1) {
    direct = 0;
    angl2 = angl1;
    angl1 = atan2(target.y - cercleY, target.x - cercleX);
  }
  direct1 = direct;
  cercleX += (cos(direct + angl2) * vt);
  cercleY += (sin(direct + angl2) * vt);
  if (angl > 0) pathR[i] += rotat;
  else if (angl < 0) pathR[i] -= rotat;
  return createVector(cercleX, cercleY);
}

function newTarget(t) {

  var minRayon = height;
  var maxRayon = height;
  var newT = t;
  var o = random(0, 1);
  var r = random(0, 1);
  newT.x += sin(o * TWO_PI) * (r * maxRayon + minRayon);
  newT.y += cos(o * TWO_PI) * (r * maxRayon + minRayon);
  return newT;
}

function run(mn, mx) {

  var minRayon = height * mn;
  var maxRayon = height * mx;
  var introSpeed = 120;
  toggleAudio(false);
  translate(width / 2, height / 2);
  scale(1 + (vitesse) * 9);
  translate(-width / 2, -height / 2);
  tunel();

  if (!crash && profondeur < vGoal) {
    profondeur += vGoal / introSpeed;
    var rt =profondeur/vGoal;
    
  }
  else if (!crash) profondeur = vGoal;
  if (!crash && profondeur >= vGoal) {
    move(5);
    vGoal = (vitesse) + 0.01;
    if (!crash) {
      keyControler();
      spcshp(player.x, player.y + 10, 10, createVector(width / 2, height / 2), true);

      if ((vitesse) > maxspeed) maxspeed = vitesse;
    }
  }
  if (crash) {
    profondeur -= vGoal / 60;
    var rt =profondeur/vGoal;
  }
  if (crash && profondeur <= 0) {
    stage++;
  }
}

var cam;

function tunel() {
  noSmooth();
  var l = (pathLength / step - 2);
  cam = createVector(-path[0].x, -path[0].y);
  for (var i = l; i >= 0; i--) {
    var h = int(i * step + inc);
    var h1 = int((i + 1) * step + inc);
    var s = height / 2 / (1 + profondeur * h);
    var x = (path[h].x + cam.x) / s + width / 2;
    var y = (path[h].y + cam.y) / s + height / 2;
    var s1 = height / 2 / (1 + profondeur * (h1));
    var x1 = (path[h1].x + cam.x) / s1 + width / 2;
    var y1 = (path[h1].y + cam.y) / s1 + height / 2;
    if (i == 0) tube(x, y, height / 2, pathR[h - inc], x1, y1, s1, pathR[h1], 100 / h1);
    else tube(x, y, s, pathR[h], x1, y1, s1, pathR[h1], 100 / h1);
    if (!crash) {
      for (var j = 0; j < trafic.length; j++) {
        trafic[j].display(h, createVector(x, y));

      }

    }
  }
}

var tubeN = 9;

function tube(x, y, s, r, x1, y1, s1, r1, c) {
  var p = TWO_PI / float(tubeN);
  for (var i = 0; i < tubeN; i++) {
    var ip = p * i;
    var ip1 = p * (i + 1);
    var cs = cos(ip + r);
    var clr = color(Hue, 10 + c - cs * 14, 40 + c + cs * 30);

    fill(clr);
    quad(x + sin(ip + r) * s, y + cs * s, x1 + sin(ip + r1) * s1, y1 + cos(ip + r1) * s1, x1 + sin(ip1 + r1) * s1, y1 + cos(ip1 + r1) * s1, x + sin(ip1 + r) * s, y + cos(ip1 + r) * s);
  }
}

playerLastPos = [];

function move(m) {
  for (var h = 0; h < playerLastPos.length - 1; h++) {
    playerLastPos[h] = playerLastPos[h + 1];
  }
  playerLastPos[playerLastPos.length - 1] = player.x;
  for (var j = 0; j < m; j++) {
    for (var i = 0; i < pathLength - 1; i++) {
      path[i] = path[i + 1];
      pathR[i] = pathR[i + 1];
    }
    if (inc < 1) inc = step;
    inc--;
    path[pathLength - 1] = newPath(pathLength - 1);
    if (!crash) {
      for (var k = 0; k < trafic.length; k++) trafic[k].action();
      spawn();
    }
  }
}

function spcshp(x, y, L, n, p) {
    var pX = x * tubeN;
    while (pX < 0) pX += tubeN;
    var s = height / 2 / (1 + profondeur * y);
    var o = (int(pX) + 0.5) * (TWO_PI / tubeN) + pathR[L];
    var l = (s * 0.64);
    var tx = (pX % 1 - 0.5) * l;
    push();
    translate(n.x, n.y);
    rotate(-o);
    translate(tx, s);
    scale(0.1 * s);
    noStroke();
    fill(Hue, 40, 20, 1);
    triangle(0, 0, 0, -1, 0.2, -0.2);
    triangle(0, -1, -1, 0, -0.2, -0.2);
    triangle(0, 0, 0, -1, -0.2, -0.2);
    triangle(0, -1, 1, 0, 0.2, -0.2);
    fill(360);
    s = 0.2 + sin(increm * vitesse) * 0.05;
    ellipse(-0.5, -0.1, s, s);
    ellipse(0.5, -0.1, s, s);
    pop();
}

var trafic = [];

function spawn() {
  var d = int(random(0, (100-(2*seconds))));//int(random(0, 220)
console.log(seconds);
  if (d === 0) {
    trafic.push(new pnj());
  }
}

function pnj() {
  this.l = pathLength;
  this.p = createVector(0, 0);
  this.spdx = 0.002 * random(-1, 1);
  this.spdy = random(0.5, 2);
  this.dlt = false;
  this.p.x = random(0, 1);
  this.p.y = pathLength;

  this.display = function(h, n) {
    if (!this.dlt) {
      if (this.p.y >= h && this.p.y <= h + step) {
        this.l = int(this.p.y);
        spcshp(this.p.x, this.p.y, this.l, n, false);
      }
      if (!crash) this.hit();
      
    }
  };
  
  this.reinit = function() {
    l = pathLength;
    p = createVector(0, 0);
    spdx = 0.002 * random(-1, 1);
    spdy = random(0.5, 1);
    dlt = false;
    p.x = random(0, 1);
    p.y = pathLength;
  };

  this.hit = function() {
    var proxMin = 0.03;
    if (this.p.y < 16 && this.p.y > 0) {
      var x = ARR(this.p.x);
      if (abs(x - player.x) < proxMin) {
        crash = true;
        this.dlt = true;
        trafic = [];
      } else {
        this.dlt = true;
      }
    }
  };

  this.action = function() {
    this.p.x += this.spdx;
    this.p.y -= this.spdy;
    if (this.p.y < -1000) trafic.shift();
  };

}

var carrier;
var modulator;

var analyzer;
var carrierBaseFreq = 220;
var modMaxFreq = 312;
var modMinFreq = 0;
var modMaxDepth = 150;
var modMinDepth = -150;
var droneAmp=0.0;

function toggleAudio(b) {
  if(b && droneAmp<0.6) droneAmp+=0.05;
  else if(!b && droneAmp>0) droneAmp-=0.01;
  carrier.amp(droneAmp);
}
