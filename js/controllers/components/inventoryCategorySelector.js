export class InventoryCategorySelectorController {
    constructor(data) {
        this.element = null;
        this.data = data;
        this.contentOpened = false;

        this.totalSelectedAmount = 0;
    }

    initialize(element) {
        this.element = element;
        this.categoryIcon = element.querySelector('.category-icon');
        this.contentElement = element.querySelector('.card-content');
        this.titleElement = element.querySelector('.card-header-title');
        this.productGrid = element.querySelector('.product-grid');

        // Initialize the elements
        this.categoryIcon.classList += ` type-${this.data.type}`;
        this.element.querySelector('.card-header-icon.icon-dropdown').addEventListener('click', _ => this.toggleContent());
        this.initializeProductRows();
        this.updateSelection();

        // Retrieve the correct height to animate the dropdown 
        this.maxContentHeight = this.contentElement.clientHeight;
        this.contentElement.style.maxHeight = '0px';
    }

    updateSelection(quantity = 0) {
        this.totalSelectedAmount += quantity;
        this.titleElement.innerHTML = `<b>[${this.totalSelectedAmount}]</b>&nbsp;${this.data.name}`;
        statePageController.updateSelection(quantity);
    }

    initializeProductRows() {
        this.data.content.forEach(productSelection => {
            let productNameElement = document.createElement('div');
            let selectedAmountElement = document.createElement('div');
            let minusPlusPanelElement = document.createElement('div');
            let minusIcon = document.createElement('span');
            let unbreakableSpace = document.createElement('span');
            let plusIcon = document.createElement('span');

            let updateSelection = (quantity) => {
                let oldValue = productSelection.selectedAmount;
                productSelection.selectedAmount = clamp(0, oldValue + quantity, productSelection.product.quantity);

                if (oldValue !== productSelection.selectedAmount) {
                    selectedAmountElement.innerText = `${productSelection.selectedAmount}/${productSelection.product.quantity}`;
                    this.updateSelection(quantity);
                }
            }

            productNameElement.innerText = productSelection.product.product.name;
            selectedAmountElement.innerText = `${productSelection.selectedAmount}/${productSelection.product.quantity}`;
            selectedAmountElement.classList = 'align-center';
            minusIcon.appendChild(document.createElement('i'));
            minusIcon.children[0].classList = 'fas fa-minus';
            minusIcon.addEventListener('click', _ => updateSelection(-1));
            plusIcon.appendChild(document.createElement('i'));
            plusIcon.children[0].classList = 'fas fa-plus';
            plusIcon.addEventListener('click', _ => updateSelection(1));
            unbreakableSpace.innerText = '\xa0';
            minusPlusPanelElement.classList = 'align-center';

            minusPlusPanelElement.appendChild(minusIcon);
            minusPlusPanelElement.appendChild(unbreakableSpace);
            minusPlusPanelElement.appendChild(plusIcon);
            this.productGrid.appendChild(productNameElement);
            this.productGrid.appendChild(selectedAmountElement);
            this.productGrid.appendChild(minusPlusPanelElement);
        });
    }

    toggleContent() {
        this.contentElement.style.maxHeight = `${(this.contentOpened ? 0 : this.maxContentHeight)}px`;
        this.contentOpened = !this.contentOpened;
    }
}
