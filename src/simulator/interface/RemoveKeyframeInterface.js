import {Keyframe} from "../Keyframe";
import {KeyframeInterface} from "./KeyframeInterface";

export class RemoveKeyframeInterface {
    constructor(ui){
        this.ui = ui;
        this.button = null;

        this.onButtonClick = this.removeKeyframe.bind(this);
    }

    addToDOM(){
        if(this.button != null){
            return;
        }

        const button = document.getElementById("remove-keyframe");
        button.addEventListener("click", this.onButtonClick);

        this.button = button;
    }

    removeKeyframe(event){
        const {ui} = this;
        const {simulator} = ui;

        event.preventDefault();

        if(ui.keyframes.length === 1){
            window.alert("You can't remove the last keyframe.");
            return;
        }

        const keyframe = ui.keyframes.find(existing => existing.active);
        const index = simulator.keyframes.indexOf(keyframe.keyframe);

        if(keyframe == null || index === -1 || !window.confirm("Are you sure?")){
            return;
        }

        simulator.keyframes.splice(index, 1);
        ui.keyframes.splice(ui.keyframes.indexOf(keyframe), 1);
        ui.keyframes[ui.keyframes.length - 1].activate(null, true);

        ui.updatePadding();

        keyframe.removeFromDOM();
    }
}
