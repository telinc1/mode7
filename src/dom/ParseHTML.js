export function ParseHTML(html){
    if(!("DOMParser" in window)){
        const container = document.createElement("div");
        container.innerHTML = html;

        return container;
    }

    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html").body;
}
