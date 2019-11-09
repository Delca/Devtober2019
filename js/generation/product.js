export function generateProduct(code) {
    code = code.toString();

    const product = {
        category: ProductType.Other,
        code,
        maker: {
            id: 999999,
            name: `Unknown`
        },
        product: {
            id: 999999,
            name: `Unknown`
        },
        quantity: 0,
    };

    if (code.length === 13) {
        let matches = /(..)(.....)(.....)./.exec(code);

        product.category = (parseInt(matches[2], 10) % 5);
        product.maker.id = parseInt(matches[2], 10);
        product.maker.name = `M${product.maker.id}`;
        product.product.id = parseInt(matches[3], 10);
        product.product.name = `P${product.product.id}`;
    }

    return product;
}
