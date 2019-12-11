class HomePageController {
    constructor() {
        this.element = null;
        this.resetCount = 10;
    }

    initialize(element) {
        this.element = element;
        this.listCompletionCountElement = element.querySelector('.list-completion-count');
        this.title = element.querySelector('h1');

        const objectiveData = getObjectiveData();
        this.listCompletionCountElement.innerText = `Completed lists: ${objectiveData.userLevel}`;

        this.title.addEventListener('click', _ => {
            --this.resetCount;

            if (this.resetCount <= 0) {
                let clearData = confirm('One more click on the title and user data will be reset!');

                if (clearData) {
                    clearUserData();
                    this.resetCount = 10;
                }
            }
        });
    }
}

export const homePageController = new HomePageController();
