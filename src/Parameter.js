import {Constant} from "./functions/Constant";

const {hasOwnProperty} = Object.prototype;

export class Parameter {
    constructor(...args){
        this.func = Constant;

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
}
