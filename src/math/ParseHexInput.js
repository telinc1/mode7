const INPUT_REGEX = /^(-?[a-z]+ +)?(-?[0-9a-f.]+)$/i;

const TAU = Math.PI * 2;
const DEG_TO_RAD = Math.PI / 180;

const VALID_FUNCTIONS = [
    "abs", "cbrt", "ceil", "clz32", "cos", "cosh", "cot", "csc", "exp",
    "expm1", "floor", "fround", "log", "log10", "log1p", "log2", "random",
    "round", "sign", "sec", "sin", "sinh", "sqrt", "tan", "tanh", "trunc"
];

const ANGLE_FUNCTIONS = ["cos", "cot", "csc", "sec", "sin", "tan"];

const FUNCTIONS = {
    cot: x => 1 / Math.tan(x),
    csc: x => 1 / Math.sin(x),
    sec: x => 1 / Math.cos(x)
};

export function ParseHexInput(input, decimal = 1){
    const matches = INPUT_REGEX.exec(input.trim());

    if(matches == null){
        return 0;
    }

    let result = Number.NaN;

    if(matches[1] == null){
        result = (matches[2].indexOf(".") === -1)
            ? parseInt(matches[2], 16)
            : Math.round(Number(matches[2]) * decimal);
    }else{
        let number = Number(matches[2]);

        if(Number.isNaN(number)){
            return 0;
        }

        const lead = matches[1].trim();
        const sign = (lead[0] === "-") ? -1 : 1;
        const name = (sign === -1) ? lead.slice(1) : lead;

        if(VALID_FUNCTIONS.indexOf(name) === -1){
            return 0;
        }

        if(ANGLE_FUNCTIONS.indexOf(name) !== -1){
            number = (number >= TAU) ? number * DEG_TO_RAD : number;
        }

        const func = FUNCTIONS[name] || Math[name];
        result = Math.round(func(number) * sign * decimal);
    }

    if(Number.isNaN(result)){
        return 0;
    }

    result = Math.round(result * decimal) / decimal;
    return (result >= 0x8000) ? -((result ^ 0xFFFF) + 1) : result;
}
