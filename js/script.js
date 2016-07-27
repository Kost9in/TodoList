
document.addEventListener('DOMContentLoaded', function(event) {

  const qs = selector => document.querySelector(selector);

  const todo = new Todo({
    items: (localStorage.todoItems) ? JSON.parse(localStorage.todoItems) : [],
    listWrapper: '.todo-wrapper .todo-list ul',
    onSelect: (selected) => { // select items
      const actionsWrapper = qs('.todo-actions');
      if (selected.length) {
        actionsWrapper.classList.add('show');
        if (selected.length > 1) actionsWrapper.classList.add('many');
        else actionsWrapper.classList.remove('many');
      }
      else actionsWrapper.classList.remove('show');
    },
    onChange: (items) => { // save items
      localStorage.todoItems = JSON.stringify(items);
    }
  });

  /* add item */
  qs('.todo-wrapper form.add-todo').addEventListener('submit', e => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input[name="add-todo"]');
    todo.add.call(todo, input.value.trim());
    input.value = '';
  });

  /* edit items */
  qs('.todo-actions .edit').addEventListener('click', e => {
    e.preventDefault();
    todo.edit.call(todo);
  });

  /* remove items */
  qs('.todo-actions .remove').addEventListener('click', e => {
    e.preventDefault();
    todo.remove.call(todo);
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
