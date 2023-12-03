import run from "aocrunner";
import _, { indexOf } from "lodash";

const MAX_RED = 12;
const MAX_GREEN = 13;
const MAX_BLUE = 14;

type Game = {
  id: number;
  draws: Draw[];
};

type Draw = {
  greens: number;
  reds: number;
  blues: number;
};

const parseInput = (rawInput: string): Game[] => {
  return rawInput.split("\n").map((gameString: string): Game => {
    const gameId = Number(gameString.match(/Game (\d+)/)?.[1]!);
    const draws: Draw[] = gameString
      .split(":")[1]
      .split(";")
      .map((drawString) => {
        const drawStrings = drawString.split(",").map((x) => x.trim());
        var reds = 0;
        var greens = 0;
        var blues = 0;
        drawStrings.forEach((x) => {
          if (x.indexOf("red") != -1) {
            reds = Number(x.match(/(\d+)/)?.[1]!);
          }
          if (x.indexOf("green") != -1) {
            greens = Number(x.match(/(\d+)/)?.[1]!);
          }
          if (x.indexOf("blue") != -1) {
            blues = Number(x.match(/(\d+)/)?.[1]!);
          }
        });
        return {
          reds,
          greens,
          blues,
        };
      });
    return {
      id: gameId,
      draws,
    };
  });
};

const gameIsPossible = (game: Game): boolean => {
  return !game.draws.some(
    (draw) =>
      draw.blues > MAX_BLUE || draw.greens > MAX_GREEN || draw.reds > MAX_RED,
  );
};

const gamePower = (game: Game): number => {
  const maxReds = _.maxBy(game.draws, (draw) => draw.reds)!.reds;
  const maxGreens = _.maxBy(game.draws, (draw) => draw.greens)!.greens;
  const maxBlues = _.maxBy(game.draws, (draw) => draw.blues)!.blues;
  return maxReds * maxGreens * maxBlues;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return _.sum(input.filter(gameIsPossible).map((game) => game.id));
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return _.sum(input.map(gamePower));
};

run({
  part1: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
        Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
        Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
        Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
        Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
