import withInput from "./utils";

const isGear = (char?: string | null): boolean => {
  if (!char) return false;
  return char === "*";
};

const solve = (input: string[]) => {
  const schematic: string[][] = input.map((l) => l.split(""));
  const width = schematic[0].length;
  const height = schematic.length;

  const checkNearGear = (i: number, j: number): string[] => {
    // if near a gear, log coords of the gear
    const coords = [];
    // top
    if (i > 0 && isGear(schematic[i - 1][j])) coords.push(`(${i - 1},${j})`);
    // bottom
    if (i + 1 < width && isGear(schematic[i + 1][j]))
      coords.push(`(${i + 1},${j})`);
    // left
    if (j > 0 && isGear(schematic[i][j - 1])) coords.push(`(${i},${j - 1})`);
    // right
    if (j + 1 < height && isGear(schematic[i][j + 1]))
      coords.push(`(${i},${j + 1})`);
    // top right
    if (i > 0 && j + 1 < height && isGear(schematic[i - 1][j + 1]))
      coords.push(`(${i - 1},${j + 1})`);
    // bottom right
    if (i + 1 < width && j + 1 < height && isGear(schematic[i + 1][j + 1]))
      coords.push(`(${i + 1},${j + 1})`);
    // top left
    if (i > 0 && j > 0 && isGear(schematic[i - 1][j - 1]))
      coords.push(`(${i - 1},${j - 1})`);
    // bottom left
    if (i + 1 < width && j > 0 && isGear(schematic[i + 1][j - 1]))
      coords.push(`(${i + 1},${j - 1})`);

    return coords;
  };

  let numStr = "";
  // track nearby gears, list of (i,j) tuples
  const nearbyGears: Set<string> = new Set();
  // track gear location and part products
  const gearRatios: { [key: string]: number[] } = {};

  // traverse row (row i, column j)
  for (let i = 0; i < schematic.length; i++) {
    const row = schematic[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];

      // if num, keep track of numStr
      const mbNum = parseInt(char, 10);
      if (!isNaN(mbNum)) {
        numStr = numStr.concat(char);
        // check if num is near a gear
        checkNearGear(i, j).forEach((ng) => nearbyGears.add(ng));
      } else {
        // else, if cur numStr was a part
        if (nearbyGears.size) {
          const num = parseInt(numStr, 10);
          // if numStr was near a gear, add to that gears product
          nearbyGears.forEach((ng) => {
            if (!gearRatios[ng]) {
              gearRatios[ng] = [num];
            } else {
              gearRatios[ng].push(num);
            }
          });
        }
        // clear the num
        numStr = "";
        // clear nearbyGears
        nearbyGears.clear();
      }
    }
  }

  // return sum of gear ratios w/ exactly two parts
  return Object.values(gearRatios)
    .filter((gr) => gr.length === 2)
    .map(([a, b]) => a * b)
    .reduce((acc, cur) => acc + cur, 0);
};

withInput(solve);
