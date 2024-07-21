import EventEmitter from 'eventemitter3';

export class Popup extends EventEmitter {
    constructor(taskEditorElement) {
        super();
        this.element = document.getElementById('autocomplete-popup');
        this.inputField = document.getElementById('autocomplete-input');
        this.listElement = document.getElementById('autocomplete-list');

        this.inputField.addEventListener('input', this.handleInput.bind(this));
        this.inputField.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.element.addEventListener('click', this.handleClick.bind(this));

        this.hide();
    }

    buildPopup(category) {
        this.currentSuggestions = Object.keys(window.suggestions[category]);
        this.currentCategory = category;
        this.currentKey = ''; // Reset currentKey
        this.renderList(this.currentSuggestions);
        setTimeout(() => this.inputField.focus(), 0);
    }

    renderList(elementsArray, activeElementIndex = 0) {
        this.activeElementIndex = activeElementIndex;
        this.clearList();
        elementsArray.forEach((element, index) => {
            const item = document.createElement('div');
            item.textContent = element;
            item.classList.add('element-item');
            if (index === this.activeElementIndex) {
                item.classList.add('active');
            }
            this.listElement.appendChild(item);
        });
        this.element.style.display = 'block';
    }

    handleInput(event) {
        const text = event.target.value.toLowerCase();
        const filteredSuggestions = this.currentSuggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(text)
        );

        if (filteredSuggestions.length > 0) {
            this.renderList(filteredSuggestions);
        } else {
            this.showNoResults();
        }
        this.emit('input', text);
    }

    handleKeyDown(event) {
        const { key } = event;
        const elements = Array.from(this.listElement.querySelectorAll('.element-item'));
        if (key === 'ArrowDown') {
            this.activeElementIndex = (this.activeElementIndex + 1) % elements.length;
            this.renderList(this.currentSuggestions, this.activeElementIndex);
        } else if (key === 'ArrowUp') {
            this.activeElementIndex = (this.activeElementIndex - 1 + elements.length) % elements.length;
            this.renderList(this.currentSuggestions, this.activeElementIndex);
        } else if (key === 'Enter') {
            this.handleSelection(elements[this.activeElementIndex].textContent);
            event.preventDefault();
        } else if (key === 'Tab') {
            event.preventDefault();
            this.activeElementIndex = (this.activeElementIndex + 1) % elements.length;
            this.renderList(this.currentSuggestions, this.activeElementIndex);
        } else if (key === 'Backspace' && this.inputField.value === '') {
            this.hide();
            this.emit('close');
        }
    }

    handleSelection(selectedElement) {
        this.inputField.value = '';
        const values = window.suggestions[this.currentCategory][selectedElement];

        if (values) {
            this.currentKey = selectedElement; // Set currentKey when key is selected
            this.currentSuggestions = values;
            this.renderList(values);
        } else {
            this.emit('select', { key: this.currentKey, value: selectedElement });
        }
    }

    handleClick(event) {
        const clickedIndex = Array.from(this.listElement.children).indexOf(event.target);
        if (clickedIndex >= 0) {
            this.handleSelection(this.currentSuggestions[clickedIndex]);
        }
    }

    clearList() {
        this.listElement.innerHTML = '';
    }

    showNoResults() {
        this.clearList();
        const item = document.createElement('div');
        item.textContent = 'Value not found';
        item.classList.add('no-results');
        this.listElement.appendChild(item);
    }

    hide() {
        this.element.style.display = 'none';
    }
}
