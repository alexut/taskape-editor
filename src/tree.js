const Events = require('eventemitter3')
const clicked = require('clicked')

const defaults = require('./defaults')
const utils = require('./utils')
const icons = require('./icons')

class Tree extends Events
{
    /**
     * Create Tree
     * @param {HTMLElement} element
     * @param {TreeData} tree - data for tree
     * @param {TreeOptions} [options]
     * @param {string} [options.children=children] name of tree parameter containing the children
     * @param {string} [options[this.options.data]=data] name of tree parameter containing the data
     * @param {string} [options.parent=parent] name of tree parameter containing the parent link in data
     * @param {string} [options.name=name] name of tree parameter containing the name in data
     * @param {boolean} [options.move=true] allow tree to be rearranged
     * @param {number} [options.indentation=20] number of pixels to indent for each level
     * @param {number} [options.threshold=10] number of pixels to move to start a drag
     * @param {number} [options.holdTime=2000] number of milliseconds before name can be edited (set to 0 to disable)
     * @param {boolean} [options.expandOnClick=true] expand and collapse node on click without drag
     * @param {number} [options.dragOpacity=0.75] opacity setting for dragged item
     * @param {string[]} [options.nameStyles]
     * @param {string[]} [options.indicatorStyles]
     * @fires render
     * @fires clicked
     * @fires expand
     * @fires collapse
     * @fires name-change
     * @fires move
     * @fires move-pending
     * @fires update
     */
    constructor(element, tree, options)
    {
        super()
        this.options = utils.options(options, defaults)
        this.element = element
        this.element[this.options.data] = tree
        document.body.addEventListener('mousemove', (e) => this._move(e))
        document.body.addEventListener('touchmove', (e) => this._move(e))
        document.body.addEventListener('mouseup', (e) => this._up(e))
        document.body.addEventListener('touchend', (e) => this._up(e))
        document.body.addEventListener('mouseleave', (e) => this._up(e))
        this._createIndicator()
        this.update()
    }

    /**
     * allow tree to be rearranged
     * @type {booleans}
     */
    get move()
    {
        return this.options.move
    }
    set move(value)
    {
        this.options.move = value
    }

    _createIndicator()
    {
        this.indicator = utils.html()
        const content = utils.html({ parent: this.indicator, styles: { display: 'flex' } })
        this.indicator.indentation = utils.html({ parent: content })
        this.indicator.icon = utils.html({ parent: content, defaultStyles: this.options.expandStyles, styles: { height: 0 } })
        this.indicator.line = utils.html({
            parent: content,
            styles: this.options.indicatorStyles
        })
    }

    leaf(data, level)
    {
        const leaf = utils.html()
        leaf.isLeaf = true
        leaf[this.options.data] = data
        leaf.content = utils.html({ parent: leaf, styles: { display: 'flex', alignItems: 'center' } })
        leaf.indentation = utils.html({ parent: leaf.content, styles: { width: level * this.options.indentation + 'px' } })
        leaf.icon = utils.html({ parent: leaf.content, html: data[this.options.expanded] ? icons.open : icons.closed, styles: this.options.expandStyles })
        leaf.name = utils.html({ parent: leaf.content, html: data[this.options.name], styles: this.options.nameStyles })

        leaf.name.addEventListener('mousedown', (e) => this._down(e))
        leaf.name.addEventListener('touchstart', (e) => this._down(e))
        for (let child of data[this.options.children])
        {
            const add = this.leaf(child, level + 1)
            add[this.options.data].parent = data
            leaf.appendChild(add)
            if (!data[this.options.expanded])
            {
                add.style.display = 'none'
            }
        }
        if (this._getChildren(leaf, true).length === 0)
        {
            this._hideIcon(leaf)
        }
        clicked(leaf.icon, () => this.toggleExpand(leaf))
        this.emit('render', leaf, this)
        return leaf
    }

    _getChildren(leaf, all)
    {
        leaf = leaf || this.element
        const children = []
        for (let child of leaf.children)
        {
            if (child.isLeaf && (all || child.style.display !== 'none'))
            {
                children.push(child)
            }
        }
        return children
    }

    _hideIcon(leaf)
    {
        leaf.icon.style.opacity = 0
        leaf.icon.style.cursor = 'unset'
    }

    _showIcon(leaf)
    {
        leaf.icon.style.opacity = 1
        leaf.icon.style.cursor = this.options.expandStyles.cursor
    }

    expandAll()
    {
        this._expandChildren(this.element)
    }

    _expandChildren(leaf)
    {
        for (let child of this._getChildren(leaf, true))
        {
            this.expand(child)
            this._expandChildren(child)
        }
    }

    collapseAll()
    {
        this._collapseChildren(this)
    }

    _collapseChildren(leaf)
    {
        for (let child of this._getChildren(leaf, true))
        {
            this.collapse(child)
            this._collapseChildren(child)
        }
    }

    toggleExpand(leaf)
    {
        if (leaf.icon.style.opacity !== '0')
        {
            if (leaf[this.options.data][this.options.expanded])
            {
                this.collapse(leaf)
            }
            else
            {
                this.expand(leaf)
            }
        }
    }

    expand(leaf)
    {
        const children = this._getChildren(leaf, true)
        if (children.length)
        {
            for (let child of children)
            {
                child.style.display = 'block'
            }
            leaf[this.options.data][this.options.expanded] = true
            leaf.icon.innerHTML = icons.open
            this.emit('expand', leaf, this)
            this.emit('update', leaf, this)
        }
    }

    collapse(leaf)
    {
        const children = this._getChildren(leaf, true)
        if (children.length)
        {
            for (let child of children)
            {
                child.style.display = 'none'
            }
            leaf[this.options.data][this.options.expanded] = false
            leaf.icon.innerHTML = icons.closed
            this.emit('collapse', leaf, this)
            this.emit('update', leaf, this)
        }
    }

    /**
     * call this after tree's data has been updated outside of this library
     */
    update()
    {
        const scroll = this.element.scrollTop
        utils.removeChildren(this.element)
        for (let leaf of this.element[this.options.data][this.options.children])
        {
            const add = this.leaf(leaf, 0)
            add[this.options.data].parent = this.element[this.options.data]
            this.element.appendChild(add)
        }
        this.element.scrollTop = scroll + 'px'
    }

    _down(e)
    {
        this.target = e.currentTarget.parentNode.parentNode
        this.down = { x: e.pageX, y: e.pageY }
        const pos = utils.toGlobal(this.target)
        this.offset = { x: e.pageX - pos.x, y: e.pageY - pos.y }
        if (this.options.holdTime)
        {
            this.holdTimeout = window.setTimeout(() => this._hold(), this.options.holdTime)
        }
        e.preventDefault()
        e.stopPropagation()
    }

    _hold()
    {
        this.holdTimeout = null
        this.edit = this.target
        this.input = utils.html({ parent: this.edit.name.parentNode, type: 'input', styles: this.options.nameStyles })
        const computed = window.getComputedStyle(this.edit.name)
        this.input.style.boxSizing = 'content-box'
        this.input.style.fontFamily = computed.getPropertyValue('font-family')
        this.input.style.fontSize = computed.getPropertyValue('font-size')
        this.input.value = this.edit.name.innerText
        this.input.setSelectionRange(0, this.input.value.length)
        this.input.focus()
        this.input.addEventListener('update', () =>
        {
            this.nameChange(this.edit, this.input.value)
            this._holdClose()
        })
        this.input.addEventListener('keyup', (e) =>
        {
            if (e.code === 'Escape')
            {
                this._holdClose()
            }
            if (e.code === 'Enter')
            {
                this.nameChange(this.edit, this.input.value)
                this._holdClose()
            }
        })
        this.edit.name.style.display = 'none'
        this.target = null
    }

    _holdClose()
    {
        if (this.edit)
        {
            this.input.remove()
            this.edit.name.style.display = 'block'
            this.edit = this.input = null
        }
    }

    nameChange(leaf, name)
    {
        leaf[this.options.data].name = this.input.value
        leaf.name.innerHTML = name
        this.emit('name-change', leaf, this.input.value, this)
        this.emit('update', leaf, this)
    }

    _setIndicator()
    {
        let level = 0
        let traverse = this.indicator.parentNode
        while (traverse !== this.element)
        {
            level++
            traverse = traverse.parentNode
        }
        this.indicator.indentation.style.width = level * this.options.indentation + 'px'
    }

    _pickup()
    {
        if (this.holdTimeout)
        {
            window.clearTimeout(this.holdTimeout)
            this.holdTimeout = null
        }
        this.emit('move-pending', this.target, this)
        const parent = this.target.parentNode
        parent.insertBefore(this.indicator, this.target)
        this._setIndicator()
        const pos = utils.toGlobal(this.target)
        document.body.appendChild(this.target)
        this.old = {
            opacity: this.target.style.opacity || 'unset',
            position: this.target.style.position || 'unset',
            boxShadow: this.target.name.style.boxShadow || 'unset'
        }
        this.target.style.position = 'absolute'
        this.target.name.style.boxShadow = '3px 3px 5px rgba(0,0,0,0.25)'
        this.target.style.left = pos.x + 'px'
        this.target.style.top = pos.y + 'px'
        this.target.style.opacity = this.options.dragOpacity
    }

    _checkThreshold(e)
    {
        if (!this.options.move)
        {
            return false
        }
        else if (this.moving)
        {
            return true
        }
        else
        {
            if (utils.distance(this.down.x, this.down.y, e.pageX, e.pageY))
            {
                this.moving = true
                this._pickup()
                return true
            }
            else
            {
                return false
            }
        }
    }

    _findClosest(e, entry)
    {
        const pos = utils.toGlobal(entry.name)
        if (pos.y + entry.name.offsetHeight / 2 <= e.pageY)
        {
            if (!this.closest.foundAbove)
            {
                if (utils.inside(e.pageX, e.pageY, entry.name))
                {
                    this.closest.foundAbove = true
                    this.closest.above = entry
                }
                else
                {
                    const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name)
                    if (distance < this.closest.distanceAbove)
                    {
                        this.closest.distanceAbove = distance
                        this.closest.above = entry
                    }
                }
            }
        }
        else if (!this.closest.foundBelow)
        {
            if (utils.inside(e.pageX, e.pageY, entry.name))
            {
                this.closest.foundBelow = true
                this.closest.below = entry
            }
            else
            {
                const distance = utils.distancePointElement(e.pageX, e.pageY, entry.name)
console.log(entry.name.innerText, distance)
                if (distance < this.closest.distanceBelow)
                {
                    this.closest.distanceBelow = distance
                    this.closest.below = entry
                }
            }
        }
        for (let child of this._getChildren(entry))
        {
            this._findClosest(e, child)
        }
    }

    _getFirstChild(element, all)
    {
        const children = this._getChildren(element, all)
        if (children.length)
        {
            return children[0]
        }
    }

    _getLastChild(element, all)
    {
        const children = this._getChildren(element, all)
        if (children.length)
        {
            return children[children.length - 1]
        }
    }

    _getParent(element)
    {
        while (element !== this.element && element.style.display === 'none')
        {
            element = element.parentNode
        }
        return element
    }

    _move(e)
    {
        if (this.target && this._checkThreshold(e))
        {
            this.indicator.remove()
            this.target.style.left = e.pageX - this.offset.x + 'px'
            this.target.style.top = e.pageY - this.offset.y + 'px'
            this.closest = { distanceAbove: Infinity, distanceBelow: Infinity }
            for (let child of this._getChildren())
            {
                this._findClosest(e, child)
            }
            if (!this.closest.above && !this.closest.below)
            {
                this.element.appendChild(this.indicator)
            }
            else if (!this.closest.above) // null [] leaf
            {
                this.element.insertBefore(this.indicator, this._getFirstChild(this.element))
            }
            else if (!this.closest.below) // leaf [] null
            {
                let pos = utils.toGlobal(this.closest.above.name)
                if (e.pageX > pos.x + this.options.indentiation)
                {
                    this.closest.below.insertBefore(this.indicator, this._getFirstChild(this.closest.below, true))
                }
                else
                {
                    let parent = this.closest.above
                    while (e.pageX < pos.x + this.options.indentation)
                    {
                        parent = this._getParent(parent)
                        pos = utils.toGlobal(parent.name)
                    }
                    parent.insertBefore(this.indicator, this._getLastChild(parent, true))
                }
            }

            else if (this.closest.below.parentNode === this.closest.above) // parent [] child
            {
                this.closest.above.insertBefore(this.indicator, this.closest.below)
            }
            else if (this.closest.below.parentNode === this.closest.above.parentNode) // sibling [] sibling
            {
                const pos = utils.toGlobal(this.closest.above.name)
                if (e.pageX > pos.x + this.options.indentiation)
                {
                    this.closest.above.insertBefore(this.indicator, this._getLastChild(this.closest.above, true))
                }
                else
                {
                    this.closest.above.parentNode.insertBefore(this.indicator, this.closest.below)
                }
            }
            else
            {
console.log('broken')
                this.closest.below.parentNode.insertBefore(this.indicator, this.closest.below)
            }
            this._setIndicator()
        }
    }

    _up()
    {
        if (this.target)
        {
            if (!this.moving)
            {
                if (this.options.expandOnClick)
                {
                    this.toggleExpand(this.target)
                }
                this.emit('clicked', this.target, this)
            }
            else
            {
                this.indicator.parentNode.insertBefore(this.target, this.indicator)
                this.target.style.position = this.old.position === 'unset' ? '' : this.old.position
                this.target.name.style.boxShadow = this.old.boxShadow === 'unset' ? '' : this.old.boxShadow
                this.target.style.opacity = this.old.opacity === 'unset' ? '' : this.old.opacity
                this.target.indentation.style.width = this.indicator.indentation.offsetWidth + 'px'
                this.indicator.remove()
                this._moveData()
                this.emit('move', this.target, this)
                this.emit('update', this.target, this)
            }
            if (this.holdTimeout)
            {
                window.clearTimeout(this.holdTimeout)
                this.holdTimeout = null
            }
            this.target = this.moving = null
        }
    }

    _moveData()
    {
        this.target[this.options.data].parent.children.splice(this.target[this.options.data].parent.children.indexOf(this.target[this.options.data]), 1)
        this.target.parentNode[this.options.data].children.splice(utils.getChildIndex(this.target.parentNode, this.target), 0, this.target[this.options.data])
        this.target[this.options.data].parent = this.target.parentNode[this.options.data]
    }
}

module.exports = Tree

/**
 * @typedef {Object} Tree~TreeData
 * @property {TreeData[]} children
 * @property {string} name
 * @property {parent} [parent] if not provided then will traverse tree to find parent
 */

/**
  * trigger when expand is called either through UI interaction or Tree.expand()
  * @event Tree~expand
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when collapse is called either through UI interaction or Tree.expand()
  * @event Tree~collapse
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when name is change either through UI interaction or Tree.nameChange()
  * @event Tree~name-change
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {string} name
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is picked up through UI interaction
  * @event Tree~move-pending
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf's location is changed
  * @event Tree~move
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is clicked and not dragged or held
  * @event Tree~clicked
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf is changed (i.e., moved, name-change)
  * @event Tree~update
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */

/**
  * trigger when a leaf's div is created
  * @event Tree~render
  * @type {object}
  * @property {HTMLElement} tree element
  * @property {Tree} Tree
  */