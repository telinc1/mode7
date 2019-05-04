import {Parameter} from "./Parameter";

const INDEX_POINT = {x: 0, y: 0};

export class Entry {
    constructor(scanlines, parameters = {}){
        this.scanlines = scanlines - 1;
        this.scanline = 0;
        this.parameters = {};
        this.values = {};
        this.settings = 0;

        this.wrapPoint = this.wrapToTilemap;

        this.previousEntry = null;
        this.nextEntry = null;

        this.createParameter(parameters, "matrixA", -128, 128, 1);
        this.createParameter(parameters, "matrixB", -128, 128);
        this.createParameter(parameters, "matrixC", -128, 128);
        this.createParameter(parameters, "matrixD", -128, 128, 1);
        this.createParameter(parameters, "offsetX", -4096, 4095);
        this.createParameter(parameters, "offsetY", -4096, 4095);
        this.createParameter(parameters, "centerX", -4096, 4095);
        this.createParameter(parameters, "centerY", -4096, 4095);
    }

    begin(){
        this.scanline = 0;
        this.updateValues();

        const {values, settings} = this;
        values.flipX = (settings & 0x1) !== 0;
        values.flipY = (settings & 0x2) !== 0;

        if((settings & 0x80) === 0){
            this.wrapPoint = this.wrapToTilemap;
        }else{
            this.wrapPoint = ((settings & 0x40) === 0) ? this.wrapToFixed : this.wrapToFirstTile;
        }

        return this;
    }

    nextScanline(){
        this.scanline += 1;

        if(this.scanline > this.scanlines){
            this.scanline = this.scanlines;

            if(this.nextEntry != null){
                return this.nextEntry.begin();
            }
        }

        this.updateValues();
        return this;
    }

    transform(screenX, screenY, point = {}){
        const {values} = this;
        const {matrixA, matrixB, matrixC, matrixD, offsetX, offsetY, centerX, centerY} = values;

        if(values.flipX){
            screenX = 256 - screenX;
        }

        if(values.flipY){
            screenY = 256 - screenY;
        }

        point.x = Math.round(
            matrixA * (screenX + offsetX - centerX) + matrixB * (screenY + offsetY - centerY) + centerX
        );

        point.y = Math.round(
            matrixC * (screenX + offsetX - centerX) + matrixD * (screenY + offsetY - centerY) + centerY
        );

        return point;
    }

    transformToPixelIndex(screenX, screenY, point = INDEX_POINT){
        const {x, y} = this.wrapPoint(this.transform(screenX, screenY, INDEX_POINT), INDEX_POINT);
        return x + y * 1024;
    }

    wrapToTilemap({x, y}, out = {}){
        out.x = (x >= 0) ? x % 1024 : (x % 1024 + 1024) % 1024;
        out.y = (y >= 0) ? y % 1024 : (y % 1024 + 1024) % 1024;
        return out;
    }

    wrapToFirstTile({x, y}, out = {}){
        if(x < 0 || x >= 1024 || y < 0 || y >= 1024){
            out.x = (x >= 0) ? x % 8 : (x % 8 + 8) % 8;
            out.y = (y >= 0) ? y % 8 : (y % 8 + 8) % 8;
        }else{
            out.x = x;
            out.y = y;
        }

        return out;
    }

    wrapToFixed({x, y}, out = {}){
        if(x < 0 || x >= 1024 || y < 0 || y >= 1024){
            out.x = Number.NaN;
            out.y = Number.NaN;
        }else{
            out.x = x;
            out.y = y;
        }

        return out;
    }

    createParameter(parameters, name, min, max, fallback = 0){
        const parameter = parameters[name];

        if(parameter instanceof Parameter){
            this.parameters[name] = parameter.setRange(min, max);
            return;
        }

        if(typeof parameter === "number"){
            this.parameters[name] = new Parameter(parameter).setRange(min, max);
            return;
        }

        this.parameters[name] = new Parameter(fallback).setRange(min, max);
    }

    updateValues(){
        const {parameters, values} = this;
        const progress = this.scanline / this.scanlines;

        values.matrixA = parameters.matrixA.getValue(progress);
        values.matrixB = parameters.matrixB.getValue(progress);
        values.matrixC = parameters.matrixC.getValue(progress);
        values.matrixD = parameters.matrixD.getValue(progress);
        values.offsetX = parameters.offsetX.getValue(progress);
        values.offsetY = parameters.offsetY.getValue(progress);
        values.centerX = parameters.centerX.getValue(progress);
        values.centerY = parameters.centerY.getValue(progress);
    }
}
