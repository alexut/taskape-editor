# Taskape Task Editor

A vanilla drag-and-drop UI tree for managing tasks, based on David Figatner's drag-and-drop UI tree.

## Autocomplete Manager Popup

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant TaskEditor
    participant AutocompleteManager
    participant Popup
    participant Tree
    participant Input
    participant Clicked
    participant Leaf

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

    User->>TaskEditor: Type "@" or click #addTags
    TaskEditor->>AutocompleteManager: Detect "@" or button click
    AutocompleteManager->>AutocompleteManager: Fetch tags suggestions from window.suggestions
    AutocompleteManager->>Popup: Show tags suggestions

    User->>TaskEditor: Type ">" or click #addActions
    TaskEditor->>AutocompleteManager: Detect ">" or button click
    AutocompleteManager->>AutocompleteManager: Fetch actions suggestions from window.suggestions
    AutocompleteManager->>Popup: Show actions suggestions

    User->>TaskEditor: Type "#" or click #addOracles
    TaskEditor->>AutocompleteManager: Detect "#" or button click
    AutocompleteManager->>AutocompleteManager: Fetch oracles suggestions from window.suggestions
    AutocompleteManager->>Popup: Show oracles suggestions

    User->>Popup: Navigate and select suggestion
    Popup->>AutocompleteManager: Return selected suggestion {key: 'tags', value: 'estimate'}
    AutocompleteManager->>AutocompleteManager: Fetch values for selected suggestion
    AutocompleteManager->>Popup: Show values suggestions ['5h', '30min', '2h', '1h', '6h', '?estimate']

    User->>Popup: Navigate and select value
    Popup->>AutocompleteManager: Return selected value {key: 'estimate', value: '5h'}
    AutocompleteManager->>TaskEditor: Insert selected value @estimate(5h)
    AutocompleteManager->>Popup: Close popup
    Popup->>TaskEditor: Return focus to TaskEditor
```

### Workflow

#### Triggering the Popup:

When the user types "@" or clicks one of the designated buttons (`#addTags`, `#addActions`, `#addOracles`), the autocomplete popup appears inside the TaskEditor contenteditable area.
The popup initially shows the main categories (tags, actions, or oracles).

#### Selecting a Category:

If the user types a character after "@", the relevant category is automatically selected.
For example, typing "@t" will show the "tags" category first.
If a button is clicked, the popup directly shows the respective category.

#### Navigating Suggestions:

As the user continues typing, the popup updates to show the most relevant suggestions.
For instance, typing "@e" after selecting the "tags" category will prioritize the "estimate" property.

#### Selecting a Property:

The user can navigate the suggestions using the arrow keys.
Pressing "Enter" selects the highlighted suggestion.
Once a property (e.g., estimate) is selected, the popup displays the values related to that property.

#### Inserting a Value:

The user navigates through the values and selects one.
The selected value is inserted into the TaskEditor as `@property(value)`.

#### Removing a Tag:

The user can remove a tag by using backspace or delete on the span element.

### Example Usage

Typing "@":
1. User types "@" in the TaskEditor.
2. The popup shows categories: tags, actions, oracles.
3. User types "e".
4. The popup shows properties starting with "e", e.g., estimate under tags.
5. User selects estimate.
6. The popup shows values for estimate: ['5h', '30min', '2h', '1h', '6h', '?estimate'].
7. User selects 5h.
8. The value 5h is inserted into the TaskEditor as `@estimate(5h)`.

## Rationale

Taskape Task Editor is designed to provide an easy-to-use, drag-and-drop interface for managing hierarchical tasks without the need for frameworks like Vue or React.

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
```
