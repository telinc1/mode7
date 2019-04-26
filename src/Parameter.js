import {Clamp} from "./Clamp";
import {Constant} from "./functions/Constant";

const {hasOwnProperty} = Object.prototype;

export class Parameter {
    constructor(...args){
        this.func = Constant;
        this.min = Number.NEGATIVE_INFINITY;
        this.max = Number.POSITIVE_INFINITY;

        if(args[0] instanceof Function){
            this.func = args.shift();
        }

        this.values = args.map(Number).filter(value => !Number.isNaN(value));

        if(this.values.length === 0){
            this.values.push(0);
        }
    }

    getValue(progress){
        return this.func(progress, this.values);
    }

    setRange(min, max){
        if(min != null){
            this.min = Number(min);
        }

        if(max != null){
            this.max = Number(max);
        }

        const {values} = this;

        for(let index = 0; index < values.length; index++){
            values[index] = Clamp(values[index], min, max);
        }
    }
}
