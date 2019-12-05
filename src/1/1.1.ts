import * as fs from 'fs';
import * as path from 'path';

const getRequiredFuel = (mass: number) => Math.floor(mass / 3) - 2;

const getTotalRequiredFuel = (masses: number[]) => masses.reduce((sum, mass) => sum += getRequiredFuel(mass), 0);

const input = fs.readFileSync(path.join(__dirname, '1.input'), {encoding: 'utf-8'}).split('\n').map(v => +v);

console.log(`Total required fuel is ${getTotalRequiredFuel(input)}`);
