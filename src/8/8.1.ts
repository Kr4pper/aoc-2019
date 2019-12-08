import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '8.input'), {encoding: 'utf-8'});

const chunk = <T>(array: T[], chunkSize: number) =>
    Array(Math.ceil(array.length / chunkSize))
        .fill(0)
        .map((_, index) => index * chunkSize)
        .map(begin => array.slice(begin, begin + chunkSize));

const chunks = chunk(input.split(''), 25 * 6);

const countOccurences = (str: string, char: string): number => (str.match(new RegExp(`${char}`, 'g')) || []).length

const lowestZeroes = chunks.sort((a, b) => countOccurences(a.join(), '0') > countOccurences(b.join(), '0') ? 1 : -1)[0];
console.log(countOccurences(lowestZeroes.join(), '1') * countOccurences(lowestZeroes.join(), '2'));
