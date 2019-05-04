import {PadString} from "./PadString";

export function NumberToHex(input){
    const number = (input >= 0) ? input : (Math.abs(input) ^ 0xFFFF) + 1;
    return PadString(Math.round(number).toString(16).toUpperCase(), 4, "0");
}
