import {CanvasRenderer} from "./CanvasRenderer";
import {GetElement} from "./GetElement";

const TEMP_ENTRY = {
    matrixA: 1.1796875,
    matrixB: 0.17578125,
    matrixC: -0.23046875,
    matrixD: 1.52734375,
    offsetX: 224,
    offsetY: 401,
    centerX: 442,
    centerY: 432
};

export class Simulator {
    constructor(tilemap, canvas){
        this.tilemap = GetElement(tilemap, Image);

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an Image, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, canvas);

        this.onTilemapLoad = this.render.bind(this);
        this.tilemap.addEventListener("load", this.onTilemapLoad);
    }

    transform(entry = TEMP_ENTRY, x, y){
        const {offsetX, offsetY, centerX, centerY} = entry;
        const resultX = entry.matrixA * (x + offsetX - centerX) + entry.matrixB * (y + offsetY - centerY) + centerX;
        const resultY = entry.matrixC * (x + offsetX - centerX) + entry.matrixD * (y + offsetY - centerY) + centerY;

        return Math.floor(resultX) + Math.floor(resultY) * 1024;
    }

    render(){
        return this.renderer.render();
    }
}
