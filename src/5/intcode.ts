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

export const interpretIntcode = async (intCode: string, input: IOContainer, output: IOContainer): Promise<void> => {
    const nextIntcodeState = async (band: number[], offset: number): Promise<[number[], number]> => {
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
                writeBand(copy, offset + 1, await input.read());
                break;
            case OpCodes.Write:
                //console.log('OUT:', parameters[0]);
                output.write(parameters[0]);
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
    let band = intCode.split(',').map(v => +v);
    let next;
    const outputs = [];

    while (true) {
        [next, offset] = await nextIntcodeState(band, offset);
        if (output) outputs.push(output);
        if (next === band) return

        band = next;
    }
}

export class IOContainer {
    private state: number[] = [...this.input];
    private position: number = 0;
    private isWaiting: boolean = false;
    private signal: any = undefined;

    constructor(private input: number[] = []) {}

    write(value: number) {
        this.state.push(value);
        
        if (this.isWaiting) {
            this.signal();
            this.isWaiting = false;
            this.signal = undefined;
        }
    }

    async read() {
        if (this.position < this.state.length) return this.state[this.position++];
        if (this.isWaiting) throw new Error('does not support two reads at once');

        this.isWaiting = true;
        await new Promise(res => this.signal = res);
        return this.state[this.position++];
    }
}
