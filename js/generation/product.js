export function generateCategory(makerId) {
    return (makerId.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0) % 5);
}

export function generateMakerName(makerId) {
    const category = generateCategory(makerId);
    const currentSeed = RNG.getCurrentSeed();
    RNG.setCurrentSeed(parseInt(makerId, 10));
    const template = RNG.pickFromArray(MakerNameTemplateByProductType[category]);
    const name = fillOutTemplate(template);

    RNG.setCurrentSeed(currentSeed);

    return name;
}

export function generateMaker(matches) {
    const maker = {
        id: 999999,
        name: `Unknown`
    };

    if (matches) {
        maker.id = parseInt(matches[2], 10);
        maker.name = generateMakerName(maker.id);
    }

    return maker;
}

export function getProductName(categoryId, productId) {
    const currentSeed = RNG.getCurrentSeed();
    RNG.setCurrentSeed(productId);
    const name = RNG.pickFromArray(ProductNameByProductType[categoryId]);

    RNG.setCurrentSeed(currentSeed);
    return name;
}

export function generateProduct(code) {
    code = code.toString();
    const currentSeed = RNG.getCurrentSeed();
    RNG.setCurrentSeed(parseInt(code, 10));

    const matches = (code.length === 13 ? /(..)(.....)(.....)./.exec(code) : null);

    const product = {
        category: ProductType.Other,
        code,
        maker: generateMaker(matches),
        product: {
            id: 999999,
            name: `Unknown`
        },
        quantity: 0,
        stats: {
            firstScanTimestamp: null,
            lastScanTimestamp: null,
            timesScanned: 0,
            timesOrdered: 0,
            timesGifted: 0,
            timesSubmitted: 0,
            timesBroken: 0,
        }
    };

    if (matches) {
        product.category = generateCategory(matches[2]);
        product.product.id = parseInt(matches[3], 10);

        product.product.name = getProductName(product.category, product.product.id);
    }

    RNG.setCurrentSeed(currentSeed);

    return product;
}
