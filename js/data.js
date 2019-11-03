export const ProductType = {
    Vegetable: 0,
    Meat: 1,
    Drugstore: 2,
    Furniture: 3,
    Electronics: 4,
};

export const ProductTypeName = {
    0: 'Vegetable/Fruit',
    1: 'Meat/Fish',
    2: 'Drugstore',
    3: 'Furniture',
    4: 'Electronics',
}

var companies = {
    vegetables: ['Ol\'Joe Farm', 'Anoty cooperative', 'Nymia city fields'],
    meats: ['Butchery Rheto and sons', 'Gurgling Fisherman'],
    drugstore: ['On a sunny day', 'Morolin beauty shop'],
    furniture: ['LBK Interiors', 'Royal House'],
    electronics: ['Cargo Superstars', 'Yeewah']
};

// ---- //

export function getInventory() {
    return {
        1956485675964: {
            type: 0,
            code: 1956485675964,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 3,
        },
        7658456521325: {
            type: 1,
            code: 7658456521325,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 3,
        },
        3645212568945: {
            type: 2,
            code: 3645212568945,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 3,
        },
        6495127835642: {
            type: 3,
            code: 6495127835642,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 3,
        },
        46372158649524: {
            type: 4,
            code: 46372158649524,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 3,
        },
        7546852315246: {
            type: 1,
            code: 7546852315246,
            cost: {
                0: 0, 1: 1, 2: 2, 3: 1, 4: 2,
                5: 3, 6: 2, 7: 1, 8: 1, 9: 0, 
            },
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 1,
        },
        5621345215236: {
            type: 1,
            code: 5621345215236,
            maker: {
                id: 56485,
                name: 'Dem makerZ'
            },
            product: {
                id: 67596,
                name: 'Dat produK'
            },
            quantity: 8,
        },
    };
}

export function getStickInventory() {
    let data = {};

    for (let i = 0; i < 10; ++i) {
        data[i] = {
            stick: i,
            quantity: ((13 * i) % 10)
        };
    }

    return data;
}
