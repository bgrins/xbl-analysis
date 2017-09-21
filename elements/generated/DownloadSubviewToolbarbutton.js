class FirefoxDownloadSubviewToolbarbutton extends FirefoxMenuButtonBase {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<children includes="observes|template|menupopup|panel|tooltip">
</children>
<image class="toolbarbutton-icon" inherits="validate,src=image,label,consumeanchor">
</image>
<vbox class="toolbarbutton-text" flex="1">
<firefox-text-label crop="end" inherits="value=label,accesskey,crop,wrap">
</firefox-text-label>
<firefox-text-label class="status-text status-full" crop="end" inherits="value=fullStatus">
</firefox-text-label>
<firefox-text-label class="status-text status-open" crop="end" inherits="value=openLabel">
</firefox-text-label>
<firefox-text-label class="status-text status-retry" crop="end" inherits="value=retryLabel">
</firefox-text-label>
<firefox-text-label class="status-text status-show" crop="end" inherits="value=showLabel">
</firefox-text-label>
</vbox>
<toolbarbutton anonid="button" class="action-button">
</toolbarbutton>`;
    let comment = document.createComment(
      "Creating firefox-download-subview-toolbarbutton"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-download-subview-toolbarbutton",
  FirefoxDownloadSubviewToolbarbutton
);
