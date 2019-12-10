import {getOptimumStation, getDimensions, getAsteroids} from './10';

const [x, y] = getDimensions();
console.log(`Dimensions are ${x}x${y}`)

const asteroids = getAsteroids();
console.log(`There are ${asteroids.length} asteroids`);

const [position, maxVisible] = getOptimumStation(asteroids, [x, y]);
console.log(`The most visible asteroids are ${maxVisible} from position ${position}`);
