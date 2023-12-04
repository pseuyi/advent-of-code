import withInput from "./utils";

interface CubeSet {
  red: number;
  green: number;
  blue: number;
}

const findMinSet = (cubeSets: CubeSet[]): CubeSet => {
  const min: CubeSet = { red: 0, green: 0, blue: 0 };

  cubeSets.forEach((cs) => {
    if (cs.red > min.red) min.red = cs.red;
    if (cs.green > min.green) min.green = cs.green;
    if (cs.blue > min.blue) min.blue = cs.blue;
  });

  for (const color in min) {
    if (min[color] === 0) delete min[color];
  }

  return min;
};

const findPower = (cubeSet: CubeSet): number => {
  return cubeSet.red * cubeSet.green * cubeSet.blue;
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
  return games.reduce((acc, game) => {
    // parse input into cube sets
    const [tag, cubes] = game.split(": ");
    const id = tag.split(" ")[1];

    const cubeSets = cubes.split("; ").map(makeCubeSet);

    return acc + findPower(findMinSet(cubeSets));
  }, 0);
};

withInput(solve);
