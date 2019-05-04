import {AddEntryInterface} from "./AddEntryInterface";
import {ColorInterface} from "./ColorInterface";
import {EntryInterface} from "./EntryInterface";

export class UserInterface {
    constructor(simulator){
        this.simulator = simulator;
        this.entries = [];
        this.add = null;
        this.colors = [];

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

        Object.keys(this.simulator.colors).forEach((key) => {
            const ui = new ColorInterface(this, key);
            ui.addToDOM();

            this.colors.push(ui);
        });

        this.entries[0].onItemClick(null, true);
    }
}
