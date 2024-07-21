import { Tree } from './tree';
import { AutocompleteManager } from './autocomplete';
import { Popup } from './popup';

function initializeTree() {
    const tasks = window.tasks;
    const tree = new Tree(tasks, { parent: document.getElementById('tasktree') });
    tree.expandAll();
    const taskEditorElement = document.getElementById('taskeditor');
    const popup = new Popup(taskEditorElement);
    const taskArea = document.getElementById('taskarea');
    const autocompleteManager = new AutocompleteManager(taskArea, popup);

    taskArea.addEventListener('input', autocompleteManager.handleTaskAreaInput.bind(autocompleteManager));
}

window.onload = function () {
    initializeTree();
};
