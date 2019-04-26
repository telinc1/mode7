import {CanvasRenderer} from "./CanvasRenderer";
import {Entry} from "./Entry";
import {GetElement} from "./GetElement";

import {Parameter} from "./Parameter";
import {Linear} from "./functions/Linear";

export class Simulator {
    constructor(tilemap, canvas){
        this.tilemap = GetElement(tilemap, Image);

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an Image, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, canvas);
        this.previousEntry = null;
        this.nextEntry = new Entry(224);
        this.dirty = false;

        this.nextEntry.previousEntry = this;

        this.onTilemapLoad = this.render.bind(this);
        this.tilemap.addEventListener("load", this.onTilemapLoad);
    }

    render(){
        return this.renderer.render(this.nextEntry);
    }
}
