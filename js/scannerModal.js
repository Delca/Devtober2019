/** @type HTMLElement */
export let scannerModal = null;
export let zxingCodeReader = null;

let scannedBarcodes = [];

function launchScan() {
    zxingCodeReader
        .listVideoInputDevices()
        .then(videoInputDevices => {
            if (videoInputDevices.length === 0) {
                alert('No camera detected - This game requires a video input to play :-(');
            } else {
                zxingCodeReader
                    .decodeOnceFromVideoDevice(undefined, 'video')
                    .then(result => {
                        console.log(result.text);
                        scannedBarcodes.push({
                            code: result.text,
                            date: Date.now()
                        });
                        launchScan();
                    })
                    .catch(err => console.error(err));
            }
        })
        .catch(err => console.error(err));
}
export function openScannerModal() {
    if (scannerModal) {
        return;
    }

    var template = document.querySelector('#scanner-modal');

    scannerModal = document.importNode(template.content, true).children[0];
    document.body.appendChild(scannerModal);
    scannerModal.classList.add('is-active');

    launchScan();
}
export function closeScannerModal() {
    if (!scannerModal) {
        return;
    }

    scannerModal.parentNode.removeChild(scannerModal);
    scannerModal = null;

    if (scannedBarcodes.length > 0) {
        alert(`Barcode scanned:\n${scannedBarcodes.map(code => code.code).join('\n')}`);

        scannedBarcodes.length = 0;
    }
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

