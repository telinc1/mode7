export function GetLeft(element){
    let left = 0;
    let current = element;

    while(current != null){
        left += current.offsetLeft;
        current = current.offsetParent;
    }

    return (left >= 0) ? left : 0;
}
