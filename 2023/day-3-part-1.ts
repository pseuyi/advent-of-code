import withInput from "./utils";

const isSymbol = (char?: string | null): boolean => {
  if (!char) return false;

  const parsed = parseInt(char, 10);
  if (char !== "." && isNaN(parsed)) return true;
  return false;
};

const solve = (input: string[]) => {
  const schematic: string[][] = input.map((l) => l.split(""));
  const width = schematic[0].length;
  const height = schematic.length;

  const checkIsPart = (i: number, j: number): boolean => {
    // top
    const top = i > 0 ? schematic[i - 1][j] : null;
    // bottom
    const bottom = i + 1 < width ? schematic[i + 1][j] : null;
    // left
    const left = j > 0 ? schematic[i][j - 1] : null;
    // right
    const right = j + 1 < height ? schematic[i][j + 1] : null;
    // top right
    const upperRight = i > 0 && j + 1 < height ? schematic[i - 1][j + 1] : null;
    // bottom right
    const bottomRight =
      i + 1 < width && j + 1 < height ? schematic[i + 1][j + 1] : null;
    // top left
    const topLeft = i > 0 && j > 0 ? schematic[i - 1][j - 1] : null;
    // bottom left
    const bottomLeft = i + 1 < width && j > 0 ? schematic[i + 1][j - 1] : null;


    const res = [
      top,
      bottom,
      left,
      right,
      upperRight,
      bottomRight,
      topLeft,
      bottomLeft,
    ].some(isSymbol);

    return res;
  };

  // track sum
  let sum = 0;

  let numStr = "";
  let isPart = false;

  // traverse row (row i, column j)
  for (let i = 0; i < schematic.length; i++) {
    const row = schematic[i];
    for (let j = 0; j < row.length; j++) {
      const char = row[j];

      // if num, keep track of numStr
      const mbNum = parseInt(char, 10);
      if (!isNaN(mbNum)) {
        numStr = numStr.concat(char);
        // check if num is a part and update isPart
        isPart = checkIsPart(i, j) || isPart;
      } else {
        // else, if cur numStr was a part
        if (isPart) {

          // add to sum
          sum = sum + parseInt(numStr, 10);
        }
        // clear the num
        numStr = "";
        // clear isPart
        isPart = false;
      }
    }
  }
  return sum;
};

withInput(solve);
