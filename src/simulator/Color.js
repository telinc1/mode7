import {Clamp} from "../math/Clamp";

const HEX_COLOR = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

export class Color {
    constructor(red = 0, green = 0, blue = 0, alpha = 255){
        this.setTo(red, green, blue, alpha);
    }

    setTo(red, green, blue, alpha = null){
        this.red = Clamp(Math.round(red), 0, 255);
        this.green = Clamp(Math.round(green), 0, 255);
        this.blue = Clamp(Math.round(blue), 0, 255);

        if(alpha != null){
            this.alpha = Clamp(Math.round(alpha), 0, 255);
        }

        return this;
    }

    setFromHex(color){
        const matches = color.match(HEX_COLOR);

        if(matches == null){
            return this;
        }

        return this.setTo(parseInt(matches[1], 16), parseInt(matches[2], 16), parseInt(matches[3], 16));
    }

    toHex(){
        const color = (this.red << 16) | (this.green << 8) | this.blue;
        const hex = color.toString(16).toUpperCase();

        return `#${(hex.length >= 6) ? hex : new Array(7 - hex.length).join("0") + hex}`;
    }

    toRGBA(){
        return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha / 255})`;
    }
}
