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

const WIDTH = 25
const HEIGHT = 6

const decodeImage = (input: number[]) => {
  const layers = buildLayers(input);
  const numLayers = layers.length;

  // final image is a copy of a single layer
  const image = layers[0].slice() 

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let stack = [];

      // build stack of aligned pixels
      for (let z = 0; z < numLayers; z++) {
        stack.push(layers[z][y][x]);
      }

      // process stack
      const pixel = stack.reduce((acc, curr) => acc == 2 ? curr : acc)
      // print white/0 pixels as spaces for readability
      image[y][x] = pixel == 0 ? ' ' : pixel
    }
  }

  const result = image.map(r=>r.join('')).join('\n')
  console.log(result)
};

const buildLayers = (input: number[]) => {
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

  return layers;
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
