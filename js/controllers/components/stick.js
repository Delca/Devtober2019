export class StickController {
    constructor(data) {
        this.element = null;
        this.data = data;
    }

    initialize(element) {
        this.element = element;
        this.stickTypeElement = this.element.querySelector('.stick-type');
        this.stickQuantityElement = this.element.querySelector('.stick-quantity');
    
        this.stickTypeElement.innerText = this.data.stick;
        this.stickQuantityElement.innerText = this.data.quantity;
        this.stickQuantityElement.classList += (this.data.isError ? ' is-danger' : '');
    }
}
