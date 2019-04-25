import {GetElement} from "./GetElement";

export class CanvasRenderer {
    constructor(simulator, canvas){
        this.simulator = simulator;
        this.canvas = GetElement(canvas, HTMLCanvasElement);

        if(this.canvas == null){
            throw new Error(`The canvas must be a canvas element, ${typeof this.canvas} provided.`);
        }

        this.context = this.canvas.getContext("2d");
    }

    render(){
        this.context.drawImage(this.simulator.tilemap, 0, 0);
    }
}
