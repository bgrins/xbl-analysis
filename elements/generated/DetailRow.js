class FirefoxDetailRow extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:label class="detail-row-label" inherits="value=label"></xul:label>
      <xul:label class="detail-row-value" inherits="value"></xul:label>
    `;
  }

  set value(val) {
    if (!val) this.removeAttribute("value");
    else this.setAttribute("value", val);
  }

  get value() {
    return this.getAttribute("value");
  }
}
customElements.define("firefox-detail-row", FirefoxDetailRow);
