/** @type HTMLElement */
export let scannerModal = null;
export let scannerResultModal = null;
export let zxingCodeReader = null;

let scannedBarcodes = [];

function launchScan() {
    const scanSuccess = (result) => {
        if (scannedBarcodes.some(c => c.code === result.text) === false) {
            console.log(result);
            scannedBarcodes.push({
                code: result.text,
                date: Date.now()
            });
        }
    }

    zxingCodeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
            if (videoInputDevices.length === 0) {
                alert('No camera detected - This game requires a video input to play :-(');
            } else {
                zxingCodeReader
                    .decodeFromInputVideoDeviceContinuously(undefined, 'video', (result, err) => {
                        if (result) {
                            scanSuccess(result);
                        }
                    });
            }
        })
        .catch(err => console.error(err));
}

export function openScannerModal() {
    if (scannerModal) {
        return;
    }

    scannerModal = instantiateTemplate('scanner-modal', document.body);
    scannerModal.classList.add('is-active');

    launchScan();
}
export function closeScannerModal() {
    if (!scannerModal) {
        return;
    }

    scannerModal.parentNode.removeChild(scannerModal);
    scannerModal = null;
    zxingCodeReader.stopContinuousDecode();

    openScannerResultModal();
}

export function checkForVideoInput() {
    zxingCodeReader = new ZXing.BrowserBarcodeReader();

    zxingCodeReader
      .listVideoInputDevices()
      .then(videoInputDevices => {
        if (videoInputDevices.length === 0) {
            alert('No camera detected - This game requires a video input to play :-(');
        }
      })
      .catch(err => console.error(err));
}

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
