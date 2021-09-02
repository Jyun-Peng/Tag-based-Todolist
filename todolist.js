class Todo {
    constructor(id ,content = '', tags = [], completed = false) {
        this.id = id;
        this.content = content;
        this.tags = tags;
        this.completed = completed;
    }
    // method
    setTodo(content, tag) {
        this.content = content;
        this.tag = Object.assign({}, tag);
    }
}

class Tag {
    constructor(id, tagName){
        this.id = id;
        this.tagName = tagName;
    }
}

var todos = [];
var tags = [];
var chosenTagIds = [];
var chosenTagIdsBuffer = [];
var editTarget;
var createdTodoNum = 0;
var createdTagNum = 0;

const todoList = document.querySelector('.todo-list');
const todoInput = document.querySelector('.todo-input');
const tagList = document.querySelector('.tag-list');
const tagInput = document.querySelector('.tag-input');

function createTodo(content, tags) {
    createdTodoNum ++;
    let newTodo = new Todo(createdTodoNum ,content, tags, false);
    todos.push(newTodo);
}

function createTag(tagName) {
    createdTagNum++;
    let newTag = new Tag(createdTagNum, tagName);
    tags.push(newTag);
}

function deepCopyObjectArray(arrFrom,arrTo){
    for(let i=0; i<arrFrom.length; i++){
        arrTo[i]=Object.assign({},arrFrom[i]);
    }
}


function renderTodoList() {

    todoList.innerHTML = `
        ${todos.map(ele => {
            if(ele.completed === false){
                return `
                    <li data-id=${ele.id}>
                        <div class='btn finish-btn'>O</div>
                        <h3>${ele.content}</h3>
                        <div class='btn edit-btn'>:</div>
                    </li>
                `               
            }}).join('')
        }
    `

    console.log(todos);
}

function renderTagList() {

    tagList.innerHTML = `
        ${tags.map(ele => {
                return `
                    <li data-id=${ele.id}>
                        <h3>${ele.tagName}</h3>
                        <div class='btn delete-btn'>X</div>
                    </li>
                `               
            }).join('')
        }
    `
    console.log(tags);
}

function renderChooseTag() {
    document.querySelector('.tag-group').innerHTML = `
    ${tags.map(ele => {
            return `
                <div class='tag' data-id=${ele.id}>
                    ${ele.tagName}
                </div>
            `               
        }).join('')
    }
`
}

function renderChosenTags() {
    let tagsIter = tags[Symbol.iterator]();
    document.querySelector('.chosen-tags-group').innerHTML = `
    ${chosenTagIds.map(id => {
        let tag = tagsIter.next().value;
        console.log(tag);
        while(tag){
            if(id === tag.id)return `<div class='tag'>${tag.tagName}</div>`;
            tag = tagsIter.next().value;
        }
    }).join('')}
    `
}



renderTodoList();
renderTagList();
renderChooseTag();


document.querySelector('.btn--create-todo').addEventListener('click', () => {
    let content = todoInput.value;
    if(!content) return;
    
    createTodo(content, chosenTagIds);
    todoInput.value = '';
    chosenTagIds = [];
    renderTodoList();
    renderChooseTag();
    renderChosenTags();


})

todoList.addEventListener('click', (e) => {
    if(e.target.classList.contains('finish-btn')){
        let id = parseInt(e.target.parentNode.getAttribute('data-id'));
        todos = todos.map(ele => {
            if(ele.id === id)ele.completed = true;
            return ele;
        })
        renderTodoList();
    }
    if(e.target.classList.contains('edit-btn')){
        editTarget = e.target.parentNode;
    }
})

// document.querySelector('.delete-todo-btn').addEventListener('click', () => {
//     if(!editTarget) return;
//     let id = parseInt(editTarget.getAttribute('data-id'));
//     todos = todos.filter(ele => ele.id !== id)
//     console.log(todos)
//     renderTodoList();
// })

document.querySelector('.btn--create-tag').addEventListener('click', () => {
    let newTag = tagInput.value;
    if(!newTag) return;
    createTag(newTag);
    renderTagList();
    renderChooseTag();
    tagInput.value = ''
})
document.querySelector('.btn--choose-tag').addEventListener('click', () => {
    document.querySelector('.choose-tag-wrapper').classList.add('active');
    chosenTagIdsBuffer = [];
})
document.querySelector('.btn--tag-confirm').addEventListener('click', () => {
    document.querySelector('.choose-tag-wrapper').classList.remove('active');
    chosenTagIds = chosenTagIdsBuffer.slice(0).sort((a,b) => a > b ? 1 : -1 );
    renderChosenTags();
    renderChooseTag();
})
document.querySelector('.btn--tag-cancel').addEventListener('click', () => {
    document.querySelector('.choose-tag-wrapper').classList.remove('active');
    renderChooseTag();
})

document.querySelector('.choose-tag-container>.tag-group').addEventListener('click', (e) => {
    if(!e.target.classList.contains('tag')) return;

    let id = parseInt(e.target.getAttribute('data-id'));
    
    if(!e.target.classList.contains('active')){
        e.target.classList.add('active');

        chosenTagIdsBuffer.push(id);
    }
    else{
        e.target.classList.remove('active');
        chosenTagIdsBuffer = chosenTagIdsBuffer.filter(chosenId => chosenId !== id);
    }
})


setInterval(() => {
    if(todoInput.value !== '')document.querySelector('.btn--create-todo').classList.add('active');
    else document.querySelector('.btn--create-todo').classList.remove('active')
},0)