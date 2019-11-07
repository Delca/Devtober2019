if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('/Devtober2019/js/mainSW.js');
}

var templatesToLoad = [
    'scannerModal',
    'scannerResultModal',

    'pages/home',
    'pages/state',
    'pages/collection',

    'components/objective',
    'components/stick',
    'components/stickPanel',
    'components/inventoryCategorySelector',
    'components/inventoryCollectionDisplay',
    'components/detailsModal',
];
var importFilenames = [
    '/Devtober2019/js/scannerModal.js',
    '/Devtober2019/js/data.js',
    '/Devtober2019/js/controllers/navigation.js',
    '/Devtober2019/js/controllers/pages/state.js',
    '/Devtober2019/js/controllers/pages/collection.js',
    '/Devtober2019/js/controllers/components/objective.js',
    '/Devtober2019/js/controllers/components/stick.js',
    '/Devtober2019/js/controllers/components/stickPanel.js',
    '/Devtober2019/js/controllers/components/inventoryCategorySelector.js',
    '/Devtober2019/js/controllers/components/inventoryCollectionDisplay.js',
    '/Devtober2019/js/controllers/components/detailsModal.js',
    '/Devtober2019/js/generation/rng.js',
    '/Devtober2019/js/generation/objective.js',
];
var index = 0;

function importFile(callback) {
    if (importFilenames.length === index) {
        return;
    }

    import(importFilenames[index]).then(module => {
        Object.assign(window, module);

        console.log(`Imported ${importFilenames[index]}`);
        ++index;
        callback(importFile);
    });
}

function clamp(a, b, c) {
    return (Math.min(Math.max(a, b), c));
}

/**
 * @param {string} templateID
 * @param {HTMLElement} parent
 * @returns {HTMLElement}
 */
function instantiateTemplate(templateID, parent = document.body, controller = null) {
    var template = document.querySelector(`#${templateID}`);

    if (!template) {
        console.error(`template ${templateID} is invalid: ${template}`);
        return;
    }

    var instance = document.importNode(template.content, true).children[0];
    parent.appendChild(instance);

    let controllerName = instance.getAttribute('data-controller');
    if (controllerName && window[controllerName] && window[controllerName].initialize) {
        controller = window[controllerName];
    }

    if (controller) {
        controller.initialize(instance);
    }

    return instance;
}

importFile(importFile);

console.log('app.js LOG');

window.addEventListener('load', async () => {
    console.log('app.js LOAD LOG');

    if (window.location.hostname !== 'localhost') {
        checkForVideoInput();
    }

    var parser = new DOMParser();
    var processed = 0;
    var resolve = () => {console.error('RESOLVE UNSET !');};

    templatesToLoad.forEach((async templateName => {
        let finish = () => {
            if (++processed === templatesToLoad.length) {
                resolve();
            }
        };

        try {
            let response = await fetch(`templates/${templateName}.html`);
            let responseText = await response.text();

            if (response.status < 200 || response.status > 299) {
                console.error(`Could not load template ${templateName} [${response.status}]: ${responseText}`);
                return;
            }

            var template = parser.parseFromString(responseText, 'text/html').querySelector('head > template');
            document.body.appendChild(template);
            console.log(`Imported template ${templateName}`);
        }
        catch (e) {
            console.error(`Error while loading template ${templatesToLoad}: ${e}`);
        }
        finally {
            finish();
        }
    }));

    await new Promise((r) => {
        resolve = r;
    });

    navigationController.openPage('state-page');
});
