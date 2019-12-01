var fs = require('fs');

fs.readFile('input.txt', function(err, data) {
  if (err) throw err;

  // text array
  const text = data
    .toString()
    .split('\n')
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 10));

  processInput(text);
});

const processInput = input => {
  const total = input.reduce((acc, curr, idx) => {
    const fuel = p2(curr);

    return acc + fuel;
  }, 0);

  console.log('total fuel required: ', total);
};

const p1 = (mass) => Math.floor(mass/3) - 2;

const p2 = (mass, total = 0) => {
  const fuel = Math.floor(mass / 3) - 2;

  if(fuel < 0) return total;
  else return p2(fuel, total + fuel);
};
