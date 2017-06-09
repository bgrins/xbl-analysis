class XblTabs extends XblBasecontrol {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

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
}
customElements.define("xbl-tabs", XblTabs);
