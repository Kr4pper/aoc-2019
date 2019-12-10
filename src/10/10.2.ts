import {getOptimumStation, getDimensions, getAsteroids, NumberTuple} from './10';

const [x, y] = getDimensions();
console.log(`Dimensions are ${x}x${y}`);

const asteroids = getAsteroids();
console.log(`There are ${asteroids.length} asteroids`);

const [[xLaser, yLaser]] = getOptimumStation(asteroids, [x, y]);
console.log(`The laser will be at ${xLaser},${yLaser}`);

const asteroidData: [NumberTuple, number, number][] = asteroids.map(([x, y]) => [
    [x, y],
    Math.PI - Math.atan2(x - xLaser, y - yLaser), // clockwise rotation 0..2*PI
    Math.abs(x - xLaser) + Math.abs(y - yLaser),
]);

const sorted = asteroidData.sort((a, b) => a[1] < b[1]
    ? -1
    : a[1] === b[1]
        ? a[2] < b[2]
            ? -1
            : 1
        : 1
);

let destroyed = 0;
let idx = 0;
while (true) {
    if (++destroyed === 200) {
        console.log(`The 200th asteroid to be destroyed is located at ${sorted[idx][0]}`);
        break;
    }
    const removed = sorted[idx];
    sorted.splice(idx, 1);
    const next = sorted.findIndex(([_, rotation], i) => i >= idx && rotation !== removed[1]);
    idx = next === -1 ? 0 : next;
}
