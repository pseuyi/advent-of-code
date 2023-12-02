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

const parseFrom = n => (s, e) => {
  const num = pi(
    n
      .toString()
      .split('')
      .slice(s, e)
      .join(''),
  );

  return num;
};

const processInput = input => {
  const INPUT = 5;

  let i = 0;
  while (i < input.length) {
    let modeA, modeB, modeC;

    const parser = parseFrom(input[i]);
    let op = parser(-2, input[i].toString().length);

    if (op == 99) {
      console.log('halting');
      break;
    }

    modeC = parser(-3, -2);
    modeB = parser(-4, -3);
    modeA = parser(-5, -2);

    const idxC = input[i + 1];
    const idxB = input[i + 2];
    const idxA = input[i + 3];

    const valC = modeC ? idxC : input[idxC];
    const valB = modeB ? idxB : input[idxB];
    const valA = modeA ? idxA : input[idxA];

    switch (op) {
      case 1:
        input[idxA] = valC + valB;
        i += 4;
        break;
      case 2:
        input[idxA] = valC * valB;
        i += 4;
        break;
      case 3:
        input[idxC] = INPUT;
        i += 2;
        break;
      case 4:
        console.log('output: ', input[idxC]);
        i += 2;
        break;
      case 5:
        console.log('5: ', valB);
        if (valC != 0) i = valB;
        else i += 3;
        break;
      case 6:
        if (valC == 0) i = valB;
        else i += 3;
        break;
      case 7:
        input[idxA] = valC < valB ? 1 : 0;
        i += 4;
        break;
      case 8:
        input[idxA] = valC == valB ? 1 : 0;
        i += 4;
        break;
      default:
        console.log('at opcode: ', op);
        throw new Error('invalid opcode');
        break;
    }
  }

  return input[0];
};
