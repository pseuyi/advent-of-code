var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split('\n')
    .filter(s => s.length > 0)
    .slice();

  simulateMotion(text, 1000);
});

type Moon = {
  pos: {x: number; y: number; z: number};
  vel: {x: number; y: number; z: number};
};

const totalEnergy = moons => {
  let total = 0;
  moons.forEach(moon => {
    total += potentialEnergy(moon) * kineticEnergy(moon);
  });
  return total;
};

const potentialEnergy = moon =>
  Object.keys(moon.pos).reduce(
    (acc, curr) => acc + Math.abs(moon.pos[curr]),
    0,
  );
const kineticEnergy = moon =>
  Object.keys(moon.vel).reduce(
    (acc, curr) => acc + Math.abs(moon.vel[curr]),
    0,
  );

const simulateMotion = (input, timeSteps) => {
  const moons = createMoons(input);
  // within each time step
  for (let t = 0; t < timeSteps; t++) {
    // apply gravity
    applyGravity(moons);
    // apply velocity
    applyVelocity(moons);
    console.log(`moons after ${t + 1} velocity: `, moons);
  }

  console.log('final moons: ', moons);

  const total = totalEnergy(moons);
  console.log('total system energy: ', total);
};

const applyGravity = moons => {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      const m1 = moons[i];
      const m2 = moons[j];
      compareMoons(m1, m2);
    }
  }
};

const applyVelocity = moons => {
  moons.forEach(moon => {
    for (const key of Object.keys(moon.pos)) {
      moon.pos[key] += moon.vel[key];
    }
  });
};

const compareMoons = (m1: Moon, m2: Moon) => {
  for (const key of Object.keys(m1.pos)) {
    if (m1.pos[key] > m2.pos[key]) {
      m1.vel[key]--;
      m2.vel[key]++;
    } else if (m1.pos[key] < m2.pos[key]) {
      m1.vel[key]++;
      m2.vel[key]--;
    }
  }
};

const createMoons = input => {
  //[I, E, G, C]

  const moons = input.map(p => {
    const [x, y, z] = p
      .slice(1, -1)
      .split(',')
      .map(c => parseInt(c.split('=')[1], 10));

    return {pos: {x, y, z}, vel: {x: 0, y: 0, z: 0}};
  });

  console.log('initial moons: ', moons);
  return moons;
};
