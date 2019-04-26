import {Parameter} from "./Parameter";

export class Entry {
    constructor(scanlines, parameters = {}){
        this.scanlines = scanlines - 1;
        this.scanline = 0;
        this.parameters = {};
        this.values = {};
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

    transform(x, y){
        const {matrixA, matrixB, matrixC, matrixD, offsetX, offsetY, centerX, centerY} = this.values;
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
