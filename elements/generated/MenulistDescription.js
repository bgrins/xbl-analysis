class FirefoxMenulistDescription extends FirefoxMenulist {
  constructor() {
    super();
  }
  connectedCallback() {
    super.connectedCallback();
    console.log(this, "connected");

    this.innerHTML = `<hbox class="menulist-label-box" flex="1">
<image class="menulist-icon" inherits="src=image,src">
</image>
<firefox-text-label class="menulist-label" inherits="value=label,crop,accesskey" crop="right" flex="1">
</firefox-text-label>
<firefox-text-label class="menulist-label menulist-description" inherits="value=description" crop="right" flex="10000">
</firefox-text-label>
</hbox>
<dropmarker class="menulist-dropmarker" type="menu" inherits="disabled,open">
</dropmarker>
<children includes="menupopup">
</children>`;
    let comment = document.createComment(
      "Creating firefox-menulist-description"
    );
    this.prepend(comment);
  }
  disconnectedCallback() {}
}
customElements.define(
  "firefox-menulist-description",
  FirefoxMenulistDescription
);
