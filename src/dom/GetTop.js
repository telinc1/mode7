export function GetTop(element){
    let top = 0;
    let current = element;

    while(current != null){
        top += current.offsetTop;
        current = current.offsetParent;
    }

    return (top >= 0) ? top : 0;
}
