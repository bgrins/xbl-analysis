class XblPanebutton extends XblRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="paneButtonIcon" xbl:inherits="src">
</image>
<label class="paneButtonLabel" xbl:inherits="value=label">
</label>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-panebutton ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panebutton", XblPanebutton);
