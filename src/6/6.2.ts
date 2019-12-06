import * as fs from 'fs';
import * as path from 'path';

const input = fs.readFileSync(path.join(__dirname, '6.input'), {encoding: 'utf-8'})
    .split('\r\n')
    .map(raw => raw.split(')') as [string, string])
    .reduce((res, [nodeA, nodeB]) => ({...res, [nodeA]: [...(res[nodeA] || []), nodeB]}), {} as {[key: string]: string[]});

interface Node {
    parent: Node;
    objectName: string;
    depth: number;
}

function* getOrbitsRecursively(objectName: string, depth: number = 0, parent?: Node): IterableIterator<Node> {
    const node = {parent, objectName, depth}
    yield node;
    const entry = input[objectName];
    if (!entry) return;

    for (let e of entry) yield* getOrbitsRecursively(e, depth + 1, node);
}

const orbits = [...getOrbitsRecursively('COM')];
const you = orbits.find(o => o.objectName === 'YOU');
const santa = orbits.find(o => o.objectName === 'SAN');

const flattenParents = (node: Node): string[] => {
    let parents = [];
    let parent = node.parent;
    while (parent) {
        parents.push(parent.objectName);
        parent = parent.parent;
    }
    return parents;
}

const youParents = flattenParents(you);
const santaParents = flattenParents(santa);

const fromYou = youParents.findIndex(p => santaParents.indexOf(p) > -1);
const fromSanta = santaParents.indexOf(youParents[fromYou]);
const orbitChangesRequired = fromYou + fromSanta;
console.log(`A total of ${fromYou}+${fromSanta}=${orbitChangesRequired} orbit swaps is required`);
