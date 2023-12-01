import run from "aocrunner";
import _ from "lodash";

const parseInputPart1 = (rawInput: string) => {
  return rawInput.split("\n").map((x) =>
    x
      .trim()
      .split("")
      .map((x) => Number(x))
      .filter((x) => !isNaN(x)),
  );
};

const parseInputPart2 = (rawInput: string) => {
  return rawInput.split("\n").map((x) => replaceWordsWithNumbers(x.trim()));
};

const wordNumberReplacementValues = [
  ["one", "o1ne"],
  ["two", "t2wo"],
  ["three", "thr3ee"],
  ["four", "fo4ur"],
  ["five", "fi5ve"],
  ["six", "si6x"],
  ["seven", "sev7en"],
  ["eight", "eig8ht"],
  ["nine", "ni9ne"],
];

const replaceWordsWithNumbers = (input: string) => {
  var wip = input;
  wordNumberReplacementValues.forEach((element) => {
    wip = wip.replaceAll(element[0], element[1]);
  });
  return wip;
};

const part1 = (rawInput: string) => {
  const input = parseInputPart1(rawInput);

  return _.sum(input.map((x) => x[0] * 10 + x[x.length - 1]));
};

const part2 = (rawInput: string) => {
  const input = parseInputPart2(rawInput);
  return _.sum(
    input
      .map((x) =>
        x
          .split("")
          .map((x) => Number(x))
          .filter((x) => !isNaN(x)),
      )
      .map((x) => x[0] * 10 + x[x.length - 1]),
  );
};

run({
  part1: {
    tests: [
      {
        input: `1abc2
        pqr3stu8vwx
        a1b2c3d4e5f
        treb7uchet`,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `two1nine
        eightwothree
        abcone2threexyz
        xtwone3four
        4nineeightseven2
        zoneight234
        7pqrstsixteen`,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
