import {AddKeyframeInterface} from "./AddKeyframeInterface";
import {GetLeft} from "../../dom/GetLeft";
import {KeyframeInterface} from "./KeyframeInterface";
import {RemoveKeyframeInterface} from "./RemoveKeyframeInterface";

export class TimelineInterface {
    constructor(ui){
        this.ui = ui;
        this.simulator = ui.simulator;
        this.keyframes = [];
        this.addKeyframe = new AddKeyframeInterface(this);
        this.removeKeyframe = new RemoveKeyframeInterface(this);

        this.simulator.keyframes.forEach((keyframe) => {
            this.keyframes.push(new KeyframeInterface(this, keyframe));
        });

        this.timeline = null;
        this.dragging = null;
    }

    addToDOM(){
        if(this.timeline != null){
            return;
        }

        this.timeline = document.getElementById("timeline");
        this.timeline.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.timeline.addEventListener("mouseup", this.stopDrag.bind(this));

        this.addKeyframe.addToDOM();
        this.removeKeyframe.addToDOM();

        this.keyframes.forEach((keyframe) => {
            keyframe.addToDOM();
        });

        this.keyframes[0].activate(null, true);
    }

    startDrag(target){
        this.dragging = target;
        this.offset = GetLeft(this.timeline);
    }

    stopDrag(){
        this.dragging = null;
    }

    updatePadding(){
        const {keyframes} = this.simulator;
        const lastKeyframe = keyframes[keyframes.length - 1];
        this.timeline.style.paddingRight = `${(lastKeyframe.position / 1000) * 200 + 200}px`;
    }

    onMouseMove(event){
        if(this.dragging == null){
            return;
        }

        const offset = ((event.clientX - this.offset + this.timeline.parentNode.scrollLeft) / 200) * 1000;
        const position = Math.round(offset / 250) * 250;

        for(let index = 0; index < this.keyframes.length; index++){
            if(this.keyframes[index].keyframe.position === position){
                return;
            }
        }

        this.dragging.setPosition(position);
        this.updatePadding();
    }
}
