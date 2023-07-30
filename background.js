// background will load up the todos and store them
// POTENTIALLY the problem with the old one is using just the popup to continually load and save?
// ConfluenceCatcher behaviour is a lot more stable - using the same approach with ToDoList

let todos = []; // array of objects, title and contents
console.log("todolist: in the background: tada!");

get_from_storage().then(result => {
    todos.push(...result); // spread operator for concatenating arrays
    console.log(todos);
}).catch(error => {
    console.log("todolist: nothing in storage... moving on!");
});

function handleMessage(request, sender, sendResponse) {
    if (Object.keys(request)[0] == "todos_to_popup") {
        browser.runtime.sendMessage({todos_to_popup: todos})
    } else if (Object.keys(request)[0] == "todos_from_popup") {
        // overwrite the current todos with the received ones.
        todos = request.todos_from_popup;
        console.log("todolist: Received from popup");
        console.log(todos);
        save_to_storage(todos);
    }
}

function reset_storage() {
    browser.storage.local.clear();
    todos.length = 0;
    console.log("todolist: storage reset");
}

function save_to_storage(array) {
    browser.storage.local.set({stored_todos : array});
    console.log("todolist: storage updated");
}

async function get_from_storage() {
    try {
        let stored = await browser.storage.local.get('stored_todos');
        return stored.stored_todos;
    } catch (error) {
        console.error(`todolist: Error: ${error}`);
    }
}
browser.runtime.onMessage.addListener(handleMessage);
