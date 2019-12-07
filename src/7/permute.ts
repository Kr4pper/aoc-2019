// from https://stackoverflow.com/a/37580979
export function permute<T>(list: T[]): T[][] {
    var length = list.length,
        result = [list.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = list[i];
            list[i] = list[k];
            list[k] = p;
            ++c[i];
            i = 1;
            result.push(list.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}
