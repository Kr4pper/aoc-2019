const matchesRules = (code: string): boolean => {
    const digits = code.split('');
    if (digits.some((digit, i) => digit > digits[i+1])) return false;

    for (let i = 0; i < code.length; i++) {
        if (code[i] === code[i+1] && code[i] !== code[i+2]) return true;
        while (code[i] === code[i+1]) i++; // skip over triplets etc
    }
};

let matches = 0;
for (let i = 172851; i <= 675869; i++) {
    if (matchesRules(String(i))) {
        console.log(i)
        matches++;
    }
}

console.log(`There are ${matches} matching codes`);
