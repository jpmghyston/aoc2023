import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(x => x.trim().split(""));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const expanded = transposeArray(duplicateBlankRows(transposeArray(duplicateBlankRows(input))));
  const galaxyCoords: [number, number][] = getGalaxyCoords(expanded);
  let distancesSum = 0;
  const qq = [];
  for (let i = 0; i < galaxyCoords.length; i++) {
    for (let j = i; j < galaxyCoords.length; j++) {
      qq.push([i, j, getDistanceBetween(galaxyCoords[i], galaxyCoords[j])]);
      distancesSum += getDistanceBetween(galaxyCoords[i], galaxyCoords[j])
    }
  }
  return distancesSum;
};

const getDistanceBetween = (coord1: [number, number], coord2: [number, number]): number => {
  return Math.abs(coord1[0] - coord2[0]) + Math.abs(coord1[1] - coord2[1]);
}

const getGalaxyCoords = (expanded: string[][]) => {
  const galaxyCoords: [number, number][] = [];
  for (let i = 0; i < expanded.length; i++) {
    for (let j = 0; j < expanded[0].length; j++) {
      if (expanded[i][j] === "#") {
        galaxyCoords.push([i, j]);
      }
    }
  }
  return galaxyCoords;
}

const duplicateBlankRows = (input: string[][]): string[][] => {
  let arr = _.cloneDeep(input);
  let i = 0;
  while (i < arr.length) {
    if (arr[i].every(x => x === ".")) {
      arr.splice(i, 0, arr[i]);
      i += 1;
    }
    i += 1;
  }
  return arr;
}

const getBlankRows = (arr: string[][]): number[] => {
  const output = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].every(x => x === ".")) {
      output.push(i);
    }
  }
  return output;
}

const getDistanceBetweenPart2 = (coord1: [number, number], coord2: [number, number], blankRows: number[], blankCols: number[]): number => {
  const blankRowsBetween = blankRows.filter(x => (x <= coord2[0] && x >= coord1[0]) || (x <= coord1[0] && x >= coord2[0])).length;
  const blankColsBetween = blankCols.filter(x => (x <= coord2[1] && x >= coord1[1]) || (x <= coord1[1] && x >= coord2[1])).length;
  const rowDistance = Math.abs(coord2[0] - coord1[0]) + blankRowsBetween * 10;
  const colDistance = Math.abs(coord2[1] - coord1[1]) + blankColsBetween * 10;
  return rowDistance + colDistance;
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const blankRows = getBlankRows(input);
  const blankCols = getBlankRows(transposeArray(input));
  const galaxyCoords: [number, number][] = getGalaxyCoords(input);
  let distancesSum = 0;
  for (let i = 0; i < galaxyCoords.length; i++) {
    for (let j = i; j < galaxyCoords.length; j++) {
      distancesSum += getDistanceBetweenPart2(galaxyCoords[i], galaxyCoords[j], blankRows, blankCols);
    }
  }
  return distancesSum;

};

const transposeArray = (array: string[][]) => {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]))
}

run({
  part1: {
    tests: [
      {
        input: `...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....`,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `...#......
        .......#..
        #.........
        ..........
        ......#...
        .#........
        .........#
        ..........
        .......#..
        #...#.....`,
        expected: 374,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
