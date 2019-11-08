const a = 25214903917;
const c = 11;
const modulo = Math.pow(2, 48);
const seed = Math.floor(10000 * Math.random());

function getCurrentSeed() {
    return getUserData('rng').currentValue;
}

function setCurrentSeed(seed) {
    manipulateUserData('rng', data => {
        data.currentValue = seed;
    });
}

function nextValue() {
    let result = null;

    manipulateUserData('rng', data => {
        const currentValue = (data.currentValue !== undefined ? data.currentValue : seed);
        const nextValue = (a * currentValue + c) % modulo;

        data.currentValue = nextValue;
        result = nextValue;
    });

    return result;
}

function nextValueFloat() {
    return (nextValue() / modulo);
}

function pickFromArray(arr) {
    let index = (nextValue() % arr.length);

    return arr[index];
}

export const RNG = {
    getCurrentSeed,
    setCurrentSeed,
    nextValue,
    nextValueFloat,
    pickFromArray,
};
