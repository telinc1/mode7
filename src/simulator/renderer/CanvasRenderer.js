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

        const top = [];
        const right = [];
        const bottom = [];
        const left = [];

        let entry = firstEntry.begin();

        for(let x = 0; x < 256; x++){
            const point = entry.transform(x, 0);
            point.entry = entry;

            top.push(point);
        }

        const {isNaN} = Number;

        for(let y = 0; y < 224; y++){
            const leftPoint = entry.transform(0, y);
            leftPoint.entry = entry;

            const rightPoint = entry.transform(255, y);
            rightPoint.entry = entry;

            left.push(leftPoint);
            right.push(rightPoint);

            for(let x = 0; x < 256; x++){
                const screenIndex = (y * 256 + x) * 4;
                const tilemapIndex = entry.transformToPixelIndex(x, y) * 4;

                if(isNaN(tilemapIndex)){
                    screenPixels[screenIndex] = 0;
                    screenPixels[screenIndex + 1] = 0;
                    screenPixels[screenIndex + 2] = 0;
                    screenPixels[screenIndex + 3] = 255;
                }else{
                    screenPixels[screenIndex] = tilemapPixels[tilemapIndex];
                    screenPixels[screenIndex + 1] = tilemapPixels[tilemapIndex + 1];
                    screenPixels[screenIndex + 2] = tilemapPixels[tilemapIndex + 2];
                    screenPixels[screenIndex + 3] = tilemapPixels[tilemapIndex + 3];
                }
            }

            entry = entry.nextScanline();
        }

        for(let x = 0; x < 256; x++){
            const point = entry.transform(x, 223);
            point.entry = entry;

            bottom.push(point);
        }

        screen.putImageData(screenData, 0, 0);

        this.drawScreenBorder(tilemap, top);
        this.drawScreenBorder(tilemap, right);
        this.drawScreenBorder(tilemap, bottom);
        this.drawScreenBorder(tilemap, left);
    }

    drawScreenBorder(context, points){
        let currentColor = null;
        let currentRegionX = Number.NaN;
        let currentRegionY = Number.NaN;
        let currentEntry = null;

        context.beginPath();
        context.lineWidth = 5;

        points.forEach((point) => {
            const {x, y, entry} = point;
            const regionX = Math.floor(point.x / 1024);
            const regionY = Math.floor(point.y / 1024);

            let color = ((entry.settings & 0x80) !== 0 && (regionX !== 0 || regionY !== 0))
                ? "rgba(255, 0, 0, 0.4)"
                : "#00f";

            entry.wrapToTilemap(point);

            if(
                currentColor !== color
                || currentRegionX !== regionX
                || currentRegionY !== regionY
                || currentEntry !== entry
            ){
                context.stroke();

                context.beginPath();
                context.strokeStyle = color;
                context.moveTo(point.x, point.y);

                currentColor = color;
                currentRegionX = regionX;
                currentRegionY = regionY;
                currentEntry = entry;
            }else{
                context.lineTo(point.x, point.y);
            }
        });

        context.stroke();
    }
}
