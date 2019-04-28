import {GetTop} from "./dom/GetTop";
import {Simulator} from "./simulator/Simulator";
import {UserInterface} from "./simulator/interface/UserInterface";

document.addEventListener("DOMContentLoaded", function(){
    const source = document.createElement("img");
    const tilemap = document.getElementById("tilemap");
    const screen = document.getElementById("screen");

    const simulator = new Simulator(source, tilemap, screen);

    const ui = new UserInterface(simulator);
    ui.addToDOM();

    source.src = "assets/tilemap/grid.png";

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

    const tilemapContainer = document.getElementById("tilemap-container");

    $("#view-modal").on("show.bs.modal", function(event){
        this.querySelector(".modal-body").appendChild(tilemap);
    }).on("hidden.bs.modal", function(event){
        tilemapContainer.appendChild(tilemap);
    });

    $("#change-upload-tab").on("show.bs.tab", (event) => {
        tilemapFileAlert.classList.add("d-none");
    });

    Array.prototype.forEach.call(document.getElementById("tilemap-choices").children, (item) => {
        const image = item.firstElementChild;

        if(!(image instanceof HTMLImageElement)){
            return;
        }

        image.addEventListener("click", (event) => {
            source.src = image.src;
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
            source.src = event.target.result;

            tilemapFileAlert.innerText = "Image selected.";

            const {classList} = tilemapFileAlert;
            classList.add("alert-success");
            classList.remove("alert-danger");
            classList.remove("d-none");
        };

        reader.readAsDataURL(file);
    });

    simulator.refresh();
});
