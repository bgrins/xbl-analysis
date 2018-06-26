class Hardblockedaddon extends MozXULElement {
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
          <label class="blockedLabel" value="FROM-DTD.blocklist.blocked.label;"></label>
        </hbox>
      </vbox>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}