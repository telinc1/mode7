import {CanvasRenderer} from "./renderer/CanvasRenderer";
import {Color} from "./Color";
import {GetElement} from "../dom/GetElement";
import {Keyframe} from "./Keyframe";

import {AnimationHandler} from "./animation/AnimationHandler";
window.AnimationHandler = AnimationHandler;

export class Simulator {
    constructor(source, tilemap, screen){
        window.simulator = this;

        this.source = GetElement(source, Image);
        this.tilemap = GetElement(tilemap, HTMLCanvasElement);

        if(this.source == null){
            throw new Error(`The tilemap source must be an Image, ${typeof this.source} provided.`);
        }

        if(this.tilemap == null){
            throw new Error(`The tilemap must be an HTMLCanvasElement, ${typeof this.tilemap} provided.`);
        }

        this.renderer = new CanvasRenderer(this, screen);

        this.keyframes = [new Keyframe(this)];
        this.keyframe = 0;

        this.colors = {
            fixed: new Color(),
            real: new Color(0, 0, 255),
            virtual: new Color(255, 0, 0, 102)
        };

        this.onSourceLoad = this.refresh.bind(this);
        this.source.addEventListener("load", this.onSourceLoad);
    }

    refresh(){
        const keyframe = this.keyframes[this.keyframe] || this.keyframes[0];

        if(keyframe == null){
            return;
        }

        this.renderer.render(keyframe.nextEntry);
    }
}
