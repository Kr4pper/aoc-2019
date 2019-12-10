enum OpCodes {
    Add = 1,
    Multiply,
    Read,
    Write,
    JumpIfTrue,
    JumpIfFalse,
    LessThan,
    Equals,
    RelativeBaseOffset,
    Halt = 99,
}

interface Operation {
    opCode: OpCodes;
    opSize: number;
}

enum ParameterModes {
    Position,
    Immediate,
    Relative,
}

type BigIntTable = {[idx: number]: bigint};

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
const decodeOperation = (operation: bigint): [OpCodes, ParameterModes[]] => {
    const _operation = String(operation);
    const opCode = +_operation.slice(-2);
    const modes = _operation.slice(0, -2).split('').reverse().map(Number);
    return [opCode, modes];
};

const getOpSize = (opCode: OpCodes) => {
    switch (opCode) {
        case OpCodes.Add: return 4;
        case OpCodes.Multiply: return 4;
        case OpCodes.Read: return 2;
        case OpCodes.Write: return 2;
        case OpCodes.JumpIfTrue: return 3;
        case OpCodes.JumpIfFalse: return 3;
        case OpCodes.LessThan: return 4;
        case OpCodes.Equals: return 4;
        case OpCodes.RelativeBaseOffset: return 2;
        case OpCodes.Halt: return 0;
    }
}

const range = (length: number) => Array.from({length}, (_, i) => i);

export const interpretIntcode = async (intCode: string, input: IOContainer, output: IOContainer): Promise<void> => {
    const readBand = (relativeOffset: number = 0, mode: ParameterModes = ParameterModes.Position) => {
        const address = band[offset + relativeOffset];
        switch (mode) {
            case ParameterModes.Position:
                return band[Number(address)] || 0n;
            case ParameterModes.Immediate:
                return BigInt(address);
            case ParameterModes.Relative:
                return band[relativeBase + Number(address)] || 0n;
        }
    }

    const writeBand = (value: number | bigint, relativeOffset: number = 0, mode: ParameterModes = ParameterModes.Position) =>
        band[Number(band[offset + relativeOffset]) + (mode === ParameterModes.Relative ? relativeBase : 0)] = BigInt(value);

    let offset = 0;
    let relativeBase = 0;
    let band: BigIntTable = intCode.split(',').reduce((res, value, idx) => ({...res, [idx]: BigInt(value)}), {});

    while (true) {
        const [opCode, modes] = decodeOperation(band[offset]);
        const parameters = range(getOpSize(opCode) - 1).map(i => readBand(i + 1, modes[i]));
        let newOffset = offset + getOpSize(opCode);

        switch (opCode) {
            case OpCodes.Halt:
                return;
            case OpCodes.Add:
                writeBand(parameters[0] + parameters[1], 3, modes[2]);
                break;
            case OpCodes.Multiply:
                writeBand(parameters[0] * parameters[1], 3, modes[2]);
                break;
            case OpCodes.Read:
                writeBand(await input.read(), 1, modes[0]);
                break;
            case OpCodes.Write:
                //console.log('OUT:', parameters[0]);
                output.write(parameters[0]);
                break;
            case OpCodes.JumpIfTrue:
                if (parameters[0] !== 0n) newOffset = Number(parameters[1]);
                break;
            case OpCodes.JumpIfFalse:
                if (parameters[0] === 0n) newOffset = Number(parameters[1]);
                break;
            case OpCodes.LessThan:
                writeBand(parameters[0] < parameters[1] ? 1 : 0, 3, modes[2]);
                break;
            case OpCodes.Equals:
                writeBand(parameters[0] === parameters[1] ? 1 : 0, 3, modes[2]);
                break;
            case OpCodes.RelativeBaseOffset:
                relativeBase += Number(parameters[0]);
                break;
            default:
                console.log('Unhandled opCode', opCode);
                throw new Error(opCode);
        }

        offset = newOffset;
    }
}

export class IOContainer {
    private state: bigint[] = [...this.input].map(BigInt);
    private position: number = 0;
    private isWaiting: boolean = false;
    private unblock: () => void;

    constructor(private input: (number | bigint)[] = []) {}

    write(value: bigint) {
        this.state.push(value);

        if (this.isWaiting) {
            this.unblock();
            this.isWaiting = false;
            this.unblock = undefined;
        }
    }

    async read() {
        if (this.position < this.state.length) return this.state[this.position++];
        if (this.isWaiting) throw new Error('does not support two reads at once');
        this.isWaiting = true;
        await new Promise(resolve => this.unblock = resolve);
        return this.state[this.position++];
    }
}
