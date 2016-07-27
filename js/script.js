
document.addEventListener('DOMContentLoaded', function(event) {

  const todo = new Todo('.todo-wrapper .todo-list ul');

  document.querySelector('.todo-wrapper form.todo-search').addEventListener('submit', todo.filter.bind(todo));
  document.querySelector('.todo-wrapper form.add-todo').addEventListener('submit', todo.add.bind(todo));

});
