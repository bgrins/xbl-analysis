class DownloadSubviewToolbarbutton extends MenuButtonBase {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor"></image>
      <vbox class="toolbarbutton-text" flex="1">
        <label crop="end" inherits="value=label,accesskey,crop,wrap"></label>
        <label class="status-text status-full" crop="end" inherits="value=fullStatus"></label>
        <label class="status-text status-open" crop="end" inherits="value=openLabel"></label>
        <label class="status-text status-retry" crop="end" inherits="value=retryLabel"></label>
        <label class="status-text status-show" crop="end" inherits="value=showLabel"></label>
      </vbox>
      <toolbarbutton anonid="button" class="action-button"></toolbarbutton>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}