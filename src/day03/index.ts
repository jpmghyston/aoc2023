import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map((x) => x.trim());
};

const getSymbolLocations = (chars: string[][]): Set<string> => {
  const symbolLocations = new Set<string>();
  for (const [i, line] of chars.entries()) {
    for (const [j, char] of line.entries()) {
      if (!(char == ".") && isNaN(Number(char))) {
        symbolLocations.add([i, j].toString());
      }
    }
  }
  return symbolLocations;
};

const isNumberAtLocation = (chars: string[][], i: number, j: number) => {
  return !isNaN(Number(chars[i][j]));
};

const getGearRatios = (chars: string[][]): number[] => {
  const iWidth = chars.length;
  const jWidth = chars[0].length;
  const gearRatios: number[] = [];
  for (const [i, line] of chars.entries()) {
    for (const [j, char] of line.entries()) {
      if (char === "*") {
        const numberDigitLocations = [];
        const startJ = Math.max(j - 1, 0);
        const endJ = Math.min(j + 1, jWidth);
        const startI = Math.max(i - 1, 0);
        const endI = Math.min(i + 1, iWidth);
        for (let iVal = startI; iVal <= endI; iVal++) {
          for (let jVal = startJ; jVal <= endJ; jVal++) {
            if (isNumberAtLocation(chars, iVal, jVal)) {
              numberDigitLocations.push([iVal, jVal]);
            }
          }
        }
        const numbers = new Set<number>();
        numberDigitLocations.forEach((location) => {
          const [iVal, jVal] = location;
          var startOfNumber = jVal;
          while (
            startOfNumber >= 0 &&
            isNumberAtLocation(chars, iVal, startOfNumber)
          ) {
            startOfNumber--;
          }
          startOfNumber++;
          var endOfNumber = jVal;
          while (
            endOfNumber <= jWidth &&
            isNumberAtLocation(chars, iVal, endOfNumber)
          ) {
            endOfNumber++;
          }
          endOfNumber--;
          numbers.add(
            Number(chars[iVal].slice(startOfNumber, endOfNumber + 1).join("")),
          );
        });
        if (numbers.size === 2) {
          gearRatios.push([...numbers][0] * [...numbers][1]);
        }
      }
    }
  }
  return gearRatios;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const jWidth = input[0].length;
  const iWidth = input.length;
  const chars = input.map((x) => x.split(""));
  const symbolLocations = getSymbolLocations(chars);
  const partNumbers = [];
  const regex = /\d+/g;
  for (const [i, line] of input.entries()) {
    var match: RegExpExecArray | null;
    while ((match = regex.exec(line))) {
      const startIndex = +(regex.lastIndex - match[0].length);
      const endIndex = regex.lastIndex - 1;
      const startJ = Math.max(startIndex - 1, 0);
      const endJ = Math.min(endIndex + 1, jWidth);
      const startI = Math.max(i - 1, 0);
      const endI = Math.min(i + 1, iWidth);
      for (let iVal = startI; iVal <= endI; iVal++) {
        for (let jVal = startJ; jVal <= endJ; jVal++) {
          if (symbolLocations.has([iVal, jVal].toString())) {
            partNumbers.push(Number(match[0]));
          }
        }
      }
    }
  }
  return _.sum(partNumbers);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const gearRatios = getGearRatios(input.map((x) => x.split("")));

  return _.sum(gearRatios);
};

run({
  part1: {
    tests: [
      {
        input: `467..114..
      ...*......
      ..35..633.
      ......#...
      617*......
      .....+.58.
      ..592.....
      ......755.
      ...$.*....
      .664.598..`,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `467..114..
        ...*......
        ..35..633.
        ......#...
        617*......
        .....+.58.
        ..592.....
        ......755.
        ...$.*....
        .664.598..`,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
