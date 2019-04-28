export function GetElement(input, expected = null){
    let element = input;

    if(typeof input === "string"){
        element = document.getElementById(input);
    }

    if(element == null || (expected != null && !(element instanceof expected))){
        return null;
    }

    return element;
}
