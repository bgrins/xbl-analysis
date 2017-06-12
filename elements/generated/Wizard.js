class XblWizard extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

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

  set title(val) {
    return (document.title = val);
  }

  get title() {
    return document.title;
  }

  set canAdvance(val) {
    this._nextButton.disabled = !val;
    return (this._canAdvance = val);
  }

  get canAdvance() {
    return this._canAdvance;
  }

  set canRewind(val) {
    this._backButton.disabled = !val;
    return (this._canRewind = val);
  }

  get canRewind() {
    return this._canRewind;
  }

  get pageStep() {
    return this._pageStack.length;
  }

  get currentPage() {
    return this._currentPage;
  }

  get pageIndex() {
    return this._currentPage ? this._currentPage.pageIndex : -1;
  }

  get onFirstPage() {
    return this._pageStack.length == 1;
  }
}
customElements.define("xbl-wizard", XblWizard);
