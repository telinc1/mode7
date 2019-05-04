import {Entry} from "../Entry";
import {EntryInterface} from "./EntryInterface";

export class AddEntryInterface {
    constructor(ui){
        this.ui = ui;
        this.dom = null;

        this.onButtonClick = this.addEntry.bind(this);
    }

    addToDOM(){
        if(this.dom != null){
            return;
        }

        const button = document.getElementById("add-entry");
        button.addEventListener("click", this.onButtonClick);

        this.dom = button;
    }

    removeFromDOM(){
        if(this.dom == null){
            return;
        }

        this.dom.removeEventListener("click", this.onButtonClick);
        this.dom = null;
    }

    addEntry(event){
        const entry = new Entry(1);

        let lastEntry = this.ui.keyframe.nextEntry;

        while(true){
            if(lastEntry.nextEntry == null){
                break;
            }

            lastEntry = lastEntry.nextEntry;
        }

        lastEntry.nextEntry = entry;
        entry.previousEntry = lastEntry;

        const ui = new EntryInterface(this.ui, entry);
        ui.addToDOM();

        this.ui.entries.push(ui);

        this.ui.simulator.refresh();

        event.preventDefault();
    }
}
