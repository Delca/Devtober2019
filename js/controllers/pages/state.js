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
        this.stickGridElement = instantiateTemplate('stick-panel-component', this.stickGridElement, new StickPanelController());
        this.stickTabElement.insertBefore(this.stickGridElement, this.stickTabElement.firstChild);
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

        this.inventory = getInventory();
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
            .querySelector('.icon-category').classList += ' type-' + (i % 5);
        });
    }

    displayStickData() {
        this.objectiveTabElement.style.display = 'none';
        this.stickTabElement.style.display = 'grid';
        this.objectiveTabHeaderElement.classList = '';
        this.stickTabHeaderElement.classList = 'is-active';

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
