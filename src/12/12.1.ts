import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '12.input'), {encoding: 'utf-8'});
let positions = input.split('\r\n').map(line => line.match(/([-\d]+)/g).map(Number))
let velocities = [...positions].map(v => v.map(() => 0));

const range = (length: number) => Array.from({length}, (_, i) => i);

const pairs = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
];

const applyStep = () => {
    pairs.forEach(([m1, m2]) => {
        range(3).forEach(coordinate => {
            const a = positions[m1][coordinate];
            const b = positions[m2][coordinate];
            if (a === b) return;

            velocities[m1][coordinate] += a < b ? 1 : -1;
            velocities[m2][coordinate] += a > b ? 1 : -1;
        });
    });

    range(4).forEach(moon => range(3).forEach(coordinate => positions[moon][coordinate] += velocities[moon][coordinate]));
}

let iterations = 0;
while (iterations++ < 1000) applyStep();

const absoluteValueSum = (numbers: number[]) => numbers.reduce((sum, num) => sum += Math.abs(num), 0);

const energyOfMoon = (positions: number[], velocities: number[]) => absoluteValueSum(positions) * absoluteValueSum(velocities);

const totalEnergy = range(4).reduce((res, idx) => res += energyOfMoon(positions[idx], velocities[idx]), 0);
console.log(totalEnergy);
