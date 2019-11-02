export class ObjectiveController {
    constructor(data) {
        this.element = null;
        this.data = data;
        this.contentOpened = false;
    }

    initialize(element) {
        this.element = element;
        this.contentElement = element.querySelector('.card-content');
        this.titleElement = element.querySelector('.card-header-title');

        // Retrieve the correct height to animate the dropdown 
        this.maxContentHeight = this.contentElement.clientHeight;
        this.contentElement.style.maxHeight = '0px';

        // Initialize the elements
        this.titleElement.innerHTML = `<b>[${this.data.currentProgress}/${this.data.goal}]</b>&nbsp;Objective #${this.data.type}`;
        this.element.querySelector('.card-header-icon.icon-dropdown').addEventListener('click', _ => this.toggleContent());
    }

    toggleContent() {
        this.contentElement.style.maxHeight = `${(this.contentOpened ? 0 : this.maxContentHeight)}px`;
        this.contentOpened = !this.contentOpened;
    }
}
