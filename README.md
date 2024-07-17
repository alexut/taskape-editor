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

    User->>Tree: new Tree(tasks, { parent: document.body, edit: true })
    Tree->>Input: constructor(tree)
    Input->>Clicked: clicked(element, callback, options)
    User->>Tree: expandAll()
    Tree->>User: Expands all tasks
    User->>Tree: addTask('New Task')
    Tree->>User: Task added
    User->>Tree: removeTask('Task ID')
    Tree->>User: Task removed
    User->>Tree: editTask('Task ID', 'New Name')
    Tree->>User: Task edited
```

## UML Class Diagram

```mermaid
classDiagram
    class Tree {
        +Task[] tasks
        +Tree(Task[] tasks)
        +void addTask(string name)
        +void removeTask(string name)
        +Task getTask(string name)
        +void updateTaskName(string oldName, string newName)
        +Task[] listTasks()
    }

    class Task {
        +string name
        +Task[] task
        +Task(string name, Task[] task)
        +void updateName(string newName)
    }

    class Clicked {
        +Clicked(element, callback, options)
        +void destroy()
        +void touchstart(e)
        +void touchmove(e)
        +void touchcancel()
        +void touchend(e)
        +void mouseclick(e)
        +void mousedblclick(e)
    }

    class Input {
        +Input(Tree tree)
        +void _down(e)
        +void _hold()
        +void _checkThreshold(e)
        +void _pickup()
        +void _move(e)
        +void _up(e)
        +void _moveData()
        +void _indicatorMarginLeft(value)
    }

    class Indicator {
        +Indicator(Tree tree)
        +HTMLElement get()
        +void set_marginLeft(value)
    }

    class Utils {
        +static HTMLElement el(element)
        +static number distance(x1, y1, x2, y2)
        +static number distancePointElement(px, py, element)
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

    Tree --> Task
    Input --> Tree
    Clicked --> Input
    Indicator --> Tree
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