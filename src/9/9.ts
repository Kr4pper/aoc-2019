import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';

const input = fs.readFileSync(path.join(__dirname, '9.input'), {encoding: 'utf-8'});

(async () => await Promise.all([1, 2].map(async problem => {
    const output = new IOContainer();
    await interpretIntcode(input, new IOContainer([problem]), output);
    console.log(`Problem ${problem}: ${await output.read()}`);
})))();
