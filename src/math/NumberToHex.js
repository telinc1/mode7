export function NumberToHex(input){
    const number = (input >= 0) ? input : (Math.abs(input) ^ 0xFFFF) + 1;
    const hex = Math.round(number).toString(16).toUpperCase();

    return (hex.length >= 4) ? hex : new Array(5 - hex.length).join("0") + hex;
}
