export class DetailsModalController {
    constructor(data) {
        this.element = null;
        this.data = data;
        this.singleCost = getProductCodeCost(data.code);
        this.stickInventory = null;
        this.orderQuantity = 1;
    }

    initialize(element) {
        this.element = element;
        this.categoryIcon = element.querySelector('.icon-category');
        this.closeIcon = element.querySelector('.icon-close');
        this.tagGridElement = element.querySelector('.tag-grid');
        this.stickCostPanelElement = element.querySelector('.stick-cost-panel');
        this.orderPanelTitleElement = element.querySelector('.order-panel-title');
        this.orderNumberInputElement = element.querySelector('.order-number-input > .order-quantity');
        this.orderLessButtonElement = element.querySelector('.order-number-input > span:first-child');
        this.orderMoreButtonElement = element.querySelector('.order-number-input > span:last-child');
        this.placeOrderButtonElement = element.querySelector('.place-order-button');
        this.titleElement = element.querySelector('.card-header-title');

        this.titleElement.innerText = this.data.code;
        createIcon(CategoryIcons[this.data.category], this.categoryIcon.children[0]);
        this.categoryIcon.classList += ` type-${this.data.category}`;
        this.closeIcon.addEventListener('click', () => this.close());

        this.orderPanelTitleElement.innerText = `Order from ${this.data.maker.name}`;

        this.orderLessButtonElement.addEventListener('click', _ => this.updateCostDisplay(-1));
        this.orderMoreButtonElement.addEventListener('click', _ => this.updateCostDisplay(1));
        this.placeOrderButtonElement.addEventListener('click', _ => this.placeOrder());

        this.stickPanelController = new StickPanelController(this.data.cost);
        this.stickPanelElement = instantiateTemplate('stick-panel-component', this.stickCostPanelElement, this.stickPanelController);

        this.updateProductInfo();

        this.stickInventory = getStickInventoryData();
        this.updateCostDisplay();
    }

    formatDate(timestamp) {
        if (!timestamp) {
            return '-';
        }

        const date = new Date(timestamp);

        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }

    updateProductInfo() {
        this.tagGridElement.children[0].children[1].innerText = this.data.maker.name;
        this.tagGridElement.children[1].children[1].innerText = this.data.stats.timesScanned;
        this.tagGridElement.children[2].children[1].innerText = ProductTypeName[this.data.category];
        this.tagGridElement.children[3].children[1].innerText = this.data.stats.timesOrdered;
        this.tagGridElement.children[4].children[1].innerText = this.data.product.name;
        this.tagGridElement.children[5].children[1].innerText = this.data.stats.timesGifted;
        this.tagGridElement.children[6].children[1].innerText = this.formatDate(this.data.stats.firstScanTimestamp);
        this.tagGridElement.children[7].children[1].innerText = this.data.stats.timesSubmitted;
        this.tagGridElement.children[8].children[1].innerText = this.formatDate(this.data.stats.lastScanTimestamp);
        this.tagGridElement.children[9].children[1].innerText = this.data.stats.timesBroken;
    }

    computeCost() {
        const cost = {};

        this.preventPlacingOrder = false;

        for (let i = 0; i < 10; ++i) {
            cost[i] = {
                stick: i,
                quantity: this.orderQuantity * (this.singleCost[i].quantity || 0),
            };

            cost[i].isError = (cost[i].quantity > this.stickInventory[i].quantity);
            this.preventPlacingOrder = this.preventPlacingOrder || cost[i].isError;
        }

        return cost;
    }

    updateCostDisplay(quantity = 0) {
        this.orderQuantity = clamp(1, this.orderQuantity + quantity, 99);
        this.orderNumberInputElement.innerText = this.orderQuantity;

        let cost = this.computeCost();

        this.stickPanelController.updateDisplay(cost);
        this.placeOrderButtonElement.classList = `tag place-order-button ${this.preventPlacingOrder ? '' : 'is-active'}`
    }

    static open(data) {
        instantiateTemplate('details-modal-component', document.body, new DetailsModalController(data));
    }

    placeOrder() {
        const cost = this.computeCost();

        manipulateUserData('inventory', (inventoryData) => {
            for (let i = 0; i <= 9; ++i) {
                inventoryData.sticks[i].quantity = clamp(0, (inventoryData.sticks[i].quantity - cost[i].quantity), 999);
            }

            const product = inventoryData.products[this.data.code];

            product.quantity += this.orderQuantity;

            if (product.stats) {
                product.stats.timesOrdered += this.orderQuantity;
            }
            
            this.close();
            DetailsModalController.open(product);
        });
    }

    close() {
        this.element.parentNode.removeChild(this.element);
    }
}
