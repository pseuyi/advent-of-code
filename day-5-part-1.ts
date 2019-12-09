var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split(',')
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 10));

  processInput(text.slice());
});

const pi = n => parseInt(n, 10);

const processInput = input => {
  let i = 0;
  while (i < input.length) {
    const INPUT = 1;
    let modeA, modeB, modeC;

    const opInput = input[i].toString();
    const op = pi(
      opInput
        .split('')
        .slice(-2)
        .join(''),
    );

    if (op == 99) {
      console.log('halting');
      break;
    }

    modeC = pi(
      opInput
        .split('')
        .slice(-3, -2)
        .join(''),
    );
    modeB = pi(
      opInput
        .split('')
        .slice(-4, -3)
        .join(''),
    );
    modeA = pi(
      opInput
        .split('')
        .slice(-5, -4)
        .join(''),
    );

    const idxC = input[i + 1];
    const idxB = input[i + 2];
    const idxA = input[i + 3];

    const valC = modeC ? idxC : input[idxC];
    const valB = modeB ? idxB : input[idxB];
    const valA = modeA ? idxA : input[idxA];

    if (op == 1) {
     input[idxA]  = valC + valB;
      i += 4;
    } else if (op == 2) {
      input[idxA] = valC * valB;
      i += 4;
    } else if (op == 3) {
      input[idxC] = INPUT;
      i += 2;
    } else if (op == 4) {
      console.log('output: ', input[idxC]);
      i += 2;
    } else {
      throw new Error('invalid opcode');
      break;
    }

  }

  return input[0];
};
