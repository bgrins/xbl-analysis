class XblCaption extends XblBasetext {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<children>
<image class="caption-icon" xbl:inherits="src=image">
</image>
<label class="caption-text" flex="1" xbl:inherits="default,value=label,crop,accesskey">
</label>
</children>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-caption ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-caption", XblCaption);
