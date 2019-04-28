import {CanvasRenderer} from "./renderer/CanvasRenderer";
import {Entry} from "./Entry";
import {GetElement} from "../dom/GetElement";

import {Parameter} from "./Parameter";
import {Linear} from "../math/functions/Linear";

export class Simulator {
    constructor(tilemap, canvas){
        this.tilemap = GetElement(tilemap, Image);

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an Image, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, canvas);
        this.previousEntry = null;
        this.nextEntry = new Entry(224);

        this.nextEntry.previousEntry = this;

        this.onTilemapLoad = this.refresh.bind(this);
        this.tilemap.addEventListener("load", this.onTilemapLoad);
    }

    refresh(){
        this.renderer.render(this.nextEntry);
    }
}
