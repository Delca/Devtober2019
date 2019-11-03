export class StickPanelController {
    constructor() {
        this.element = null;
    }

    initialize(element) {
        this.element = element;
        this.stickGridElement = element.querySelector('.stick-grid');
    
        this.loadDataFromMemory();
        this.updateDisplay();
    }

    loadDataFromMemory() {
        this.sticksData = {};

        for (let i = 0; i < 10; ++i) {
            this.sticksData[i] = {
                stick: i,
                quantity: ((13 * i) % 10)
            };
        }
    }

    updateDisplay() {
        while (this.stickGridElement.firstChild) {
            this.stickGridElement.removeChild(this.stickGridElement.firstChild);
        }

        for (let i = 0; i < 10; ++i) {
            let stick = this.sticksData[i];

            instantiateTemplate('stick-component', this.stickGridElement, new StickController(stick));
        }
    }
}
