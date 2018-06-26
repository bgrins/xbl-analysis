class Update extends Richlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <hbox>
        <label class="update-name" inherits="value=name" flex="1" crop="right"></label>
        <label inherits="href=detailsURL,hidden=hideDetailsURL" class="text-link" value="FROM-DTD.update.details.label;"></label>
      </hbox>
      <grid>
        <columns>
          <column class="update-label-column"></column>
          <column flex="1"></column>
        </columns>
        <rows>
          <row>
            <label class="update-installedOn-label"></label>
            <label class="update-installedOn-value" inherits="value=installDate" flex="1" crop="right"></label>
          </row>
          <row>
            <label class="update-status-label"></label>
            <description class="update-status-value" flex="1"></description>
          </row>
        </rows>
      </grid>
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

  set detailsURL(val) {
    this.setAttribute('detailsURL', val);
    return val;
  }

  get detailsURL() {
    return this.getAttribute('detailsURL');
  }

  set installDate(val) {
    this.setAttribute('installDate', val);
    return val;
  }

  get installDate() {
    return this.getAttribute('installDate');
  }

  set hideDetailsURL(val) {
    this.setAttribute('hideDetailsURL', val);
    return val;
  }

  get hideDetailsURL() {
    return this.getAttribute('hideDetailsURL');
  }

  set status(val) {
    this.setAttribute("status", val);
    var field = document.getAnonymousElementByAttribute(this, "class", "update-status-value");
    while (field.hasChildNodes())
      field.firstChild.remove();
    field.appendChild(document.createTextNode(val));
    return val;
  }

  get status() {
    return this.getAttribute('status');
  }

  _setupEventListeners() {

  }
}