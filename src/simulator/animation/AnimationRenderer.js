import {FrameEntry} from "./FrameEntry";

export class AnimationRenderer {
    constructor(keyframes){
        this.keyframes = keyframes;
        this.animation = null;
    }

    render(){
        this.animation = [];

        this.keyframes.forEach((keyframe) => {
            let entry = keyframe.nextEntry.begin();
            let scanline = new FrameEntry();

            this.animation.push({keyframe, entry: scanline});

            for(let y = 0; y < 255; y++){
                scanline.calculated = Object.assign({}, entry.values);
                scanline.settings = entry.settings;

                const nextScanline = new FrameEntry();
                nextScanline.previousEntry = scanline;
                scanline.nextEntry = nextScanline;
                scanline = nextScanline;

                entry = entry.nextScanline();
            }

            scanline.previousEntry.nextEntry = null;
        });

        return this.animation;
    }
}
