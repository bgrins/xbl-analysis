class FirefoxHandler extends FirefoxRichlistitem {
  connectedCallback() {
    super.connectedCallback();
    this.innerHTML = `
      <xul:vbox pack="center">
        <xul:image inherits="src=image" height="32" width="32"></xul:image>
      </xul:vbox>
      <xul:vbox flex="1">
        <xul:label class="name" inherits="value=name"></xul:label>
        <xul:label class="description" inherits="value=description"></xul:label>
      </xul:vbox>
    `;
  }

  get label() {
    return this.getAttribute("name") + " " + this.getAttribute("description");
  }
}
customElements.define("firefox-handler", FirefoxHandler);
