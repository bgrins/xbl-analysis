class MozMenuButton extends MozMenuButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <button class="box-inherit button-menubutton-button" anonid="button" flex="1" allowevents="true" inherits="disabled,crop,image,label,accesskey,command,
                                buttonover,buttondown,align,dir,pack,orient">
        <children></children>
      </button>
      <dropmarker class="button-menubutton-dropmarker" inherits="open,disabled,label"></dropmarker>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}