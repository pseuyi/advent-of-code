var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split(',')
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 10));

  let noun = 12
  let verb = 2
  
  const tgt = 19690720

  // part 1
  // processInput(text)
  
  // part 2
  let value = processInput(text.slice(), noun, verb)
  while(value !== tgt) {


    if(value < tgt) {
      noun++
    }

    if(value > tgt) {
      noun--
      verb++
    }

    value = processInput(text.slice(), noun, verb)

  }
  console.log('n + v: ', 100 * noun + verb)

});

const processInput = (input, n=12, v=2) => {
  input[1] = n
  input[2] = v

  for (let i = 0; i < input.length; i += 4) {
    const op = input[i];
    const a = input[input[i + 1]];
    const b = input[input[i + 2]];
    const idx = input[i + 3];
    let v;

    if(op == 99) {
      console.log('halting')
      break;
    } else if (op == 1) {
      v = a + b;
    } else if (op == 2) {
      v = a * b;
    } 

    if (v) input[idx] = v;
  }

  console.log('value at idx 0: ', input[0]);
  return input[0]
};
