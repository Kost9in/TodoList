class Todo {
  constructor (listWrapper) {
    this.listWrapper = document.querySelector(listWrapper);
    this.items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    this.selected = [];

    this.ini();
  }
  ini () {
    this.render();
  }
  filter (e) {
    e.preventDefault();
    console.log('filter');
  }
  add (e) {
    e.preventDefault();
    console.log('add');
  }
  select (e) {
    e.preventDefault();
    let idx = +e.currentTarget.getAttribute('data-idx');
    if (e.ctrlKey) {
      const indexOf = this.selected.indexOf(idx);
      console.log(indexOf);
      if (indexOf !== -1) this.selected.splice(indexOf, 1);
      else this.selected.push(idx);
    } else if (e.shiftKey) {
      if (this.selected.length > 0) {
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
    this.render();
  }
  render () {
    const itemsHtml = document.createDocumentFragment();
    this.items.forEach((value, idx) => {
      const li = document.createElement('li');
      li.innerText = value;
      if (this.selected.indexOf(idx) !== -1) li.classList = 'selected';
      li.setAttribute('data-idx', idx);
      itemsHtml.appendChild(li);
      li.addEventListener('click', this.select.bind(this));
    });
    this.listWrapper.innerHTML = '';
    this.listWrapper.appendChild(itemsHtml);

  }
}
