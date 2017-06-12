class XblPanebutton extends XblRadio {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<image class="paneButtonIcon" xbl:inherits="src">
</image>
<label class="paneButtonLabel" xbl:inherits="value=label">
</label>`;
    let comment = document.createComment("Creating xbl-panebutton");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-panebutton", XblPanebutton);
