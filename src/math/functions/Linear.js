export function Linear(progress, [start, end]){
    return start + progress * (end - start);
}

Linear.metadata = {
    name: "Linear",
    values: ["Start", "End"]
};
