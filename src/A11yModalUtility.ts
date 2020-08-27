import A11yModalInstance from "./A11yModalInstance";
import A11yModalManagerOptions from "./A11yModalManagerOptions";

export default class A11yModalUtility {
    modalLayer: HTMLDivElement;
    instances: Array<A11yModalInstance> = [];
    options: A11yModalManagerOptions;

    constructor(options?: A11yModalManagerOptions) {
        this.options = options || new A11yModalManagerOptions();
        
        let defaultOptions: A11yModalManagerOptions = new A11yModalManagerOptions();

        this.options.modalLayerClass = this.options.modalLayerClass || defaultOptions.modalLayerClass;
        this.options.hiddenClass = this.options.hiddenClass || defaultOptions.hiddenClass;
        this.options.dismissClass = this.options.dismissClass || defaultOptions.dismissClass;

        this.instances = [];
        this.modalLayer = document.querySelector(`.${this.options.modalLayerClass}`);

        document.addEventListener('keyup', this.handleKeyboardEvent);
    }

    configure = (modalIdentifier: string) => {
        let modalInstance: A11yModalInstance = new A11yModalInstance(document.querySelector(`#${modalIdentifier}`), this);

        let focusableNodeElements = modalInstance.modalNode.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        modalInstance.firstFocusableElement = <HTMLElement>focusableNodeElements[0];
        modalInstance.lastFocusableElement = <HTMLElement>focusableNodeElements[focusableNodeElements.length - 1];

        this.instances.push(modalInstance);

        return modalInstance;
    }

    open = (modalIdentifier: string) => {
        let modalInstance = this.instances.filter(function(instance: any) {
            return instance.modalNode.id === modalIdentifier;
        })[0];

        if (!modalInstance) {
            modalInstance = this.configure(modalIdentifier);
        }

        this.injectFocusTraps(modalInstance);

        (<HTMLElement>modalInstance.modalNode.parentNode).classList.remove(this.options.hiddenClass);
        
        if (this.modalLayer.classList.contains(this.options.hiddenClass)) {
            this.modalLayer.classList.remove(this.options.hiddenClass);
        }

        // focus first elem.
        modalInstance.firstFocusableElement.focus();
    }

    close = (modalInstance: A11yModalInstance) => {
        let modalIndex = this.instances.indexOf(modalInstance, 0);

        if (modalIndex === -1) {
            throw "Modal instance does not exist in modal layer.";
        }

        this.removeFocusTraps(modalInstance);
        
        // Add the a11y-hidden class back to the modal instances container.
        (<HTMLElement>modalInstance.modalNode.parentNode).classList.add(this.options.hiddenClass);

        // Remove the modal instance from the stored instances.
        this.instances.splice(modalIndex, 1)[0];

        if (modalIndex > 0) {
            this.instances[modalIndex - 1].firstFocusableElement.focus();
        }
    }

    private injectFocusTraps = (modalInstance: A11yModalInstance) => {
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
    }

    private removeFocusTraps = (modalInstance: A11yModalInstance) => {
        modalInstance.modalNode.parentNode.removeChild(modalInstance.firstFocusTrapElement);
        modalInstance.modalNode.parentNode.removeChild(modalInstance.lastFocusTrapElement);
    }

    private handleKeyboardEvent = (event: KeyboardEvent) => {
        if (event.key.toLowerCase() === 'escape' && this.instances.length > 0) {
            this.close(this.instances[this.instances.length - 1]);
        }
    }
}

declare global {
    interface Window { a11yModalUtil: A11yModalUtility; }
}

window.addEventListener("DOMContentLoaded", () => {
    window.a11yModalUtil = window.a11yModalUtil || new A11yModalUtility();
})