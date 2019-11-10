export class ObjectiveController {
    constructor(data, objectiveIndex) {
        this.element = null;
        this.data = data;
        this.contentOpened = false;
        this.objectiveIndex = objectiveIndex;
    }

    initialize(element) {
        this.element = element;
        this.contentElement = element.querySelector('.card-content');
        this.titleElement = element.querySelector('.card-header-title');
        this.objectiveDescriptionElement = element.querySelector('.objective-description');
        this.objectiveCategoryCounterElement = element.querySelector('.objective-category');
        this.objectiveMakerCounterElement = element.querySelector('.objective-maker');
        this.objectiveProductCounterElement = element.querySelector('.objective-product');
        this.productGrid = element.querySelector('.product-grid');
        this.submitButton = element.querySelector('.submit-button');
        this.categoryIconElement = element.querySelector('.icon-category');

        // Initialize the elements
        createIcon((this.data.objectiveType === 0 ? 'fa-smile' : CategoryIcons[this.data.categoryId]), this.categoryIconElement.children[0]);
        this.element.querySelector('.card-header-icon.icon-dropdown').addEventListener('click', _ => this.toggleContent());
        this.submitButton.addEventListener('click', _ => this.submitSelection());

        this.initializeHTMLFromObjectiveData();

        // Retrieve the correct height to animate the dropdown
        this.maxContentHeight = this.contentElement.clientHeight;
        this.contentElement.style.maxHeight = '0px';
    }

    toggleContent() {
        this.contentElement.style.maxHeight = `${(this.contentOpened ? 0 : this.maxContentHeight)}px`;
        this.contentOpened = !this.contentOpened;
    }

    getObjectiveName() {
        switch (this.data.objectiveType) {
            case ObjectiveType.Whatever:
                return 'Anything goes';
            case ObjectiveType.Category:
                return ProductTypeName[this.data.categoryId];
            case ObjectiveType.Maker:
                return generateMakerName(this.data.makerId);
            case ObjectiveType.Product:
                return getProductName(this.data.categoryId, this.data.productId);
            case ObjectiveType.Target:
                return `${getProductName(this.data.categoryId, this.data.productId)} from ${generateMakerName(this.data.makerId)}`;
        }
    }

    initializeHTMLFromObjectiveData() {
        this.titleElement.innerHTML = `<b>[${this.data.submitted.length}/${this.data.goalQuantity}]</b>&nbsp;${this.getObjectiveName()}`;

        this.objectiveCategoryCounterElement.children[1].innerText = ProductTypeName[this.data.categoryId];
        this.objectiveMakerCounterElement.children[1].innerText = generateMakerName(this.data.makerId);
        this.objectiveProductCounterElement.children[1].innerText = getProductName(this.data.categoryId, this.data.productId);

        [
            this.objectiveCategoryCounterElement,
            this.objectiveMakerCounterElement,
            this.objectiveProductCounterElement,
        ].forEach(tagElement => {
            tagElement.style.display = 'none';

            while (tagElement.children[0].firstChild) {
                tagElement.children[0].removeChild(tagElement.children[0].firstChild);
            }

            createIcon(CategoryIcons[this.data.categoryId], tagElement.children[0]);
        });
        
        let description = '';
        switch (this.data.objectiveType) {
            case 0:
                description = 'Anything will do, we just need some products in the shop!';
                break;
            case 1:
                description = 'We need a specific kind of product, stat!';
                this.objectiveCategoryCounterElement.style.display = 'flex';
                break;
            case 2:
                description = 'Customers are complaining about not finding products from a certain maker here!';
                this.objectiveMakerCounterElement.style.display = 'flex';
                break;
            case 3:
                description = 'We need this particular product, no matter where it came from!';
                this.objectiveProductCounterElement.style.display = 'flex';
                break;
            case 4:
                description = 'We really need this specific product from this specific maker!';
                this.objectiveMakerCounterElement.style.display = 'flex';
                this.objectiveProductCounterElement.style.display = 'flex';
                break;

            default:
                description = 'ERROR - This should never happen :S'
                break;
        }
        this.objectiveDescriptionElement.innerText = description;

        const inventory = getInventoryData();

        this.selection = {
            products: {},
            total: 0,
        };

        while (this.productGrid.firstChild) {
            this.productGrid.removeChild(this.productGrid.firstChild);
        }

        if (this.data.goalQuantity > this.data.submitted.length) {
            Object.getOwnPropertyNames(inventory.products)
                .filter(productCode => productMatchObjective(inventory.products[productCode], this.data))
                .sort((productCodeA, productCodeB) => (inventory.products[productCodeB].quantity - inventory.products[productCodeA].quantity))
                .forEach(productCode => {
                    const product = inventory.products[productCode];

                    let productNameElement = document.createElement('div');
                    let selectedAmountElement = document.createElement('div');
                    let minusPlusPanelElement = document.createElement('div');
                    let minusIcon = document.createElement('span');
                    let unbreakableSpace = document.createElement('span');
                    let plusIcon = document.createElement('span');

                    let updateSelection = (quantity) => {
                        const oldQuantity = (this.selection.products[productCode] || 0);
                        const newQuantity = clamp(0, oldQuantity + quantity, product.quantity);

                        if (oldQuantity != newQuantity) {
                            const newTotal = clamp(0, this.selection.total + quantity, this.data.goalQuantity - this.data.submitted.length);

                            if (this.selection.total != newTotal) {
                                this.selection.products[productCode] = newQuantity;
                                this.selection.total = newTotal;

                                selectedAmountElement.innerText = `${newQuantity}/${product.quantity}`;
                                this.submitButton.classList = `submit-button ${newTotal > 0 ? 'enabled' : ''}`;
                            }
                        }
                    }

                    productNameElement.innerText = product.product.name;
                    selectedAmountElement.innerText = (product.quantity > 0 ? `${0}/${product.quantity}` : 0);
                    selectedAmountElement.classList = 'align-center';
                    minusIcon.appendChild(document.createElement('i'));
                    minusIcon.children[0].classList = 'fas fa-minus';
                    minusIcon.addEventListener('click', _ => updateSelection(-1));
                    plusIcon.appendChild(document.createElement('i'));
                    plusIcon.children[0].classList = 'fas fa-plus';
                    plusIcon.addEventListener('click', _ => updateSelection(1));
                    unbreakableSpace.innerText = '\xa0';
                    minusPlusPanelElement.classList = 'align-center';

                    if (product.quantity > 0) {
                        minusPlusPanelElement.appendChild(minusIcon);
                        minusPlusPanelElement.appendChild(unbreakableSpace);
                        minusPlusPanelElement.appendChild(plusIcon);
                    }
                    this.productGrid.appendChild(productNameElement);
                    this.productGrid.appendChild(selectedAmountElement);
                    this.productGrid.appendChild(minusPlusPanelElement);
                });
        }
        else {
            this.submitButton.style.display = 'none';
            this.productGrid.style.display = 'none';
            this.categoryIconElement.classList = 'card-header-icon icon-category type-' + this.data.categoryId;
        }
    }

    submitSelection() {
        if (this.selection.total <= 0) {
            return;
        }

        const self = this;
        const submittedProducts = Object.getOwnPropertyNames(this.selection.products)
            .filter(productCode => this.selection.products[productCode] > 0)
            .map(code => ({
                code,
                quantity: this.selection.products[code]
            }));

        manipulateUserData(['inventory', 'objective'], (inventoryData, objectiveData) => {
            const objective = objectiveData.objectiveList.objectives[this.objectiveIndex];

            submittedProducts.forEach(productSubmission => {
                const inventorySlot = inventoryData.products[productSubmission.code];
                objective.submitted = objective.submitted.concat(Array(productSubmission.quantity).fill(0).map(_ => productSubmission.code));

                inventorySlot.quantity = clamp(0, inventorySlot.quantity - productSubmission.quantity, 999);

                if (inventorySlot.stats) {
                    inventorySlot.stats.timesSubmitted += productSubmission.quantity;
                }
            });

            if (objective.submitted.length >= objective.goalQuantity) {
                objective.completionTimestamp = Date.now();
                self.toggleContent();
            }

            if (isObjectiveListCompleted(objectiveData.objectiveList)) {
                objectiveData.objectiveList.completionTimestamp = objective.completionTimestamp;
                objectiveData.completionHistory.push(objectiveData.objectiveList);
                objectiveData.userLevel += 1;
                objectiveData.objectiveList = null;

                navigationController.openPage('home-page');
            }

            self.data = objective;
        });

        this.initializeHTMLFromObjectiveData();
    }
}
