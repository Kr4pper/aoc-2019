import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';

const input = fs.readFileSync(path.join(__dirname, '13.input'), {encoding: 'utf-8'});
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

    await interpretIntcode(input, ioIn, ioOut);
    const output = [...ioOut['state'].map(Number)];
    while (output.length) {
        const x = output.shift();
        const y = output.shift();
        const signal = output.shift();
        tiles[y][x] = signal;
    }

    console.log(`There are ${tiles.reduce((res, row) => res + row.filter(v => v === Tile.Block).length, 0)} block tiles`);
    //console.log(tiles.map(row => row.join('')).join('\n'));
})();