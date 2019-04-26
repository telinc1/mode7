import {GetTop} from "./GetTop";
import {Simulator} from "./Simulator";
import {UserInterface} from "./interface/UserInterface";

document.addEventListener("DOMContentLoaded", function(){
    const tilemap = document.getElementById("tilemap");
    const screen = document.getElementById("screen");

    const simulator = new Simulator(tilemap, screen);

    const ui = new UserInterface(simulator);
    ui.addToDOM();

    const tilemapImage = document.querySelector("#tilemap-image > img");
    const tilemapFile = document.getElementById("tilemap-file");
    const tilemapFileAlert = document.getElementById("tilemap-file-alert");

    const threshold = GetTop(screen) + 0.625 * screen.height;

    document.addEventListener("scroll", () => {
        if(window.pageYOffset > threshold){
            screen.classList.add("fixed");
        }else{
            screen.classList.remove("fixed");
        }
    });

    $("#tilemap-image-tab").on("show.bs.tab", (event) => {
        tilemapImage.src = tilemap.src;
    });

    $("#tilemap-upload-tab").on("show.bs.tab", (event) => {
        tilemapFileAlert.classList.add("d-none");
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

    tilemapFile.addEventListener("change", (event) => {
        const {files} = tilemapFile;

        if(files.length === 0){
            return;
        }

        const file = files[0];

        if(!file.type.startsWith("image/")){
            tilemapFileAlert.innerText = "You must select an image file.";

            const {classList} = tilemapFileAlert;
            classList.add("alert-danger");
            classList.remove("alert-success");
            classList.remove("d-none");

            return;
        }

        tilemapFileAlert.classList.add("d-none");

        const reader = new FileReader();
        reader.onload = (event) => {
            tilemap.src = event.target.result;

            tilemapFileAlert.innerText = "Image selected.";

            const {classList} = tilemapFileAlert;
            classList.add("alert-success");
            classList.remove("alert-danger");
            classList.remove("d-none");
        };

        reader.readAsDataURL(file);
    });

    simulator.refresh();

    tilemapImage.src = tilemap.src;
});
