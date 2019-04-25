import {Simulator} from "./Simulator";

document.addEventListener("DOMContentLoaded", function(){
    const simulator = new Simulator("tilemap", "screen");
    const tilemap = simulator.tilemap;

    const tilemapImage = document.querySelector("#tilemap-image > img");

    $("#tilemap-image-tab").on("show.bs.tab", (event) => {
        tilemapImage.src = tilemap.src;
    });

    Array.prototype.forEach.call(document.getElementById("tilemap-choices").children, (item) => {
        const image = item.firstElementChild;

        if(!(image instanceof HTMLImageElement)){
            return;
        }

        image.addEventListener("click", (event) => {
            tilemap.src = image.src;
        });
    });

    simulator.render();

    tilemapImage.src = tilemap.src;
});
