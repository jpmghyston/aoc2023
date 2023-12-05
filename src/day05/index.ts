import run from "aocrunner";
import _, { lastIndexOf } from "lodash";

type ParseOutput = {
  seeds: number[];
  seedToSoil: (input: number) => number;
  soilToFertilizer: (input: number) => number;
  fertilizerToWater: (input: number) => number;
  waterToLight: (input: number) => number;
  lightToTemperature: (input: number) => number;
  temperatureToHumidity: (input: number) => number;
  humidityToLocation: (input: number) => number;
};

type MapEntry = {
  destinationRangeStart: number;
  destinationRangeEnd: number;
  sourceRangeStart: number;
  sourceRangeEnd: number;
};

const mapToValue = (input: number, mapEntry: MapEntry) => {
  if (mapEntry.sourceRangeStart <= input && input < mapEntry.sourceRangeEnd) {
    return input - mapEntry.sourceRangeStart + mapEntry.destinationRangeStart;
  }
  return null;
};

const parseInput = (rawInput: string): ParseOutput => {
  const lines = rawInput.split("\n").map((x) => x.trim());
  const seeds = lines[0].split(":")[1].split(" ").slice(1).map(Number);

  return {
    seeds,
    seedToSoil: getMappingFunction(
      lines,
      "seed-to-soil map:",
      "soil-to-fertilizer map:",
    ),
    soilToFertilizer: getMappingFunction(
      lines,
      "soil-to-fertilizer map:",
      "fertilizer-to-water map:",
    ),
    fertilizerToWater: getMappingFunction(
      lines,
      "fertilizer-to-water map:",
      "water-to-light map:",
    ),
    waterToLight: getMappingFunction(
      lines,
      "water-to-light map:",
      "light-to-temperature map:",
    ),
    lightToTemperature: getMappingFunction(
      lines,
      "light-to-temperature map:",
      "temperature-to-humidity map:",
    ),
    temperatureToHumidity: getMappingFunction(
      lines,
      "temperature-to-humidity map:",
      "humidity-to-location map:",
    ),
    humidityToLocation: getMappingFunction(
      lines,
      "humidity-to-location map:",
      null,
    ),
  };
};

const part1 = (rawInput: string) => {
  const {
    seeds,
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  } = parseInput(rawInput);

  return Math.min(
    ...seeds
      .map(seedToSoil)
      .map(soilToFertilizer)
      .map(fertilizerToWater)
      .map(waterToLight)
      .map(lightToTemperature)
      .map(temperatureToHumidity)
      .map(humidityToLocation),
  );
};

const part2 = (rawInput: string) => {
  const {
    seeds,
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  } = parseInput(rawInput);
  var lowestLocationNumber = Number.MAX_VALUE;
  var totalSeeds = 0;
  const qqTotalSeeds = 1807562333;
  for (let i = 0; i < seeds.length; i += 2) {
    const startSeed = seeds[i];
    const endSeed = seeds[i] + seeds[i + 1];
    const numberOfSeeds = endSeed - startSeed;
    totalSeeds += numberOfSeeds;
    console.log(`% complete: ${(totalSeeds / qqTotalSeeds) * 100}%`);

    for (let seed = seeds[i]; seed < seeds[i] + seeds[i + 1]; seed++) {
      const locationNumber = [seed]
        .map(seedToSoil)
        .map(soilToFertilizer)
        .map(fertilizerToWater)
        .map(waterToLight)
        .map(lightToTemperature)
        .map(temperatureToHumidity)
        .map(humidityToLocation)[0];

      if (lowestLocationNumber > locationNumber) {
        lowestLocationNumber = locationNumber;
      }
    }
  }
  return lowestLocationNumber;
};

run({
  part1: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `seeds: 79 14 55 13

        seed-to-soil map:
        50 98 2
        52 50 48
        
        soil-to-fertilizer map:
        0 15 37
        37 52 2
        39 0 15
        
        fertilizer-to-water map:
        49 53 8
        0 11 42
        42 0 7
        57 7 4
        
        water-to-light map:
        88 18 7
        18 25 70
        
        light-to-temperature map:
        45 77 23
        81 45 19
        68 64 13
        
        temperature-to-humidity map:
        0 69 1
        1 0 69
        
        humidity-to-location map:
        60 56 37
        56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
function getMappingFunction(
  lines: string[],
  startLine: string,
  endLine: string | null,
) {
  const endLineIndex =
    endLine != null ? lines.indexOf(endLine) - 1 : lines.length - 1;
  const mapEntries = lines
    .slice(lines.indexOf(startLine) + 1, endLineIndex)
    .map((line): MapEntry => {
      const arr = line.split(" ").map(Number);
      return {
        destinationRangeStart: arr[0],
        destinationRangeEnd: arr[0] + arr[2],
        sourceRangeStart: arr[1],
        sourceRangeEnd: arr[1] + arr[2],
      };
    });

  const mappingFunction = (input: number) => {
    var output: number | null = null;
    mapEntries.forEach((entry) => {
      const mapped = mapToValue(input, entry);
      if (mapped !== null) {
        output = mapped;
      }
    });
    return output ?? input;
  };
  return mappingFunction;
}
