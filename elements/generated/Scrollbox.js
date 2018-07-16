class Scrollbox extends Basecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
        <children></children>
      </box>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}