class FirefoxContainer extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox flex="1" equalsize="always">
        <xul:hbox flex="1" align="center">
          <xul:hbox inherits="data-identity-icon=containerIcon,data-identity-color=containerColor" height="24" width="24" class="userContext-icon"></xul:hbox>
          <xul:label flex="1" crop="end" inherits="text=containerName,highlightable"></xul:label>
        </xul:hbox>
        <xul:hbox flex="1" align="right">
          <children></children>
        </xul:hbox>
      </xul:hbox>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}