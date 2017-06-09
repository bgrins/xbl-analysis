class XblOptionsdialog extends XblDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox flex="1">
<categoryBox anonid="prefsCategories">
<children>
</children>
</categoryBox>
<vbox flex="1">
<dialogheader id="panelHeader">
</dialogheader>
<iframe anonid="panelFrame" name="panelFrame" style="width: 0px;" flex="1">
</iframe>
</vbox>
</hbox>
<vbox flex="1">
<categoryBox anonid="prefsCategories">
<children>
</children>
</categoryBox>
<vbox flex="1">
<iframe anonid="panelFrame" name="panelFrame" style="width: 0px;" flex="1">
</iframe>
</vbox>
</vbox>`;
    let name = document.createElement("span");
    name.textContent = "Creating xbl-optionsdialog ";
    this.prepend(name);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-optionsdialog", XblOptionsdialog);
