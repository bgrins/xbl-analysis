class FirefoxMenuButton extends FirefoxMenuButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <xul:button class="box-inherit button-menubutton-button" anonid="button" flex="1" allowevents="true" inherits="disabled,crop,image,label,accesskey,command,
                                buttonover,buttondown,align,dir,pack,orient">
        <children></children>
      </xul:button>
      <xul:dropmarker class="button-menubutton-dropmarker" inherits="open,disabled,label"></xul:dropmarker>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}