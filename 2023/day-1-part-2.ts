import withInput from "./utils";

const replaceWithDigits = (line: string): string => {
  let replaced = line;

  const numToDig = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
  };
  const numbers = Object.keys(numToDig);

  numbers.forEach(
    (num) =>
      (replaced = replaced.replaceAll(
        num,
        `${num.slice(0, 1)}${numToDig[num]}${num.slice(-1)}`
      ))
  );

  return replaced;
};

const getCalibrationValue = (str: string): number => {
  let firstDigit, secondDigit;

  for (const char of str) {
    const parsed = parseInt(char, 10);
    if (!isNaN(parsed)) {
      if (!firstDigit) firstDigit = parsed;
      secondDigit = parsed;
    }
  }

  const value = parseInt(`${String(firstDigit)}${String(secondDigit)}`, 10);

  return value;
};

const solve = (document: string[]) => {
  let sum = 0;

  document.forEach((line, idx) => {
    const str = replaceWithDigits(line);
    sum += getCalibrationValue(str);
  });

  return sum;
};

withInput(solve);
