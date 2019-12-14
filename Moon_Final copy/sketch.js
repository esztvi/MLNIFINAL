// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
KNN Classification on Webcam Images with mobileNet. Built with p5.js
=== */
let r; //color that first line
let g; //color that first line
let b; //color that first line
let pg;
let pgMain;
let pgFrameCount = 0;
let particles = [];
let centX = 400;
let centY = 400;
let radius = 100;
let x1, y1, x2, y2;
let angle = 0;
let rad;
let oppRad;
let radiusNoise;
let angleNoise;
let xNoise;
let yNoise;
let strokeCol = 251;
let strokeChange = -1;
const CAM_WIDTH = 640;
const CAM_HEIGHT = 480;
const INTERVAL_COUNT = 60;
const GRID_SIZE = 25;
const PG_FRAME_COUNT= 1500;
const NOISE_SPEED_X = 0.005;
const NOISE_SPEED_Y = 0.00;

let interval = 0;


window.addEventListener("resize", reload);
function reload() {
  location.reload();
}


let displayMode = false;
/*
f: draw Webcam
t: draw the flower pattern + scatter the pattern
*/

/* MODES
0: Base
1: Neck
2: Liver
3: Kidney
4: Breast
5: Lung
6: Stomach
7: Colon
8: Ovarian
9: Bone
10: HL
11: NHL
12: Brain
*/
let mode = 0;
let pmode = 0;
let modeNames = ["Base", "Neck", "Liver", "Kidney", "Breast", "Lung", "Stomach", "Colon", "Ovarian", "Bone", "HL", "NHL", "Brain"];
let modeColors = [];
let flowers;

let video;
let tempVideo;
let snapshot;
// Create a KNN classifier
const knnClassifier = ml5.KNNClassifier();
let featureExtractor;
let date;

function setup() {
  //noCanvas();
  createCanvas(windowWidth, windowHeight);

  modecolors = [color(128, 0, 32), color(49, 145, 119), color(255, 117, 56), color(234, 128, 176), color(234, 224, 200), color(204, 204, 255), color(0,0,139), color(56,142,142), color(255,225,53), color(136,6,206), color(158,253, 56), color(85,85,85)];
  flowers = [flower1,flower2,flower3,flower4,flower5,flower6,flower7,flower8,flower9,flower10,flower11,flower12];

  // Create a featureExtractor that can extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);

  // Create a video element
  video = createCapture(VIDEO);
  video.size(CAM_WIDTH, CAM_HEIGHT);
  video.hide();
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');

  //
  snapshot = createImage(CAM_WIDTH, CAM_HEIGHT);
  tempVideo = createImage(CAM_WIDTH, CAM_HEIGHT);

  pixelDensity(1);
  pg = createGraphics(windowWidth, windowHeight);
  pgMain = createGraphics(windowWidth, windowHeight);
  // background(255);
  //black, alpha
  //pg.stroke(r,g,b,0);
  pg.strokeWeight(1);
  pg.noStroke();
  radiusNoise = (random(10));
  angleNoise = (random(10));
  xNoise = (random(10));
  yNoise = (random(10));

  date = new Date();

  // Create the UI buttons
  createButtons();
}

function draw() {
  background(0);
  // switch & case
  if (!displayMode) {
    tempVideo.copy(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, CAM_WIDTH, CAM_HEIGHT);
    image(tempVideo, 0, 0, width, height);
  } else {

    switch (mode) {
      // case 0:
      // pg.tint(255, 255, 255, 100);
      // pg.image(video, 0, 0, width, height);
      // break;
      //Neck
      case 1:
      flower1();
      break;

      //Liver
      case 2:
      flower2();
      break;

      //Kidney
      case 3:
      flower3();
      break;

      //Breast
      case 4:
      flower4();
      break;

      //Lung
      case 5:
      flower5();
      break;

      //Stomach
      case 6:
      flower6();
      break;

      //Colon
      case 7:
      flower7();
      break;

      //Ovarian
      case 8:
      flower8();
      break;

      //Bone
      case 9:
      flower9();
      break;

      //HL
      case 10:
      flower10();
      break;

      //NHL
      case 11:
      flower11();
      break;

      //Brain
      case 12:
      flower12();
      break;

      default:
      //
    }

    if(pgFrameCount>PG_FRAME_COUNT+250){
      console.log("RESET PLS");

      let y = String( date.getYear() + 2000 - 100 );
      let m = String( date.getMonth() + 1 );
      let d = String( date.getDate() );
      let h = String( date.getHours() );
      let mi = String( date.getMinutes() );
      let s = String( date.getSeconds() );
      let filename = y+m+d+"_"+h+mi+s;
      save(pgMain, 'benignity_' + filename + '.jpg');


      // clear();
      //Program.restart();
      displayMode = false;
      mode =0;
      pmode = 0;
      interval = 0;
      particles = [];
      pgFrameCount = 0;
      pg = createGraphics(windowWidth, windowHeight);
      pgMain = createGraphics(windowWidth, windowHeight);
    }

  }

  fill(230,230,250);;
  text(modeNames[mode], 10, 20);
  text(interval, 10, 50);
  // store current "mode" as previous mode
  pmode = mode;
}
// function reset(){
//     redraw();
// !displayMode;
// mode =0;
// pmode = 0;
// interval=0;
// text(modeNames[mode], 10, 20);
// text(interval, 10, 50);
// image(video, 0, 0, width, height);
// case:0
//
//   break;
// }
// // function keyPressed() {
//   if (key == ' ') {
//     snapshot.copy(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, CAM_WIDTH, CAM_HEIGHT);
//     snapshot.filter(GRAY);
//     mode = 1;
//   }
function keyPressed() {
  if (key == ' ') {
    let date = new Date();
    let y = String(date.getYear() + 2000 - 100);
    let m = String(date.getMonth() + 1);
    let d = String(date.getDate());
    let h = String(date.getHours());
    let mi = String(date.getMinutes());
    let s = String(date.getSeconds());

    let filename = y + m + d + "_" + h + mi + s;
    save(pg,'pattern_' + filename + '.jpg');
  }
}
function progression() {
  snapshot.copy(video, 0, 0, CAM_WIDTH, CAM_HEIGHT, 0, 0, CAM_WIDTH, CAM_HEIGHT);
  // snapshot.filter(THRESHOLD);
  snapshot.filter(GRAY);
  snapshot.filter(BLUR, 4);

  pgMain.push();
  pgMain.tint(100, 100, 100);
  pgMain.image(snapshot, 0, 0, width, height);
  pgMain.pop();

  displayMode = true;
}

//Neck
function flower1() {
  r = 128;
  g = 0;
  b = 32;

  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(128,0,32, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(128,0,32, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;
}
//Liver
function flower2() {
  r = 49;
  g = 145;
  b = 119;
  // pg.blendMode(ADD);
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));

    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(49,145,119, 60);
    pg.line(x1, y1, x2, y2);

    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(49,145,119, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Kidney
let flower3 =function flower3() {
  r = 255;
  g = 117;
  b = 56;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(255,117,56, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(255,117,56, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Breast
let flower4 =function flower4() {
  r = 234;
  g = 128;
  b = 176;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(234,128,176, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(234,128,176, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Lung
function flower5() {
  r = 234;
  g = 224;
  b = 200;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(234,224,200, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(234,224,200, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Stomach
function flower6() {
  r = 204;
  g = 204;
  b = 255;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(204,204,255, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(204,204,255, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Colon
function flower7() {
  r = 0;
  g = 0;
  b = 139;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(0,0,139, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(0,0,139, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Ovarian
let flower8 =function flower8() {

  r = 56;
  g = 142;
  b = 142;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));


    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(56,142,142, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(56,142,142, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Bone
let flower9 =function flower9() {
  r = 255;
  g = 225;
  b = 53;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));


    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));

    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(255,255,53, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(255,255,53, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//HL
let flower10 =function flower10() {
  r = 136;
  g = 6;
  b = 206;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(136,6,206, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(136,6,206, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;
}
//NHL
let flower11 =function flower11() {
  r = 158;
  g = 253;
  b = 56;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(158,253,56, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(158,253,56, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}
//Brain
let flower12 =function flower12() {
  r = 85;
  g = 85;
  b = 85;
  if (pgFrameCount < PG_FRAME_COUNT) {
    radius = noise(radiusNoise) * 600;
    angle += (noise(angleNoise) * 6) - 3;
    centX = pg.width / 2 + (noise(xNoise) * 100) - 50;
    centY = pg.width / 4 + (noise(yNoise) * 100) - 50;
    rad = radians(angle);
    x1 = centX + (radius * cos(rad));
    y1 = centY + (radius * sin(rad));

    oppRad = rad + PI;

    x2 = centX + (radius * cos(oppRad));
    y2 = centY + (radius * sin(oppRad));
    x3 = centX + (radius * cos(rad*0.8));
    y3 = centY + (radius * sin(rad*0.8));
    x4 = centX + (radius * cos(rad*0.8 + PI));
    y4 = centY + (radius * sin(rad*0.8 + PI));

    pg.stroke(255, 255, 255, 120);
    pg.point(x3, y3);
    pg.point(x4, y4);
    pg.stroke(85,85,85, 60);
    pg.line(x1, y1, x2, y2);
    strokeCol += strokeChange;
    if (strokeCol > 250) {
      strokeChange *= -1;
    }
    if (strokeCol < 1) {
      strokeChange *= -1;
    }
    pg.stroke(85,85,85, 60);
    angle++;
    radiusNoise += 0.01;
    xNoise += NOISE_SPEED_X;
    yNoise += NOISE_SPEED_Y;

    pgMain.push();
    pgMain.tint(100, 100, 100);
    pgMain.image(snapshot, 0, 0, width, height);
    pgMain.pop();
    pgMain.image(pg, 0, 0, width, height);
    image(pgMain, 0, 0);

  } else if (pgFrameCount == PG_FRAME_COUNT) {
    //create particles
    image( pgMain, 0, 0 );
    let gridSize = GRID_SIZE;
    for (let y = 0; y < pg.height; y += gridSize) {
      for (let x = 0; x < pg.width; x += gridSize) {
        let img = createImage(gridSize, gridSize);
        img.copy(pgMain, x, y, gridSize, gridSize, 0, 0, gridSize, gridSize);
        particles.push(new Particle(img, x, y));
      }
    }
  } else {
    //manipulate
    for (let p of particles) {
      p.move();
      p.accelerate();
      p.disappear();
      p.display();
    }
  }
  pgFrameCount++;

}

class Particle {
  constructor(img, x, y) {
    this.img = img;
    this.x = x;
    this.y = y;
    this.xSpd = random(-0.01, 0.01);
    this.ySpd = random(-0.01, 0.01);
    // this.alpha = 255;
    this.scl = 1.0;
    this.sclSpd = random(0.001, 0.009);
  }

  move() {
    this.x += this.xSpd;
    this.y += this.ySpd;

  }
  accelerate() {
    let amount = 1.05;
    this.xSpd *= amount;
    this.ySpd *= amount;
  }
  disappear() {
    this.scl -= this.sclSpd;
    this.scl = constrain(this.scl, 0.0, 1.0);


  }
  display() {
    push();
    translate(this.x, this.y);
    // tint(255, alpha);
    scale(this.scl);
    image(this.img, 0, 0);

    pop();
  }


};

function modelReady(){
  select('#status').html('FeatureExtractor(mobileNet model) Loaded')
}

// Add the current frame from the video to the classifier
function addExample(label) {
  // Get the features of the input video
  const features = featureExtractor.infer(video);
  // You can also pass in an optional endpoint, defaut to 'conv_preds'
  // const features = featureExtractor.infer(video, 'conv_preds');
  // You can list all the endpoints by calling the following function
  // console.log('All endpoints: ', featureExtractor.mobilenet.endpoints)

  // Add an example with a label to the classifier
  knnClassifier.addExample(features, label);
  updateCounts();
}

// Predict the current frame.
function classify() {
  //if (mode != 0) return;

  // Get the total number of labels from knnClassifier
  const numLabels = knnClassifier.getNumLabels();
  if (numLabels <= 0) {
    console.error('There is no examples in any label');
    return;
  }
  // Get the features of the input video
  const features = featureExtractor.infer(video);

  // Use knnClassifier to classify which label do these features belong to
  // You can pass in a callback function `gotResults` to knnClassifier.classify function
  knnClassifier.classify(features, gotResults);
  // You can also pass in an optional K value, K default to 3
  // knnClassifier.classify(features, 3, gotResults);

  // You can also use the following async/await function to call knnClassifier.classify
  // Remember to add `async` before `function predictClass()`
  // const res = await knnClassifier.classify(features);
  // gotResults(null, res);
}

// A util function to create UI buttons
function createButtons() {
  // When the A button is pressed, add the current frame
  // from the video with a label of "Brain" to the classifier
  buttonBrain = select('#addClassBrain');
  buttonBrain.mousePressed(function() {
    addExample('Brain');
  });

  // When the B button is pressed, add the current frame
  // from the video with a label of "Neck" to the classifier
  buttonNeck = select('#addClassNeck');
  buttonNeck.mousePressed(function() {
    addExample('Neck');
  });

  // When the C button is pressed, add the current frame
  // from the video with a label of "Liver" to the classifier
  buttonLiver = select('#addClassLiver');
  buttonLiver.mousePressed(function() {
    addExample('Liver');
  });
  buttonKidney = select('#addClassKidney');
  buttonKidney.mousePressed(function() {
    addExample('Kidney');
  });
  buttonBreast = select('#addClassBreast');
  buttonBreast.mousePressed(function() {
    addExample('Breast');
  });
  buttonLung = select('#addClassLung');
  buttonLung.mousePressed(function() {
    addExample('Lung');
  });
  buttonStomach = select('#addClassStomach');
  buttonStomach.mousePressed(function() {
    addExample('Stomach');
  });
  buttonColon = select('#addClassColon');
  buttonColon.mousePressed(function() {
    addExample('Colon');
  });
  buttonOvarian = select('#addClassOvarian');
  buttonOvarian.mousePressed(function() {
    addExample('Ovarian');
  });
  buttonBone = select('#addClassBone');
  buttonBone.mousePressed(function() {
    addExample('Bone');
  });
  buttonHodgkinLymphoma = select('#addClassHodgkinLymphoma');
  buttonHodgkinLymphoma.mousePressed(function() {
    addExample('Hodgkin Lymphoma');
  });
  buttonNonHodgkinLymphoma = select('#addClassNonHodgkinLymphoma');
  buttonNonHodgkinLymphoma.mousePressed(function() {
    addExample('Non-Hodgkin Lymphoma');
  });

  // Reset buttons
  resetBtnBrain = select('#resetBrain');
  resetBtnBrain.mousePressed(function() {
    clearLabel('Brain');
  });

  resetBtnNeck = select('#resetNeck');
  resetBtnNeck.mousePressed(function() {
    clearLabel('Neck');
  });

  resetBtnLiver = select('#resetLiver');
  resetBtnLiver.mousePressed(function() {
    clearLabel('Liver');
  });

  resetBtnKidney = select('#resetKidney');
  resetBtnKidney.mousePressed(function() {
    clearLabel('Kidney');
  });
  resetBtnBreast = select('#resetBreast');
  resetBtnBreast.mousePressed(function() {
    clearLabel('Breast');
  });
  resetBtnLung = select('#resetLung');
  resetBtnLung.mousePressed(function() {
    clearLabel('Lung');
  });
  resetBtnStomach = select('#resetStomach');
  resetBtnStomach.mousePressed(function() {
    clearLabel('Stomach');
  });
  resetBtnColon = select('#resetColon');
  resetBtnColon.mousePressed(function() {
    clearLabel('Colon');
  });
  resetBtnOvarian = select('#resetOvarian');
  resetBtnOvarian.mousePressed(function() {
    clearLabel('Ovarian');
  });
  resetBtnBone = select('#resetBone');
  resetBtnBone.mousePressed(function() {
    clearLabel('Bone');
  });
  resetBtnBone = select('#resetBone');
  resetBtnBone.mousePressed(function() {
    clearLabel('Bone');
  });
  resetBtnHodgkinLymphoma = select('#resetHodgkinLymphoma');
  resetBtnHodgkinLymphoma.mousePressed(function() {
    clearLabel('Hodgkin Lymphoma');
  });
  resetBtnNonHodgkinLymphoma = select('#resetNonHodgkinLymphoma');
  resetBtnNonHodgkinLymphoma.mousePressed(function() {
    clearLabel('Non-Hodgkin Lymphoma');
  });


  // Predict button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);

  // Clear all classes button
  buttonClearAll = select('#clearAll');
  buttonClearAll.mousePressed(clearAllLabels);

  // Load saved classifier dataset
  buttonSetData = select('#load');
  buttonSetData.mousePressed(loadMyKNN);

  // Get classifier dataset
  buttonGetData = select('#save');
  buttonGetData.mousePressed(saveMyKNN);
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }

  if (result.confidencesByLabel) {
    const confidences = result.confidencesByLabel;
    // result.label is the label that has the highest confidence
    if (result.label) {
      select('#result').html(result.label);
      select('#confidence').html(`${confidences[result.label] * 100} %`);

      //***
      if (!displayMode && confidences[result.label] > 0.99) {
        for (let i=0; i<modeNames.length; i++) {
          if (modeNames[i] == result.label){
            mode = i;
          }
        }
        console.log(pmode + " | " + mode);
        if (pmode != mode) {
          // changed!
          interval = 0
        } else {
          interval++;
        }
        if (interval > INTERVAL_COUNT) {
          interval = 0;
          progression();
        }
      }
    }

    select('#confidenceBrain').html(`${confidences['Brain'] ? confidences['Brain'] * 100 : 0} %`);
    select('#confidenceNeck').html(`${confidences['Neck'] ? confidences['Neck'] * 100 : 0} %`);
    select('#confidenceLiver').html(`${confidences['Liver'] ? confidences['Liver'] * 100 : 0} %`);
    select('#confidenceKidney').html(`${confidences['Kidney'] ? confidences['Kidney'] * 100 : 0} %`);
    select('#confidenceBreast').html(`${confidences['Breast'] ? confidences['Breast'] * 100 : 0} %`);
    select('#confidenceLung').html(`${confidences['Lung'] ? confidences['Lung'] * 100 : 0} %`);
    select('#confidenceStomach').html(`${confidences['Stomach'] ? confidences['Stomach'] * 100 : 0} %`);
    select('#confidenceStomach').html(`${confidences['Colon'] ? confidences['Colon'] * 100 : 0} %`);
    select('#confidenceOvarian').html(`${confidences['Ovarian'] ? confidences['Ovarian'] * 100 : 0} %`);
    select('#confidenceBone').html(`${confidences['Bone'] ? confidences['Bone'] * 100 : 0} %`);
    select('#confidenceHodgkinLymphoma').html(`${confidences['Hodgkin Lymphoma'] ? confidences['Hodgkin Lymphoma'] * 100 : 0} %`);
    select('#confidenceNonHodgkinLymphoma').html(`${confidences['Non-Hodgkin Lymphoma'] ? confidences['Non-Hodgkin Lymphoma'] * 100 : 0} %`);
  }

  classify();
}

// Update the example count for each label
function updateCounts() {
  const counts = knnClassifier.getCountByLabel();

  select('#exampleBrain').html(counts['Brain'] || 0);
  select('#exampleNeck').html(counts['Neck'] || 0);
  select('#exampleLiver').html(counts['Liver'] || 0);
  select('#exampleKidney').html(counts['Kidney'] || 0);
  select('#exampleBreast').html(counts['Breast'] || 0);
  select('#exampleLung').html(counts['Lung'] || 0);
  select('#exampleStomach').html(counts['Stomach'] || 0);
  select('#exampleColon').html(counts['Colon'] || 0);
  select('#exampleOvarian').html(counts['Ovarian'] || 0);
  select('#exampleBone').html(counts['Bone'] || 0);
  select('#exampleHodgkinLymphoma').html(counts['Hodgkin Lymphoma'] || 0);
  select('#exampleNonHodgkinLymphoma').html(counts['Non-Hodgkin Lymphoma'] || 0);
}

// Clear the examples in one label
function clearLabel(label) {
  knnClassifier.clearLabel(label);
  updateCounts();
}

// Clear all the examples in all labels
function clearAllLabels() {
  knnClassifier.clearAllLabels();
  updateCounts();
}

// Save dataset as myKNNDataset.json
function saveMyKNN() {
  knnClassifier.save('myKNNDataset');
}

// Load dataset to the classifier
function loadMyKNN() {
  knnClassifier.load('/myKNNDataset.json', updateCounts);
}
