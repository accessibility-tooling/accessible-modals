import ModalManager from "./A11yModalUtility";

export default class A11yModalInstance {
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