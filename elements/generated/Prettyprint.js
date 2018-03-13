class FirefoxPrettyprint extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <html:div id="top"></html:div>
      <html:span style="display: none;">
        <children></children>
      </html:span>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {
    this.addEventListener("prettyprint-dom-created", (event) => {
      document.getAnonymousNodes(this).item(0).appendChild(event.detail);
    });

  }
}