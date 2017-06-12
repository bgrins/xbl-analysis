class XblLabelControl extends XblTextLabel {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children>
</children>
<span anonid="accessKeyParens">
</span>`;
    let comment = document.createComment("Creating xbl-label-control");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get labeledControlElement() {
    var control = this.control;
    return control ? document.getElementById(control) : null;
  }

  get control() {
    return this.getAttribute("control");
  }
}
customElements.define("xbl-label-control", XblLabelControl);
