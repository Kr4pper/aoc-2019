import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';
import {permute} from './permute';

const intCode = fs.readFileSync(path.join(__dirname, '7.input'), {encoding: 'utf-8'});

(async () => {
    const res = (
        await Promise.all(
            permute([0, 1, 2, 3, 4])
                .map(async phases => [
                    phases,
                    await phases.reduce(async (last, phase) => {
                        const output = new IOContainer([]);
                        await interpretIntcode(intCode, new IOContainer([phase, await last]), output);
                        return await output.read();
                    }, Promise.resolve(0n))
                ])
        )
    ).sort((a, b) => a[1] < b[1] ? 1 : -1)[0];
    console.log(`The maximum of ${res[1]} is achieved with phases ${res[0]}`);
})();
