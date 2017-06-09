class XblGroupbox extends XblGroupboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="groupbox-title" align="center" pack="start">
<children includes="caption">
</children>
</hbox>
<box flex="1" class="groupbox-body" xbl:inherits="orient,align,pack">
<children>
</children>
</box>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-groupbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-groupbox", XblGroupbox);
