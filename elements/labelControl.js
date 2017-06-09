class XblLabelControl extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
</children>
<span anonid="accessKeyParens">
</span>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-label-control ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-label-control", XblLabelControl);
