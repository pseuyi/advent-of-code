import withInput from "./utils";

const solve = (cards: string[]): number => {
  let points = 0;

  const calcPoints = (card: string): number => {
    let matches = 0;

    const [winningNums, ourNums] = card
      .split(" | ")
      .map((v) => v.split(" "))
      .map((ns) => {
        return ns.filter((n) => n !== "");
      });

    ourNums.forEach((n) => {
      if (winningNums.includes(n)) {
        matches += 1;
      }
    });

    return matches > 0 ? 2 ** (matches - 1) : 0;
  };

  const nums = cards.map((c) => c.split(": ")[1]);

  nums.forEach((n) => {
    points += calcPoints(n);
  });

  return points;
};

withInput(solve);
