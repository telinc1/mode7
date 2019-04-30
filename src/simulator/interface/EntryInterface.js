import {Clamp} from "../../math/Clamp";
import {Constant} from "../../math/functions/Constant";
import {Entry} from "../Entry";
import {Linear} from "../../math/functions/Linear";
import {NumberToHex} from "../../math/NumberToHex";
import {ParseHexInput} from "../../math/ParseHexInput";
import {ParseHTML} from "../../dom/ParseHTML";

const LIST_ITEM = `<span class="list-group-item list-group-item-action pointer">
    For <input type="number" min="1" max="224" class="scanlines form-control d-inline w-25"> <span class="scanline-label">scanlines</span>
    <span class="float-right ml-3 pointer remove"><i class="fas fa-times"></i></span>
    <span class="float-right ml-3 pointer down"><i class="fas fa-arrow-down"></i></span>
    <span class="float-right ml-3 pointer up"><i class="fas fa-arrow-up"></i></span>
</span>`;

const PARAMETER = `<div class="form-group row">
    <label class="col-md-2 col-form-label name"></label>
    <div class="col-md-10 form-row fields">
        <div class="col static">
            <select class="custom-select functions"></select>
        </div>
    </div>
</div>`;

const INPUT_FIELD = `<div class="col input-float">
    <label></label>
    <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text">$</span>
        </div>
        <input type="text">
    </div>
</div>`;

const PARAMETERS = {
    matrixA: {name: "Matrix A", decimal: 256},
    matrixB: {name: "Matrix B", decimal: 256},
    matrixC: {name: "Matrix C", decimal: 256},
    matrixD: {name: "Matrix D", decimal: 256},
    offsetX: {name: "Offset X"},
    offsetY: {name: "Offset Y"},
    centerX: {name: "Center X"},
    centerY: {name: "Center Y"}
};

const FUNCTIONS = [Constant, Linear];

export class EntryInterface {
    constructor(ui, entry){
        this.ui = ui;
        this.entry = entry;
        this.dom = null;
    }

    addToDOM(){
        if(this.dom != null){
            return;
        }

        const item = ParseHTML(LIST_ITEM).firstElementChild;
        item.addEventListener("click", this.onItemClick.bind(this));

        const scanlines = item.querySelector(".scanlines");
        scanlines.value = this.entry.scanlines + 1;
        scanlines.addEventListener("input", this.onScanlineInput.bind(this));

        const scanlineLabel = item.querySelector(".scanline-label");
        scanlineLabel.innerText = (this.entry.scanlines === 0) ? "scanline" : "scanlines";

        const up = item.querySelector(".up");
        up.addEventListener("click", this.onUpClick.bind(this));

        const down = item.querySelector(".down");
        down.addEventListener("click", this.onDownClick.bind(this));

        const remove = item.querySelector(".remove");
        remove.addEventListener("click", this.onRemoveClick.bind(this));

        const entries = document.getElementById("entries");
        entries.appendChild(item);

        this.dom = {entries, item, scanlines, scanlineLabel, up, down, remove};
    }

    // I bitterly regret not using Vue for this.
    onItemClick(event, force = false){
        const {entries, item} = this.dom;

        if(force !== true && (event.target !== item || item.classList.contains("active"))){
            return;
        }

        const active = entries.querySelector(".active");

        if(active != null){
            active.classList.remove("active");
        }

        item.classList.add("active");

        const container = document.getElementById("parameters");

        while(container.firstChild != null){
            container.removeChild(container.firstChild);
        }

        const {entry} = this;

        Object.keys(PARAMETERS).forEach((key) => {
            const definition = PARAMETERS[key];

            const form = ParseHTML(PARAMETER).firstElementChild;
            form.querySelector(".name").innerText = definition.name;

            const selectFunction = (func) => {
                const parameter = entry.parameters[key];
                const fields = form.querySelector(".fields");

                while(fields.lastChild != null){
                    if(fields.lastChild.className === "col static"){
                        break;
                    }

                    fields.removeChild(fields.lastChild);
                }

                parameter.func = func;

                func.metadata.values.forEach((value, index) => {
                    if(parameter.values[index] == null){
                        parameter.values[index] = 0;
                    }

                    const inputField = ParseHTML(INPUT_FIELD).firstElementChild;
                    const decimal = (definition.decimal == null) ? null : document.createElement("span");
                    const factor = (definition.decimal == null) ? 1 : definition.decimal;

                    const label = inputField.querySelector("label");
                    label.innerText = value;

                    const input = inputField.querySelector("input");
                    input.className = "form-control";
                    input.placeholder = value;
                    input.value = NumberToHex(parameter.values[index] * factor);

                    if(decimal != null){
                        decimal.innerText = `= ${parameter.values[index]}`;
                        inputField.appendChild(decimal);
                    }

                    input.addEventListener("input", () => {
                        const number = Clamp(ParseHexInput(input.value, factor) / factor, parameter.min, parameter.max);

                        if(decimal != null){
                            decimal.innerText = `= ${number}`;
                        }

                        parameter.values[index] = number;
                        this.ui.simulator.refresh();
                    });

                    input.addEventListener("blur", () => {
                        input.value = NumberToHex(parameter.values[index] * factor);

                        if(decimal != null){
                            decimal.innerText = `= ${parameter.values[index]}`;
                        }
                    });

                    fields.appendChild(inputField);
                });
            };

            const select = form.querySelector(".functions");

            FUNCTIONS.forEach((func) => {
                const option = document.createElement("option");
                option.innerText = func.metadata.name;
                option.value = func.metadata.name;

                select.appendChild(option);
            });

            select.addEventListener("change", () => {
                const func = FUNCTIONS.find(func => func.metadata.name === select.value);

                if(func == null){
                    return;
                }

                selectFunction(func);
                this.ui.simulator.refresh();
            });

            selectFunction(entry.parameters[key].func);

            container.appendChild(form);
        });
    }

    onScanlineInput(){
        const value = Clamp(this.dom.scanlines.value, 1, 224) || 1;
        this.dom.scanlines.value = value;

        this.dom.scanlineLabel.innerText = (value === 1) ? "scanline" : "scanlines";

        this.entry.scanlines = value - 1;
        this.ui.simulator.refresh();
    }

    onUpClick(event){
        event.preventDefault();

        if(this.ui.entries.length === 1){
            return;
        }

        const {entry} = this;

        if(entry.previousEntry == null || !(entry.previousEntry instanceof Entry)){
            return;
        }

        this.swap(entry, entry.previousEntry);

        const previous = this.dom.item.previousElementSibling;

        if(previous == null){
            return;
        }

        this.dom.entries.insertBefore(this.dom.item, previous);

        const index = this.ui.entries.indexOf(this);

        if(index > 0){
            this.ui.entries[index] = this.ui.entries[index - 1];
            this.ui.entries[index - 1] = this;
        }

        this.ui.simulator.refresh();
    }

    onDownClick(event){
        event.preventDefault();

        if(this.ui.entries.length === 1){
            return;
        }

        const {entry} = this;

        if(entry.nextEntry == null){
            return;
        }

        this.swap(entry, entry.nextEntry);

        const next = this.dom.item.nextElementSibling;

        if(next == null){
            return;
        }

        this.dom.entries.insertBefore(this.dom.item, next.nextSibling);

        const index = this.ui.entries.indexOf(this);

        if(index !== -1 && index + 1 < this.ui.entries.length){
            this.ui.entries[index] = this.ui.entries[index + 1];
            this.ui.entries[index + 1] = this;
        }

        this.ui.simulator.refresh();
    }

    onRemoveClick(event){
        event.preventDefault();

        if(this.ui.entries.length === 1){
            window.alert("You can't remove the last entry.");
            return;
        }

        if(!window.confirm("Are you sure?")){
            return;
        }

        this.removeEntry(this.entry);

        this.dom.item.parentNode.removeChild(this.dom.item);

        const index = this.ui.entries.indexOf(this);

        if(index !== -1){
            this.ui.entries.splice(index, 1);
        }

        if(this.dom.item.classList.contains("active")){
            this.ui.entries[0].onItemClick(null, true);
        }

        this.ui.simulator.refresh();
    }

    swap(x, y){
        if(x === y){
            return;
        }

        const previousX = x.previousEntry;
        const previousY = y.previousEntry;

        if(previousX === y){
            this.removeEntry(x);
            this.insertAfter(x, previousY);
        }else if(previousY === x){
            this.removeEntry(y);
            this.insertAfter(y, previousX);
        }else{
            this.removeEntry(x);
            this.removeEntry(y);

            this.insertAfter(x, previousY);
            this.insertAfter(y, previousX);
        }
    }

    insertAfter(entry, reference){
        if(reference){
            entry.nextEntry = reference.nextEntry;
            reference.nextEntry = entry;
        }

        entry.previousEntry = reference;

        if(entry.nextEntry){
            entry.nextEntry.previousEntry = entry;
        }
    }

    removeEntry(entry){
        if(entry.previousEntry != null){
            entry.previousEntry.nextEntry = entry.nextEntry;
        }

        if(entry.nextEntry != null){
            entry.nextEntry.previousEntry = entry.previousEntry;
        }

        entry.previousEntry = null;
        entry.nextEntry = null;
    }
}
