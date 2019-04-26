import {GetElement} from "./GetElement";

export class CanvasRenderer {
    constructor(simulator, canvas){
        this.simulator = simulator;
        this.canvas = GetElement(canvas, HTMLCanvasElement);

        if(this.canvas == null){
            throw new Error(`The canvas must be a canvas element, ${typeof this.canvas} provided.`);
        }

        this.context = this.canvas.getContext("2d");

        this.buffer = document.createElement("canvas");
        this.buffer.width = 1024;
        this.buffer.height = 1024;

        this.bufferContext = this.buffer.getContext("2d");
    }

    render(firstEntry){
        const {canvas, context, bufferContext} = this;

        bufferContext.clearRect(0, 0, 1024, 1024);
        bufferContext.drawImage(this.simulator.tilemap, 0, 0);

        const pixels = bufferContext.getImageData(0, 0, 1024, 1024).data;
        const screen = context.createImageData(256, 224);
        const {data} = screen;

        let entry = firstEntry.begin();

        for(let y = 0; y < 224; y++){
            for(let x = 0; x < 256; x++){
                const screenIndex = (y * 256 + x) * 4;
                const pixelIndex = entry.transform(x, y) * 4;

                data[screenIndex] = pixels[pixelIndex];
                data[screenIndex + 1] = pixels[pixelIndex + 1];
                data[screenIndex + 2] = pixels[pixelIndex + 2];
                data[screenIndex + 3] = pixels[pixelIndex + 3];
            }

            entry = entry.nextScanline();
        }

        context.putImageData(screen, 0, 0);
    }
}
