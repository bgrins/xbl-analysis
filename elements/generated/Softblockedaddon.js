class FirefoxSoftblockedaddon extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:image inherits="src=icon"></xul:image>
      <xul:vbox flex="1">
        <xul:hbox class="addon-name-version">
          <xul:label class="addonName" crop="end" inherits="value=name"></xul:label>
          <xul:label class="addonVersion" inherits="value=version"></xul:label>
        </xul:hbox>
        <xul:hbox>
          <xul:spacer flex="1"></xul:spacer>
          <xul:checkbox class="disableCheckbox" checked="true" label="FROM-DTD-blocklist-checkbox-label"></xul:checkbox>
        </xul:hbox>
      </xul:vbox>
    `;
    Object.defineProperty(this, "_checkbox", {
      configurable: true,
      enumerable: true,
      get() {
        delete this._checkbox;
        return (this._checkbox = document.getAnonymousElementByAttribute(
          this,
          "class",
          "disableCheckbox"
        ));
      },
      set(val) {
        delete this._checkbox;
        return (this._checkbox = val);
      }
    });
  }

  get checked() {
    return this._checkbox.checked;
  }
}
customElements.define("firefox-softblockedaddon", FirefoxSoftblockedaddon);
