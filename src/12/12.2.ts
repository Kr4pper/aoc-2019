import * as fs from 'fs';
import * as path from 'path';

console.time();

const input = fs.readFileSync(path.join(__dirname, '12.input'), {encoding: 'utf-8'});
let positions = input.split('\r\n').map(line => line.match(/([-\d]+)/g).map(Number))
let velocities = [...positions].map(v => v.map(() => 0));

const range = (length: number) => Array.from({length}, (_, i) => i);

const range3 = range(3);
const range4 = range(4);

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
        range3.forEach(coordinate => {
            const a = positions[m1][coordinate];
            const b = positions[m2][coordinate];
            if (a === b) return;

            velocities[m1][coordinate] += a < b ? 1 : -1;
            velocities[m2][coordinate] += a > b ? 1 : -1;
        });
    });

    range4.forEach(moon => range3.forEach(coordinate => positions[moon][coordinate] += velocities[moon][coordinate]));
}

const greatestCommonDivisor = (a: number, b: number): number => b
    ? greatestCommonDivisor(b, a % b)
    : a;

const lcm = (a: number, b: number) => a * b / greatestCommonDivisor(a, b);

const getTimeToRepeat = () => {
    const start = range4.map(i => ({p: [...positions[i]], v: [...velocities[i]]}));
    const repeats: number[] = [];
    for (let i = 1; range3.some(dim => !repeats[dim]); i++) {
        applyStep();
        range3
            .filter(dim =>
                !repeats[dim]
                && range4.every(moon => positions[moon][dim] === start[moon].p[dim] && velocities[moon][dim] === start[moon].v[dim])
            ).forEach(dim => repeats[dim] = i);
    }
    return range3.map(d => repeats[d]).reduce(lcm);
};

console.log(getTimeToRepeat());
console.timeEnd();
