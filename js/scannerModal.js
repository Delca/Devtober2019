/** @type HTMLElement */
export let scannerResultModal = null;

let scannedBarcodes = [];



export function openScannerResultModal() {
    if (scannerResultModal || scannedBarcodes.length === 0) {
        return;
    }

    var template = document.querySelector('#scanner-result-modal');

    scannerResultModal = document.importNode(template.content, true).children[0];
    document.body.appendChild(scannerResultModal);
    scannerResultModal.classList.add('is-active');

    var singleBarcode = scannerResultModal.children[1].children[1].children[0];
    var barcodeContainer = singleBarcode.parentNode; 
    singleBarcode.parentNode.removeChild(singleBarcode);

    scannedBarcodes.forEach(scannedCode => {
        let barcodeElementInstance = document.importNode(singleBarcode, true);

        barcodeElementInstance.children[1].innerText = scannedCode.code;

        barcodeContainer.appendChild(barcodeElementInstance);
    });
}
export function closeScannerResultModal() {
    if (!scannerResultModal) {
        return;
    }

    scannerResultModal.parentNode.removeChild(scannerResultModal);
    scannerResultModal = null;

    scannedBarcodes = [];
}
