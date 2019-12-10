import * as fs from 'fs';
import * as path from 'path';
import {interpretIntcode, IOContainer} from '../5/intcode';
import {permute} from './permute';

const intCode = fs.readFileSync(path.join(__dirname, '7.input'), {encoding: 'utf-8'});

const appendIoContainers = (phases: number[]): [number[], IOContainer[]] => [
    phases,
    [
        new IOContainer([phases[0], 0]),
        new IOContainer([phases[1]]),
        new IOContainer([phases[2]]),
        new IOContainer([phases[3]]),
        new IOContainer([phases[4]])
    ]
];

(async () => {
    const res = (
        await Promise.all(
            permute([5, 6, 7, 8, 9])
                .map(appendIoContainers)
                .map(async ([phases, units]): Promise<[number[], bigint]> => {
                    await Promise.all(units.map((unit, idx) => interpretIntcode(intCode, unit, units[(idx + 1) % 5])));
                    return [phases, await units[0].read()];
                })
        )
    ).sort((a, b) => a[1] < b[1] ? 1 : -1)[0]
    console.log(`The maximum of ${res[1]} is achieved with phases ${res[0]}`);
})();
