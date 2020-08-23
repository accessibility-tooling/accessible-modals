window.addEventListener('DOMContentLoaded', () => {
    let modalToggleElems = document.querySelectorAll('.modal-toggle');

    modalToggleElems.forEach((modalToggleElem) => {
        let modalTarget = modalToggleElem.dataset.target;

        modalToggleElem.addEventListener('click', () => {
            window.a11yModal.open(modalTarget)
        });
    });
});