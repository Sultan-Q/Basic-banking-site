const containers = [50, 50, 1000, 54, 110, 55, 120]; // sizes of the containers
const totalWater = 75; // total amount of water to distribute

const totalContainerSize = containers.reduce((acc, val) => acc + val, 0); // calculate the total size of all containers
const relativeSizes = containers.map((size) => size / totalContainerSize); // calculate the relative sizes of the containers

const amounts = relativeSizes.map((relativeSize) =>
  roundToNearestSecondDecimal(relativeSize * totalWater)
); // distribute the water based on relative sizes

console.log(amounts); // Output: [2, 3, 5]
console.log(52.12 / 1000);
console.log(2.61 / 50);
function roundToTwo(num) {
  return +(Math.round(num + "e+2") + "e-2");
}
function roundToNearestSecondDecimal(num) {
  return Math.round(num * 100) / 100;
}
const num = 2.6059763724808898;
const roundedNum = roundToTwo(num);
console.log(roundedNum); // Output: 2.61
