var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split('\n')
    .filter(s => s.length > 0)
    .map(r => r.split(''));

  const input = text.slice();

  findLocation(input);
});

type Asteroid = {x: number; y: number};

const findLocation = (input: string[]) => {

  const asteroids: Asteroid[] = [];
  // iterate over the input to find asteroids coords
  // store coords as list of points{x:number,y:number}

  for (let y = 0; y < input.length; y++) {
    const row = input[y];
    for (let x = 0; x < row.length; x++) {
      //is it an asteroid?
      if (input[y][x] === '#') {
        const asteroid = {x, y};
        asteroids.push(asteroid);
      }
    }
  }

  const asteroidSlopes = {};
  // for ea asteroid, find all slopes with other asteroids
  for (let p1 of asteroids) {
    let slope;
    const asteroidName = `${p1.x},${p1.y}`;
    asteroidSlopes[asteroidName] = new Set();
    for (let p2 of asteroids) {
      slope = findSlope(p1, p2);
    
      // store the slope set in an object keyed by a string that is a concatentation of the asteroids x,y
      if (slope !== 'self') asteroidSlopes[`${p1.x},${p1.y}`].add(slope);
    }
  }

  let maxDetected = 0;
  // for ea asteroids slopes, count unique
  // return the asteroid with the highest count
  for (let key of Object.keys(asteroidSlopes)) {
    const slopes = asteroidSlopes[key].size;
    if (slopes > maxDetected) maxDetected = slopes;
  }

  console.log('maxDetected: ', maxDetected);
};

const findSlope = (p1: Asteroid, p2: Asteroid) => {
  let dir = '';

  dir += p2.y > p1.y ? 'bottom-' : 'top-';
  dir += p2.x > p1.x ? 'right-' : 'left-';

  const num = p1.y - p2.y;
  const den = p1.x - p2.x;

  if (den === 0 && num === 0) return 'self';
  if (num === 0) {
    return p2.x > p1.x ? 'right-horizontal' : 'left-horizontal';
  }
  if (den === 0) {
    return p2.y > p1.y ? 'bottom-vertical' : 'top-vertical';
  }

  return dir + (num / den).toString();
};
