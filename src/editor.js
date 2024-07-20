'use strict';

import * as utils from './utils';

export class TaskEditor {
    constructor(tree) {
        this.tree = tree;
        this.currentTask = null;
        this.taskArea = document.getElementById('taskarea');
        this.createTaskBtn = document.getElementById('createTaskBtn');
        this.editTaskBtn = document.getElementById('editTaskBtn');
        this.placeholderText = this.taskArea.getAttribute('data-placeholder');

        this.createTaskBtn.addEventListener('click', () => this.createTask());
        this.editTaskBtn.addEventListener('click', () => this.updateTask());
        this.taskArea.addEventListener('input', () => this.onTaskAreaInput());

        this.setupPlaceholder();
    }

    setupPlaceholder() {
        const setPlaceholder = () => {
            if (this.taskArea.innerText.trim() === '') {
                this.taskArea.innerText = this.placeholderText;
                this.taskArea.classList.add('placeholder');
            }
        };

        const removePlaceholder = () => {
            if (this.taskArea.innerText === this.placeholderText) {
                this.taskArea.innerText = '';
                this.taskArea.classList.remove('placeholder');
            }
        };

        this.taskArea.addEventListener('focus', removePlaceholder);
        this.taskArea.addEventListener('blur', setPlaceholder);

        setPlaceholder(); // Initial call to set the placeholder
    }

    createTask() {
        const taskName = this.taskArea.innerText.trim();
        if (taskName && taskName !== this.placeholderText) {
            const selectedLeaf = document.querySelector(`.${this.tree.prefixClassName}-leaf-select`);
            const newTask = { name: taskName, task: [] };

            if (selectedLeaf) {
                const selectedLeafInstance = selectedLeaf.__leafInstance;
                if (selectedLeafInstance && selectedLeafInstance.data) {
                    const parentTask = selectedLeafInstance.data.parent;
                    if (parentTask) {
                        const siblingIndex = parentTask.task.indexOf(selectedLeafInstance.data);
                        parentTask.task.splice(siblingIndex + 1, 0, newTask);
                    } else {
                        console.error('Parent task not found for the selected leaf');
                    }
                } else {
                    console.error('Selected leaf instance or its data is not defined');
                }
            } else {
                if (this.tree.element.data && this.tree.element.data.task) {
                    this.tree.element.data.task.push(newTask);
                } else {
                    console.error('Tree data or tree data task array is not defined');
                }
            }

            this.tree.update();
            this.resetTaskArea();
        }
    }

    updateTask() {
        if (this.currentTask) {
            this.currentTask.data.name = this.taskArea.innerText.trim();
            this.tree.update();
            this.resetTaskArea();
        }
    }

    onTaskAreaInput() {
        const taskName = this.taskArea.innerText.trim();
        if (this.currentTask && taskName && taskName !== this.placeholderText) {
            this.editTaskBtn.classList.remove('hidden');
            this.createTaskBtn.classList.add('hidden');
        } else {
            this.editTaskBtn.classList.add('hidden');
            this.createTaskBtn.classList.remove('hidden');
        }
    }

    resetTaskArea() {
        this.taskArea.innerText = '';
        this.taskArea.blur(); // Triggers the placeholder to be set
        this.editTaskBtn.classList.add('hidden');
        this.createTaskBtn.classList.remove('hidden');
        this.currentTask = null;
    }

    editTask(leaf) {
        this.currentTask = leaf;
        this.taskArea.innerText = leaf.data.name;
        this.editTaskBtn.classList.remove('hidden');
        this.createTaskBtn.classList.add('hidden');
        this.taskArea.focus();
    }
}
