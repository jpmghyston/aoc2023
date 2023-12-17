import run from "aocrunner";
import _ from "lodash";

type Lens = {
  label: string;
  focalLength: number;
}

const parseInput = (rawInput: string) => {
  return rawInput.trim().split(",");
};

const hashAlgorithm = (input: string): number => {
  let val = 0;
  for (let i = 0; i < input.length; i++) {
    val += input.charCodeAt(i);
    val *= 17;
    val %= 256;
  }
  return val;
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return _.sum(input.map(hashAlgorithm));
};

type Boxes = {
  [box: number]: Lens[];
}


const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const boxes: Boxes = {};
  input.forEach(instruction => {
    if (instruction.indexOf("=") !== -1) {
      const [label, numberStr] = instruction.split("=");
      const focalLength = parseInt(numberStr);
      const boxNumber = hashAlgorithm(label);
      if (boxes[boxNumber] === undefined) {
        boxes[boxNumber] = [{
          label,
          focalLength,
        }]
      } else {
        const lenses = boxes[boxNumber];
        if (lenses.some(lens => lens.label === label)) {
          for (let i = 0; i < lenses.length; i++) {
            if (lenses[i].label === label) {
              lenses[i].focalLength = focalLength;
            }
          }
        } else {
          lenses.push({
            label,
            focalLength
          })
        }
      }
    } else {
      const [label] = instruction.split("-");
      const boxNumber = hashAlgorithm(label);
      if (boxes[boxNumber] !== undefined) {
        boxes[boxNumber] = boxes[boxNumber].filter(lens => lens.label !== label);
      }
    }
  });

  let totalFocusingPower = 0;
  for (let i = 0; i < 256; i++) {
    if (boxes[i]) {
      const lenses = boxes[i];
      lenses.forEach((lens, index) => {
          totalFocusingPower += ((i + 1) * (index + 1) * lens.focalLength);
      })
    }
  }

  return totalFocusingPower;
};

run({
  part1: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
