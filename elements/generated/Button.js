class Button extends ButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <hbox class="box-inherit button-box" inherits="align,dir,pack,orient" align="center" pack="center" flex="1" anonid="button-box">
        <image class="button-icon" inherits="src=image"></image>
        <label class="button-text" inherits="value=label,accesskey,crop,highlightable"></label>
        <label class="button-highlightable-text" inherits="text=label,accesskey,crop,highlightable"></label>
      </hbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}