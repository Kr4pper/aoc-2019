import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '10.input'), {encoding: 'utf-8'}).split('\r\n');

export type NumberTuple = [number, number];

export const getDimensions = (): NumberTuple => [
    input[0].length,
    input.length,
];

export const getAsteroids = (): NumberTuple[] => input.reduce((res, line, lineIdx) => [
    ...res,
    ...line.split('').reduce((res, char, charIdx) => [...res, ...(char === '#' ? [[charIdx, lineIdx]] : [])], []),
], [] as NumberTuple[])

const greatestCommonDivisor = (a: number, b: number): number => b
    ? greatestCommonDivisor(b, a % b)
    : a;

const reduceFraction = (numerator: number, denominator: number): NumberTuple => {
    const gcd = Math.abs(greatestCommonDivisor(numerator, denominator));
    return [numerator / gcd, denominator / gcd];
}

const visibleFrom = (a: NumberTuple, all: NumberTuple[], [xMax, yMax]: NumberTuple) => {
    const visible = new Set([...all].map(([x, y]) => `${x},${y}`));

    all.forEach(b => { // this does twice the theoretically required work :/
        if (a === b) visible.delete(`${a[0]},${a[1]}`)

        const [xLos, yLos] = reduceFraction(b[0] - a[0], b[1] - a[1]);
        let [x, y] = b;
        while (x >= 0 && x < xMax && y >= 0 && y < yMax) {
            x += xLos;
            y += yLos;
            visible.delete(`${x},${y}`);
        }
    });

    return visible.size;
}

export const getOptimumStation = (asteroids: NumberTuple[], [xMax, yMax]: NumberTuple): [NumberTuple, number] =>
    asteroids
        .map(a => [a, visibleFrom(a, asteroids, [xMax, yMax])] as [NumberTuple, number])
        .sort((a, b) => a[1] > b[1] ? -1 : 1)[0];
