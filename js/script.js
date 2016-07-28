
document.addEventListener('DOMContentLoaded', function(event) {

  const qs = selector => document.querySelector(selector);

  const todoItems = new DataStorage(JSON.parse(localStorage.todoItems));

  const todo = new Todo({
    items: todoItems.select(),
    listWrapper: '.todo-wrapper .todo-list ul',
    onSelect: (selected) => { // select items
      const actionsWrapper = qs('.todo-actions');
      if (selected.length) {
        actionsWrapper.classList.add('show');
        if (selected.length > 1) actionsWrapper.classList.add('many');
        else actionsWrapper.classList.remove('many');
      }
      else actionsWrapper.classList.remove('show');
    }
  });

  /* add item */
  qs('.todo-wrapper form.add-todo').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[name="add-todo"]');
    todoItems.insert(input.value.trim());
    input.value = '';
  });
  todoItems.subscribe('insert', (item, items) => {
    localStorage.todoItems = JSON.stringify(items);
    todo.select();
  });

  /* edit items */
  qs('.todo-actions .edit').addEventListener('click', e => {
    e.preventDefault();
    todo.edit((idx, item) => todoItems.update(idx, item));
  });
  todoItems.subscribe('update', (item, items) => {
    localStorage.todoItems = JSON.stringify(items);
    todo.select();
  });

  /* remove items */
  qs('.todo-actions .remove').addEventListener('click', e => {
    e.preventDefault();
    todoItems.delete(todo.selected);

  });
  todoItems.subscribe('delete', (items) => {
    localStorage.todoItems = JSON.stringify(items);
    todo.select();
  });

  /* filter items */
  qs('.todo-wrapper form.todo-search').addEventListener('submit', e => {
    e.preventDefault();
    const searchInput = qs('form.todo-search input[name="todo-search"]');
    const filterText = searchInput.value.trim();
    todo.filter.call(todo, filterText);
    const filterInfo = qs('.todo-wrapper .todo-filter');
    if (filterText) {
      filterInfo.innerHTML = `Filter: ${filterText}`;
      const remove = document.createElement('a');
      remove.classList = 'remove';
      remove.innerHTML = '<i class="fa fa-times"></i>';
      remove.addEventListener('click', e => {
        e.preventDefault();
        searchInput.value = '';
        filterInfo.innerHTML = '';
        todo.filter.call(todo, '');
      });
      filterInfo.appendChild(remove);
    }
    else filterInfo.innerHTML = '';
  });

});
