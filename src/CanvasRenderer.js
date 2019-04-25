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
        const {transform} = this.simulator;

        for(let y = 0; y < 224; y++){
            for(let x = 0; x < 256; x++){
                this.context.drawImage(this.simulator.tilemap, ...transform(undefined, x, y), 1, 1, x, y, 1, 1);
            }
        }
    }
}
