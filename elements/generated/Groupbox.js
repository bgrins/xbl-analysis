class XblGroupbox extends XblGroupboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="groupbox-title" align="center" pack="start">
<children includes="caption">
</children>
</hbox>
<box flex="1" class="groupbox-body" inherits="orient,align,pack">
<children>
</children>
</box>`;
    let comment = document.createComment("Creating xbl-groupbox");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox", XblGroupbox);
