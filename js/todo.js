class Todo {

  constructor (config) {
    this.listWrapper = document.querySelector(config.listWrapper);
    this.onSelect = config.onSelect;
    this.onChange = config.onChange;
    this.filterText = '';
    this.items = config.items;
    this.selected = [];
    this.edited = [];

    this.listWrapper.addEventListener('click', e => {
      if (e.target.tagName === 'LI') {
        e.preventDefault();
        const event = {
          idx: +e.target.getAttribute('data-idx'),
          ctrl: e.ctrlKey,
          shift: e.shiftKey
        };
        this.select.call(this, event);
      }
    });
    this.render();
  }

  filter (filterText) {
    this.filterText = filterText;
    this.select();
  }

  add (newItem) {
    if (newItem) {
      this.items.push(newItem);
      this.save();
    }
    this.select();
  }

  edit () {
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

  remove () {
    this.items = this.items.filter((item, idx) => this.selected.indexOf(idx) === -1);
    this.save();
    this.select();
  }

  save () {
    this.onChange(this.items); // callback
  }

  select (event) {
    if (typeof event === 'undefined') this.selected = [];
    else {
      if (event.ctrl) {
        const indexOf = this.selected.indexOf(event.idx);
        if (indexOf !== -1) this.selected.splice(indexOf, 1);
        else this.selected.push(event.idx);
      } else if (event.shift) {
        if (this.selected.length) {
          const first = this.selected[0];
          this.selected = [first];
          while (event.idx !== first) {
            this.selected.push(event.idx);
            if (event.idx > first) event.idx--;
            else event.idx++;
          }
        } else this.selected = [event.idx];
      } else {
        if (this.selected.indexOf(event.idx) !== -1 && this.selected.length === 1) this.selected = [];
        else this.selected = [event.idx];
      }
    }
    this.render();
    this.onSelect(this.selected); // callback
  }

  render () {
    const itemsHtml = document.createDocumentFragment();
    const filterReg = new RegExp(this.filterText, 'i');
    const filteredItems = this.items.map((item, idx) => (filterReg) ? filterReg.test(item) : true);
    let itemsCount = 0;
    this.items.forEach((value, idx) => {
      if (filteredItems[idx]) {
        const li = document.createElement('li');
        li.innerText = value;
        if (this.selected.indexOf(idx) !== -1) li.classList.add('selected');
        li.setAttribute('data-idx', idx);
        itemsHtml.appendChild(li);
        itemsCount++;
      }
    });
    if (!itemsCount) {
      const empty = document.createElement('li');
      empty.innerText = 'Results not found...';
      empty.classList.add('empty');
      itemsHtml.appendChild(empty);
    }
    this.listWrapper.innerHTML = '';
    this.listWrapper.appendChild(itemsHtml);
  }
}
