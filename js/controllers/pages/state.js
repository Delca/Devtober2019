class StatePageController {
    constructor() {
        this.element = null;
        this.objectiveData = null;
        this.sticksData = null;

        this.selectedAmount = 0;
        this.inventorySelectionControllers = [];
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

        this.breakButton.addEventListener('click', _ => this.breakSelection());

        this.displayObjectiveData();
    }

    displayObjectiveData() {
        this.objectiveData = getObjectiveData();

        this.stickTabElement.style.display = 'none';
        this.objectiveTabElement.style.display = 'grid';
        this.objectiveTabHeaderElement.classList = 'is-active';
        this.stickTabHeaderElement.classList = '';


        while (this.objectiveTabElement.firstChild) {
            this.objectiveTabElement.removeChild(this.objectiveTabElement.firstChild);
        }

        this.objectiveData.objectiveList.objectives.forEach((objective, i) => {
            const controller = new ObjectiveController(objective);
            instantiateTemplate('objective-component', this.objectiveTabElement, controller)
                .querySelector('.icon-category').classList += ' type-' + (i % 5);
        });
    }

    displayStickData() {
        this.inventory = getInventoryData();
        this.stickGridElement.controller.updateDisplay(this.inventory.sticks);

        this.objectiveTabElement.style.display = 'none';
        this.stickTabElement.style.display = 'grid';
        this.objectiveTabHeaderElement.classList = '';
        this.stickTabHeaderElement.classList = 'is-active';

        let categoryContents = Object.getOwnPropertyNames(this.inventory.products)
            .map(productCode => this.inventory.products[productCode])
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

        this.selectedAmount = 0;
        this.inventorySelectionControllers.length = 0;


        Object.getOwnPropertyNames(categoryContents).forEach(type => {
            let categoryData = {
                type,
                name: `Category #${type}`,
                content: categoryContents[type]
            }

            const controller = new InventoryCategorySelectorController(categoryData);
            this.inventorySelectionControllers.push(controller);
            instantiateTemplate('inventory-category-selector-component', this.inventoryGridElement, controller);
        });
    }

    updateSelection(quantity = 0) {
        this.selectedAmount += quantity;

        this.breakButton.classList = `break-button ${this.selectedAmount > 0 ? 'enabled' : ''}`;
    }

    breakSelection() {
        if (this.selectedAmount <= 0) {
            return;
        }

        const codesToBreak = this.inventorySelectionControllers.reduce((acc, val) => {
            val.data.content.forEach(productSelection => {
                if (productSelection.selectedAmount > 0) {
                    acc = acc.concat(Array(productSelection.selectedAmount).fill(productSelection.product.code));
                }
            });

            return acc;
        }, []);

        const earnedSticks = createEmptyStickWallet();

        const currentSeed = RNG.getCurrentSeed();
        codesToBreak.forEach(code => breakCode(code, earnedSticks));
        RNG.setCurrentSeed(currentSeed);

        manipulateUserData('inventory', (inventoryData) => {
            // Update the user data
            transferStickWallet(earnedSticks, inventoryData.sticks);

            codesToBreak.forEach(productCode => {
                inventoryData.products[productCode].quantity = clamp(0, (inventoryData.products[productCode].quantity - 1) , 999);
            });
        });

        console.log(earnedSticks);

        this.displayStickData();
    }
}

export const statePageController = new StatePageController();
