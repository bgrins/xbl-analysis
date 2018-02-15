class FirefoxHardblockedaddon extends XULElement {
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
          <xul:label class="blockedLabel" value="FROM-DTD-blocklist-blocked-label"></xul:label>
        </xul:hbox>
      </xul:vbox>
    `;

  }

}