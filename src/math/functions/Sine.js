export function Sine(progress, [min, max]){
    return min + Math.sin(progress * Math.PI) * (max - min);
}

Sine.metadata = {
    name: "Sinusoidal",
    values: ["Minimum", "Maximum"]
};
