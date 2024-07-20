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
                    this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.remove(`${this._tree.prefixClassName}-select`);
                }
                this._tree._selection = this._target;
                this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.add(`${this._tree.prefixClassName}-select`);
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
                    this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.remove(`${this._tree.prefixClassName}-select`);
                }
                this._tree._selection = this._target;
                this._tree._selection.querySelector(`.${this._tree.prefixClassName}-name`).classList.add(`${this._tree.prefixClassName}-select`);
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
            boxShadow: this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow || 'unset'
        };
        this._target.style.position = 'absolute';
        this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow = '3px 3px 5px rgba(0,0,0,0.25)';
        this._target.style.left = pos.x + 'px';
        this._target.style.top = pos.y + 'px';
        this._target.style.opacity = this._tree.dragOpacity;
        if (this._tree._getChildren(parent, true).length === 0) {
            const leafInstance = parent.__leafInstance; // Get the Leaf instance
            if (leafInstance) {
              leafInstance.hideIcon(); // Call hideIcon on the Leaf instance
            } else {
              console.error('Leaf instance not found for parent element'); 
            }
          }
    }

    _findClosest(e, entry) {
        const pos = utils.toGlobal(entry.querySelector(`.${this._tree.prefixClassName}-name`));
        if (pos.y + entry.querySelector(`.${this._tree.prefixClassName}-name`).offsetHeight / 2 <= e.pageY) {
            if (!this._closest.foundAbove) {
                if (utils.inside(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`))) {
                    this._closest.foundAbove = true;
                    this._closest.above = entry;
                } else {
                    const distance = utils.distancePointElement(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`));
                    if (distance < this._closest.distanceAbove) {
                        this._closest.distanceAbove = distance;
                        this._closest.above = entry;
                    }
                }
            }
        } else if (!this._closest.foundBelow) {
            if (utils.inside(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`))) {
                this._closest.foundBelow = true;
                this._closest.below = entry;
            } else {
                const distance = utils.distancePointElement(e.pageX, e.pageY, entry.querySelector(`.${this._tree.prefixClassName}-name`));
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
            const x = utils.toGlobal(this._target.querySelector(`.${this._tree.prefixClassName}-name`)).x;
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
                let pos = utils.toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getFirstChild(this._closest.above, true));
                } else if (x > pos.x - indentation) {
                    this._closest.above.parentNode.appendChild(indicator);
                } else {
                    let parent = this._closest.above;
                    while (parent !== element && x < pos.x) {
                        parent = this._tree._getParent(parent);
                        if (parent !== element) {
                            pos = utils.toGlobal(parent.querySelector(`.${this._tree.prefixClassName}-name`));
                        }
                    }
                    parent.appendChild(indicator);
                }
            } else if (this._closest.below.parentNode === this._closest.above) {
                // parent [] child
                this._closest.above.insertBefore(indicator, this._closest.below);
            } else if (this._closest.below.parentNode === this._closest.above.parentNode) {
                // sibling [] sibling
                const pos = utils.toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
                } else {
                    this._closest.above.parentNode.insertBefore(indicator, this._closest.below);
                }
            } else {
                // child [] parent^
                let pos = utils.toGlobal(this._closest.above.querySelector(`.${this._tree.prefixClassName}-name`));
                if (x > pos.x + indentation) {
                    this._closest.above.insertBefore(indicator, this._tree._getLastChild(this._closest.above, true));
                } else if (x > pos.x - indentation) {
                    this._closest.above.parentNode.appendChild(indicator);
                } else if (x < utils.toGlobal(this._closest.below.querySelector(`.${this._tree.prefixClassName}-name`)).x) {
                    this._closest.below.parentNode.insertBefore(indicator, this._closest.below);
                } else {
                    let parent = this._closest.above;
                    while (parent.parentNode !== this._closest.below.parentNode && x < pos.x) {
                        parent = this._tree._getParent(parent);
                        pos = utils.toGlobal(parent.querySelector(`.${this._tree.prefixClassName}-name`));
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
                const leafInstance = indicator.parentNode.__leafInstance;
                if (leafInstance) {
                    leafInstance.showIcon();
                }
                this._target.style.position = this._old.position === 'unset' ? '' : this._old.position;
                this._target.querySelector(`.${this._tree.prefixClassName}-name`).style.boxShadow = this._old.boxShadow === 'unset' ? '' : this._old.boxShadow;
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
