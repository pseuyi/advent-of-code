import withInput from "./utils";

interface CubeSet {
  red: number;
  green: number;
  blue: number;
}

const BAG: CubeSet = {
  red: 12,
  green: 13,
  blue: 14,
};

const isValid = (cs: CubeSet): boolean => {
  if (cs.red > BAG.red || cs.green > BAG.green || cs.blue > BAG.blue)
    return false;

  return true;
};

const makeCubeSet = (cubes: string): CubeSet => {
  const cs: CubeSet = { red: 0, green: 0, blue: 0 };

  const colors = cubes.split(", ");
  colors.forEach((c) => {
    const [num, color] = c.split(" ");
    cs[color] = parseInt(num, 10);
  });

  return cs;
};

const solve = (games: string[]) => {
  let res = 0;

  games.forEach((game) => {
    // parse input into cube sets
    const [tag, cubes] = game.split(": ");
    const id = tag.split(" ")[1];

    const cubeSets = cubes.split("; ").map(makeCubeSet);

    if (cubeSets.every(isValid)) {
      res += parseInt(id, 10);
    }
  });

  return res;
};

withInput(solve);
