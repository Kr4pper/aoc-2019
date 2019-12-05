import * as fs from 'fs';
import * as path from 'path';

const paths = fs.readFileSync(path.join(__dirname, '3.input'), {encoding: 'utf-8'}).split('\n');

const visitedWithSteps = new Map<string, number>();
const stepsToIntersection: number[] = [];
paths.forEach((path, idx) => tracePath(path, idx === 0));

console.log(`The closest intersection is ${stepsToIntersection.sort((a, b) => a < b ? -1 : 1)[0]}`);

function tracePath(path: string, ignoreCollision: boolean) {
    const vectors = {
        'R': [1, 0],
        'L': [-1, 0],
        'U': [0, 1],
        'D': [0, -1],
    }

    let x = 0;
    let y = 0;
    let steps = 0;

    path.split(',').forEach(segment => {
        const [direction, ..._magnitude] = segment;
        const [dx, dy]: number[] = vectors[direction as 'R' | 'L' | 'U' | 'D'];
        const magnitude = +_magnitude.join('');

        for (let i = 0; i < magnitude; i++) {
            x += dx;
            y += dy;
            steps++;
            const encoded = `${x},${y}`;
            if (
                !ignoreCollision
                && (x !== 0 || y !== 0)
                && visitedWithSteps.has(encoded)
            ) stepsToIntersection.push(steps + visitedWithSteps.get(encoded));
            else visitedWithSteps.set(encoded, steps);
        }
    });
}
