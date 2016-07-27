
document.addEventListener('DOMContentLoaded', function(event) {

  const todo = new Todo({
    listWrapper: '.todo-wrapper .todo-list ul',
    actionsWrapper: '.todo-actions',
    addInput: 'form.add-todo input[name="add-todo"]',
    searchInput: 'form.todo-search input[name="todo-search"]',
    filterInfo: '.todo-wrapper .todo-filter'
  });

  document.querySelector('.todo-wrapper form.add-todo').addEventListener('submit', todo.add.bind(todo));
  document.querySelector('.todo-actions .edit').addEventListener('click', todo.edit.bind(todo));
  document.querySelector('.todo-actions .remove').addEventListener('click', todo.remove.bind(todo));
  document.querySelector('.todo-wrapper form.todo-search').addEventListener('submit', todo.filter.bind(todo));

});
