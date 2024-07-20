import { Tree } from './tree';
import { TaskEditor } from './editor';

function initializeTree() {
    const tasks = window.tasks;
    const tree = new Tree(tasks, { parent: document.getElementById('tasktree') });
    tree.expandAll();
    window.taskEditor = new TaskEditor(tree); // Ensure taskEditor is assigned to the tree instance
    tree.taskEditor = window.taskEditor;
}

window.onload = function () {
    initializeTree();
};
