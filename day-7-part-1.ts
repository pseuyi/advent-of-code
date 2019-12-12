var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split(',')
    .filter(s => s.length > 0)
    .map(s => pi(s));

  const instructions = text.slice();

  let maxSignal = 0;
  let maxCode = [];
  const phaseSettings = getPerms('56789');

  phaseSettings.forEach(code => {
    const phaseSetting = code.split('').map(pi);

    const ampA = new IntCodeComputer(phaseSetting[0], 0).run(instructions);
    const ampB = new IntCodeComputer(phaseSetting[1], ampA).run(instructions);
    const ampC = new IntCodeComputer(phaseSetting[2], ampB).run(instructions);
    const ampD = new IntCodeComputer(phaseSetting[3], ampC).run(instructions);
    const ampE = new IntCodeComputer(phaseSetting[4], ampD).run(instructions);

    if (ampE > maxSignal) {
      maxSignal = ampE;
      maxCode = phaseSetting;
    }
  });

  console.log('maxCode: ', maxCode)
  console.log('maxSignal: ', maxSignal)
});

const getPerms = str => {
  let perms = [];

  if (str.length == 1) {
    perms.push(str);
    return perms;
  }

  for (let i = 0; i < str.length; i++) {
    const fstChar = str[i];
    const rest = str.substring(0, i) + str.substring(i + 1);
    const restPerms = getPerms(rest);
    for (let j = 0; j < restPerms.length; j++) {
      perms.push(fstChar + restPerms[j]);
    }
  }
  return perms;
};

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

function IntCodeComputer(phaseSetting, inputSignal = 0) {
  this.phaseSetting = phaseSetting;
  this.inputSignal = inputSignal;
  this.input = [this.inputSignal, this.phaseSetting];

  this.run = input => {
    let res;
    let i = 0;
    while (i < input.length) {
      let modeA, modeB, modeC;

      const parser = parseFrom(input[i]);
      let op = parser(-2, input[i].toString().length);
      if (op == 99) {
        console.log('halting');
        break;
        return res;
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
          const val = this.input.pop();
          input[idxC] = val;
          i += 2;
          break;
        case 4:
          res = parseInt(input[idxC], 10);
          i += 2;
          break;
        case 5:
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

    return res;
  };
}
