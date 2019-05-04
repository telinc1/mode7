import {CanvasRenderer} from "./renderer/CanvasRenderer";
import {Color} from "./Color";
import {Entry} from "./Entry";
import {GetElement} from "../dom/GetElement";

import {Parameter} from "./Parameter";
import {Linear} from "../math/functions/Linear";

export class Simulator {
    constructor(source, tilemap, screen){
        this.source = GetElement(source, Image);
        this.tilemap = GetElement(tilemap, HTMLCanvasElement);

        if(this.source == null){
            throw new Error(`The tilemap source must be an Image, ${typeof this.source} provided.`);
        }

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an HTMLCanvasElement, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, screen);

        this.previousEntry = null;
        this.nextEntry = new Entry(256);
        this.nextEntry.previousEntry = this;

        this.colors = {
            fixed: new Color(),
            real: new Color(0, 0, 255),
            virtual: new Color(255, 0, 0, 102)
        };

        this.onSourceLoad = this.refresh.bind(this);
        this.source.addEventListener("load", this.onSourceLoad);
    }

    refresh(){
        this.renderer.render(this.nextEntry);
    }
}
