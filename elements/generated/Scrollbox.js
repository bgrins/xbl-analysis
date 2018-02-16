class FirefoxScrollbox extends FirefoxScrollboxBase {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <xul:box class="box-inherit scrollbox-innerbox" inherits="orient,align,pack,dir" flex="1">
        <children></children>
      </xul:box>
    `;

    this.setupHandlers();
  }
  scrollByIndex(index) {
    this.boxObject.scrollByIndex(index);
  }

  setupHandlers() {

  }
}