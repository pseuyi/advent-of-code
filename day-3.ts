var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data.toString().split(' ');

  processInput(text);
});

const processInput = ([a, b]) => {
  const instructionsA = a.split(',');
  const instructionsB = b.split(',');

  // lowest distance crossing
  const LDC = [0, 0];

  // draw both wires
  const wireA = draw(instructionsA);
  const wireB = draw(instructionsB);

  console.log('wire a: ', wireA);
  console.log('wire b: ', wireB);

  // check if wires cross
};

const draw = instructions => {
  let wire = [[0, 0]];
  let node = [0, 0];

  // process individual instruction
  for (let instruction of instructions) {
    const dir = instruction.slice(0, 1);
    const steps = parseInt(instruction.slice(1), 10);

    const points = createPoints(node, dir, steps);
    wire = wire.concat(points);
    node = points[points.length - 1];
  }
  return wire;
};

const createPoints = (start, dir, steps) => {
  const points = [];
  const [index, factor] = getOperation(dir);
  while (steps > 0) {
    let point = start;
    point[index] = start[index] + factor;
    steps--;
    points.push(point.slice());
  }
  console.log('new points: ', points);
  return points;
};

const getOperation = dir => {
  // select operation
  let factor;
  let index;
  switch (dir) {
    case 'L':
      factor = -1;
      index = 0;
      break;
    case 'R':
      factor = 1;
      index = 0;
      break;
    case 'D':
      factor = -1;
      index = 1;
      break;
    case 'U':
      factor = 1;
      index = 1;
      break;
    default:
      break;
  }
  return [index, factor];
};

const validate = (prevA, prevB, crossings) => {
  // check if wires have crossed
  // store distance at crossing pt
};
