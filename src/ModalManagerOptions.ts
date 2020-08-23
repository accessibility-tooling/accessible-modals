export default class ModalManagerOptions {
    constructor(modalLayerClass?: string, hiddenClass?: string, dismissClass?: string) {
        
    }

    modalLayerClass: string = 'a11y-modal-layer';
    hiddenClass: string = 'a11y-hidden';
    dismissClass: string = 'a11y-modal-dismiss';
}