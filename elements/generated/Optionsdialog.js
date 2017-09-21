class FirefoxOptionsdialog extends FirefoxDialog {
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
</hbox>`;
    let comment = document.createComment("Creating firefox-optionsdialog");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("firefox-optionsdialog", FirefoxOptionsdialog);
