export class NavigationController {
    constructor(rootElement) {
        this.rootElement = rootElement;
        this.currentPage = null;
        this.animating = false;        
    }

    async openPage(templateId, options) {
        if (this.animating) {
            console.error(`Cannot open page ${templateId}, another animation is still ongoing`);
            return;
        }

        options = Object.assign({}, {
            fromRight: true,
            duration: .3,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            controller: null
        }, options);

        let oldPage = this.currentPage || { style: {} };
        let newPage = instantiateTemplate(templateId, this.rootElement, options.controller);

        newPage.style.marginLeft = `${(options.fromRight ? 100 : -100)}%`;
        newPage.style.transition = `margin-left ${options.duration}s ${options.easing}`;
        oldPage.style.marginLeft = '0%';

        let startTime = Date.now();
        let resolve = null;

        let cycleCount = 0;
        let animate = () => {
            let now = Date.now();
            let progress = clamp(0, ((now - startTime) / (options.duration * 1000)), 1);
            let done = (progress >= 1);
        
            // Since the new page just got instantiated in the same frame,
            // we have to wait to trigger the transition
            // One cycle seems to fail sometimes, so we wait two more just in case
            if (++cycleCount === 4) {
                oldPage.style.marginLeft = `${(options.fromRight ? -100 : 100)}%`;
                newPage.style.marginLeft = '0%';
            }

            if (done === false) {
                requestAnimationFrame(animate);
            } else {
                if (this.currentPage) {
                    this.rootElement.removeChild(this.currentPage);
                }
                this.currentPage = newPage;
                this.animating = false;
                resolve();
            }
        }

        this.animating = true;
        animate();

        await new Promise(r => resolve = r);
    }
}

export const navigationController = new NavigationController(document.body);
