class StatePageController {
    constructor() {
        this.element = null;
        this.listData = null;
        this.sticksData = null;
    }
    
    initialize(element) {
        this.element = element;
        this.tabsElement = document.querySelector('.state-page > .tabs');
        this.tabContentElement = document.querySelector('.state-page > .tab-content-panel');
        this.objectiveListElement = document.querySelector('.state-page > .tab-content-panel > .objective-list');

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
        this.sticksData = {};

        for (let i = 0; i < 10; ++i) {
            this.sticksData[i] = {
                stick: i,
                amount: ((13 * i) % 10)
            };
        }        
    }

    displayListData() {
        this.listData.forEach(objective => {
            instantiateTemplate('objective-component', this.objectiveListElement, new ObjectiveController(objective));
        });
    }
}

export const statePageController = new StatePageController();
