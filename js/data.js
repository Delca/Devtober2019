export const ProductType = {
    Vegetable: 0,
    Meat: 1,
    Drugstore: 2,
    Furniture: 3,
    Electronics: 4,
    Other: 5,
};

export const ProductTypeName = {
    0: 'Vegetable/Fruit',
    1: 'Meat/Fish',
    2: 'Drugstore',
    3: 'Furniture',
    4: 'Electronics',
}

export const ObjectiveType = {
    Whatever: 0,    // any product will do
    Category: 1,    // every product of the given category will do
    Maker: 2,       // every product from the maker will do
    Product: 3,     // every product with this denomination will do
    Target: 4,      // only a specific maker/product combo will do
};

export const ObjectiveFlavourText = {
    0: ['[0] Flavour text %0'],
    1: ['[1] Flavour text %0'],
    2: ['[2] Flavour text %0'],
    3: ['[3] Flavour text %0'],
    4: ['[4] Flavour text %0 %1'],
};

export const EntityCount = {
    Maker: 128,
    ProductType: {
        0: 15,
        1: 20,
        2: 30,
        3: 40,
        4: 70,
    }
};

var companies = {
    vegetables: ['Ol\'Joe Farm', 'Anoty cooperative', 'Nymia city fields'],
    meats: ['Butchery Rheto and sons', 'Gurgling Fisherman'],
    drugstore: ['On a sunny day', 'Morolin beauty shop'],
    furniture: ['LBK Interiors', 'Royal House'],
    electronics: ['Cargo Superstars', 'Yeewah']
};

// ---- //

export function addProductToInventory(inventory, code, quantity) {
    inventory.products[code] = inventory.products[code] || generateProduct(code);
    inventory.products[code].quantity = clamp(0, (inventory.products[code].quantity + quantity), 999);    
}

export function getProductCodeCost(code) {
    const cost = createEmptyStickWallet();

    `${code}`.split('').forEach(number => {
        cost[number].quantity += 1;
    });

    return cost;
}

export function breakCode(code, sticks) {
    code = code.toString();

    const retrievalProbability = (
        code.length < 13 ? 0.35 : (
            code.length > 13 ? 0.2 : (
                0.80
            )
        )
    );

    code.split('').forEach(number => {
        const retrievalRoll = RNG.nextValueFloat();

        if (retrievalRoll >= retrievalProbability) {
            sticks[number].quantity += 1;
        }
    });
}

export function transferStickWallet(sourceWallet, targetWallet, doNotEmptySourceWallet = false) {
    for (let i = 0; i < 10; ++i) {
        targetWallet[i].quantity = clamp(0, targetWallet[i].quantity + sourceWallet[i].quantity, 999);

        if (doNotEmptySourceWallet === false) {
            sourceWallet[i].quantity = 0;
        }
    }
}

export function createEmptyStickWallet(fill = false) {
    const sticks = {};

    for (let i = 0; i < 10; ++i) {
        sticks[i] = {
            stick: i,
            quantity: (fill ? ((13 * i) % 10) : 0)
        };
    }

    return sticks;
}

export function getInventoryData() {
    let inventoryToReturn = null;
    manipulateUserData('inventory', (inventoryData) => {
        if (inventoryData.products === undefined) {
            let startingInventory = {
                products: {},
                sticks: createEmptyStickWallet(true),
            };

            Object.assign(inventoryData, startingInventory);
        }

        inventoryToReturn = inventoryData;
    });

    return inventoryToReturn;
}

export function getStickInventoryData() {
    return getInventoryData().sticks;
}

export function getObjectiveData() {
    let objectiveDataToReturn = null;
    manipulateUserData('objective', (objectiveData) => {
        if (objectiveData.userLevel === undefined) {
            // initialize the objective data
            Object.assign(objectiveData, {
                userLevel: 0,
                objectiveList: generateObjectiveList(0)
            });
        }

        objectiveDataToReturn = objectiveData;
    });

    return objectiveDataToReturn;

    return [
        {
            type: 4,
            currentProgress: 2,
            goal: 5,
            param1: 1523,
            param2: 0.52342,
            param3: 'yellow',
        },
        {
            type: 2,
            currentProgress: 0,
            goal: 2,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        },
        {
            type: 1,
            currentProgress: 3,
            goal: 3,
        }
    ];
}

// ---- //

function getSaveKey(category) {
    return `devtober2019-${category}`;
}

export function getUserData(category) {
    return JSON.parse(localStorage.getItem(getSaveKey(category))) || {};
}

function saveUserData(category, data) {
    localStorage.setItem(getSaveKey(category), JSON.stringify(data));
}

export function manipulateUserData(categories, handler = Function.prototype) {
    if (typeof (categories) === 'string') {
        categories = [categories];
    }

    let userData = categories.map(getUserData);

    try {
        handler.apply(null, userData);

        categories.forEach((category, i) => {
            saveUserData(category, userData[i]);
        });
    }
    catch (e) {
        console.error(`Error while manipulating ${categories} save data, no change has been saved`);
        throw e;
    }
}
