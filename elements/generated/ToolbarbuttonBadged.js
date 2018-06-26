class ToolbarbuttonBadged extends Toolbarbutton {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <children includes="observes|template|menupopup|panel|tooltip"></children>
      <stack class="toolbarbutton-badge-stack">
        <children></children>
        <image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor"></image>
        <label class="toolbarbutton-badge" inherits="value=badge,style=badgeStyle" top="0" end="0" crop="none"></label>
      </stack>
      <label class="toolbarbutton-text" crop="right" flex="1" inherits="value=label,accesskey,crop,wrap"></label>
      <label class="toolbarbutton-multiline-text" flex="1" inherits="text=label,accesskey,wrap"></label>
      <dropmarker anonid="dropmarker" type="menu" class="toolbarbutton-menu-dropmarker" inherits="disabled,label"></dropmarker>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}