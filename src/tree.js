'use strict';

import Events from 'eventemitter3';
import clicked from './clicked'; // Adjusted path to clicked in src directory
import { Input } from './input';
import { defaults } from './defaults';
import * as utils from './utils';

export class Tree extends Events {
    constructor(tree, options) {
        super();
        this._options = utils.options(options, defaults);
        this._input = new Input(this);
        if (typeof this._options.element === 'undefined') {
            this.element = document.createElement('div');
        } else {
            this.element = utils.el(this._options.element);
        }
        if (this._options.parent) {
            utils.el(this._options.parent).appendChild(this.element);
        }
        this.element.classList.add(this.prefixClassName);
        this.element.data = tree;
        this.update();
    }

    get selection() {
        return this._selection.data;
    }
    set selection(data) {}

    get prefixClassName() {
        return this._options.prefixClassName;
    }
    set prefixClassName(value) {
        if (value !== this._options.prefixClassName) {
            this._options.prefixClassName = value;
            this.update();
        }
    }

    get indentation() {
        return this._options.indentation;
    }
    set indentation(value) {
        if (value !== this._options.indentation) {
            this._options.indentation = value;
            this._input._indicatorMarginLeft = value + 'px';
            this.update();
        }
    }

    get holdTime() {
        return this._options.holdTime;
    }
    set holdTime(value) {
        if (value !== this._options.holdTime) {
            this._options.holdTime = value;
        }
    }

    get move() {
        return this._options.move;
    }
    set move(value) {
        this._options.move = value;
    }

    get expandOnClick() {
        return this._options.expandOnClick;
    }
    set expandOnClick(value) {
        this._options.expandOnClick = value;
    }

    get select() {
        return this._options.select;
    }
    set select(value) {
        this._options.select = value;
    }

    get dragOpacity() {
        return this._options.dragOpacity;
    }
    set dragOpacity(value) {
        this._options.dragOpacity = value;
    }

    _leaf(data, level) {
        const leaf = utils.html({ className: `${this.prefixClassName}-leaf` });
        leaf.isLeaf = true;
        leaf.data = data;
        leaf.content = utils.html({ parent: leaf, className: `${this.prefixClassName}-content` });
        leaf.style.marginLeft = this.indentation + 'px';
        const iconClass = `${this.prefixClassName}-expand${data.expanded ? ' expanded' : ''}`;
        leaf.icon = utils.html({
            parent: leaf.content,
            className: iconClass.trim()
        });
        leaf.name = utils.html({ parent: leaf.content, html: data.name, className: `${this.prefixClassName}-name` });

        // Add a handler for dragging
        leaf.handler = utils.html({ parent: leaf.content, className: `${this.prefixClassName}-leaf-handler` });
        leaf.handler.addEventListener('mousedown', e => this._input._down(e));
        leaf.handler.addEventListener('touchstart', e => this._input._down(e));

        // Handle selection on the leaf
        leaf.name.addEventListener('mousedown', e => this._input._down(e));
        leaf.name.addEventListener('touchstart', e => this._input._down(e));

        // Use clicked to handle single-click for selection and double-click for editing
        clicked(leaf.name, () => {}, {
            doubleClickCallback: () => {
                if (this._options.edit) {
                    leaf.name.setAttribute('contenteditable', true);
                    leaf.name.focus();
                }
            }
        });

        leaf.name.addEventListener('blur', () => {
            if (this._options.edit) {
                data.name = leaf.name.innerText;
                leaf.name.removeAttribute('contenteditable');
                this.emit('name-change', leaf, leaf.name.innerText, this);
                this.emit('update', leaf, this);
            }
        });

        // Ensure the task property is always an array
        data.task = data.task || [];
        for (let child of data.task) {
            const add = this._leaf(child, level + 1);
            add.data.parent = data;
            leaf.appendChild(add);
            if (!data.expanded) {
                add.style.display = 'none';
            }
        }
        if (this._getChildren(leaf, true).length === 0) {
            this._hideIcon(leaf);
        }
        clicked(leaf.icon, () => this.toggleExpand(leaf));
        this.emit('render', leaf, this);
        return leaf;
    }

    _getChildren(leaf, all) {
        leaf = leaf || this.element;
        const children = [];
        for (let child of leaf.children) {
            if (child.isLeaf && (all || child.style.display !== 'none')) {
                children.push(child);
            }
        }
        return children;
    }

    _hideIcon(leaf) {
        if (leaf.isLeaf) {
            leaf.icon.classList.add('hidden');
        }
    }

    _showIcon(leaf) {
        if (leaf.isLeaf) {
            leaf.icon.classList.remove('hidden');
        }
    }

    expandAll() {
        this._expandChildren(this.element);
    }

    _expandChildren(leaf) {
        for (let child of this._getChildren(leaf, true)) {
            this.expand(child);
            this._expandChildren(child);
        }
    }

    collapseAll() {
        this._collapseChildren(this.element);
    }

    _collapseChildren(leaf) {
        for (let child of this._getChildren(leaf, true)) {
            this.collapse(child);
            this._collapseChildren(child);
        }
    }

    toggleExpand(leaf) {
        if (!leaf.icon.classList.contains('hidden')) {
            if (leaf.data.expanded) {
                this.collapse(leaf);
            } else {
                this.expand(leaf);
            }
        }
    }

    expand(leaf) {
        if (leaf.isLeaf) {
            const children = this._getChildren(leaf, true);
            if (children.length) {
                for (let child of children) {
                    child.style.display = 'block';
                }
                leaf.data.expanded = true;
                leaf.icon.classList.add('expanded');
                this.emit('expand', leaf, this);
                this.emit('update', leaf, this);
            }
        }
    }

    collapse(leaf) {
        if (leaf.isLeaf) {
            const children = this._getChildren(leaf, true);
            if (children.length) {
                for (let child of children) {
                    child.style.display = 'none';
                }
                leaf.data.expanded = false;
                leaf.icon.classList.remove('expanded');
                this.emit('collapse', leaf, this);
                this.emit('update', leaf, this);
            }
        }
    }

    update() {
        const scroll = this.element.scrollTop;
        utils.removeChildren(this.element);
        for (let leaf of this.element.data.task) {
            const add = this._leaf(leaf, 0);
            add.data.parent = this.element.data;
            this.element.appendChild(add);
        }
        this.element.scrollTop = scroll + 'px';
    }

    editData(data) {
        const children = this._getChildren(null, true);
        for (let child of children) {
            if (child.data === data) {
                child.name.setAttribute('contenteditable', true);
                child.name.focus();
            }
        }
    }

    getLeaf(leaf, root = this.element) {
        this.findInTree(root, data => data === leaf);
    }

    findInTree(leaf, callback) {
        for (const child of leaf.children) {
            if (callback(child)) {
                return child;
            }
            const find = this.findInTree(child, callback);
            if (find) {
                return find;
            }
        }
    }

    _getFirstChild(element, all) {
        const children = this._getChildren(element, all);
        if (children.length) {
            return children[0];
        }
    }

    _getLastChild(element, all) {
        const children = this._getChildren(element, all);
        if (children.length) {
            return children[children.length - 1];
        }
    }

    _getParent(element) {   
        element = element.parentNode;
        while (element.style.display === 'none') {
            element = element.parentNode;
        }
        return element;
    }
}
