class XblListheader extends BaseElement {
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
    let comment = document.createComment("Creating xbl-listheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-listheader", XblListheader);
