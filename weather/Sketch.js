var weather;
let c;


function setup() {
  createCanvas(600, 300)
  c = color(87, 153, 160)
  background(c);
  loadJSON('https://api.openweathermap.org/data/2.5/weather?q=New%20York&APPID=_____&units=imperial', gotData);
  
  
}
function gotData(data) {
  weather = data;
}

function draw() {

  strokeWeight(10); 
  stroke(color(6, 53, 67));
  fill(255);
  text("City: New York", 10, 30);
  if (weather) {
    text("Current temperature: " + weather.main.temp, 10, 50);
    text("Forecast: " + weather.weather[0].description, 10, 70);
    ellipse (100, 160, weather.main.temp_max, weather.main.temp_max);
    ellipse (300, 160, weather.main.humidity, weather.main.humidity);
    ellipse (500, 160, weather.main.temp_min, weather.main.temp_min);
    text("Max temperature: " + weather.main.temp_max, 35, 210);
    text("Humidity: " + weather.main.humidity, 265, 210);
    text("Min Temperature: " + weather.main.temp_min, 440, 210);
    
  
    
  }
}


