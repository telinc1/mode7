import {GetElement} from "../../dom/GetElement";

export class CanvasRenderer {
    constructor(simulator, canvas){
        this.simulator = simulator;
        this.canvas = GetElement(canvas, HTMLCanvasElement);

        if(this.canvas == null){
            throw new Error(`The screen must be an HTMLCanvasElement, ${typeof this.canvas} provided.`);
        }

        this.tilemap = this.simulator.tilemap.getContext("2d");
        this.screen = this.canvas.getContext("2d");
    }

    render(firstEntry){
        const {tilemap, screen} = this;

        tilemap.clearRect(0, 0, 1024, 1024);
        tilemap.drawImage(this.simulator.source, 0, 0);

        const tilemapPixels = tilemap.getImageData(0, 0, 1024, 1024).data;
        const screenData = screen.createImageData(256, 224);
        const screenPixels = screenData.data;
        const edges = [];

        let entry = firstEntry.begin();

        for(let y = 0; y < 224; y++){
            edges.push(entry.transform(0, y), entry.transform(255, y));

            for(let x = 0; x < 256; x++){
                const screenIndex = (y * 256 + x) * 4;
                const tilemapIndex = entry.transformToIndex(x, y) * 4;

                screenPixels[screenIndex] = tilemapPixels[tilemapIndex];
                screenPixels[screenIndex + 1] = tilemapPixels[tilemapIndex + 1];
                screenPixels[screenIndex + 2] = tilemapPixels[tilemapIndex + 2];
                screenPixels[screenIndex + 3] = tilemapPixels[tilemapIndex + 3];
            }

            entry = entry.nextScanline();
        }

        screen.putImageData(screenData, 0, 0);

        tilemap.lineWidth = 5;
        tilemap.strokeStyle = "blue";

        tilemap.beginPath();
        tilemap.moveTo(edges[0].x, edges[0].y);

        for(let index = 2; index < edges.length; index += 2){
            tilemap.lineTo(edges[index].x, edges[index].y);
        }

        tilemap.moveTo(edges[1].x, edges[1].y);

        for(let index = 3; index < edges.length; index += 2){
            tilemap.lineTo(edges[index].x, edges[index].y);
        }

        tilemap.moveTo(edges[0].x, edges[0].y);
        tilemap.lineTo(edges[1].x, edges[1].y);

        tilemap.moveTo(edges[446].x, edges[446].y);
        tilemap.lineTo(edges[447].x, edges[447].y);

        tilemap.stroke();
    }
}
