class Handler extends Richlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <vbox pack="center">
        <image inherits="src=image" height="32" width="32"></image>
      </vbox>
      <vbox flex="1">
        <label class="name" inherits="value=name"></label>
        <label class="description" inherits="value=description"></label>
      </vbox>
    `));

    this._setupEventListeners();
  }

  get label() {
    return this.getAttribute('name') + ' ' + this.getAttribute('description');
  }

  _setupEventListeners() {

  }
}