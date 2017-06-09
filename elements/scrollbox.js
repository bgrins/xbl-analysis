class XblScrollbox extends XblScrollboxBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<box class="box-inherit scrollbox-innerbox" xbl:inherits="orient,align,pack,dir" flex="1">
<children>
</children>
</box>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-scrollbox ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-scrollbox", XblScrollbox);
