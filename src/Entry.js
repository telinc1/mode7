import {Parameter} from "./Parameter";

export class Entry {
    constructor(scanlines, parameters = {}){
        this.scanlines = scanlines - 1;
        this.scanline = 0;
        this.parameters = {};
        this.nextEntry = null;

        this.createParameter(parameters, "matrixA", -32768, 32767, 256);
        this.createParameter(parameters, "matrixB", -32768, 32767);
        this.createParameter(parameters, "matrixC", -32768, 32767);
        this.createParameter(parameters, "matrixD", -32768, 32767, 256);
        this.createParameter(parameters, "offsetX", -4096, 4095);
        this.createParameter(parameters, "offsetY", -4096, 4095);
        this.createParameter(parameters, "centerX", -4096, 4095);
        this.createParameter(parameters, "centerY", -4096, 4095);
    }

    begin(){
        this.scanline = 0;
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

        return this;
    }

    transform(x, y){
        const {parameters} = this;
        const progress = this.scanline / this.scanlines;

        const matrixA = parameters.matrixA.getValue(progress) / 256;
        const matrixB = parameters.matrixB.getValue(progress) / 256;
        const matrixC = parameters.matrixC.getValue(progress) / 256;
        const matrixD = parameters.matrixD.getValue(progress) / 256;
        const offsetX = parameters.offsetX.getValue(progress);
        const offsetY = parameters.offsetY.getValue(progress);
        const centerX = parameters.centerX.getValue(progress);
        const centerY = parameters.centerY.getValue(progress);

        const resultX = matrixA * (x + offsetX - centerX) + matrixB * (y + offsetY - centerY) + centerX;
        const resultY = matrixC * (x + offsetX - centerX) + matrixD * (y + offsetY - centerY) + centerY;

        return Math.floor(resultX) + Math.floor(resultY) * 1024;
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
}
