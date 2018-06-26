class MarqueeVerticalEditable extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div style="overflow: auto; height: inherit; width: -moz-available;">
        <children></children>
      </html:div>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}