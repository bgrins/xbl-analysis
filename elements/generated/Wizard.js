class XblWizard extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<hbox class="wizard-header" anonid="Header">
</hbox>
<deck class="wizard-page-box" flex="1" anonid="Deck">
<children includes="wizardpage">
</children>
</deck>
<children>
</children>
<hbox class="wizard-buttons" anonid="Buttons" xbl:inherits="pagestep,firstpage,lastpage">
</hbox>`;
    let comment = document.createComment("Creating xbl-wizard");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard", XblWizard);
