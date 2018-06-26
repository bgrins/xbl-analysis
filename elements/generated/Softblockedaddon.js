class Softblockedaddon extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <image inherits="src=icon"></image>
      <vbox flex="1">
        <hbox class="addon-name-version">
          <label class="addonName" crop="end" inherits="value=name"></label>
          <label class="addonVersion" inherits="value=version"></label>
        </hbox>
        <hbox>
          <spacer flex="1"></spacer>
          <checkbox class="disableCheckbox" checked="true" label="FROM-DTD.blocklist.checkbox.label;"></checkbox>
        </hbox>
      </vbox>
    `));
    this._checkbox = document.getAnonymousElementByAttribute(this, "class", "disableCheckbox");

    this._setupEventListeners();
  }

  get checked() {
    return this._checkbox.checked;
  }

  _setupEventListeners() {

  }
}