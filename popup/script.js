// popup request todos object from the background script
browser.runtime.sendMessage( { todos_to_popup: "todos: a popup message" } );
let popup_todos = []; 

function handleMessage(request, sender, sendResponse) {
    if (Object.keys(request)[0] == "todos_to_popup") {
        popup_todos = request.todos_to_popup;
        const btn_create = document.createElement('button');
        btn_create.innerHTML = "Create New ToDo";
        btn_create.type = "button2";
        btn_create.purpose = "creator";
        let list = document.getElementById("myList");
        list.appendChild(btn_create);
        list.appendChild(document.createElement("br"));
        list.appendChild(document.createElement("br"));
        popup_todos.forEach(function callback(item,index) {
            const btn_delete = document.createElement('button');
            btn_delete.innerHTML = "Delete Item " + index;
            btn_delete.type = "button1";
            btn_delete.item_index = index;
            btn_delete.purpose = "deleter";
            const li = document.createElement('li');
            const todo_title = document.createElement('li'); // the title of each todo
            todo_title.textContent = item.title;
            todo_title.style.fontWeight = "bold";
            const li2 = document.createElement('ul');
            const todo_text = document.createElement('li2'); // the title of each todo
            todo_text.textContent = item.text;
            li.appendChild(todo_title);
            li2.appendChild(todo_text);
            li.appendChild(li2);
            list.appendChild(btn_delete);
            list.appendChild(li);
            list.appendChild(document.createElement("br"));
        });
    }
}

document.addEventListener("dblclick", (e) => {
    if(e.target.purpose === "deleter" && e.target.item_index >= 0) {
        delete popup_todos[e.target.item_index]; // leaves an empty slot
        popup_todos = popup_todos.flat(); // remove empty slots
        browser.runtime.sendMessage( { todos_from_popup: popup_todos } );
        location.reload() // refresh popup
    } else if (e.target.purpose === "creator") {
        const new_title = prompt("Please enter Todo Title");
        if (new_title != null){
            const new_text = prompt("Please enter Todo Text");
            if (new_text != null) {
                const local_obj = {};
                local_obj.title = new_title;
                local_obj.text = new_text;
                popup_todos.push(local_obj);
                console.log("popup " + popup_todos);
                browser.runtime.sendMessage( { todos_from_popup: popup_todos } );
                location.reload() // refresh popup
            }
        }
    }
});

// allows popup to listen for messages and clicks
browser.runtime.onMessage.addListener(handleMessage)
