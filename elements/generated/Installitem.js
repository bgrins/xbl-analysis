class FirefoxInstallitem extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <xul:hbox flex="1">
        <xul:vbox align="center" pack="center" class="xpinstallIconContainer">
          <xul:image class="xpinstallItemIcon" inherits="src=icon"></xul:image>
        </xul:vbox>
        <xul:vbox flex="1" pack="center">
          <xul:hbox class="xpinstallItemNameRow" align="center">
            <xul:label class="xpinstallItemName" inherits="value=name" crop="right"></xul:label>
          </xul:hbox>
          <xul:hbox class="xpinstallItemDetailsRow" align="center">
            <xul:textbox class="xpinstallItemURL" inherits="value=url" flex="1" readonly="true" crop="right"></xul:textbox>
          </xul:hbox>
        </xul:vbox>
      </xul:hbox>
    `;

    this._setupEventListeners();
  }

  set name(val) {
    this.setAttribute('name', val);
    return val;
  }

  get name() {
    return this.getAttribute('name');
  }

  set cert(val) {
    this.setAttribute('cert', val);
    return val;
  }

  get cert() {
    return this.getAttribute('cert');
  }

  set signed(val) {
    this.setAttribute('signed', val);
    return val;
  }

  get signed() {
    return this.getAttribute('signed');
  }

  set url(val) {
    this.setAttribute('url', val);
    return val;
  }

  get url() {
    return this.getAttribute('url');
  }

  set icon(val) {
    this.setAttribute('icon', val);
    return val;
  }

  get icon() {
    return this.getAttribute('icon');
  }

  set type(val) {
    this.setAttribute('type', val);
    return val;
  }

  get type() {
    return this.getAttribute('type');
  }

  _setupEventListeners() {

  }
}