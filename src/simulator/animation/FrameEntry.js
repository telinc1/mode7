import {Entry} from "../Entry";

export class FrameEntry extends Entry {
    constructor(){
        super(1);
        this.parameters = null;

        this.progress = 0;
        this.nextFrame = null;
    }

    nextScanline(){
        if(this.nextEntry == null){
            return this;
        }

        this.nextEntry.progress = this.progress;
        this.nextEntry.nextFrame = this.nextFrame.nextEntry;

        return this.nextEntry.begin();
    }

    updateValues(){
        Object.keys(this.calculated).forEach((key) => {
            const start = this.calculated[key];
            const end = this.nextFrame.calculated[key];

            this.values[key] = start + this.progress * (end - start);
        });
    }
}
