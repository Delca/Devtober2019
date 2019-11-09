export class ScannerModalController {
    constructor() {
        this.element = null;
        this.scannedBarcodes = [];
    }

    initialize(element) {
        this.element = element;
        this.closeButton = element.querySelector('.close-button');

        this.closeButton.addEventListener('click', _ => ScannerModalController.close());

        this.launchScan();
    }

    launchScan() {
        if (!ScannerModalController.zxingCodeReader) {
            console.error('zxingCodeReader is not initialized (does this device have any video input ?)');
            return;
        }
        
        const scanSuccess = (result) => {
            if (this.scannedBarcodes.some(c => c.code === result.text) === false) {
                console.log(result);
                this.triggerFlashAnimation();
                this.scannedBarcodes.push({
                    code: result.text,
                    date: Date.now()
                });
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
        this.element.classList = 'scanner-modal-component successful-scan';

        setTimeout(_ => this.element.classList = 'scanner-modal-component', 60);
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

        if (ScannerModalController.zxingCodeReader) {
            ScannerModalController.zxingCodeReader.stopContinuousDecode();
        }
        ScannerModalController.instance.element.parentNode.removeChild(ScannerModalController.instance.element);
        
        window.scannedBarcodes = ScannerModalController.instance.scannedBarcodes;
        openScannerResultModal();

        ScannerModalController.instance = null;
    }
}
