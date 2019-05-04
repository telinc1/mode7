import {AnimationHandler} from "../animation/AnimationHandler";

export class PlayInterface {
    constructor(timeline){
        this.timeline = timeline;
        this.simulator = timeline.simulator;
        this.dom = null;
        this.animation = null;

        this.onButtonClick = this.prepareAnimation.bind(this);
    }

    addToDOM(){
        if(this.dom != null){
            return;
        }

        const button = document.getElementById("play-animation");
        button.addEventListener("click", this.onButtonClick);

        this.dom = {ui: document.getElementById("user-interface"), button};
    }

    prepareAnimation(event){
        event.preventDefault();

        if(this.animation != null){
            return;
        }

        const {ui} = this.dom;

        this.animation = new AnimationHandler(this.simulator);
        this.animation.onComplete = () => {
            this.animation = null;

            this.timeline.keyframes[this.timeline.keyframes.length - 1].activate(null, true);

            ui.classList.remove("hiding", "hidden");
        };

        this.animation.render();

        window.scroll({top: 0, behavior: "smooth"});

        ui.classList.add("hiding");
        window.setTimeout(() => {
            const {ui} = this.dom;
            ui.classList.add("hidden");

            this.animation.start();
        }, 1000);
    }
}
