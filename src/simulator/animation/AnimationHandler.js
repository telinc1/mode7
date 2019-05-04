import {AnimationRenderer} from "./AnimationRenderer";
import {Clamp} from "../../math/Clamp";

export class AnimationHandler {
    constructor(simulator){
        this.simulator = simulator;
        this.animation = null;
        this.timestamp = null;
        this.lastTime = null;
        this.id = null;
        this.onComplete = null;

        this.callback = this.step.bind(this);
    }

    render(){
        const renderer = new AnimationRenderer(this.simulator.keyframes);
        this.animation = renderer.render();
    }

    start(){
        if(this.timestamp != null){
            return;
        }

        if(this.animation == null){
            this.render();
        }

        this.lastTime = 0;
        this.timestamp = window.performance.now();
        this.time = 0;

        this.id = window.requestAnimationFrame(this.callback);
    }

    step(){
        this.lastTime = this.timestamp;
        this.timestamp = window.performance.now();
        this.time += this.timestamp - this.lastTime;

        let currentIndex = 0;

        for(let index = 0; index < this.animation.length; index++){
            if(this.animation[index].keyframe.position > this.time){
                break;
            }

            currentIndex = index;
        }

        if(currentIndex === this.animation.length - 1){
            if(this.onComplete != null){
                this.onComplete();
            }

            return;
        }

        const currentFrame = this.animation[currentIndex];
        const nextFrame = this.animation[currentIndex + 1];

        const currentPosition = currentFrame.keyframe.position;
        const nextPosition = nextFrame.keyframe.position;

        currentFrame.entry.progress = Clamp((this.time - currentPosition) / (nextPosition - currentPosition), 0, 1);
        currentFrame.entry.nextFrame = nextFrame.entry;

        this.simulator.renderer.render(currentFrame.entry);

        this.id = window.requestAnimationFrame(this.callback);
    }
}
