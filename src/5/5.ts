const input = '3,225,1,225,6,6,1100,1,238,225,104,0,1102,91,92,225,1102,85,13,225,1,47,17,224,101,-176,224,224,4,224,1002,223,8,223,1001,224,7,224,1,223,224,223,1102,79,43,225,1102,91,79,225,1101,94,61,225,1002,99,42,224,1001,224,-1890,224,4,224,1002,223,8,223,1001,224,6,224,1,224,223,223,102,77,52,224,1001,224,-4697,224,4,224,102,8,223,223,1001,224,7,224,1,224,223,223,1101,45,47,225,1001,43,93,224,1001,224,-172,224,4,224,102,8,223,223,1001,224,1,224,1,224,223,223,1102,53,88,225,1101,64,75,225,2,14,129,224,101,-5888,224,224,4,224,102,8,223,223,101,6,224,224,1,223,224,223,101,60,126,224,101,-148,224,224,4,224,1002,223,8,223,1001,224,2,224,1,224,223,223,1102,82,56,224,1001,224,-4592,224,4,224,1002,223,8,223,101,4,224,224,1,224,223,223,1101,22,82,224,1001,224,-104,224,4,224,1002,223,8,223,101,4,224,224,1,223,224,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,8,226,677,224,102,2,223,223,1005,224,329,1001,223,1,223,1007,226,226,224,1002,223,2,223,1006,224,344,101,1,223,223,108,226,226,224,1002,223,2,223,1006,224,359,1001,223,1,223,107,226,677,224,102,2,223,223,1006,224,374,101,1,223,223,8,677,677,224,102,2,223,223,1006,224,389,1001,223,1,223,1008,226,677,224,1002,223,2,223,1006,224,404,101,1,223,223,7,677,677,224,1002,223,2,223,1005,224,419,101,1,223,223,1108,226,677,224,1002,223,2,223,1005,224,434,101,1,223,223,1108,226,226,224,102,2,223,223,1005,224,449,1001,223,1,223,107,226,226,224,102,2,223,223,1005,224,464,101,1,223,223,1007,677,677,224,102,2,223,223,1006,224,479,101,1,223,223,1007,226,677,224,102,2,223,223,1005,224,494,1001,223,1,223,1008,226,226,224,1002,223,2,223,1005,224,509,1001,223,1,223,1108,677,226,224,1002,223,2,223,1006,224,524,1001,223,1,223,108,677,677,224,1002,223,2,223,1005,224,539,101,1,223,223,108,226,677,224,1002,223,2,223,1005,224,554,101,1,223,223,1008,677,677,224,1002,223,2,223,1006,224,569,1001,223,1,223,1107,677,677,224,102,2,223,223,1005,224,584,1001,223,1,223,7,677,226,224,102,2,223,223,1005,224,599,1001,223,1,223,8,677,226,224,1002,223,2,223,1005,224,614,1001,223,1,223,7,226,677,224,1002,223,2,223,1006,224,629,101,1,223,223,1107,677,226,224,1002,223,2,223,1005,224,644,1001,223,1,223,1107,226,677,224,102,2,223,223,1006,224,659,1001,223,1,223,107,677,677,224,1002,223,2,223,1005,224,674,101,1,223,223,4,223,99,226'.split(',').map(v => +v);

const userInput = 5;

enum OpCodes {
    Halt = 99,
    Add = 1,
    Multiply = 2,
    Read = 3,
    Write = 4,
    JumpIfTrue = 5,
    JumpIfFalse = 6,
    LessThan = 7,
    Equals = 8,
}

interface Operation {
    opCode: OpCodes;
    opSize: number;
}

enum ParameterModes {
    Position,
    Immediate,
}

/**
 ABCDE
  1002

    DE - two-digit opcode,      02 == opcode 2
    C - mode of 1st parameter,  0 == position mode
    B - mode of 2nd parameter,  1 == immediate mode
    A - mode of 3rd parameter,  0 == position mode,
                                    omitted due to being a leading zero
    @returns [opCode, modes[]]
 */
const decodeOperation = (operation: number): [OpCodes, ParameterModes[]] => {
    const opCode = operation % 100;
    const modes = String(operation).slice(0, -2).split('').reverse().map(v => +v);
    return [opCode, modes];
};

const getOpSize = (opCode: OpCodes) => {
    switch (opCode) {
        case OpCodes.Halt: return 1;
        case OpCodes.Add: return 4;
        case OpCodes.Multiply: return 4;
        case OpCodes.Read: return 2;
        case OpCodes.Write: return 2;
        case OpCodes.JumpIfTrue: return 3;
        case OpCodes.JumpIfFalse: return 3;
        case OpCodes.LessThan: return 4;
        case OpCodes.Equals: return 4;
    }
}

const readBand = (band: number[], offset: number, mode: ParameterModes = ParameterModes.Position) => {
    switch (mode) {
        case ParameterModes.Position:
            return band[band[offset]];
        case ParameterModes.Immediate:
            return band[offset];
    }
}

const writeBand = (band: number[], offset: number, value: number) => band[band[offset]] = value;

const range = (length: number) => Array.from({length}, (_, i) => i);

const nextIntcodeState = (band: number[], offset: number): [number[], number] => {
    const [opCode, modes] = decodeOperation(band[offset]);
    const copy = [...band];
    const parameters = range(getOpSize(opCode) - 1).map(i => readBand(copy, offset + i + 1, modes[i]));

    let newOffset = offset + getOpSize(opCode);
    switch (opCode) {
        case OpCodes.Halt:
            return [band, newOffset];
        case OpCodes.Add:
            writeBand(copy, offset + 3, parameters[0] + parameters[1]);
            break;
        case OpCodes.Multiply:
            writeBand(copy, offset + 3, parameters[0] * parameters[1]);
            break;
        case OpCodes.Read:
            writeBand(copy, offset + 1, userInput); // un-hardcode ?
            break;
        case OpCodes.Write:
            console.log('OUT:', parameters[0]);
            break;
        case OpCodes.JumpIfTrue:
            if (parameters[0] !== 0) newOffset = parameters[1];
            break;
        case OpCodes.JumpIfFalse:
            if (parameters[0] === 0) newOffset = parameters[1];
            break;
        case OpCodes.LessThan:
            writeBand(copy, offset + 3, parameters[0] < parameters[1] ? 1 : 0);
            break;
        case OpCodes.Equals:
            writeBand(copy, offset + 3, parameters[0] === parameters[1] ? 1 : 0);
            break;
        default:
            console.log('Unhandled opCode', opCode);
    }
    return [copy, newOffset];
}

let offset = 0;
let band = input;
let next;

while (true) {
    [next, offset] = nextIntcodeState(band, offset);
    if (next === band) break;

    band = next;
}
