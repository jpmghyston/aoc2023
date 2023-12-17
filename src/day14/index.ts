import run from "aocrunner";
import _ from "lodash";

const parseInput = (rawInput: string) => {
  return rawInput.split("\n").map(x => x.trim().split(""));
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const rollingRocks: Array<[number, number]> = [];
  const stationaryRocks: Array<[number, number]> = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      if (input[i][j] === "O") {
        rollingRocks.push([i, j]);
      }
      if (input[i][j] === "#") {
        stationaryRocks.push([i, j]);
      }
    }
  }

  const newRollingRocks: Array<[number, number]> = [];

  for (let j = 0; j < input[0].length; j++) {
    let rollingRocksInColumn = rollingRocks.filter(([x, y]) => y === j);
    const stationaryRocksInColumn = stationaryRocks.filter(([x, y]) => y === j);
    stationaryRocksInColumn.sort(([x1, y1], [x2, y2]) => x2 - x1);
    stationaryRocksInColumn.forEach(([x, y]) => {
      const rollingRocksBelowStationaryRock = rollingRocksInColumn.filter(([xr, _]) => xr > x);
      rollingRocksInColumn = rollingRocksInColumn.filter(([xr, yr]) => !(xr > x));
      const newCoordinates: Array<[number, number]> = _.range(rollingRocksBelowStationaryRock.length).map(k => [x + 1 + k, y]);
      newRollingRocks.push(...newCoordinates);
    })
    const newCoordinates: Array<[number, number]> = _.range(rollingRocksInColumn.length).map(k => [0 + k, j]);
    newRollingRocks.push(...newCoordinates);

  }
  const getWeightingForCoordinate = ([x, y]: [number, number]) => {
    return input.length - x;
  }
  return _.sum(newRollingRocks.map(getWeightingForCoordinate));
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
 
  return;
};

run({
  part1: {
    tests: [
      {
        input: `O....#....
        O.OO#....#
        .....##...
        OO.#O....O
        .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....`,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `O....#....
        O.OO#....#
        .....##...
        OO.#O....O
        .O.....O#.
        O.#..O.#.#
        ..O..#O..O
        .......O..
        #....###..
        #OO..#....`,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
