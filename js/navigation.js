class NavigationController {
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
            duration: .35,
            easing: (t) => ((--t)*t*t+1),
        }, options);

        let oldPage = this.currentPage || { style: {} };
        let newPage = instantiateTemplate(templateId, this.rootElement);
        
        let startTime = Date.now();
        let resolve = null;

        let animate = () => {
            let now = Date.now();
            let progress = options.easing(clamp(0, ((now - startTime) / (options.duration * 1000)), 1));
            let done = (progress >= 1);
        
            oldPage.style.marginLeft = `${(options.fromRight ? -1 : 1) * (100 * progress)}%`;
            newPage.style.marginLeft = `${(options.fromRight ? 1 : -1) * (100 * (1 - progress))}%`;

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
