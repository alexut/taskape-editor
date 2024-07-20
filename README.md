# Taskape Task Editor
A vanilla drag-and-drop UI tree for managing tasks, based on David Figatner's drag-and-drop ui tree

## Rationale
Taskape Task Editor is designed to provide an easy-to-use, drag-and-drop interface for managing hierarchical tasks without the need for frameworks like Vue or React.

## Interaction Diagram

```mermaid
sequenceDiagram
    participant User
    participant Tree
    participant Input
    participant Clicked
    participant Leaf
    participant TaskEditor

    User->>Leaf: mousedown/touchstart (double-click)
    Leaf->>Clicked: touchstart(e)
    Leaf->>Clicked: touchend(e)
    Clicked->>Clicked: mousedblclick(e)
    Clicked->>TaskEditor: editTask(Leaf)
    TaskEditor->>TaskEditor: taskArea.innerText = leaf.data.name
    TaskEditor->>TaskEditor: Show editTaskBtn, Hide createTaskBtn

    User->>TaskEditor: Edit text in taskArea
    TaskEditor->>TaskEditor: onTaskAreaInput()
    TaskEditor->>TaskEditor: Update button visibility

    User->>TaskEditor: Click editTaskBtn
    TaskEditor->>Leaf: leaf.data.name = taskArea.innerText.trim()
    TaskEditor->>Tree: tree.update()
    Tree->>Tree: _createLeaf(data, level) (for each leaf)
    Tree->>Tree: Update DOM structure
    TaskEditor->>TaskEditor: resetTaskArea()
```

## UML Class Diagram

```mermaid
classDiagram
  class Tree {
    -_options: Object
    -_input: Input
    -taskEditor: TaskEditor
    +element: HTMLElement
    +_selection: HTMLElement
    +constructor(tree: Object, options: Object)
    -_createLeaf(data: Object, level: number): Leaf
    -_getChildren(leaf: HTMLElement, all: boolean): HTMLElement[]
    +expandAll()
    -_expandChildren(leaf: HTMLElement)
    +collapseAll()
    -_collapseChildren(leaf: HTMLElement)
    +toggleExpand(leaf: HTMLElement)
    +expand(leaf: HTMLElement) 
    +collapse(leaf: HTMLElement) 
    +update()
    +editData(data: Object)
    +getLeaf(leaf: HTMLElement, root: HTMLElement)
    +findInTree(leaf: HTMLElement, callback: Function)
    -_getFirstChild(element: HTMLElement, all: boolean): HTMLElement
    -_getLastChild(element: HTMLElement, all: boolean): HTMLElement
    -_getParent(element: HTMLElement): HTMLElement
  }

  class Leaf {
    -tree: Tree
    -data: Object
    -level: number
    -element: HTMLElement
    +constructor(tree: Tree, data: Object, level: number)
    +getChildren(all: boolean): HTMLElement[]
    +hideIcon()
    +showIcon()
    +expand()
    +collapse()
    +selectLeaf()
  }

  class Input {
    +_tree: Tree
    +_indicator: Indicator
    +_target: HTMLElement
    +_isDown: Object
    +_offset: Object
    +_holdTimeout: number
    +_moving: boolean
    +_old: Object
    +_closest: Object
    +constructor(tree: Tree)
    -_down(e: Event)
    -_hold()
    -_checkThreshold(e: Event): boolean
    -_pickup()
    -_findClosest(e: Event, entry: HTMLElement)
    -_move(e: Event)
    -_up(e)
    -_moveData()
    -_indicatorMarginLeft(value: number)
  }

  class Indicator {
    +_indicator: HTMLElement
    +constructor(tree: Tree)
    +get(): HTMLElement
    +set marginLeft(value: number)
  }

  class Clicked {
    +Clicked(element, callback, options)
    +destroy()
    +touchstart(e)
    +touchmove(e)
    +touchcancel()
    +touchend(e)
    +mouseclick(e)
    +mousedblclick(e)
  }

  class TaskEditor {
    +tree: Tree
    +currentTask: Leaf | null
    +taskArea: HTMLElement
    +createTaskBtn: HTMLElement
    +editTaskBtn: HTMLElement
    +placeholderText: string
    +constructor(tree: Tree)
    +setupPlaceholder()
    +createTask()
    +updateTask()
    +onTaskAreaInput()
    +resetTaskArea()
    +editTask(leaf: Leaf)
  }

  class Utils {
    +static el(element)
    +static distance(x1, y1, x2, y2)
    +static distancePointElement(px, py, element)
    +static boolean inside(x, y, element)
    +static PointLike toGlobal(e)
    +static object options(options, defaults)
    +static void style(element, style, value)
    +static number percentage(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2)
    +static void removeChildren(element)
    +static HTMLElement html(options)
    +static number getChildIndex(parent, child)
    +static void attachStyles(styles)
  }

  Tree --> Leaf
  Tree --> TaskEditor
  Input --> Tree
  Input --> Indicator
  Clicked --> Input
  Tree --> Utils

```

## Super Simple Example
```js
const tasks = {
    task: [
        { 
            name: 'Do the laundry',
            task: [
                { name: 'Get the detergent', task: [] },
                { name: 'Sort the clothes', task: [] },
                { name: 'Put the clothes in the washing machine', task: [] },
                { name: 'Turn on the washing machine', task: [] }
            ] 
        },
        { 
            name: 'Do the dishes',
            task: [
                { name: 'Scrape the dishes', task: [] },
                { name: 'Rinse the dishes', task: [] },
                { name: 'Put the dishes in the dishwasher', task: [] },
                { name: 'Turn on the dishwasher', task: [] }
            ]
        }
    ]
};

const tree = new Tree(tasks, { parent: document.body, edit: true });
tree.expandAll();
```

## Features
- Drag-and-drop tasks
- Indentation for nested tasks
- Expand/collapse tasks
- Edit task names
- Add new tasks
- Delete tasks


## Tasks
Tasks are represented as a JavaScript object, where each task is an object with a `name` string and a `task` array of subtasks.


## License
Taskape Task Editor is released under the [MIT License](https://opensource.org/licenses/MIT).
```

## Credits
- [David Figatner] 