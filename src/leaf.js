'use strict';

import clicked from './clicked';
import * as utils from './utils';

export class Leaf {
    constructor(data, level, tree) {
        this.data = data;
        this.tree = tree;
        this.level = level;
        this.element = utils.html({ className: `${tree.prefixClassName}-leaf` });
        this.element.isLeaf = true;
        this.element.__leafInstance = this;
        this.element.data = data;
        this.element.content = utils.html({ parent: this.element, className: `${tree.prefixClassName}-content` });
        this.element.style.marginLeft = `${tree.indentation}px`;
        const iconClass = `${tree.prefixClassName}-expand${data.expanded ? ' expanded' : ''}`;
        this.element.icon = utils.html({
            parent: this.element.content,
            className: iconClass.trim()
        });
        this.element.name = utils.html({ parent: this.element.content, html: data.name, className: `${tree.prefixClassName}-name` });

        // Add a handler for dragging
        this.element.handler = utils.html({ parent: this.element.content, className: `${tree.prefixClassName}-leaf-handler` });
        this.element.handler.addEventListener('mousedown', e => tree._input._down(e));
        this.element.handler.addEventListener('touchstart', e => tree._input._down(e));

        // Handle selection on the leaf
        this.element.name.addEventListener('mousedown', e => {
            tree._input._down(e);
            this.selectLeaf();
        });
        this.element.name.addEventListener('touchstart', e => {
            tree._input._down(e);
            this.selectLeaf();
        });

        // Use clicked to handle single-click for selection and double-click for updating task area
        clicked(this.element.name, () => {}, {
            doubleClickCallback: () => {
                if (tree.taskEditor && typeof tree.taskEditor.editTask === 'function') {
                    tree.taskEditor.editTask(this);
                } else {
                    console.error('editTask method not found in taskEditor');
                }
            }
        });

        // Ensure the task property is always an array
        data.task = data.task || [];
        for (let child of data.task) {
            const add = new Leaf(child, level + 1, tree);
            add.data.parent = data;
            this.element.appendChild(add.element);
            if (!data.expanded) {
                add.element.style.display = 'none';
            }
        }
        if (this.getChildren(true).length === 0) {
            this.hideIcon();
        }
        this.element.icon.addEventListener('click', () => tree.toggleExpand(this.element));
        tree.emit('render', this.element, tree);
    }

    getChildren(all) {
        const children = [];
        for (let child of this.element.children) {
            if (child.isLeaf && (all || child.style.display !== 'none')) {
                children.push(child);
            }
        }
        return children;
    }

    hideIcon() {
        if (this.element.isLeaf) {
            this.element.icon.classList.add('hidden');
        }
    }

    showIcon() {
        if (this.element.isLeaf) { 
            this.element.icon.classList.remove('hidden');
        }
    }

    selectLeaf() {
        const selectedLeaf = document.querySelector(`.${this.tree.prefixClassName}-leaf-select`);
        if (selectedLeaf) {
            selectedLeaf.classList.remove(`${this.tree.prefixClassName}-leaf-select`);
        }
        this.element.classList.add(`${this.tree.prefixClassName}-leaf-select`);
    }
}
