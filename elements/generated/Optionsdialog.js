class XblOptionsdialog extends XblDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

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
    let comment = document.createComment("Creating xbl-optionsdialog");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-optionsdialog", XblOptionsdialog);
