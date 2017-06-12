class XblListboxBase extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    let comment = document.createComment("Creating xbl-listbox-base");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  set selectedItem(val) {
    this.selectItem(val);
  }

  set selType(val) {
    this.setAttribute("seltype", val);
    return val;
  }

  get selType() {
    return this.getAttribute("seltype");
  }

  get currentItem() {
    return this._currentItem;
  }

  get selectedCount() {
    return this.selectedItems.length;
  }

  get disableKeyNavigation() {
    return this.hasAttribute("disableKeyNavigation");
  }

  set suppressOnSelect(val) {
    this.setAttribute("suppressonselect", val);
  }

  get suppressOnSelect() {
    return this.getAttribute("suppressonselect") == "true";
  }

  set _selectDelay(val) {
    this.setAttribute("_selectDelay", val);
  }

  get _selectDelay() {
    return this.getAttribute("_selectDelay") || 50;
  }
}
customElements.define("xbl-listbox-base", XblListboxBase);
