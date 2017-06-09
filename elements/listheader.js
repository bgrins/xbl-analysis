class XblListheader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="listheader-icon">
</image>
<label class="listheader-label" xbl:inherits="value=label,crop" flex="1" crop="right">
</label>
<image class="listheader-sortdirection" xbl:inherits="sortDirection">
</image>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-listheader ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listheader", XblListheader);
