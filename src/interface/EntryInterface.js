import {Clamp} from "../Clamp";
import {Entry} from "../Entry";
import {ParseHTML} from "../ParseHTML";

const LIST_ITEM = `<span class="list-group-item list-group-item-action pointer">
    <input type="number" min="1" max="224" class="scanlines form-control d-inline w-25"> scanlines
    <span class="float-right ml-3 pointer remove"><i class="fas fa-times"></i></span>
    <span class="float-right ml-3 pointer down"><i class="fas fa-arrow-down"></i></span>
    <span class="float-right ml-3 pointer up"><i class="fas fa-arrow-up"></i></span>
</span>`;

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

        const scanlines = item.querySelector(".scanlines");
        scanlines.value = this.entry.scanlines + 1;
        scanlines.addEventListener("input", this.onScanlineInput.bind(this));

        const up = item.querySelector(".up");
        up.addEventListener("click", this.onUpClick.bind(this));

        const down = item.querySelector(".down");
        down.addEventListener("click", this.onDownClick.bind(this));

        const remove = item.querySelector(".remove");
        remove.addEventListener("click", this.onRemoveClick.bind(this));

        const entries = document.getElementById("entries");
        entries.appendChild(item);

        this.dom = {entries, item, scanlines, up, down, remove};
    }

    onScanlineInput(){
        const value = Clamp(this.dom.scanlines.value, 1, 224) || 1;
        this.dom.scanlines.value = value;

        this.entry.scanlines = value - 1;
        this.ui.simulator.dirty = true;
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
        }else{
            throw new Error();
        }
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
        }else{
            throw new Error();
        }
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
        }else{
            throw new Error();
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
