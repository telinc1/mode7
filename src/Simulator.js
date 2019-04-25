import {CanvasRenderer} from "./CanvasRenderer";
import {GetElement} from "./GetElement";

export class Simulator {
    constructor(tilemap, canvas){
        this.tilemap = GetElement(tilemap, Image);

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an Image, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, canvas);
    }

    render(){
        return this.renderer.render();
    }
}
