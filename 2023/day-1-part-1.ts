import withInput from "./utils";

const getCalibrationValue = (line: string): number => {
  let firstDigit, secondDigit;

  for (const char of line) {
    const parsed = parseInt(char, 10);
    if (!isNaN(parsed)) {
      if (!firstDigit) firstDigit = parsed;
      secondDigit = parsed;
    }
  }

  return parseInt(`${String(firstDigit)}${String(secondDigit)}`, 10);
};

const solve = (document: string[]) => {
  let sum = 0;

  document
    .forEach((line, idx) => {
      sum += getCalibrationValue(line);
    });

  return sum;
};

withInput(solve);
