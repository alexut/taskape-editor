'use strict';

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

function clicked(element, callback, options = {}) {
    return new Clicked(element, callback, options);
}

var Clicked = function () {
    function Clicked(element, callback, options) {
        var _this = this;

        _classCallCheck(this, Clicked);

        this.options = options;
        this.threshhold = this.options.threshhold || 10;
        this.events = {
            mouseclick: function mouseclick(e) {
                return _this.mouseclick(e);
            },
            mousedblclick: function mousedblclick(e) {
                return _this.mousedblclick(e);
            },
            touchstart: function touchstart(e) {
                return _this.touchstart(e);
            },
            touchmove: function touchmove(e) {
                return _this.touchmove(e);
            },
            touchcancel: function touchcancel(e) {
                return _this.touchcancel(e);
            },
            touchend: function touchend(e) {
                return _this.touchend(e);
            }
        };
        element.addEventListener('click', this.events.mouseclick);
        element.addEventListener('dblclick', this.events.mousedblclick);
        element.addEventListener('touchstart', this.events.touchstart, { passive: true });
        element.addEventListener('touchmove', this.events.touchmove, { passive: true });
        element.addEventListener('touchcancel', this.events.touchcancel);
        element.addEventListener('touchend', this.events.touchend);
        this.element = element;
        this.callback = callback;
        this.doubleClickCallback = this.options.doubleClickCallback;
    }

    _createClass(Clicked, [{
        key: 'destroy',
        value: function destroy() {
            this.element.removeEventListener('click', this.events.mouseclick);
            this.element.removeEventListener('dblclick', this.events.mousedblclick);
            this.element.removeEventListener('touchstart', this.events.touchstart);
            this.element.removeEventListener('touchmove', this.events.touchmove);
            this.element.removeEventListener('touchcancel', this.events.touchcancel);
            this.element.removeEventListener('touchend', this.events.touchend);
        }
    }, {
        key: 'touchstart',
        value: function touchstart(e) {
            if (e.touches.length === 1) {
                this.lastX = e.changedTouches[0].screenX;
                this.lastY = e.changedTouches[0].screenY;
                this.down = true;
            }
        }
    }, {
        key: 'pastThreshhold',
        value: function pastThreshhold(x, y) {
            return Math.abs(this.lastX - x) > this.threshhold || Math.abs(this.lastY - y) > this.threshhold;
        }
    }, {
        key: 'touchmove',
        value: function touchmove(e) {
            if (!this.down || e.touches.length !== 1) {
                this.touchcancel();
                return;
            }
            var x = e.changedTouches[0].screenX;
            var y = e.changedTouches[0].screenY;
            if (this.pastThreshhold(x, y)) {
                this.touchcancel();
            }
        }
    }, {
        key: 'touchcancel',
        value: function touchcancel() {
            this.down = false;
        }
    }, {
        key: 'touchend',
        value: function touchend(e) {
            if (this.down) {
                e.preventDefault();
                if (this.callback) {
                    this.callback(e, this.options.args);
                }
            }
        }
    }, {
        key: 'mouseclick',
        value: function mouseclick(e) {
            if (this.callback) {
                this.callback(e, this.options.args);
            }
        }
    }, {
        key: 'mousedblclick',
        value: function mousedblclick(e) {
            if (this.doubleClickCallback) {
                this.doubleClickCallback(e, this.options.args);
            }
        }
    }]);

    return Clicked;
}();

export default clicked;

export const defaults = {
    move: true,
    select: true,
    indentation: 20,
    threshold: 10,
    holdTime: 1000,
    expandOnClick: false,
    dragOpacity: 0.75,
    prefixClassName: 'mb-task',
    cursorName: 'grab -webkit-grab pointer',
    cursorExpand: 'pointer',
    edit: true, 
    symbols: {
        oracles: '#',
        tags: '@',
        actions: '>'
    }
};

import * as utils from './utils'

export class Indicator {
    constructor(tree) {
        this._indicator = utils.html()
        this._indicator.style.marginLeft = tree.indentation + 'px'
        const content = utils.html({ parent: this._indicator })
        content.style.display = 'flex'
        this._indicator.indentation = utils.html({ parent: content })
        this._indicator.icon = utils.html({ parent: content, className: `${tree.prefixClassName}-expand` })
        this._indicator.icon.style.height = 0
        this._indicator.line = utils.html({ parent: content, className: `${tree.prefixClassName}-indicator` })
    }

    get() {
        return this._indicator
    }

    set _marginLeft(value) {
        this._indicator.style.marginLeft = value + 'px'
    }
}
'use strict';

import * as utils from './utils';
import { Indicator } from './indicator';

export class Input {
    constructor(tree) {
        this._tree = tree;
        this._indicator = new Indicator(tree);
        document.body.addEventListener('mousemove', e => this._move(e));
        document.body.addEventListener('touchmove', e => this._move(e));
        document.body.addEventListener('mouseup', e => this._up(e));
        document.body.addEventListener('touchend', e => this._up(e));
        document.body.addEventListener('mouseleave', e => this._up(e));
    }

    _down(e) {
        if (e.target.classList.contains(`${this._tree.prefixClassName}-leaf-handler`)) {
            // Start drag and drop
            this._target = e.currentTarget.parentNode.parentNode;
            let alreadySelected = false;
            if (this._tree._selection === this._target) {
                alreadySelected = true;
            } else {
                if (this._tree._selection) {
                    this._tree._selection.name.classList.remove(`${this._tree.prefixClassName}-select`);
                }
                this._tree._selection = this._target;
                this._tree._selection.name.classList.add(`${this._tree.prefixClassName}-select`);
            }
            this._isDown = { x: e.pageX, y: e.pageY, alreadySelected };
            const pos = utils.toGlobal(this._target);
            this._offset = { x: e.pageX - pos.x, y: e.pageY - pos.y };
            if (this._tree.holdTime) {
                this._holdTimeout = window.setTimeout(() => this._hold(), this._tree.holdTime);
            }
            e.preventDefault();
            e.stopPropagation();
        } else {
            // Handle selection
            this._target = e.currentTarget.parentNode.parentNode;
            if (this._tree._selection !== this._target) {
                if (this._tree._selection) {
                    this._tree._selection.name.classList.remove(`${this._tree.prefixClassName}-select`);
                }
                this._tree._selection = this._target;
                this._tree._selection.name.classList.add(`${this._tree.prefixClassName}-select`);
                this._tree.emit('selection-change', this._target, this._tree);
            }
        }
    }

    _hold() {
        this._holdTimeout = null;
        this._tree.edit(this._target);
    }

    _checkThreshold(e) {
        if (!this._isDown) {
            return false;
        }
        if (!this._tree.move) {
            return false;
        } else if (this._moving) {
            return true;
        } else {
            if (utils.distance(this._isDown.x, this._isDown.y, e.pageX, e.pageY)) {
                this._moving = true;
                this._pickup();
                return true;
            } else {
                return false;
            }
        }
    }

    _pickup() {
        if (this._holdTimeout) {
            window.clearTimeout(this._holdTimeout);
            this._holdTimeout = null;
        }
        this._tree.emit('move-pending', this._target, this._tree);
        const parent = this._target.parentNode;
        parent.insertBefore(this._indicator.get(), this._target);
        const pos = utils.toGlobal(this._target);
        document.body.appendChild(this._target);
        this._old = {
            opacity: this._target.style.opacity || 'unset',
            position: this._target.style.position || 'unset',
            boxShadow: this._target.name.style.boxShadow || 'unset'
        };
        this._target.style.position = 'absolute';
        this._target.name.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.25)';
        this._target.style.left = pos.x + 'px';
        this._target.style.top = pos.y + 'px';
        this._target.style.opacity = this._tree.dragOpacity;
        if (this._tree._getChildren(parent, true).length === 0) {
            this._tree._hideIcon(parent);
        }
    }

    _findClosest(e, entry) {
        const pos = utils.toGlobal(entry.name);
        if (pos.y + entry.name.offsetHeight / 2 <= e.pageY) {
            if (!this._closest.foundAbove) {
                if (utils.inside(e.pageX, e.pageY, entry.name)) {
                    this._closest.foundAbove = true;
                    this._closest.above = entry;
                } else {
                    const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name);
                    if (distance < this._closest.distanceAbove) {
                        this._closest.distanceAbove = distance;
                        this._closest.above = entry;
                    }
                }
            }
        } else if (!this._closest.foundBelow) {
            if (utils.inside(e.pageX, e.pageY, entry.name)) {
                this._closest.foundBelow = true;
                this._closest.below = entry;
            } else {
                const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name);
                if (distance < this._closest.distanceBelow) {
                    this._closest.distanceBelow = distance;
                    this._closest.below = entry;
                }
            }
        }
        for (let child of this._tree._getChildren(entry)) {
            this._findClosest(e, child);
        }
    }

    _move(e) {
        if (this._target && this._checkThreshold(e)) {
            const element = this._tree.element;
            const indicator = this._indicator.get();
            const indentation = this._tree.indentation;
            indicator.remove();
            this._target.style.left = e.pageX - this._offset.x + 'px';
            this._target.style.top = e.pageY - this._offset.y + 'px';
            const x = utils.toGlobal(this._target.name).x;
            this._closest = { distanceAbove: Infinity, distanceBelow: Infinity };
            for (let child of this._tree._getChildren()) {
                this._findClosest(e, child);
            }
            if (!this._closest.above && !this._closest.below) {
                element.appendChild(indicator);
            } else if (!this._closest.above)  {
                // null [] leaf
                element.insertBefore(indicator, this._tree._getFirstChild(element));
            } else if (!this._closest.below) {
                // leaf [] null
                let pos = utils.toGlobal(this._closest.above.name);
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getFirstChild(this._closest.above, true));
                } else if (x > pos.x - indentation) {
                    this._closest.above.parentNode.appendChild(indicator);
                } else {
                    let parent = this._closest.above;
                    while (parent !== element && x < pos.x) {
                        parent = this._tree._getParent(parent);
                        if (parent !== element) {
                            pos = utils.toGlobal(parent.name);
                        }
                    }
                    parent.appendChild(indicator);
                }
            } else if (this._closest.below.parentNode === this._closest.above) {
                // parent [] child
                this._closest.above.insertBefore(indicator, this._closest.below);
            } else if (this._closest.below.parentNode === this._closest.above.parentNode) {
                // sibling [] sibling
                const pos = utils.toGlobal(this._closest.above.name);
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
                } else {
                    this._closest.above.parentNode.insertBefore(indicator, this._closest.below);
                }
            } else {
                // child [] parent^
                let pos = utils.toGlobal(this._closest.above.name);
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
                } else if (x > pos.x - indentation) {
                    this._closest.above.parentNode.appendChild(indicator);
                } else if (x < utils.toGlobal(this._closest.below.name).x) {
                    this._closest.below.parentNode.insertBefore(indicator, this._closest.below);
                } else {
                    let parent = this._closest.above;
                    while (parent.parentNode !== this._closest.below.parentNode && x < pos.x) {
                        parent = this._tree._getParent(parent);
                        pos = utils.toGlobal(parent.name);
                    }
                    parent.appendChild(indicator);
                }
            }
        }
    }

    _up(e) {
        if (this._target) {
            if (!this._moving) {
                if (this._tree.expandOnClick && (!this._tree.select || this._isDown.alreadySelected)) {
                    this._tree.toggleExpand(this._target);
                }
                this._tree.emit('clicked', this._target, e, this._tree);
            } else {
                const indicator = this._indicator.get();
                indicator.parentNode.insertBefore(this._target, indicator);
                this._tree.expand(indicator.parentNode);
                this._tree._showIcon(indicator.parentNode);
                this._target.style.position = this._old.position === 'unset' ? '' : this._old.position;
                this._target.name.style.boxShadow = this._old.boxShadow === 'unset' ? '' : this._old.boxShadow;
                this._target.style.opacity = this._old.opacity === 'unset' ? '' : this._old.opacity;
                indicator.remove();
                this._moveData();
                this._tree.emit('move', this._target, this._tree);
                this._tree.emit('update', this._target, this._tree);
            }
            if (this._holdTimeout) {
                window.clearTimeout(this._holdTimeout);
                this._holdTimeout = null;
            }
            this._target = this._moving = null;
            this._isDown = null;  // Reset _isDown
        }
    }

    _moveData() {
        this._target.data.parent.task.splice(this._target.data.parent.task.indexOf(this._target.data), 1);
        this._target.parentNode.data.task.splice(utils.getChildIndex(this._target.parentNode, this._target), 0, this._target.data);
        this._target.data.parent = this._target.parentNode.data;
    }

    _indicatorMarginLeft(value) {
        this._indicator.marginLeft = value;
    }
}

'use strict';

import Events from 'eventemitter3';
import clicked from './clicked';
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

        leaf.name.addEventListener('input', (e) => this._handleTagActionSuggestions(e, leaf));

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

    _handleTagActionSuggestions(e, leaf) {
        const input = e.target;
        const value = input.innerText;
        const cursorPosition = window.getSelection().getRangeAt(0).startOffset;

        const lastSymbolIndex = this._findLastSymbol(value, cursorPosition);
        if (lastSymbolIndex === -1) return;

        const currentWord = value.substring(lastSymbolIndex, cursorPosition);
        const suggestions = this._getSuggestions(currentWord);

        this._showSuggestions(suggestions, input, cursorPosition);
    }

    _findLastSymbol(value, cursorPosition) {
        const symbols = Object.values(this._options.symbols);
        for (let i = cursorPosition - 1; i >= 0; i--) {
            if (symbols.includes(value.charAt(i))) {
                return i;
            }
        }
        return -1;
    }

    _getSuggestions(currentWord) {
        const symbol = currentWord.charAt(0);
        const wordPart = currentWord.substring(1).toLowerCase();

        if (symbol === this._options.symbols.tags) {
            return Object.keys(window.suggestions.tags).filter(tag => tag.startsWith(wordPart)).flatMap(tag => window.suggestions.tags[tag]);
        } else if (symbol === this._options.symbols.actions) {
            return Object.keys(window.suggestions.actions).filter(action => action.startsWith(wordPart)).flatMap(action => window.suggestions.actions[action]);
        } else if (symbol === this._options.symbols.oracles) {
            return Object.keys(window.suggestions.oracles).filter(oracle => oracle.startsWith(wordPart)).flatMap(oracle => window.suggestions.oracles[oracle]);
        }

        return [];
    }

    _showSuggestions(suggestions, target, cursorPosition) {
        let suggestionsList = document.getElementById('suggestions-list');
        if (!suggestionsList) {
            suggestionsList = document.createElement('ul');
            suggestionsList.id = 'suggestions-list';
            suggestionsList.style.position = 'absolute';
            document.body.appendChild(suggestionsList);
        }

        suggestionsList.innerHTML = '';
        suggestionsList.style.left = `${target.getBoundingClientRect().left}px`;
        suggestionsList.style.top = `${target.getBoundingClientRect().bottom}px`;

        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('li');
            suggestionItem.innerText = suggestion;
            suggestionItem.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this._insertSuggestion(target, suggestion, cursorPosition);
                suggestionsList.innerHTML = '';
            });
            suggestionsList.appendChild(suggestionItem);
        });
    }

    _insertSuggestion(target, suggestion, cursorPosition) {
        const value = target.innerText;
        const symbol = value.charAt(cursorPosition - 1);
        const before = value.substring(0, cursorPosition - 1);
        const after = value.substring(cursorPosition);

        const span = document.createElement('span');
        span.className = 'suggestion-span';
        span.contentEditable = 'false';
        span.innerHTML = `${symbol}${suggestion} <span class="remove-suggestion">x</span>`;
        span.querySelector('.remove-suggestion').addEventListener('click', () => {
            span.remove();
        });

        const range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(span);
``
        const space = document.createTextNode(' ');
        range.insertNode(space);
        range.setStartAfter(space);
        range.setEndAfter(space);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        const event = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        target.dispatchEvent(event);

        target.focus();
    }
}

/**
 * converts a string to an HTMLElement if necessary
 * @param {(HTMLElement|string)} element
 */
export function el(element) {
    if (typeof element === 'string') {
        return document.querySelector(element)
    }
    return element

}

/**
 * measure distance between two points
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 */
export function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/**
 * find shortest distance from point to HTMLElement's bounding box
 * from: https://gamedev.stackexchange.com/questions/44483/how-do-i-calculate-distance-between-a-point-and-an-axis-aligned-rectangle
 * @param {number} x
 * @param {number} y
 * @param {HTMLElement} element
 */
export function distancePointElement(px, py, element) {
    const pos = toGlobal(element)
    const width = element.offsetWidth
    const height = element.offsetHeight
    const x = pos.x + width / 2
    const y = pos.y + height / 2
    const dx = Math.max(Math.abs(px - x) - width / 2, 0)
    const dy = Math.max(Math.abs(py - y) - height / 2, 0)
    return dx * dx + dy * dy
}

/**
 * determine whether the mouse is inside an element
 * @param {HTMLElement} dragging
 * @param {HTMLElement} element
 */
export function inside(x, y, element) {
    const pos = toGlobal(element)
    const x1 = pos.x
    const y1 = pos.y
    const w1 = element.offsetWidth
    const h1 = element.offsetHeight
    return x >= x1 && x <= x1 + w1 && y >= y1 && y <= y1 + h1
}

/**
 * determines global location of a div
 * from https://stackoverflow.com/a/26230989/1955997
 * @param {HTMLElement} e
 * @returns {PointLike}
 */
export function toGlobal(e) {
    const box = e.getBoundingClientRect()

    const body = document.body
    const docEl = document.documentElement

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop
    const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft

    const clientTop = docEl.clientTop || body.clientTop || 0
    const clientLeft = docEl.clientLeft || body.clientLeft || 0

    const top = box.top + scrollTop - clientTop
    const left = box.left + scrollLeft - clientLeft

    return { y: Math.round(top), x: Math.round(left) }
}

/**
 * @typedef {object} PointLike
 * @property {number} x
 * @property {number} y
 */

/**
 * combines options and default options
 * @param {object} options
 * @param {object} defaults
 * @returns {object} options+defaults
 */
export function options(options, defaults) {
    options = options || {}
    for (let option in defaults) {
        options[option] = typeof options[option] !== 'undefined' ? options[option] : defaults[option]
    }
    return options
}

/**
 * set a style on an element
 * @param {HTMLElement} element
 * @param {string} style
 * @param {(string|string[])} value - single value or list of possible values (test each one in order to see if it works)
 */
export function style(element, style, value) {
    if (Array.isArray(value)) {
        for (let entry of value) {
            element.style[style] = entry
            if (element.style[style] === entry) {
                break
            }
        }
    } else {
        element.style[style] = value
    }
}

/**
 * calculate percentage of overlap between two boxes
 * from https://stackoverflow.com/a/21220004/1955997
 * @param {number} xa1
 * @param {number} ya1
 * @param {number} xa2
 * @param {number} xa2
 * @param {number} xb1
 * @param {number} yb1
 * @param {number} xb2
 * @param {number} yb2
 */
export function percentage(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2) {
    const sa = (xa2 - xa1) * (ya2 - ya1)
    const sb = (xb2 - xb1) * (yb2 - yb1)
    const si = Math.max(0, Math.min(xa2, xb2) - Math.max(xa1, xb1)) * Math.max(0, Math.min(ya2, yb2) - Math.max(ya1, yb1))
    const union = sa + sb - si
    if (union !== 0) {
        return si / union
    } else {
        return 0
    }
}

export function removeChildren(element) {
    while (element.firstChild) {
        element.firstChild.remove()
    }
}

'use strict';

export function html(options) {
    options = options || {};
    const object = document.createElement(options.type || 'div');
    if (options.parent) {
        options.parent.appendChild(object);
    }
    if (options.className) {
        object.classList.add(options.className);
    }
    if (options.html) {
        object.innerHTML = options.html;
    }
    if (options.id) {
        object.id = options.id;
    }
    if (options.attributes) {
        for (const key in options.attributes) {
            object.setAttribute(key, options.attributes[key]);
        }
    }
    return object;
}

export function getChildIndex(parent, child) {
    let index = 0
    for (let entry of parent.children) {
        if (entry === child) {
            return index
        }
        index++
    }
    return -1
}

export function attachStyles(styles) {
    const s = document.createElement('style')
    s.innerHTML = styles
    document.head.appendChild(s)
}