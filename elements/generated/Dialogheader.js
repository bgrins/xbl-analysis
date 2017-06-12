class XblDialogheader extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<label class="dialogheader-title" xbl:inherits="value=title,crop" crop="right" flex="1">
</label>
<label class="dialogheader-description" xbl:inherits="value=description">
</label>`;
    let comment = document.createComment("Creating xbl-dialogheader");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dialogheader", XblDialogheader);
