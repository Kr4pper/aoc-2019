const matchesRules = (code: string): boolean => {
    const digits = code.split('');
    if (digits.some((digit, i) => digit > digits[i+1])) return false;
    return digits.some((digit, i) => digit === digits[i+1]);
};

let matches = 0;
for (let i = 172851; i <= 675869; i++) {
    if (matchesRules(String(i))) matches++;
}

console.log(`There are ${matches} matching codes`);
