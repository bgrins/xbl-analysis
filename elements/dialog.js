class XblDialog extends XblRootElement {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox class="box-inherit dialog-content-box" flex="1">
<children>
</children>
</vbox>
<hbox class="dialog-button-box" anonid="buttons" xbl:inherits="pack=buttonpack,align=buttonalign,dir=buttondir,orient=buttonorient">
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
<button dlgtype="help" class="dialog-button" hidden="true">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1">
</spacer>
<button dlgtype="cancel" class="dialog-button">
</button>
<button dlgtype="accept" class="dialog-button" xbl:inherits="disabled=buttondisabledaccept">
</button>
<button dlgtype="extra2" class="dialog-button" hidden="true">
</button>
<spacer anonid="spacer" flex="1" hidden="true">
</spacer>
<button dlgtype="accept" class="dialog-button" xbl:inherits="disabled=buttondisabledaccept">
</button>
<button dlgtype="extra1" class="dialog-button" hidden="true">
</button>
<button dlgtype="cancel" class="dialog-button">
</button>
<button dlgtype="help" class="dialog-button" hidden="true">
</button>
<button dlgtype="disclosure" class="dialog-button" hidden="true">
</button>
</hbox>`;
    let comment = document.createComment("Creating xbl-dialog");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-dialog", XblDialog);
