import run from "aocrunner";
import lcm from "compute-lcm";

type Node = {
  name: string;
  left: string;
  right: string;
};

type ParsedInput = {
  instructions: string[];
  nodes: Node[];
};

const parseInput = (rawInput: string): ParsedInput => {
  const lines = rawInput.split("\n").map((x) => x.trim());
  const instructions = lines[0].split("");
  const regex = /(\w{3}) = \((\w{3}), (\w{3})\)/;
  const nodes: Node[] = lines.slice(2).map((line) => {
    const match = line.match(regex);
    if (match === null) {
      throw Error("No match");
    }
    return {
      name: match[1],
      left: match[2],
      right: match[3],
    };
  });

  return {
    instructions,
    nodes,
  };
};

const getStepsToEnd = (
  startingNode: Node,
  instructions: string[],
  nodes: Node[],
  isEndingNode: (nodeName: string) => boolean,
) => {
  const numberOfInstructions = instructions.length;
  let currentNodeName = startingNode.name;
  let steps = 0;
  while (!isEndingNode(currentNodeName)) {
    const instruction = instructions[steps % numberOfInstructions];
    const currentNode: Node = nodes.find(
      (node) => node.name === currentNodeName,
    )!;
    if (instruction === "R") {
      currentNodeName = currentNode.right;
    } else {
      currentNodeName = currentNode.left;
    }
    steps += 1;
  }
  return steps;
};

const part1 = (rawInput: string) => {
  const { instructions, nodes } = parseInput(rawInput);
  const firstNode = nodes.find((node) => node.name === "AAA")!;
  return getStepsToEnd(firstNode, instructions, nodes, isEndingNodeNamePart1);
};

const isStartingNodePart2 = (node: Node) => {
  return node.name[2] === "A";
};

const isEndingNodeNamePart1 = (nodeName: string) => {
  return nodeName === "ZZZ";
};

const isEndingNodeNamePart2 = (nodeName: string) => {
  return nodeName[2] === "Z";
};

const part2 = (rawInput: string) => {
  const { instructions, nodes } = parseInput(rawInput);

  return lcm(
    nodes
      .filter(isStartingNodePart2)
      .map((node) =>
        getStepsToEnd(node, instructions, nodes, isEndingNodeNamePart2),
      ),
  )!;
};

run({
  part1: {
    tests: [
      {
        input: `RL

        AAA = (BBB, CCC)
        BBB = (DDD, EEE)
        CCC = (ZZZ, GGG)
        DDD = (DDD, DDD)
        EEE = (EEE, EEE)
        GGG = (GGG, GGG)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 2,
      },
      {
        input: `LLR

        AAA = (BBB, BBB)
        BBB = (AAA, ZZZ)
        ZZZ = (ZZZ, ZZZ)`,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `LR

        11A = (11B, XXX)
        11B = (XXX, 11Z)
        11Z = (11B, XXX)
        22A = (22B, XXX)
        22B = (22C, 22C)
        22C = (22Z, 22Z)
        22Z = (22B, 22B)
        XXX = (XXX, XXX)`,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
