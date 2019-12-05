import * as fs from 'fs';
import * as path from 'path';

const paths = fs.readFileSync(path.join(__dirname, '3.input'), {encoding: 'utf-8'}).split('\n');

const visited = new Set<string>();
const intersections: [number, number][] = [];
paths.forEach((path, idx) => tracePath(path, idx === 0));

const manhattanDistance = (...numbers: number[]) => numbers.reduce((sum, value) => sum += Math.abs(value), 0);

console.log(`The closest intersection is ${intersections.sort((a, b) => manhattanDistance(...a) < manhattanDistance(...b) ? -1 : 1)[0]}`);

function tracePath(path: string, ignoreCollision: boolean) {
    const vectors = {
        'R': [1, 0],
        'L': [-1, 0],
        'U': [0, 1],
        'D': [0, -1],
    }

    let x = 0;
    let y = 0;

    path.split(',').forEach(segment => {
        const [direction, ..._magnitude] = segment;
        const [dx, dy]: number[] = vectors[direction as 'R' | 'L' | 'U' | 'D'];
        const magnitude = +_magnitude.join('');

        for (let i = 0; i < magnitude; i++) {
            x += dx;
            y += dy;
            const encoded = `${x},${y}`;
            if (!ignoreCollision && visited.has(encoded)) intersections.push([x, y]);
            else visited.add(encoded);
        }
    });
}
