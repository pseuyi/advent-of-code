var fs = require('fs');

fs.readFile('input.txt', function(err: any, data: any) {
  if (err) throw err;

  const input = data
    .toString()
    .split('')
    .filter((s: string) => s.length > 0 && s !== '\n')
    .map((n: string) => parseInt(n, 10));

  decodeImage(input);
});

type Layer = number[][];

const WIDTH = 25;
const HEIGHT = 6;

const decodeImage = (input: number[]) => {
  const layers: Layer[] = [];

  let layer: Layer = [];
  let row: number[] = [];

  // divide the input into sets of width
  for (let i = 0; i < input.length; i++) {
    const digit = input[i];
    row.push(digit);

    if (row.length == WIDTH) {
      layer.push(row);
      row = [];
    }

    if (layer.length == HEIGHT) {
      layers.push(layer);
      layer = [];
    }
  }

  const zeroCount: number[] = layers.map(layer => countNums(layer, 0));

  const leastZeros = Math.min(...zeroCount);
  const leastZeroIdx = zeroCount.indexOf(leastZeros)
  const leastZeroLayer = layers[leastZeroIdx] 

  const result = countNums(leastZeroLayer, 1) * countNums(leastZeroLayer, 2)
  
  console.log('result: ', result)
  return result
};

const countNums = (layer: Layer, n: number): number => {
  let count = 0;

  for (const row of layer) {
    for (const digit of row) {
      if (digit == n) count++;
    }
  }

  return count;
};
