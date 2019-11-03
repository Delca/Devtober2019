class StatePageController {
    constructor() {
        this.element = null;
        this.listData = null;
        this.sticksData = null;

        this.selectedAmount = 0;
    }
    
    initialize(element) {
        this.element = element;
        this.tabsElement = element.querySelector('.tabs');
        this.objectiveTabHeaderElement = this.tabsElement.children[0].children[1];
        this.stickTabHeaderElement = this.tabsElement.children[0].children[2];
        this.tabContentElement = element.querySelector('.tab-content-panel');
        this.objectiveTabElement = element.querySelector('.tab-content-panel > .objective-tab');
        this.stickTabElement = element.querySelector('.tab-content-panel > .stick-tab');
        this.stickGridElement = element.querySelector('.tab-content-panel > .stick-tab > .stick-grid');
        this.inventoryGridElement = element.querySelector('.tab-content-panel > .stick-tab > .inventory-grid');
        this.breakButton = element.querySelector('.break-button');

        this.loadDataFromMemory();
        this.displayListData();
    }

    loadDataFromMemory() {
        this.listData = [
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

        // ---- //

        this.sticksData = {};

        for (let i = 0; i < 10; ++i) {
            this.sticksData[i] = {
                stick: i,
                quantity: ((13 * i) % 10)
            };
        }
        
        // ---- //

        this.inventory = {
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

    displayListData() {
        this.stickTabElement.style.display = 'none';
        this.objectiveTabElement.style.display = 'grid';
        this.objectiveTabHeaderElement.classList = 'is-active';
        this.stickTabHeaderElement.classList = '';

        while (this.objectiveTabElement.firstChild) {
            this.objectiveTabElement.removeChild(this.objectiveTabElement.firstChild);
        }

        this.listData.forEach((objective, i) => {
            instantiateTemplate('objective-component', this.objectiveTabElement, new ObjectiveController(objective))
            .querySelector('.category-icon').classList += ' type-' + (i % 5);
        });
    }

    displayStickData() {
        this.objectiveTabElement.style.display = 'none';
        this.stickTabElement.style.display = 'grid';
        this.objectiveTabHeaderElement.classList = '';
        this.stickTabHeaderElement.classList = 'is-active';

        while (this.stickGridElement.firstChild) {
            this.stickGridElement.removeChild(this.stickGridElement.firstChild);
        }

        for (let i = 0; i < 10; ++i) {
            let stick = this.sticksData[i];

            instantiateTemplate('stick-component', this.stickGridElement, new StickController(stick));
        }

        let categoryContents = Object.getOwnPropertyNames(this.inventory)
            .map(productCode => this.inventory[productCode])
            .reduce((acc, val) => {
                acc[val.type] = acc[val.type] || [];

                acc[val.type].push({
                    product: val,
                    selectedAmount: 0,
                });

                return acc;
            }, {});

        while (this.inventoryGridElement.firstChild) {
            this.inventoryGridElement.removeChild(this.inventoryGridElement.firstChild);
        }

        Object.getOwnPropertyNames(categoryContents).forEach(type => {
            let categoryData = {
                type,
                name: `Category #${type}`,
                content: categoryContents[type]
            }

            instantiateTemplate('inventory-category-selector-component', this.inventoryGridElement, new InventoryCategorySelectorController(categoryData));
        });   
    }

    updateSelection(quantity = 0) {
        this.selectedAmount += quantity;
        
        this.breakButton.classList = `break-button ${this.selectedAmount > 0 ? 'enabled' : ''}`;
    }
}

export const statePageController = new StatePageController();
