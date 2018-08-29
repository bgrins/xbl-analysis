class MozCustomizableuiToolbarMenubarStub extends MozXULElement {
  connectedCallback() {

    this._setupEventListeners();
  }

  get toolbox() {
    if (this._toolbox)
      return this._toolbox;

    if (this.parentNode && this.parentNode.localName == "toolbox") {
      this._toolbox = this.parentNode;
    }

    return this._toolbox;
  }

  get currentSet() {
    return this.getAttribute("defaultset");
  }

  insertItem() {
    return null;
  }

  _setupEventListeners() {

  }
}