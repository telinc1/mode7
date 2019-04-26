import {AddEntryInterface} from "./AddEntryInterface";
import {EntryInterface} from "./EntryInterface";

export class UserInterface {
    constructor(simulator){
        this.simulator = simulator;
        this.entries = [];
        this.add = null;

        window.ui = this;
    }

    addToDOM(){
        let entry = this.simulator.nextEntry;

        while(entry != null){
            const ui = new EntryInterface(this, entry);
            ui.addToDOM();

            this.entries.push(ui);

            entry = entry.nextEntry;
        }

        this.add = new AddEntryInterface(this);
        this.add.addToDOM();
    }
}
