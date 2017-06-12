class XblPrefwindow extends XblDialog {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<windowdragbox orient="vertical">
<radiogroup anonid="selector" orient="horizontal" class="paneSelector chromeclass-toolbar" role="listbox">
</radiogroup>
</windowdragbox>
<hbox flex="1" class="paneDeckContainer">
<deck anonid="paneDeck" flex="1">
<children includes="prefpane">
</children>
</deck>
</hbox>
<hbox anonid="dlg-buttons" class="prefWindow-dlgbuttons" pack="end">
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
<button dlgtype="help" class="dialog-button" hidden="true" icon="help">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1">
</spacer>
<button dlgtype="cancel" class="dialog-button" icon="cancel">
</button>
<button dlgtype="accept" class="dialog-button" icon="accept">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1">
</spacer>
<button dlgtype="accept" class="dialog-button" icon="accept">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<button dlgtype="cancel" class="dialog-button" icon="cancel">
</button>
<button dlgtype="help" class="dialog-button" hidden="true" icon="help">
</button>
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
</hbox>
<hbox>
<children>
</children>
</hbox>`;
    let comment = document.createComment("Creating xbl-prefwindow");
    this.prepend(comment);
  }
  disconnectedCallback() {}

  get preferencePanes() {
    return this.getElementsByTagName("prefpane");
  }

  get type() {
    return this.getAttribute("type");
  }

  get _paneDeck() {
    return document.getAnonymousElementByAttribute(this, "anonid", "paneDeck");
  }

  get _paneDeckContainer() {
    return document.getAnonymousElementByAttribute(
      this,
      "class",
      "paneDeckContainer"
    );
  }

  get _selector() {
    return document.getAnonymousElementByAttribute(this, "anonid", "selector");
  }

  get lastSelected() {
    return this.getAttribute("lastSelected");
  }

  set currentPane(val) {
    return (this._currentPane = val);
  }
}
customElements.define("xbl-prefwindow", XblPrefwindow);
