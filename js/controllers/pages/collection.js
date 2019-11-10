class CollectionPageController {
    constructor() {
        this.element = null;
        this.listData = null;
        this.sticksData = null;

        this.selectedAmount = 0;
    }
    
    initialize(element) {
        this.element = element;
        this.collectionGrid = element.querySelector('.collection-grid');
        this.tabsElement = element.querySelector('.tabs');
        this.byCategoryTabHeaderElement = this.tabsElement.children[0].children[1];
        this.byMakerTabHeaderElement = this.tabsElement.children[0].children[2];


        this.loadDataFromMemory();
        this.displayByCategory();
    }

    loadDataFromMemory() {
        this.inventory = getInventoryData();
    }

    displayByCategory() {
        this.byCategoryTabHeaderElement.classList = 'is-active';
        this.byMakerTabHeaderElement.classList = '';

        let categoryContents = Object.getOwnPropertyNames(this.inventory.products)
            .map(productCode => this.inventory.products[productCode])
            .reduce((acc, val) => {
                acc[val.category] = acc[val.category] || [];

                acc[val.category].push({
                    product: val,
                    selectedAmount: 0,
                });

                return acc;
            }, {});

        while (this.collectionGrid.firstChild) {
            this.collectionGrid.removeChild(this.collectionGrid.firstChild);
        }

        Object.getOwnPropertyNames(categoryContents).forEach(category => {
            let categoryData = {
                category,
                isCategory: true,
                name: ProductTypeName[category],
                content: categoryContents[category]
            }

            instantiateTemplate('inventory-collection-display-component', this.collectionGrid, new InventoryCollectionDisplayController(categoryData));
        });
    }

    displayByMaker() {
        this.byCategoryTabHeaderElement.classList = '';
        this.byMakerTabHeaderElement.classList = 'is-active';

        let makerContents = Object.getOwnPropertyNames(this.inventory.products)
            .map(productCode => this.inventory.products[productCode])
            .reduce((acc, val) => {
                acc[val.maker.id] = acc[val.maker.id] || [];

                acc[val.maker.id].push({
                    product: val,
                    selectedAmount: 0,
                });

                return acc;
            }, {});

        while (this.collectionGrid.firstChild) {
            this.collectionGrid.removeChild(this.collectionGrid.firstChild);
        }

        Object.getOwnPropertyNames(makerContents).forEach(makerId => {
            let makerData = {
                category: generateCategory(makerId),
                isCategory: false,
                name: generateMakerName(makerId),
                content: makerContents[makerId]
            }

            instantiateTemplate('inventory-collection-display-component', this.collectionGrid, new InventoryCollectionDisplayController(makerData));
        });
    }
}

export const collectionPageController = new CollectionPageController();
