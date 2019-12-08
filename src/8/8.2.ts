import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '8.input'), {encoding: 'utf-8'});

const chunk = <T>(array: T[], chunkSize: number) =>
    Array(Math.ceil(array.length / chunkSize))
        .fill(0)
        .map((_, index) => index * chunkSize)
        .map(begin => array.slice(begin, begin + chunkSize));

const width = 25;
const height = 6;
const chunks = chunk(input.split(''), width * height);

const image = Array.from({length: height}).map(() => Array.from({length: width}));

chunks.forEach(chunk => chunk.map((value, idx) => {
    const x = Math.floor(idx / width);
    const y = idx % width;
    if (image[x][y] || value === '2') return;
    image[x][y] = value === '1' ? 'X' : ' ';
}));

console.log(image.map(line => line.join('')).join('\n'));
