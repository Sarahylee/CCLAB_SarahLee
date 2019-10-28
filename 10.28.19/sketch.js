let img1;
let snowflakes = []; // array to hold snowflake objects
let c;
var air;
var b;

//function preload()
//{
//   load image
//  img1 = loadImage('Fire.jpg');
//}

function setup() {
  createCanvas(645, 363);
  fill(240);
  noStroke();
  loadJSON('https://api.airvisual.com/v2/city?city=San Jose&state=California&country=USA&key=fa014b85-52e0-4c05-bda0-05e947e70184', gotData);
  
}

function gotData(data) { 
  air = data;
}

function draw() {
  //background(img1);
  strokeWeight(1); 
  stroke(color(6, 53, 67));
  
  background('brown');
  
  let t = frameCount / 60; // update time

  // create a random number of snowflakes each frame
  for (let i = 0; i < random(5); i++) {
    snowflakes.push(new snowflake()); // append snowflake object
  }

  // loop through snowflakes with a for..of loop
  for (let flake of snowflakes) {
    flake.update(t); // update snowflake position
    flake.display(); // draw snowflake
  }
  if (air){
  text('Pollution in San Jose, CA is: ' + air.data.current.pollution.aqius + ' due to the current wildfires.', 180, 175);
  // console.log();
  
  b = air.data.current.pollution.aqius / 10;
  console.log(b);
  
  }
}

// snowflake class
function snowflake() {
  // initialize coordinates
  this.posX = 0;
  this.posY = random(-50, 0);
  this.initialangle = random(0, 2 * PI);
  this.size = random(2, 5);

  // radius of snowflake spiral
  // chosen so the snowflakes are uniformly spread out in area
  this.radius = sqrt(random(pow(width / 2, 2)));

  this.update = function(time) {
    // console.log("Inside Function");
    
    // x position follows a circle
    let w = b; // angular speed
    console.log("W "+ w + "b "+ b);
    
    let angle = w * time + this.initialangle;
    this.posX = width / 2 + this.radius * sin(angle);

    // different size snowflakes fall at slightly different y speeds
    this.posY += pow(this.size, 0.5);

    // delete snowflake if past end of screen
    if (this.posY > height) {
      let index = snowflakes.indexOf(this);
      snowflakes.splice(index, 1);
    }
  };

  this.display = function() {
    ellipse(this.posX, this.posY, this.size);
    fill(167);
   // image(img, 0, height / 2, img.width / 2, img.height / 2);
  };
}

