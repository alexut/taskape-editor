import EventEmitter from 'eventemitter3';

export class AutocompleteManager extends EventEmitter {
    constructor(taskArea, popup) {
        super();
        this.taskArea = taskArea;
        this.popup = popup;
        this.currentCategory = '';
        this.currentKey = '';
        this.initEventListeners();
    }

    initEventListeners() {
        this.taskArea.addEventListener('input', this.handleTaskAreaInput.bind(this));
        document.querySelector('#addTags').addEventListener('click', () => this.openPopup('tags'));
        document.querySelector('#addActions').addEventListener('click', () => this.openPopup('actions'));
        document.querySelector('#addOracles').addEventListener('click', () => this.openPopup('oracles'));
        document.querySelector('#addTags').addEventListener('click', () => this.addKeyToTaskArea('@'))
        document.querySelector('#addActions').addEventListener('click', () => this.addKeyToTaskArea('>'));
        document.querySelector('#addOracles').addEventListener('click', () => this.addKeyToTaskArea('#'));

        this.popup.on('select', this.handlePopupSelect.bind(this));
        this.popup.on('close', this.handlePopupClose.bind(this));
    }

    handleTaskAreaInput(event) {
        const text = event.target.innerText;
        const lastChar = text[text.length - 1];

        if (['@', '>', '#'].includes(lastChar)) {
            this.openPopup(lastChar === '@' ? 'tags' : lastChar === '>' ? 'actions' : 'oracles');
        }
    }

    addKeyToTaskArea(key) {

        // if content of the taskArea is equal with data-placeholder than remove it
        if (this.taskArea.innerText === this.taskArea.getAttribute('data-placeholder')) {
            this.taskArea.innerText = '';
        }

        this.taskArea.innerHTML += key;
    }

    openPopup(category, key = '') {
        console.log('Opening popup for category:', category);
        this.currentCategory = category;
        this.popup.buildPopup(category);
    }

    handlePopupSelect({ key, value }) {
        console.log('Selected:', key, value);
        this.insertSelectedValue(key, value);
    }

    insertSelectedValue(category, value) {
        const textToInsert = `${category}(${value})&nbsp;`;
    
        // console log the text to insert showing also hidden characters
        console.log('Text to insert:', JSON.stringify(textToInsert));
        this.taskArea.innerHTML += textToInsert;
        this.placeCursorAtEnd();
        this.resetState();
    }
    

    placeCursorAtEnd() {
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(this.taskArea);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
        this.taskArea.focus();
    }

    handlePopupClose() {
        this.placeCursorAtEnd();
    }

    resetState() {
        this.popup.hide();
        this.currentCategory = '';
        this.currentKey = '';
    }
}
