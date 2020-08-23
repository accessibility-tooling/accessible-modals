import ModalManagerOptions from "./ModalManagerOptions";
import ModalInstance from "./ModalInstance";

export default class ModalManager {
    modalLayer: HTMLDivElement;
    instances: Array<ModalInstance> = [];
    options: ModalManagerOptions;

    constructor(options?: ModalManagerOptions) {
        this.options = options || new ModalManagerOptions();
        
        let defaultOptions: ModalManagerOptions = new ModalManagerOptions();

        this.options.modalLayerClass = this.options.modalLayerClass || defaultOptions.modalLayerClass;
        this.options.hiddenClass = this.options.hiddenClass || defaultOptions.hiddenClass;
        this.options.dismissClass = this.options.dismissClass || defaultOptions.dismissClass;

        this.instances = [];
        this.modalLayer = document.querySelector(`.${this.options.modalLayerClass}`);
    }

    configure = (modalIdentifier: string) => {
        let modalInstance: ModalInstance = new ModalInstance(document.querySelector(`#${modalIdentifier}`), this);

        let focusableNodeElements = modalInstance.modalNode.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        modalInstance.firstFocusableElement = <HTMLElement>focusableNodeElements[0];
        modalInstance.lastFocusableElement = <HTMLElement>focusableNodeElements[focusableNodeElements.length - 1];

        modalInstance.firstFocusTrapElement = document.createElement('div');
        modalInstance.firstFocusTrapElement.tabIndex = 0;

        modalInstance.firstFocusTrapElement.addEventListener('focus', (event) => {
            modalInstance.lastFocusableElement.focus();
        });

        modalInstance.lastFocusTrapElement = document.createElement('div');
        modalInstance.lastFocusTrapElement.tabIndex = 0;

        modalInstance.lastFocusTrapElement.addEventListener('focus', (event) => {
            modalInstance.firstFocusableElement.focus();
        });

        modalInstance.modalNode.parentNode.insertBefore(modalInstance.firstFocusTrapElement, modalInstance.modalNode);
        modalInstance.modalNode.parentNode.insertBefore(modalInstance.lastFocusTrapElement, modalInstance.modalNode.nextSibling);

        this.instances.push(modalInstance);

        return modalInstance;
    }

    open = (modalIdentifier: string) => {
        let modalInstance = this.instances.filter(function(instance: any) {
            return instance.modalNode.id === modalIdentifier;
        })[0];

        if (!modalInstance) {
            modalInstance = this.configure(modalIdentifier);
            this.instances.push(modalInstance);
        }

        (<HTMLElement>modalInstance.modalNode.parentNode).classList.remove(this.options.hiddenClass);
        
        if (this.modalLayer.classList.contains(this.options.hiddenClass)) {
            this.modalLayer.classList.remove(this.options.hiddenClass);
        }

        // focus first elem.
        modalInstance.firstFocusableElement.focus();
    }

    close = (modalInstance: ModalInstance) => {
        let modalIndex = this.instances.indexOf(modalInstance, 0);

        this.instances.splice(modalIndex, 1);
        (<HTMLElement>modalInstance.modalNode.parentNode).classList.add(this.options.hiddenClass);

        if (modalIndex > 0) {
            this.instances[modalIndex - 1].firstFocusableElement.focus();
        }
    }
}

declare global {
    interface Window { a11yModal: ModalManager; }
}

window.addEventListener("DOMContentLoaded", () => {
    window.a11yModal = window.a11yModal || new ModalManager();
})