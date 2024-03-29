import {Entry} from "./Entry";

export class Keyframe {
    constructor(simulator){
        this.simulator = simulator;

        this.position = 0;

        this.previousEntry = null;
        this.nextEntry = new Entry(256);
        this.nextEntry.previousEntry = this;
    }
}
