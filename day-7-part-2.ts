var fs = require('fs'); 

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split(',')
    .filter(s => s.length > 0)
    .map(s => pi(s));

  const program = text.slice();

  amplifierController(program)
});

const amplifierController = program => {
  let maxSignal = 0;
  let maxCode = [];

  const phaseSettings = getPerms('98765')

  phaseSettings.forEach(perm => {
    const sequence = perm.split('').map(pi);

    let prevSignal = 0;

    const amps = sequence.map((ps, i) => {
      const amp = IntCodeComputer(program.slice());
      amp.next();
      amp.next(ps);
      return amp;
    });

    let halted;
    while (!halted) {
      amps.forEach((a,i) => {
        const ampOut = a.next(prevSignal)
        const {value, done} = ampOut
        if (value != null) prevSignal = value;
        halted = done
      });
    }

    if (prevSignal > maxSignal) {
      maxSignal = prevSignal;
      maxCode = sequence;
    }
  });
  console.log('maxCode: ', maxCode);
  console.log('maxSignal: ', maxSignal);
}

function* IntCodeComputer(program) {
  let output;

  let i = 0;
  while (i < program.length) {
    const [modeA, modeB, modeC, op] = parseInstruction(program[i]);

    if (op == 99) {
      console.log('halting');
      return output;
      break;
    }

    const idxC = program[i + 1];
    const idxB = program[i + 2];
    const idxA = program[i + 3];

    const valC = modeC ? idxC : program[idxC];
    const valB = modeB ? idxB : program[idxB];
    const valA = modeA ? idxA : program[idxA];

    switch (op) {
      case 1:
        program[idxA] = valC + valB;
        i += 4;
        break;
      case 2:
        program[idxA] = valC * valB;
        i += 4;
        break;
      case 3:
        const input = yield;
        program[idxC] = input;
        i += 2;
        break;
      case 4:
        output = program[idxC];
        yield output;
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
        program[idxA] = valC < valB ? 1 : 0;
        i += 4;
        break;
      case 8:
        program[idxA] = valC == valB ? 1 : 0;
        i += 4;
        break;
      default:
        console.log('at opcode: ', op);
        throw new Error('invalid opcode');
        break;
    }
  }
}

const pi = n => parseInt(n, 10);

const parseInstruction = instruction => {
  instruction = padZeroes(instruction.toString(), 5);
  return [
    instruction.substring(0, 1),
    instruction.substring(1, 2),
    instruction.substring(2, 3),
    instruction.substring(3),
  ].map(pi);
};

const padZeroes = (str, n) => {
  str = str.split('').reverse();
  while (str.length < n) {
    str.push('0');
  }
  return str.reverse().join('');
};

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
