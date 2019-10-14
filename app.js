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
});
