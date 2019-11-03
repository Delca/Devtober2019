export class DetailsModalController {
    constructor(data) {
        this.element = null;
        this.data = data;
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

        this.categoryIcon.classList += ` type-${this.data.type}`;
        this.closeIcon.addEventListener('click', () => this.close());

        this.orderPanelTitleElement.innerText = `Order from ${this.data.maker.name}`;

        this.orderLessButtonElement.addEventListener('click', _ => this.updateCost(-1));
        this.orderMoreButtonElement.addEventListener('click', _ => this.updateCost(1));

        this.stickPanelController = new StickPanelController(this.data.cost);
        this.stickPanelElement = instantiateTemplate('stick-panel-component', this.stickCostPanelElement, this.stickPanelController);

        this.updateProductInfo();

        this.stickInventory = getStickInventory();
        this.updateCost();
    }

    updateProductInfo() {
        this.tagGridElement.children[0].children[1].innerText = this.data.maker.name;
        this.tagGridElement.children[1].children[1].innerText = 0;
        this.tagGridElement.children[2].children[1].innerText = ProductTypeName[this.data.type];
        this.tagGridElement.children[3].children[1].innerText = 0;
        this.tagGridElement.children[4].children[1].innerText = this.data.product.name;
        this.tagGridElement.children[5].children[1].innerText = 0;
        this.tagGridElement.children[6].children[1].innerText = '2019-10-10';
        this.tagGridElement.children[7].children[1].innerText = 0;
        this.tagGridElement.children[8].children[1].innerText = '2019-11-04';
        this.tagGridElement.children[9].children[1].innerText = 0;
    }

    updateCost(quantity = 0) {
        this.orderQuantity = clamp(1, this.orderQuantity + quantity, 99);
        this.orderNumberInputElement.innerText = this.orderQuantity;

        let cost = {};

        let atLeastOneUnmetCost = false;

        for (let i = 0; i < 10; ++i) {
            cost[i] = {
                stick: i,
                quantity: this.orderQuantity * (this.data.cost[i] || 0), 
            };

            cost[i].isError = (cost[i].quantity > this.stickInventory[i].quantity);
            atLeastOneUnmetCost = atLeastOneUnmetCost || cost[i].isError;
        }

        this.stickPanelController.updateDisplay(cost);
        this.placeOrderButtonElement.classList = `tag place-order-button ${atLeastOneUnmetCost ? '' : 'is-active'}`
    }

    static open(data) {
        instantiateTemplate('details-modal-component', document.body, new DetailsModalController(data));
    }

    close() {
        this.element.parentNode.removeChild(this.element);
    }
}
