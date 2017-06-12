class XblWizardButtons extends XblWizardBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute("foo", "bar");

    this.innerHTML = `<vbox class="wizard-buttons-box-1" flex="1">
<separator class="wizard-buttons-separator groove">
</separator>
<hbox class="wizard-buttons-box-2">
<button class="wizard-button" dlgtype="extra1" hidden="true">
</button>
<button class="wizard-button" dlgtype="extra2" hidden="true">
</button>
<spacer flex="1" anonid="spacer">
</spacer>
<button label="&button-cancel-unix.label;" class="wizard-button" dlgtype="cancel" icon="cancel">
</button>
<spacer style="width: 24px">
</spacer>
<button label="&button-back-unix.label;" accesskey="&button-back-unix.accesskey;" class="wizard-button" dlgtype="back" icon="go-back">
</button>
<deck class="wizard-next-deck" anonid="WizardButtonDeck">
<hbox>
<button label="&button-finish-unix.label;" class="wizard-button" dlgtype="finish" default="true" flex="1">
</button>
</hbox>
<hbox>
<button label="&button-next-unix.label;" accesskey="&button-next-unix.accesskey;" class="wizard-button" dlgtype="next" icon="go-forward" default="true" flex="1">
</button>
</hbox>
</deck>
<button label="&button-back-win.label;" accesskey="&button-back-win.accesskey;" class="wizard-button" dlgtype="back" icon="go-back">
</button>
<deck class="wizard-next-deck" anonid="WizardButtonDeck">
<hbox>
<button label="&button-finish-win.label;" class="wizard-button" dlgtype="finish" default="true" flex="1">
</button>
</hbox>
<hbox>
<button label="&button-next-win.label;" accesskey="&button-next-win.accesskey;" class="wizard-button" dlgtype="next" icon="go-forward" default="true" flex="1">
</button>
</hbox>
</deck>
<button label="&button-cancel-win.label;" class="wizard-button" dlgtype="cancel" icon="cancel">
</button>
</hbox>
</vbox>`;
    let comment = document.createComment("Creating xbl-wizard-buttons");
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define("xbl-wizard-buttons", XblWizardButtons);
