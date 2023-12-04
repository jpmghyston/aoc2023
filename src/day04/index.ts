import run from "aocrunner";
import { match } from "assert";
import _ from "lodash";

type Card = {
  id: number,
  numbersYouHave: number[],
  winningNumbers: Set<number>,
  cardValue: number,
  matchingNumbers: number,
  part2Value: number | undefined,
}

const getCardValuePart1 = (numbersYouHave: number[], winningNumbers: Set<number>): number => {
  const matchingNumbers = numbersYouHave.filter(x => winningNumbers.has(x)).length;
  if (matchingNumbers === 0) {
    return 0;
  }
  if (matchingNumbers === 1) {
    return 1
  }
  return 2 ** (matchingNumbers - 1);
}

const getWonCards = (originalCards: Card[], card: Card): Card[] => {
  const wonCards = originalCards.slice(card.id, card.id + card.matchingNumbers);
  return wonCards;
}

const getCardValuePart2 = (card: Card, originalCards: Card[]) => {
  if (card.matchingNumbers === 0) {
    return 1;
  }
  if (card.part2Value) {
    return card.part2Value;
  }
  const wonCards = getWonCards(originalCards, card);
  const value = _.sum(wonCards.map(wonCard => getCardValuePart2(wonCard, originalCards)));
  card.part2Value = value + 1;
  return value + 1;
}

const parseInput = (rawInput: string): Card[] => {
  return rawInput.split("\n").map(line => {
    const id = Number(line.match(/Card\s+(\d+):/)![1]);
    const rhs = line.split(":")[1].trim();
    const numbersYouHave = rhs.split("|")[0].trim().split(" ").map(Number).filter(x => x !== 0);
    const winningNumbers = new Set(rhs.split("|")[1].trim().split(" ").map(Number).filter(x => x !== 0))
    return {
      id,
      numbersYouHave,
      winningNumbers,
      cardValue: getCardValuePart1(numbersYouHave, winningNumbers),
      matchingNumbers: numbersYouHave.filter(num => winningNumbers.has(num)).length,
      part2Value: undefined
    }
  });
};

const part1 = (rawInput: string) => {
  const cards = parseInput(rawInput);
  return _.sum(cards.map(card => card.cardValue));
};

const part2 = (rawInput: string) => {
  const originalCards = parseInput(rawInput);

  return _.sum(originalCards.map(card => getCardValuePart2(card, originalCards)));
};

run({
  part1: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
        Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
        Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
        Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
        Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
        Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
