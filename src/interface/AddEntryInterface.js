import {Entry} from "../Entry";
import {EntryInterface} from "./EntryInterface";

export class AddEntryInterface {
    constructor(ui){
        this.ui = ui;
        this.dom = null;
    }

    addToDOM(){
        if(this.dom != null){
            return;
        }

        const button = document.getElementById("add-entry");
        button.addEventListener("click", this.addEntry.bind(this));
    }

    addEntry(event){
        const entry = new Entry(1);

        let lastEntry = this.ui.simulator.nextEntry;

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

        event.preventDefault();
    }
}
