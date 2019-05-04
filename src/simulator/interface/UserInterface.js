import {ColorInterface} from "./ColorInterface";
import {TimelineInterface} from "./TimelineInterface";

export class UserInterface {
    constructor(simulator){
        this.simulator = simulator;
        this.timeline = new TimelineInterface(this);
        this.colors = [];
    }

    addToDOM(){
        this.timeline.addToDOM();

        Object.keys(this.simulator.colors).forEach((key) => {
            const ui = new ColorInterface(this, key);
            ui.addToDOM();

            this.colors.push(ui);
        });
    }
}
