import run from "aocrunner";
import _ from "lodash";

type BestResult = {
  time: number;
  distance: number;
};

const distancesForTime = (time: number): number[] => {
  const distances: number[] = [];
  _.range(time).forEach((heldValue) => {
    distances.push((time - heldValue) * heldValue);
  });
  return distances;
};

const parseInput = (rawInput: string): BestResult[] => {
  const numbers = rawInput.split("\n").map((x) =>
    x
      .trim()
      .split(":")[1]
      .split(" ")
      .map(Number)
      .filter((x) => !isNaN(x) && x !== 0),
  );
  const zipped = _.zip(numbers[0], numbers[1]);
  return zipped.map((x) => {
    return {
      time: x[0]!,
      distance: x[1]!,
    };
  });
};

const parseInputPart2 = (rawInput: string): BestResult => {
  const numbers = rawInput
    .split("\n")
    .map((x) => x.trim().split(":")[1].replace(/\s/g, ""))
    .map(Number);
  return {
    time: numbers[0],
    distance: numbers[1],
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return input
    .map((bestResult) => {
      return distancesForTime(bestResult.time).filter(
        (x) => x > bestResult.distance,
      ).length;
    })
    .reduce((x, y) => x * y, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInputPart2(rawInput);
  return distancesForTime(input.time).filter((x) => x > input.distance).length;
};

run({
  part1: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Time:      7  15   30
        Distance:  9  40  200`,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
