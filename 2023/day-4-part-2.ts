import withInput from "./utils";

const solve = (cards: string[]): number => {
  let total = 0;
  let cardsById: { [key: string]: number } = {};

  const calcMatches = (card: string): number => {
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

    return matches;
  };

  const nums = cards.map((c) => c.split(": "));

  nums.forEach(([cardId, numbers]) => {
    // parse the id num
    const id = parseInt(cardId.split(" ").pop() || "", 10);
    console.log('id: ', id);
    const matches = calcMatches(numbers);
    console.log('matches: ', matches);

    // add the original card
    if (!cardsById[id]) {
      cardsById[id] = 1;
    } else {
      cardsById[id] = cardsById[id] + 1;
    }

    // create new cards for each match
    for (let i = 1; i <= matches; i++) {
      const next = id + i;
      if (cardsById[next]) {
        // the additional cards are multiplied by the num of duplicates of the current scratched card
        const duplicates = cardsById[id];
        cardsById[next] = cardsById[next] + duplicates;
      } else {
        cardsById[next] = 1;
      }
    }

    total = total + cardsById[id];

    console.log('cardsById: ', cardsById);
    // optimize map
    // delete cardsById[id];
    console.log(`total after id ${id}: `, total);
  });

  return total;
};
withInput(solve);
