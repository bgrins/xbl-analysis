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
    let comment = document.createComment("Creating xbl-label-control");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-label-control", XblLabelControl);
