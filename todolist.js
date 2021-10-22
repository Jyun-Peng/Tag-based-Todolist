// Content:
// 1. Classes declaration
// 2. Variables/Constants declaration
// 3. Render
// 4. Todo operations
// 5. Tag operations

//--------------------------- Classes declaration start -------------------------------//

class Todo {
    constructor(id, content = '', tagIds = [], completed = false) {
        this.id = id;
        this.content = content;
        this.tagIds = tagIds;
        this.completed = completed;
    }
    // method
    setTodo({ content, tagIds }) {
        this.content = content;
        this.tagIds = tagIds.slice(0);
    }
}

class Tag {
    constructor(id, tagName) {
        this.id = id;
        this.tagName = tagName;
    }
}

//--------------------------- Classes declaration end -------------------------------//

//------------------ Variables/Constants declaration start --------------------------//

var listMode = true;
var listIsChoosingToDelete = false;
var filteredTagIds = [];

var todoListData = {
    todos: [],
    tags: [],
    createdTodoNum: 0,
    createdTagNum: 0,
};
var newTodo = {
    todo: new Todo(todoListData.createdTodoNum + 1, '', []),
    tagIdsBuffer: [],
};
var editingTodo = {
    todo: null,
    todoBuffer: {
        content: null,
        tagIds: [],
    },
};
const MAXTAGNUMBER = 5;

const mask = document.querySelector('.js-mask');
const main = document.querySelector('.main');
const createTodoPanel = main.querySelector('.create-todo-panel');
const todoInput = createTodoPanel.querySelector('.js-input--create-todo');
const todoList = main.querySelector('.todo-list');

const tagPanel = document.querySelector('.js-tag-panel');

const chooseTagPopup = document.querySelector('.js-choose-tag-popup');
const editor = document.querySelector('.js-editor');

//------------------ Variables/Constants declaration end --------------------------//

//--------------------------- Render start-------------------------------//

function renderTodoList() {
    todoList.innerHTML = (
        listMode
            ? todoListData.todos.filter((todo) => !todo.completed && isContainsFilteredTags(todo))
            : todoListData.todos.filter((todo) => todo.completed && isContainsFilteredTags(todo))
    )
        .map((todo) => {
            return `
                    <div class='list__item' data-id=${todo.id}>
                        <div class='container--btn'><div class='btn btn--finish-todo js-btn--finish-todo'></div></div>
                        <div class='container--content'><h3>${todo.content}</h3></div>
                        <div class='container--btn'><div class='btn btn--icon ${
                            listIsChoosingToDelete ? 'js-btn--choose-to-delete' : 'js-btn--edit-todo'
                        } '><i class="${
                listIsChoosingToDelete ? 'fas fa-trash-alt' : 'fas fa-ellipsis-v'
            }"></i></div></div>
                    </div>
                `;
        })
        .join('');
}

function renderTagList() {
    tagPanel.querySelector('.tag-list').innerHTML = todoListData.tags
        .map((tag) => {
            const isFiltered = filteredTagIds.some((fTagId) => fTagId === tag.id);
            return `
                    <div class='tag${isFiltered ? ' active' : ''}' data-id=${tag.id}>
                        <h3>${tag.tagName}</h3>
                        <div class='btn btn--icon js-btn--delete-tag'><i class="fas fa-times"></i></div>
                    </div>
                `;
        })
        .join('');
}
function renderChooseTagPopup() {
    document.querySelector('.js-tag-group--choose-tag').innerHTML = todoListData.tags
        .map((tag) => {
            const isChosen = newTodo.tagIdsBuffer.some((id) => id === tag.id);
            return `                
                <div class='tag${isChosen ? ' active' : ''}' data-id=${tag.id}>
                    ${tag.tagName}
                </div> 
            `;
        })
        .join('');
}
function renderChosenTags() {
    document.querySelector('.chosen-tags-list').innerHTML =
        newTodo.todo.tagIds.length === 0
            ? "<span class='initial'><i class='fas fa-tags'></i>選擇標籤</span>"
            : newTodo.todo.tagIds
                  .map((id) => {
                      const tag = todoListData.tags.find((tag) => tag.id === id);
                      return `<div class='tag'>${tag.tagName}</div>`;
                  })
                  .join('') + "<span><i class='fas fa-tags'></i>選擇標籤</span>";
}
function renderEditorTags() {
    document.querySelector('.js-tag-group--editor').innerHTML = todoListData.tags
        .map((tag) => {
            const isChosen = editingTodo.todoBuffer.tagIds.some((id) => id === tag.id);
            return `
            <div class='tag${isChosen ? ' active' : ''}' data-id=${tag.id}>
                ${tag.tagName}
            </div> 
            `;
        })
        .join('');
}
function renderEditor(editingTodoId = null) {
    if (editingTodoId) editingTodo.todo = todoListData.todos.find((todo) => todo.id === editingTodoId);
    document.querySelector('.js-input--edit-todo').textContent = editingTodo.todoBuffer.content;
    renderEditorTags();
}

function renderAll() {
    renderTodoList();
    renderTagList();
    renderEditor();
    renderChosenTags();
    renderChooseTagPopup();
}

//--------------------------- Render end -------------------------------//

//--------------------------- Todo operations start-------------------------------//
function isContainsFilteredTags(todo) {
    if (filteredTagIds.length === 0) return true;
    return todo.tagIds.some((tagId) => filteredTagIds.includes(tagId));
}
function inputCreateTodo() {
    newTodo.todo.content = this.value;
}
function inputEditTodo() {
    editingTodo.todoBuffer.content = this.textContent;
    // console.log( editingTodo.todoBuffer.content)
}
function createTodo() {
    todoListData.todos.push(newTodo.todo);
    todoListData.createdTodoNum++;
    storeLocalStorage(todoListData);
}
function deleteTodo(todoId) {
    let index = todoListData.todos.findIndex((todo) => todo.id === todoId);
    todoListData.todos.splice(index, 1);
    storeLocalStorage(todoListData);
}
function toggleTodo(todoId) {
    todoListData.todos = todoListData.todos.map((todo) => {
        if (todo.id === todoId) todo.completed = !todo.completed;
        return todo;
    });
    storeLocalStorage(todoListData);
}
function setEditingTodo(todoId) {
    editingTodo.todo = todoListData.todos.find((todo) => todo.id === todoId);
    editingTodo.todoBuffer.content = editingTodo.todo.content;
    editingTodo.todoBuffer.tagIds = editingTodo.todo.tagIds.slice(0);
}

function clickBtnCreateTodo() {
    if (!newTodo.todo.content) return;
    createTodo();
    todoInput.value = '';
    newTodo = {
        todo: new Todo(todoListData.createdTodoNum + 1, '', []),
        tagIdsBuffer: [],
    };
    renderTodoList();
    renderChooseTagPopup();
    renderChosenTags();
}
function clickBtnDeleteTodo() {
    if (!editingTodo.todo) return;
    let tagId = editingTodo.todo.id;
    deleteTodo(tagId);
    editingTodo = {
        todo: null,
        todoBuffer: {
            content: null,
            tagIds: [],
        },
    };
    renderTodoList();
    renderEditor();
    editor.parentNode.classList.remove('cover');
}
function clickBtnSwitchMode() {
    listMode = !listMode;
    if (!listMode) {
        this.classList.add('clicked');
        this.textContent = '已完成';
    } else {
        this.classList.remove('clicked');
        this.textContent = '未完成';
    }
    renderTodoList();
}
function clickTodoList(e) {
    if (e.target.matches('.js-btn--finish-todo') || e.target.matches('.btn--recover-todo')) {
        let listItem = e.target.parentNode.parentNode;
        let id = parseInt(listItem.dataset.id);
        toggleTodo(id);
        renderTodoList();
        return;
    }
    if (e.target.matches('.js-btn--choose-to-delete')) {
        let listItem = e.target.parentNode.parentNode;
        let id = parseInt(listItem.dataset.id);
        deleteTodo(id);
        renderTodoList();
        return;
    }
    if (e.target.matches('.js-btn--edit-todo')) {
        let listItem = e.target.parentNode.parentNode;
        let id = parseInt(listItem.dataset.id);
        setEditingTodo(id);
        renderEditor(id);
        editor.parentNode.classList.add('cover');
        return;
    }
}
function clickEditorBtnGroup(e) {
    if (e.target.matches('.js-btn--edit-confirm')) {
        if (!editingTodo.todoBuffer.content) return;
        // editingTodo.todo.setTodo(editingTodo.todoBuffer);
        editingTodo.todo.content = editingTodo.todoBuffer.content;
        editingTodo.todo.tagIds = editingTodo.todoBuffer.tagIds.slice(0);
        storeLocalStorage(todoListData);
        renderTodoList();
        editingTodo = {
            todo: null,
            todoBuffer: {
                content: null,
                tagIds: [],
            },
        };
        renderEditor();
        editor.parentNode.classList.remove('cover');
        return;
    }
    if (e.target.matches('.js-btn--edit-cancel')) {
        editingTodo = {
            todo: null,
            todoBuffer: {
                content: null,
                tagIds: [],
            },
        };
        renderEditor();
        editor.parentNode.classList.remove('cover');
        return;
    }
}
function clickBtnChooseToDelete() {
    listIsChoosingToDelete = !listIsChoosingToDelete;
    renderTodoList();
}
todoInput.addEventListener('keyup', inputCreateTodo);
todoList.addEventListener('click', clickTodoList);
createTodoPanel.querySelector('.js-btn--create-todo').addEventListener('click', clickBtnCreateTodo);
createTodoPanel.querySelector('.js-btn--switch-mode').addEventListener('click', clickBtnSwitchMode);
createTodoPanel.querySelector('.js-btn--choose-to-delete').addEventListener('click', clickBtnChooseToDelete);
editor.querySelector('.js-input--edit-todo').addEventListener('keyup', inputEditTodo);
editor.querySelector('.js-btn-group--editor').addEventListener('click', clickEditorBtnGroup);
editor.querySelector('.js-btn--delete-todo').addEventListener('click', clickBtnDeleteTodo);

//--------------------------- Todo operations end-------------------------------//

//--------------------------- Tag operations start-------------------------------//

function createTag(tagName) {
    todoListData.createdTagNum++;
    let newTag = new Tag(todoListData.createdTagNum, tagName);
    todoListData.tags.push(newTag);
    storeLocalStorage(todoListData);
}
function deleteTag(tagId) {
    let indexInTags = todoListData.tags.findIndex((tag) => tag.id === tagId);
    if (indexInTags >= 0) todoListData.tags.splice(indexInTags, 1);
    storeLocalStorage(todoListData);

    filteredTagIds = [];

    todoInput.value = '';
    newTodo = {
        todo: new Todo(todoListData.createdTodoNum + 1, '', []),
        tagIdsBuffer: [],
    };
    editingTodo = {
        todo: null,
        todoBuffer: {
            content: null,
            tagIds: [],
        },
    };

    todoListData.todos.map((todo) => {
        let index = todo.tagIds.findIndex((id) => id === tagId);
        if (index >= 0) todo.tagIds.splice(index, 1);
    });
}

//Event callbacks

function clickBtnCreateTag() {
    let tagInput = this.parentNode.querySelector('.js-input--create-tag');
    let newTag = tagInput.value;
    if (!newTag) return;
    createTag(newTag);
    renderTagList();
    renderChooseTagPopup();
    renderEditorTags();
    tagInput.value = '';
}
function clickBtnChooseTag() {
    chooseTagPopup.classList.add('active');
    chooseTagPopup.querySelector('.input-form>.js-input--create-tag').value = '';
    renderChooseTagPopup();
}

function clickChooseTagBtnGroup(e) {
    if (e.target.matches('.js-btn--tag-confirm')) {
        chooseTagPopup.classList.remove('active');
        newTodo.todo.tagIds = newTodo.tagIdsBuffer.slice(0);
        renderChosenTags();
        renderChooseTagPopup();
        return;
    }
    if (e.target.matches('.js-btn--tag-cancel')) {
        chooseTagPopup.classList.remove('active');
        newTodo.tagIdsBuffer = newTodo.todo.tagIds.slice(0);
        renderChooseTagPopup();
        return;
    }
}
function clickChooseTagTagGroup(e) {
    if (!e.target.matches('.tag')) return;

    let tagId = parseInt(e.target.dataset.id);

    if (!newTodo.tagIdsBuffer.some((bTagId) => bTagId === tagId) && newTodo.tagIdsBuffer.length < MAXTAGNUMBER) {
        newTodo.tagIdsBuffer.push(tagId);
        newTodo.tagIdsBuffer.sort((a, b) => (a > b ? 1 : -1));
    } else {
        let index = newTodo.tagIdsBuffer.findIndex((bTagId) => bTagId === tagId);
        if (index >= 0) newTodo.tagIdsBuffer.splice(index, 1);
    }
    renderChooseTagPopup();
}
function clickEditorTagGroup(e) {
    if (!e.target.matches('.tag')) return;

    let tagId = parseInt(e.target.dataset.id);

    if (
        !editingTodo.todoBuffer.tagIds.some((bTagId) => bTagId === tagId) &&
        editingTodo.todoBuffer.tagIds.length < MAXTAGNUMBER
    ) {
        editingTodo.todoBuffer.tagIds.push(tagId);
        editingTodo.todoBuffer.tagIds.sort((a, b) => (a > b ? 1 : -1));
    } else {
        let index = editingTodo.todoBuffer.tagIds.findIndex((bTagId) => bTagId === tagId);
        if (index >= 0) editingTodo.todoBuffer.tagIds.splice(index, 1);
    }
    renderEditorTags();
}
function clickTagList(e) {
    if (e.target.matches('.tag')) {
        if (!tagPanel.querySelector('.tag-list').matches('.not-editing')) return;

        let tagId = parseInt(e.target.dataset.id);
        if (!filteredTagIds.some((fTagId) => fTagId === tagId)) {
            filteredTagIds.push(tagId);
            filteredTagIds.sort((a, b) => (a > b ? 1 : -1));
        } else {
            let index = filteredTagIds.findIndex((fTagId) => fTagId === tagId);
            if (index >= 0) filteredTagIds.splice(index, 1);
        }
        renderTagList();
        renderTodoList();
        return;
    }
    if (e.target.matches('.js-btn--delete-tag')) {
        let id = parseInt(e.target.parentNode.dataset.id);
        deleteTag(id);
        renderTagList();
        renderEditorTags();
        renderChosenTags();
        renderTodoList();
    }
}
function clickBtnEditTags() {
    tagPanel.querySelector('.tag-list').classList.toggle('not-editing');
}

document.querySelectorAll('.js-btn--create-tag').forEach((btn) => {
    btn.addEventListener('click', clickBtnCreateTag);
});
createTodoPanel.querySelector('.js-btn--choose-tag').addEventListener('click', clickBtnChooseTag);
createTodoPanel.querySelector('.js-btn--open-tag-panel').addEventListener('click', () => {
    tagPanel.parentNode.classList.add('cover');
});

chooseTagPopup.querySelector('.js-btn-group--choose-tag').addEventListener('click', clickChooseTagBtnGroup);
chooseTagPopup.querySelector('.js-tag-group--choose-tag').addEventListener('click', clickChooseTagTagGroup);

editor.querySelector('.js-tag-group--editor').addEventListener('click', clickEditorTagGroup);

tagPanel.querySelector('.tag-list').addEventListener('click', clickTagList);
tagPanel.querySelector('.js-btn--edit-tags').addEventListener('click', clickBtnEditTags);
tagPanel.querySelector('.js-btn--close-tag-panel').addEventListener('click', () => {
    tagPanel.parentNode.classList.remove('cover');
});

//--------------------------- Tag operations end-------------------------------//

setInterval(() => {
    if (todoInput.value !== '') document.querySelector('.js-btn--create-todo').classList.add('active');
    else document.querySelector('.js-btn--create-todo').classList.remove('active');
}, 0);

function loadLocalStorage() {
    if (!localStorage.todoListData) {
        var InitialData = {
            todos: [],
            tags: [],
            createdTodoNum: 0,
            createdTagNum: 0,
        };
        storeLocalStorage(InitialData);
    }
    return JSON.parse(localStorage.getItem('todoListData'));
}

function storeLocalStorage(data) {
    localStorage.setItem('todoListData', JSON.stringify(data));
}

function initialize() {
    localStorage.removeItem('todoListData');
    todoListData = loadLocalStorage();
    newTodo = {
        todo: new Todo(todoListData.createdTodoNum + 1, '', []),
        tagIdsBuffer: [],
    };
    renderAll();
}

todoListData = loadLocalStorage();
newTodo.todo.id = todoListData.createdTodoNum + 1;

renderAll();

const defaultData = {
    todos: [
        {
            id: 1,
            content: '打掃',
            tagIds: [1],
            completed: false,
        },
        {
            id: 2,
            content: '資料庫作業',
            tagIds: [3],
            completed: false,
        },
        {
            id: 3,
            content: '我的生日',
            tagIds: [4],
            completed: false,
        },
        {
            id: 4,
            content: '我朋友的生日',
            tagIds: [5],
            completed: false,
        },
        {
            id: 5,
            content: '睡覺',
            tagIds: [1],
            completed: false,
        },
    ],
    tags: [
        {
            id: 1,
            tagName: '今天',
        },
        {
            id: 3,
            tagName: '後天',
        },
        {
            id: 4,
            tagName: '7月14日',
        },
        {
            id: 5,
            tagName: '7月15日',
        },
    ],
    createdTodoNum: 5,
    createdTagNum: 5,
};

function useDefaultValue() {
    todoListData = defaultData;
    storeLocalStorage(todoListData);
    newTodo.todo.id = todoListData.createdTodoNum + 1;
    renderAll();
}

useDefaultValue();
