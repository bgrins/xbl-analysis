class MozGroupbox extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox class="groupbox-title" align="center" pack="start">
        <children includes="caption"></children>
      </hbox>
      <box flex="1" class="groupbox-body" inherits="orient,align,pack">
        <children></children>
      </box>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}