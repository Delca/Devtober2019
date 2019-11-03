export class InventoryCollectionDisplayController {
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
        this.titleElement.innerHTML = this.data.name;
    }

    initializeProductRows() {
        this.data.content.forEach(productSelection => {
            let productCodeElement = document.createElement('div');
            let productNameElement = document.createElement('div');
            let detailsIconPanelElement = document.createElement('div');
            let detailsIcon = document.createElement('span');

            productCodeElement.innerText = productSelection.product.code;
            productNameElement.innerText = productSelection.product.product.name;

            detailsIcon.appendChild(document.createElement('i'));
            detailsIcon.children[0].classList = 'fas fa-search';
            detailsIcon.addEventListener('click', _ => console.log('Clicked', productSelection));
            detailsIconPanelElement.classList = 'align-center';
            detailsIconPanelElement.appendChild(detailsIcon);

            this.productGrid.appendChild(productCodeElement);
            this.productGrid.appendChild(productNameElement);
            this.productGrid.appendChild(detailsIconPanelElement);
        });
    }

    toggleContent() {
        this.contentElement.style.maxHeight = `${(this.contentOpened ? 0 : this.maxContentHeight)}px`;
        this.contentOpened = !this.contentOpened;
    }
}
