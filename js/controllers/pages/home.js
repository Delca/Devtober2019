class HomePageController {
    constructor() {
        this.element = null;
    }
    
    initialize(element) {
        this.element = element;
        this.listCompletionCountElement = element.querySelector('.list-completion-count');

        const objectiveData = getObjectiveData();
        this.listCompletionCountElement.innerText = `Completed lists: ${objectiveData.userLevel}`;
    }
}

export const homePageController = new HomePageController();
