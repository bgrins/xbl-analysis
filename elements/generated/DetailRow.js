class MozDetailRow extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <label class="detail-row-label" inherits="value=label"></label>
      <label class="detail-row-value" inherits="value"></label>
    `));

    this._setupEventListeners();
  }

  set value(val) {
    if (!val)
      this.removeAttribute("value");
    else
      this.setAttribute("value", val);
  }

  get value() {
    return this.getAttribute("value");
  }

  _setupEventListeners() {

  }
}