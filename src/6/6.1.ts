import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '6.input'), {encoding: 'utf-8'})
    .split('\r\n')
    .map(raw => raw.split(')') as [string, string])
    .reduce((res, [nodeA, nodeB]) => ({...res, [nodeA]: [...(res[nodeA] || []), nodeB]}), {} as {[key: string]: string[]});

function* getDepths(objectName: string, depth: number = 0): IterableIterator<number> {
    yield depth;
    const entry = input[objectName];
    if (!entry) return;

    for (let e of entry) yield* getDepths(e, depth + 1);
}

const totalOrbits = [...getDepths('COM')].reduce((sum, depth) => sum += depth, 0);
console.log(`There is a total number of ${totalOrbits} orbits`);
