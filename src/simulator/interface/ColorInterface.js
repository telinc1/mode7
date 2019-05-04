export class ColorInterface {
    constructor(ui, key){
        this.ui = ui;
        this.key = key;
        this.input = null;
    }

    addToDOM(){
        if(this.input != null){
            return;
        }

        const color = this.ui.simulator.colors[this.key];

        if(color == null){
            return;
        }

        const input = document.getElementById(`color-${this.key}`);

        if(input == null){
            return;
        }

        input.value = color.toHex();
        input.addEventListener("input", this.onInput.bind(this));
        input.addEventListener("blur", this.onBlur.bind(this));

        this.input = input;
    }

    onInput(){
        const {simulator} = this.ui;

        simulator.colors[this.key].setFromHex(this.input.value);
        simulator.refresh();
    }

    onBlur(){
        const {simulator} = this.ui;
        const color = simulator.colors[this.key];

        color.setFromHex(this.input.value);
        this.input.value = color.toHex();

        simulator.refresh();
    }
}
