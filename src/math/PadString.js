export function PadString(string, length, character = " "){
    return (string.length >= length) ? string : new Array(1 + length - string.length).join(character) + string;
}
