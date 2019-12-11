import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';

const input = fs.readFileSync(path.join(__dirname, '11.input'), {encoding: 'utf-8'});

const range = (length: number) => Array.from({length}, (_, i) => i);

(async () => {
    const directions = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0],
    ];

    const width = 80;
    const height = 40;
    const panels = range(height).map(() => range(width).fill(0));

    let x = 30;
    let y = 20;
    panels[y][x] = 1;
    let directionIdx = 0;

    const ioIn = new IOContainer();
    const ioOut = new IOContainer();

    let halted = false;
    interpretIntcode(input, ioIn, ioOut).then(() => halted = true);

    while (!halted) {
        ioIn.write(panels[y][x]);
        panels[y][x] = Number(await ioOut.read());

        directionIdx += await ioOut.read() ? 1 : -1;
        const [dx, dy] = directions[((directionIdx % 4) + 4) % 4];
        x += dx;
        y += dy;
    }

    console.log(panels.map(line => line.map(c => c ? 'X' : ' ').join('')).filter(l => l.search('X') > -1).reverse().join('\n'));
})();
