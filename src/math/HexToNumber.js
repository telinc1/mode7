export function HexToNumber(hex){
    const number = parseInt(hex, 16);

    if(Number.isNaN(number)){
        return 0;
    }

    return (number >= 0x8000) ? -((number ^ 0xFFFF) + 1) : number;
}
