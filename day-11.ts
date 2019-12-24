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

  amplifierController(program);
});

const amplifierController = program => {
  let maxSignal = 0;
  let maxCode = [];
  let history = [{x: 0, y: 0}];
  let dir = 1

  const phaseSettings = getPerms('98765').slice(0, 1);

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
    let painting = true;
    while (!halted) {
      amps.forEach((a, i) => {
        const ampOut = a.next(prevSignal);
        const {value, done} = ampOut;

        if (value != null) {
          prevSignal = value;
          if (painting) {
            console.log('painting value: ', value);
            painting = false;
          } else if (!painting) {
            const curr = history[history.length - 1];
            const [nextDir, nextPos] = changeDir(curr, value, dir)
            history.push(nextPos)
            dir = nextDir
            painting = true;
          }
        }
        halted = done;
      });
    }

    if (prevSignal > maxSignal) {
      maxSignal = prevSignal;
      maxCode = sequence;
    }
  });
  console.log('maxCode: ', maxCode);
  console.log('maxSignal: ', maxSignal);
  
  history = history.filter((el, idx, arr) => {
    return idx === arr.findIndex(el2 => el.x === el2.x && el.y === el2.y)
  })
  
  console.log('history: ', history.length);
};

const changeDir = (curr, turn, dir) => {
  let nextDir = dir
  const nextPos = JSON.parse(JSON.stringify(curr));
  //const facing = ['<', '^', '>', 'v'];

  // turn left
  if (turn === 0) {
    if (dir === 0) nextDir = 3;
    else nextDir = nextDir - 1;
  }
  // turn right
  if (turn === 1) {
    if (dir === 3) nextDir = 0;
    else nextDir = nextDir + 1;
  }

  // add/subtract on x or y axis
  if (nextDir === 1) nextPos.y += 1;
  if (nextDir === 3) nextPos.y -= 1;
  if (nextDir === 0) nextPos.x -= 1;
  if (nextDir === 2) nextPos.x += 1;

  return [nextDir, nextPos];
};

function* IntCodeComputer(program) {
  let output;
  let relativeBase = 0;

  let i = 0;
  while (i < program.length) {
    const [op, ...modes] = parseInstruction(program[i]);

    if (op == 99) {
      console.log('halting');
      return output;
      break;
    }

    const params = [program[i + 1], program[i + 2], program[i + 3]];

    const positions = getPositions(params, modes, relativeBase);
    const [idxC, idxB, idxA] = positions;

    // get values based on modes
    const [valC, valB, valA] = getValues(modes, positions, program);
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
        output = valC;
        //console.log('output ', output);
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
      case 9:
        relativeBase += valC;
        i += 2;
        break;
      default:
        console.log('at opcode: ', op);
        throw new Error('invalid opcode');
        break;
    }
  }
}

const POSITION = 'POSITION';
const IMMEDIATE = 'IMMEDIATE';
const RELATIVE = 'RELATIVE';
const modeTypes = [POSITION, IMMEDIATE, RELATIVE];

const getPositions = (params: number[], modes: number[], base: number) =>
  params.map((param, i) =>
    modeTypes[modes[i]] == RELATIVE ? param + base : param,
  );

const getValues = (modes: number[], positions: number[], program: number[]) =>
  modes.map((mode, i) => {
    const paramValue = positions[i];
    if (modeTypes[mode] == RELATIVE || modeTypes[mode] == POSITION) {
      return positions[i] > program.length ? 0 : program[positions[i]];
    } else {
      return positions[i];
    }
  });

const pi = n => parseInt(n, 10);

const parseInstruction = instruction => {
  instruction = padZeroes(instruction.toString(), 5);
  return [
    instruction.substring(3),
    instruction.substring(2, 3),
    instruction.substring(1, 2),
    instruction.substring(0, 1),
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
