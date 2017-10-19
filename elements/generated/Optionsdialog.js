class FirefoxOptionsdialog extends FirefoxDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<xul:hbox flex="1">
<xul:categorybox anonid="prefsCategories">
<children>
</children>
</xul:categorybox>
<xul:vbox flex="1">
<xul:dialogheader id="panelHeader">
</xul:dialogheader>
<xul:iframe anonid="panelFrame" name="panelFrame" style="width: 0px;" flex="1">
</xul:iframe>
</xul:vbox>
</xul:hbox>`;
    let comment = document.createComment("Creating firefox-optionsdialog");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-optionsdialog", FirefoxOptionsdialog);
