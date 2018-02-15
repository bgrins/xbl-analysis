class FirefoxMarqueeVerticalEditable extends XULElement {
  connectedCallback() {

    this.innerHTML = `
      <html:div style="overflow: auto; height: inherit; width: -moz-available;">
        <children></children>
      </html:div>
    `;

  }

}