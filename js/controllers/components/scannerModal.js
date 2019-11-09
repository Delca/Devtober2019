export class ScannerModalController {
    constructor() {
        this.element = null;
        this.scannedBarcodes = [];
    }

    initialize(element) {
        this.element = element;
        this.closeButton = element.querySelector('.close-button');
        this.scanOverlayElement = element.querySelector('.scan-overlay');
        this.scanCounterElement = element.querySelector('.scan-counter');
        this.lastScanElement = element.querySelector('.last-scan');

        this.closeButton.addEventListener('click', _ => ScannerModalController.close());

        this.launchScan();
    }

    updateScanHUD() {
        this.scanCounterElement.innerText = this.scannedBarcodes.length;
        this.lastScanElement.classList = `last-scan ${this.scannedBarcodes.length > 0 ? 'active' : ''}`;
        this.lastScanElement.innerText = (this.scannedBarcodes.length > 0 ? this.scannedBarcodes[this.scannedBarcodes.length - 1].code : '');
    
        this.closeButton.innerText = (this.scannedBarcodes.length === 0 ? 'Close' : 'Store and close');
    }

    launchScan() {
        if (!ScannerModalController.zxingCodeReader) {
            console.error('zxingCodeReader is not initialized (does this device have any video input ?)');
            return;
        }
        
        const scanSuccess = (result) => {
            const scannedCode = result.text.replace(/[^0-9]/g, '');

            if (scannedCode.length > 0 && this.scannedBarcodes.some(c => c.code === scannedCode) === false) {
                console.log(result);
                this.scannedBarcodes.push({
                    code: scannedCode,
                    date: Date.now()
                });
                this.updateScanHUD();
                this.triggerFlashAnimation();
            }
        }
    
        ScannerModalController.zxingCodeReader
            .listVideoInputDevices()
            .then(videoInputDevices => {
                if (videoInputDevices.length === 0) {
                    alert('No camera detected - This game requires a video input to play :-(');
                } else {
                    ScannerModalController.zxingCodeReader
                        .decodeFromInputVideoDeviceContinuously(undefined, 'video', (result, err) => {
                            if (result) {
                                scanSuccess(result);
                            }
                        });
                }
            })
            .catch(err => console.error(err));
    }

    triggerFlashAnimation() {
        this.scanOverlayElement.classList = 'scan-overlay successful-scan';

        setTimeout(_ => this.scanOverlayElement.classList = 'scan-overlay', 60);
    }

    static checkForVideoInput() {
        ScannerModalController.zxingCodeReader = new ZXing.BrowserBarcodeReader();
    
        ScannerModalController.zxingCodeReader
          .listVideoInputDevices()
          .then(videoInputDevices => {
            if (videoInputDevices.length === 0) {
                alert('No camera detected - This game requires a video input to play :-(');
            }
          })
          .catch(err => console.error(err));
    }

    static open() {
        if (!ScannerModalController.instance) {
            ScannerModalController.instance = new ScannerModalController();
            instantiateTemplate('scanner-modal-component', document.body, ScannerModalController.instance);
        } else {
            console.error('Only one scanner modal can be opened at a time');
        }
    }

    static close() {
        if (!ScannerModalController.instance) {
            console.error('A scanner modal must be open to be able to close it');
            return;
        }

        manipulateUserData('inventory', (inventoryData) => {
            ScannerModalController.instance.scannedBarcodes.forEach(scannedCode => {
                addProductToInventory(inventoryData, scannedCode.code, 1);
            });
        });

        if (ScannerModalController.zxingCodeReader) {
            ScannerModalController.zxingCodeReader.stopContinuousDecode();
        }
        ScannerModalController.instance.element.parentNode.removeChild(ScannerModalController.instance.element);
        
        window.scannedBarcodes = ScannerModalController.instance.scannedBarcodes;
        openScannerResultModal();

        ScannerModalController.instance = null;
    }
}
