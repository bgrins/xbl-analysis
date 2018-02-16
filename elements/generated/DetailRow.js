class FirefoxDetailRow extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:label class="detail-row-label" inherits="value=label"></xul:label>
      <xul:label class="detail-row-value" inherits="value"></xul:label>
    `;

    this.setupHandlers();
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

  setupHandlers() {

  }
}