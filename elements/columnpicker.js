class XblColumnpicker extends XblTreeBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<image class="tree-columnpicker-icon">
</image>
<menupopup anonid="popup">
<menuseparator anonid="menuseparator">
</menuseparator>
<menuitem anonid="menuitem" label="&restoreColumnOrder.label;">
</menuitem>
</menupopup>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-columnpicker ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-columnpicker", XblColumnpicker);
