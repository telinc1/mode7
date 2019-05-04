import {AddEntryInterface} from "./AddEntryInterface";
import {EntryInterface} from "./EntryInterface";
import {ParseHTML} from "../../dom/ParseHTML";

const KEYFRAME = `<span class="keyframe">
    <span class="badge badge-pill badge-dark"></span>
</span>`;

export class KeyframeInterface {
    constructor(ui, keyframe){
        this.ui = ui;
        this.simulator = ui.simulator;
        this.keyframe = keyframe;
        this.entries = [];

        let entry = keyframe.nextEntry;

        while(entry != null){
            this.entries.push(new EntryInterface(this, entry));
            entry = entry.nextEntry;
        }

        this.addEntry = new AddEntryInterface(this);

        this.dom = null;
        this.active = false;
        this.lastPosition = null;
    }

    addToDOM(){
        if(this.dom != null){
            return;
        }

        const keyframe = ParseHTML(KEYFRAME).firstElementChild;
        keyframe.addEventListener("mousedown", this.onMouseDown.bind(this));
        keyframe.addEventListener("mouseup", this.onMouseUp.bind(this));

        this.ui.timeline.appendChild(keyframe);

        this.dom = keyframe;

        this.setPosition(this.keyframe.position);
    }

    removeFromDOM(){
        if(this.dom == null){
            return;
        }

        this.dom.parentNode.removeChild(this.dom);
        this.deactivate();

        this.dom = null;
    }

    onMouseDown(event){
        this.lastPosition = this.keyframe.position;
        this.ui.startDrag(this);
    }

    onMouseUp(event){
        this.ui.stopDrag();

        if(this.keyframe.position == this.lastPosition){
            this.activate(event);
        }
    }

    setPosition(position){
        const {keyframe, dom} = this;

        keyframe.position = position;
        this.simulator.keyframes.sort((a, b) => a.position - b.position);

        dom.style.left = `${position * 0.2 + 4}px`;
        dom.querySelector(".badge").innerText = `${Math.round(position / 10) / 100} sec`;
    }

    activate(event, force = false){
        if(this.dom == null || (!force && this.active)){
            return;
        }

        this.ui.keyframes.forEach((keyframe) => {
            if(keyframe.active){
                keyframe.deactivate();
            }
        });

        this.entries.forEach((entry) => {
            entry.addToDOM();
        });

        this.entries[0].onItemClick(null, true);

        this.addEntry.addToDOM();

        this.dom.classList.add("active");
        this.active = true;

        const index = this.simulator.keyframes.indexOf(this.keyframe);

        if(index !== -1){
            this.simulator.keyframe = index;
            this.simulator.refresh();
        }
    }

    deactivate(){
        if(!this.active || this.dom == null){
            return;
        }

        this.entries.forEach((entry) => {
            entry.removeFromDOM();
        });

        this.addEntry.removeFromDOM();

        this.dom.classList.remove("active");
        this.active = false;
    }
}
