import ModalManager from "./ModalManager";

export default class ModalInstance {
    firstFocusTrapElement: HTMLDivElement;
    lastFocusTrapElement: HTMLDivElement;

    firstFocusableElement: HTMLElement;
    lastFocusableElement: HTMLElement;
    
    modalNode: HTMLDivElement;
    dismissNode: HTMLButtonElement;

    constructor(modalNode: HTMLDivElement, modalManagerInstance: ModalManager) {
        this.modalNode = modalNode;
        this.dismissNode = this.modalNode.querySelector(`.${modalManagerInstance.options.dismissClass}`);

        this.dismissNode.addEventListener('click', () => {
            modalManagerInstance.close(this);
        });
    }
}