import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';

const input = fs.readFileSync(path.join(__dirname, '11.input'), {encoding: 'utf-8'});

const range = (length: number) => Array.from({length}, (_, i) => i);
const square = (length: number) => range(length).map(() => range(length).fill(0));

(async () => {
    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ]
    const panels = square(1000);
    const visited = new Set<string>();

    let x = 500;
    let y = 500;
    let directionIdx = 0;

    const ioIn = new IOContainer();
    const ioOut = new IOContainer();

    let halted = false;
    interpretIntcode(input, ioIn, ioOut).then(() => halted = true);

    while (!halted) {
        visited.add(`${x},${y}`);
        ioIn.write(panels[x][y]);
        panels[x][y] = Number(await ioOut.read());

        directionIdx += await ioOut.read() ? 1 : -1;
        const [dx, dy] = directions[((directionIdx % 4) + 4) % 4];
        x += dx;
        y += dy;
    }

    console.log(`Visited ${visited.size} unique squares`);
})();