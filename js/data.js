export const ProductType = {
    Vegetable: 0,
    Meat: 1,
    Craft: 2,
    Furniture: 3,
    Electronics: 4,
    Other: 5,
};

export const ProductTypeName = {
    0: 'Vegetal foods',
    1: 'Animal foods',
    2: 'Craft',
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
    Maker: 128
};

var companies = {
    vegetables: ['Ol\'Joe Farm', 'Anoty cooperative', 'Nymia city fields'],
    meats: ['Butchery Rheto and sons', 'Gurgling Fisherman'],
    drugstore: ['On a sunny day', 'Morolin beauty shop'],
    furniture: ['LBK Interiors', 'Royal House'],
    electronics: ['Cargo Superstars', 'Yeewah']
};

// %0 and %1 are both people name
// %2 and %3 are both generated name
export const MakerNameTemplateByProductType = {
    [ProductType.Vegetable]: ['Old %0\'s farm', '%2 city fields', '%1 co-op', '%0 & Family', '%2 Agricultural Inc.', '%3\'s Greens'],
    [ProductType.Meat]: ['%1\'s Butcher shop', '%0\'s', '%1\'s Nice Cut', '%2 Meat Division, Ltd.', '%2 & %1', '%3 Foods'],
    [ProductType.Craft]: ['Local %0', '%1\'s Crafts', '%1 %3', '%0 & %1', 'Made by %0', '%2 Group'],
    [ProductType.Furniture]: ['%3 Furnitures', 'A Home in %2', '%1, Woodworker', '%2', '%3', '%0\'s Sofa'],
    [ProductType.Electronics]: ['%2Tech', '%2', '%3, Inc.', '%2 Electronics', '%3', '%1\'s'],
};

export const PeopleNames = [
    'Charlotte', 'Christopher', 'Joe', 'Bianca', 'Sarah', 'Alex', 'Maxim', 'Mathilda',
    'Leo', 'Lucas', 'Sam', 'Morgana', 'Richard', 'Lee', 'Marion', 'Carla', 'Louis',
    'Ben', 'Yuna', 'Nora', 'Myriam', 'Laura', 'Abril', 'Salma', 'Aya', 'Mark', 'Omar',
    'Ali', 'Juan', 'Augustin', 'Eli', 'James', 'Abigail', 'Oliver', 'Robin', 'Hans',
    'William', 'Aaron', 'Tom', 'Charlie', 'Oskar', 'Emma', 'Lucie', 'Jack', 'Daniel' 
];

const vowels = /[aiueoy]/;
const nonVowels = /[^aiueoy]/;

export const ProductNameByProductType = {
    [ProductType.Vegetable]: ['Tomato', 'Banana', 'Lettuce', 'Bell pepper', 'Beans', 'Chickpeas', 'Raspberries', 'Apple', 'Cucumber', 'Carrot', 'Potato', 'Sweet Potato', 'Lentils', 'Kiwi', 'Blueberries', 'Orange', 'Grapes', 'Avocado', 'Pear', 'Lemon', 'Plum', 'Apricot', 'Cherries', 'Cocount', 'Lychee', 'Grapefruit', 'Nectarine', 'Yuzu', 'Cranberry', 'Watermelon', 'Pineapple', 'Dragon fruit', 'Pomegranate', 'Melon'],
    [ProductType.Meat]: ['Beef tongue', 'Ribeye', 'Round steak', 'Flank steak', 'Sirloin steak', 'T-bone steak', 'Lamb breast', 'Lamb shank', 'Chump chops', 'Bacon', 'Pork chops', 'Pork ribs', 'Ham', 'Sausages', 'Dry sausages', 'Shrimps', 'Mackerel', 'Herring', 'Tuna', 'Cod', 'Sardine', 'Crab', 'Squid'],
    [ProductType.Craft]: ['Whisk', 'Rolling pin', 'Chisel', 'Hammer', 'Handbag', 'Pocket watch', 'Paper fan', 'Silk scarf', 'Fountain pen', 'Ceramic vase', 'Clay vase', 'Woven basket', 'Wooden bowl', 'Metal earrings', 'Paper hat', 'Golden ring', 'Polished ruby', 'Silver necklace', 'Glass teacup'],
    [ProductType.Furniture]: ['Desk', 'Desk chair', 'Reclining chair', '3-place sofa', 'Single bed', 'Queen size bed', 'Bookshelf', 'Bean bag', 'Bar stool', 'Rocking chair', 'Footstool', 'Garde bench', 'Bunk bed', 'Hammock', 'Futon', 'Sofa bed', 'Coffee table', 'Dining table', 'Nightstand', 'Folding table', 'Cupboard', 'Chest', 'Wardrobe', 'Antique Wardrobe', 'Folding screen', 'Commode', 'Bin'],
    [ProductType.Electronics]: ['Television', 'Laptop', 'Computer', 'Stand mixer', 'Hand mixer', 'Rice cooker', 'Juicer', 'Electric blanket', 'Toaster', 'Smartphone', 'Dumb phone', 'Hair dryer', 'Hair iron', 'Fridge', 'Oven', 'Vacuum cleaner', 'Game console', 'Headphones', 'Power strip', 'Luminaire', 'Gooseneck lamp', 'Electric fan', 'Synthesizer', ''],
};

export function fillOutTemplate(template) {
    const names = [
        RNG.pickFromArray(PeopleNames),
        RNG.pickFromArray(PeopleNames),
        RNG.pickFromArray(PeopleNames),
        RNG.pickFromArray(PeopleNames),
    ];

    console.log(names);

    return template
        .replace(/%0/g, names[0])
        .replace(/%1/g, names[1])
        .replace(/%2/g, names[2])
        .replace(/%3/g, names[3])
        ;
}

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
                userLevel: 15,
                objectiveList: generateObjectiveList(15)
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
