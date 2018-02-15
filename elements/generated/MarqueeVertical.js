class FirefoxMarqueeVertical extends FirefoxMarquee {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <html:div style="overflow: hidden; width: -moz-available;">
        <html:div class="innerDiv">
          <children></children>
        </html:div>
      </html:div>
    `;

  }

}