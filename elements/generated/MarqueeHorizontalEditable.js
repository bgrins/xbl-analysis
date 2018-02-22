class FirefoxMarqueeHorizontalEditable extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <html:div style="display: inline-block; overflow: auto; width: -moz-available;">
        <children></children>
      </html:div>
    `;

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}