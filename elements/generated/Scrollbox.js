class FirefoxScrollbox extends FirefoxBasecontrol {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
        <children></children>
      </xul:box>
    `;

    this._setupEventListeners();
  }

  scrollByIndex(index) {
    this.boxObject.scrollByIndex(index);
  }

  _setupEventListeners() {

  }
}