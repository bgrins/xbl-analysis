class MozInstallitem extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox flex="1">
        <vbox align="center" pack="center" class="xpinstallIconContainer">
          <image class="xpinstallItemIcon" inherits="src=icon"></image>
        </vbox>
        <vbox flex="1" pack="center">
          <hbox class="xpinstallItemNameRow" align="center">
            <label class="xpinstallItemName" inherits="value=name" crop="right"></label>
          </hbox>
          <hbox class="xpinstallItemDetailsRow" align="center">
            <textbox class="xpinstallItemURL" inherits="value=url" flex="1" readonly="true" crop="right"></textbox>
          </hbox>
        </vbox>
      </hbox>
    `));

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