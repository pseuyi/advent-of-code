var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split(',')
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 10));

   // part 1
  processInput(text)
  
});

const processInput = (input, noun=12, verb=2) => {
  input[1] = noun
  input[2] = verb

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
