export class StickPanelController {
    constructor(data = null) {
        this.element = null;
        this.data = data;
    }

    initialize(element) {
        this.element = element;
        this.stickGridElement = element.querySelector('.stick-grid');

        if (this.data === null) {
            this.loadDataFromMemory();
        }
        this.updateDisplay();
    }

    loadDataFromMemory() {
        this.data = getStickInventoryData();
    }

    updateDisplay(data = null) {
        if (data === null) {
            data = this.data;
        }

        while (this.stickGridElement.firstChild) {
            this.stickGridElement.removeChild(this.stickGridElement.firstChild);
        }

        for (let i = 0; i < 10; ++i) {
            let stick = (typeof data[i] === 'object' ? data[i] : { stick: i, quantity: (data[i] || 0), isError: false });

            instantiateTemplate('stick-component', this.stickGridElement, new StickController(stick));
        }
    }
}
