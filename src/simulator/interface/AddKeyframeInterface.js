import {Keyframe} from "../Keyframe";
import {KeyframeInterface} from "./KeyframeInterface";

export class AddKeyframeInterface {
    constructor(ui){
        this.ui = ui;
        this.button = null;

        this.onButtonClick = this.addKeyframe.bind(this);
    }

    addToDOM(){
        if(this.button != null){
            return;
        }

        const button = document.getElementById("add-keyframe");
        button.addEventListener("click", this.onButtonClick);

        this.button = button;
    }

    addKeyframe(event){
        const {simulator} = this.ui;
        const {keyframes} = simulator;

        const lastKeyframe = keyframes[keyframes.length - 1];

        const keyframe = new Keyframe(simulator);
        keyframe.position = (lastKeyframe == null) ? 0 : lastKeyframe.position + 250;

        simulator.keyframes.push(keyframe);

        const ui = new KeyframeInterface(this.ui, keyframe);
        ui.addToDOM();

        this.ui.keyframes.push(ui);
        this.ui.updatePadding();

        event.preventDefault();
    }
}
