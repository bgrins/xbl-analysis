class XblTabs extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<spacer class="tabs-left">
</spacer>
<children>
</children>
<spacer class="tabs-right" flex="1">
</spacer>`;
    let comment = document.createComment("Creating xbl-tabs");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get itemCount() {
    return this.childNodes.length;
  }

  get value() {
    return this.getAttribute("value");
  }
}
customElements.define("xbl-tabs", XblTabs);
