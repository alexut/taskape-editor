import { Tree } from '../src/tree';

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

function test() {
    const tree = new Tree(tasks, { parent: document.body });
    tree.expandAll();
}

window.onload = function () {
    test();
};
