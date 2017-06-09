class XblStatusbarpanel extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<label class="statusbarpanel-text" xbl:inherits="value=label,crop" crop="right" flex="1">
</label>
</children>`;
    let comment = document.createComment("Creating xbl-statusbarpanel");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-statusbarpanel", XblStatusbarpanel);
