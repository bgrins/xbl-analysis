class MozMarqueeVertical extends MozMarquee {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <html:div style="overflow: hidden; width: -moz-available;">
        <html:div class="innerDiv">
          <children></children>
        </html:div>
      </html:div>
    `));

    this._setupEventListeners();
  }

  _setupEventListeners() {

  }
}