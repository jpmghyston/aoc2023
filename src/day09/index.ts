import run from "aocrunner";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((line) => line.trim().split(" ").map(Number));
};

const getDiffs = (sequence: number[]): number[] => {
  const diffs = [];
  for (let i = 1; i < sequence.length; i++) {
    diffs.push(sequence[i] - sequence[i - 1]);
  }
  return diffs;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let result = 0;
  input.forEach((sequence) => {
    const diffList = [sequence];
    while (true) {
      const diffs = getDiffs(diffList[diffList.length - 1]);
      diffList.push(diffs);
      if (diffs.every((num) => num === 0)) {
        break;
      }
    }
    diffList[diffList.length - 1].push(0);
    for (let i = diffList.length - 2; i >= 0; i--) {
      diffList[i].push(
        diffList[i][diffList[i].length - 1] +
          diffList[i + 1][diffList[i + 1].length - 1],
      );
    }
    result += diffList[0][diffList[0].length - 1];
  });

  return result;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let result = 0;
  input.forEach((sequence) => {
    const diffList = [sequence];
    while (true) {
      const diffs = getDiffs(diffList[diffList.length - 1]);
      diffList.push(diffs);
      if (diffs.every((num) => num === 0)) {
        break;
      }
    }
    diffList[diffList.length - 1].unshift(0);
    for (let i = diffList.length - 2; i >= 0; i--) {
      diffList[i].unshift(diffList[i][0] - diffList[i + 1][0]);
    }
    result += diffList[0][0];
  });

  return result;
};

run({
  part1: {
    tests: [
      {
        input: `0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `0 3 6 9 12 15
        1 3 6 10 15 21
        10 13 16 21 30 45`,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
