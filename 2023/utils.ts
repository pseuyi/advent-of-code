import * as fs from "fs";

const withInput = (cb: (v: string[]) => void) => {
  return fs.readFile("./input.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // console.log(data);

    const linesArr = data.split("\n");
    const lines = linesArr.slice(0, linesArr.length - 1);
    console.log("ANSWER: ", cb(lines));
  });
};

export default withInput;
