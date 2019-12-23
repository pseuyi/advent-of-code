var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()

    .split('\n')
    .filter(s => s.length > 0)
    .slice();

  simulateMotion(text);
});

type Moon = {
  pos: {x: number; y: number; z: number};
  vel: {x: number; y: number; z: number};
};

const simulateMotion = input => {
  // timeSteps by dimension
  let timeSteps = {x: 0, y: 0, z: 0};
  const dimensions = ['x', 'y', 'z'];
  const moons = createMoons(input);
  const initialMoons = JSON.parse(JSON.stringify(moons));

  // within each dimension
  for (const d of dimensions) {
    console.log('dimension: ', d);

    let moonsAligned = false;
    //const d = 'x';
    while (!moonsAligned) {
      // apply gravity
      applyGravity(moons, d);
      // apply velocity
      applyVelocity(moons, d);
      // console.log(`moons after ${timeSteps[d] + 1} steps: `, moons);
      timeSteps[d]++;

      moonsAligned = checkAlignment(initialMoons, moons, d);
    }
  }

  console.log('final time steps: ', timeSteps);

  console.log('final moons: ', moons);
  const period = lcm(lcm(timeSteps.x, timeSteps.y), lcm(timeSteps.y, timeSteps.z));
  console.log('period of alignment: ', period)
};

const gcd = (a, b) => {
  let t;
  while (b !== 0) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const lcm = (a, b) => (a * b) / gcd(a, b);

const checkAlignment = (initial, target, d) => {
  //console.log('inital: ', initial);
  //console.log('target: ', target);

  return target.every((moon, i) => {
    // console.log('target moon: ', moon.pos[d])
    //console.log('initial moon: ', initial[i].pos[d])
    //console.log('equal?: ', moon.pos[d] === initial[i].pos[d] && moon.vel[d] === 0)

    if (moon.pos[d] === initial[i].pos[d] && moon.vel[d] === 0) return true;
    // else console.log('FALSE', i)
  });
};

const applyGravity = (moons, d) => {
  for (let i = 0; i < moons.length - 1; i++) {
    for (let j = i + 1; j < moons.length; j++) {
      const m1 = moons[i];
      const m2 = moons[j];
      compareMoons(m1, m2, d);
    }
  }
};

const applyVelocity = (moons, key) =>
  moons.forEach(moon => {
    moon.pos[key] += moon.vel[key];
  });

const compareMoons = (m1: Moon, m2: Moon, key) => {
  if (m1.pos[key] > m2.pos[key]) {
    m1.vel[key]--;
    m2.vel[key]++;
  } else if (m1.pos[key] < m2.pos[key]) {
    m1.vel[key]++;
    m2.vel[key]--;
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

  return moons;
};
