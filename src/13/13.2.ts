import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';

const input = fs.readFileSync(path.join(__dirname, '13.input'), {encoding: 'utf-8'});
const [_, ...rest] = input.split(',');
const _input = [2, ...rest].join(',');
const range = (length: number) => Array.from({length}, (_, i) => i);

enum Tile {
    Empty,
    Wall,
    Block,
    Paddle,
    Ball
};

(async () => {
    const tiles = range(24).map(() => []);
    const ioIn = new IOContainer();
    const ioOut = new IOContainer();
    let ball = [0, 0];
    let paddle = [0, 0];
    let score = 0;

    let halted = false;
    interpretIntcode(_input, ioIn, ioOut).then(() => halted = true);
    do {
        const [x, y, signal] = [await ioOut.read(), await ioOut.read(), await ioOut.read()].map(Number);
        tiles[y][x] = signal;
        ioIn.clear();

        if (x === -1 && y === 0 && signal > Tile.Ball) score = signal;
        if (signal === Tile.Ball) {
            ball = [x, y];
            ioIn.write(paddle[0] < ball[0] ? 1 : paddle[0] === ball[0] ? 0 : -1);
        }
        if (signal === Tile.Paddle) paddle = [x, y];
    } while (!halted || !ioOut.empty)

    console.log(`Final score: ${score}`);
})();