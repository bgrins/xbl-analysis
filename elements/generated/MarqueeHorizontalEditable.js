class MozMarqueeHorizontalEditable extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div style="display: inline-block; overflow: auto; width: -moz-available;">
        <children></children>
      </html:div>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}