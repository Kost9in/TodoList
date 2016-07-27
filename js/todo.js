class Todo {

  constructor (config) {
    this.listWrapper = document.querySelector(config.listWrapper);
    this.actionsWrapper = document.querySelector(config.actionsWrapper);
    this.addInput = document.querySelector(config.addInput);
    this.searchInput = document.querySelector(config.searchInput);
    this.filterInfo = document.querySelector(config.filterInfo);
    this.filterText = '';
    this.items = (localStorage.todoItems) ? JSON.parse(localStorage.todoItems) : [];
    this.selected = [];
    this.edited = [];
    this.render();
  }

  filter (e) {
    e.preventDefault();
    this.filterText = this.searchInput.value.trim();
    this.select();
  }

  add (e) {
    e.preventDefault();
    const value = this.addInput.value.trim();
    if (value) {
      this.items.push(value);
      this.save();
    }
    this.addInput.value = '';
    this.select();
  }

  edit (e) {
    e.preventDefault();
    const editIdx = this.selected[0];
    const editLi = this.listWrapper.querySelector(`li[data-idx="${editIdx}"]`);

    editLi.innerHTML = '';
    const form = document.createElement('form');
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    form.appendChild(input);
    editLi.appendChild(form);
    input.focus();
    input.value = this.items[editIdx];

    input.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    input.addEventListener('blur', (e) => {
      saveItem(e.currentTarget.value.trim());
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveItem(e.currentTarget.querySelector('input').value.trim());
    });

    const saveItem = (value) => {
      if (value) {
        this.items[editIdx] = value;
        this.save();
      }
      this.select();
    };
  }

  remove (e) {
    e.preventDefault();
    this.items = this.items.filter((item, idx) => this.selected.indexOf(idx) === -1);
    this.save();
    this.select();
  }

  save () {
    localStorage.todoItems = JSON.stringify(this.items);
  }

  select (e) {
    /* items */
    if (typeof e === 'undefined') this.selected = [];
    else {
      e.preventDefault();
      let idx = +e.currentTarget.getAttribute('data-idx');
      if (e.ctrlKey) {
        const indexOf = this.selected.indexOf(idx);
        if (indexOf !== -1) this.selected.splice(indexOf, 1);
        else this.selected.push(idx);
      } else if (e.shiftKey) {
        if (this.selected.length) {
          const first = this.selected[0];
          this.selected = [first];
          while (idx !== first) {
            this.selected.push(idx);
            if (idx > first) idx--;
            else idx++;
          }
        } else this.selected = [idx];
      } else {
        if (this.selected.indexOf(idx) !== -1 && this.selected.length === 1) this.selected = [];
        else this.selected = [idx];
      }
    }
    this.render();

    /* actions */
    if (this.selected.length) {
      this.actionsWrapper.classList.add('show');
      if (this.selected.length > 1) this.actionsWrapper.classList.add('many');
      else this.actionsWrapper.classList.remove('many');
    }
    else this.actionsWrapper.classList.remove('show');
  }

  render () {
    /* items */
    const itemsHtml = document.createDocumentFragment();
    const filterReg = new RegExp(this.filterText, 'i');
    const filteredItems = this.items.map((item, idx) => (filterReg) ? filterReg.test(item) : true);
    let itemsCount = 0;
    this.items.forEach((value, idx) => {
      if (filteredItems[idx]) {
        const li = document.createElement('li');
        li.innerText = value;
        if (this.selected.indexOf(idx) !== -1) li.classList = 'selected';
        li.setAttribute('data-idx', idx);
        itemsHtml.appendChild(li);
        li.addEventListener('click', this.select.bind(this));
        itemsCount++;
      }
    });
    if (!itemsCount) {
      const empty = document.createElement('li');
      empty.innerText = 'Results not found...';
      empty.classList = 'empty';
      itemsHtml.appendChild(empty);
    }
    this.listWrapper.innerHTML = '';
    this.listWrapper.appendChild(itemsHtml);
    
    /* filter */
    if (this.filterText) {
      this.filterInfo.innerHTML = `Filter: ${this.filterText}`;
      const remove = document.createElement('a');
      remove.classList = 'remove';
      remove.innerHTML = '<i class="fa fa-times"></i>';
      remove.addEventListener('click', (e) => {
        e.preventDefault();
        this.filterText = this.searchInput.value = '';
        this.select();
      });
      this.filterInfo.appendChild(remove);
    }
    else this.filterInfo.innerHTML = '';
  }
}
