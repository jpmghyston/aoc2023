import run from "aocrunner";
import _ from "lodash";

type Label =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

type Card = {
  label: Label;
  rank: number;
};

const cardsByRankPart1: Card[] = [
  { label: "A", rank: 13 },
  { label: "K", rank: 12 },
  { label: "Q", rank: 11 },
  { label: "J", rank: 10 },
  { label: "T", rank: 9 },
  { label: "9", rank: 8 },
  { label: "8", rank: 7 },
  { label: "7", rank: 6 },
  { label: "6", rank: 5 },
  { label: "5", rank: 4 },
  { label: "4", rank: 3 },
  { label: "3", rank: 2 },
  { label: "2", rank: 1 },
];

const cardsByRankPart2: Card[] = [
  { label: "A", rank: 13 },
  { label: "K", rank: 12 },
  { label: "Q", rank: 11 },
  { label: "T", rank: 9 },
  { label: "9", rank: 8 },
  { label: "8", rank: 7 },
  { label: "7", rank: 6 },
  { label: "6", rank: 5 },
  { label: "5", rank: 4 },
  { label: "4", rank: 3 },
  { label: "3", rank: 2 },
  { label: "2", rank: 1 },
  { label: "J", rank: 0 },
];

const cardRankPart1 = (label: Label): number => {
  return cardsByRankPart1.find((x) => x.label == label)!.rank;
};

const cardRankPart2 = (label: Label): number => {
  return cardsByRankPart2.find((x) => x.label == label)!.rank;
};

type HandName =
  | "FiveOfAKind"
  | "FourOfAKind"
  | "FullHouse"
  | "ThreeOfAKind"
  | "TwoPair"
  | "OnePair"
  | "HighCard";

type Hand = {
  name: HandName;
  rank: number;
};

const hands: Hand[] = [
  { name: "HighCard", rank: 0 },
  { name: "OnePair", rank: 1 },
  { name: "TwoPair", rank: 2 },
  { name: "ThreeOfAKind", rank: 3 },
  { name: "FullHouse", rank: 4 },
  { name: "FourOfAKind", rank: 5 },
  { name: "FiveOfAKind", rank: 6 },
];

const handByHandName = (handName: HandName): Hand => {
  return hands.find((hand) => hand.name === handName)!;
};

type ParsedHand = {
  hand: Hand;
  bid: number;
  cards: Label[];
};

const getLabels = (labels: string): Label[] => {
  return labels.split("").map((input: string): Label => {
    return input as Label;
  });
};

const getHandPart1 = (labels: Label[]): Hand => {
  return handByHandName(getHandNamePart1(labels));
};

const getHandNamePart1 = (labels: Label[]): HandName => {
  const cardSet = new Set<Label>(labels);
  const cardSetArray = Array.from(cardSet);
  if (cardSetArray.length === 1) {
    return "FiveOfAKind";
  }
  if (
    cardSetArray.some((label) => labels.filter((x) => x == label).length === 4)
  ) {
    return "FourOfAKind";
  }
  if (cardSetArray.length === 2) {
    return "FullHouse";
  }
  if (
    cardSetArray.some((label) => labels.filter((x) => x == label).length === 3)
  ) {
      return "ThreeOfAKind";
  }
  if (cardSetArray.length === 3) {
    return "TwoPair";
  }
  if (cardSetArray.length === 4) {
    return "OnePair";
  }
  return "HighCard";
};

const getHandPart2 = (labels: Label[]): Hand => {
  return handByHandName(getHandNamePart2(labels));
};

const getHandNamePart2 = (labels: Label[]): HandName => {
  const cardSet = new Set<Label>(labels);
  const cardSetArray = Array.from(cardSet);

  // Deal with wildcards
  if (cardSet.has("J")) {
    const numberOfWildcards = labels.filter((x) => x === "J").length;
    if (cardSetArray.length === 1 || cardSetArray.length === 2) {
      return "FiveOfAKind";
    }
    if (cardSetArray.length === 3) {
      const maxCardCounts = cardSetArray
        .filter((card) => card !== "J")
        .map(
          (card) => labels.filter((x) => x === card).length + numberOfWildcards,
        );
      if (Math.max(...maxCardCounts) === 4) {
        return "FourOfAKind";
      }
      return "FullHouse";
    }
    if (cardSetArray.length === 4) {
      return "ThreeOfAKind";
    }

    return "OnePair";
  }

  return getHandNamePart1(labels);
};

const handComparison =
  (cardToCardRank: (label: Label) => number) =>
  (handA: ParsedHand, handB: ParsedHand): number => {
    if (handA.hand.rank !== handB.hand.rank) {
      return handA.hand.rank - handB.hand.rank;
    }
    const handACardRanks = handA.cards.map(cardToCardRank);
    const handBCardRanks = handB.cards.map(cardToCardRank);
    const pairs = _.zip(handACardRanks, handBCardRanks);
    for (let i = 0; i < pairs.length; i++) {
      const [a, b] = pairs[i];
      if (a! !== b!) {
        return a! - b!;
      }
    }
    return 0;
  };

const parseInput = (
  rawInput: string,
  getHandFun: (labels: Label[]) => Hand,
): ParsedHand[] => {
  return rawInput.split("\n").map((line) => {
    const handAndBid = line.trim().split(" ");
    const labels = getLabels(handAndBid[0]);
    return {
      hand: getHandFun(labels),
      bid: Number(handAndBid[1]),
      cards: labels,
    };
  });
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput, getHandPart1);
  input.sort(handComparison(cardRankPart1)).reverse;
  var total = 0;
  for (var i = 0; i < input.length; i++) {
    const bid = input[i].bid;
    const rank = i + 1;
    total += bid * rank;
  }
  return total;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput, getHandPart2);
  input.sort(handComparison(cardRankPart2)).reverse;
  var total = 0;
  for (var i = 0; i < input.length; i++) {
    const bid = input[i].bid;
    const rank = i + 1;
    total += bid * rank;
  }
  return total;
};

run({
  part1: {
    tests: [
      {
        input: `32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483`,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `32T3K 765
        T55J5 684
        KK677 28
        KTJJT 220
        QQQJA 483`,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
