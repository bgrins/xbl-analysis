class FirefoxMarqueeHorizontal extends FirefoxMarquee {
  connectedCallback() {
    super.connectedCallback()
    this.innerHTML = `
      <html:div style="display: -moz-box; overflow: hidden; width: -moz-available;">
        <html:div style="display: -moz-box;">
          <html:div class="innerDiv" style="display: table; border-spacing: 0;">
            <html:div>
              <children></children>
            </html:div>
          </html:div>
        </html:div>
      </html:div>
    `;

    this.setupHandlers();
  }

  setupHandlers() {

  }
}