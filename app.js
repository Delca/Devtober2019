if ('serviceWorker' in navigator) {
   navigator.serviceWorker.register('/Devtober2019/mainSW.js');
}

var importFilenames = [
    '/Devtober2019/js/scannerModal.js'
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

importFile(importFile);

console.log('app.js LOG');

window.addEventListener('load', () => {
    console.log('app.js LOAD LOG');

    if (window.location.hostname !== 'localhost') {
        checkForVideoInput();
    }

    var templatesToLoad = ['scannerModal', 'scannerResultModal'];
    var parser = new DOMParser();

    templatesToLoad.forEach((async templateName => {
        let response = await fetch(`templates/${templateName}.html`);
        let responseText = await response.text();
        
        if (response.status < 200 || response.status > 299) {
            console.error(`Could not load template ${templateName} [${response.status}]: ${responseText}`);
            return;
        }

        var template = parser.parseFromString(responseText, 'text/html').querySelector('head > template');
        document.body.appendChild(template);
        console.log(`Imported template ${templateName}`);
    }));
});
