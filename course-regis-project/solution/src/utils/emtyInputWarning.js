const emptyInputWarning = (field) => {
    const element = document.querySelector(`#${field}`);
    if (element) {
        element.style.borderColor = 'var(--danger-color)';
    }
    element.addEventListener('keyup', () => {
        if (element.value.trim() != '') {
            element.style.borderColor = '';
        } else {
            element.style.borderColor = 'var(--danger-color)';
        }
    });
    element.addEventListener('blur', () => {
        if (element.value.trim() != '') {
            element.style.borderColor = '';
        } else {
            element.style.borderColor = 'var(--danger-color)';
        }
    });
}

export default emptyInputWarning;