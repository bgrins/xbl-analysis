class FirefoxCreatorLink extends XULElement {
  connectedCallback() {
    this.innerHTML = `
      <xul:label anonid="label" value="FROM-DTD-addon-createdBy-label"></xul:label>
      <xul:label anonid="creator-link" class="creator-link text-link"></xul:label>
      <xul:label anonid="creator-name" class="creator-name"></xul:label>
    `;

    this._label = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "label"
    );

    this._creatorLink = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "creator-link"
    );

    this._creatorName = document.getAnonymousElementByAttribute(
      this,
      "anonid",
      "creator-name"
    );

    if (
      this.hasAttribute("nameonly") &&
      this.getAttribute("nameonly") == "true"
    ) {
      this._label.hidden = true;
    }
  }

  setCreator(aCreator, aHomepageURL) {
    if (!aCreator) {
      this.collapsed = true;
      return;
    }
    this.collapsed = false;
    var url = aCreator.url || aHomepageURL;
    var showLink = !!url;
    if (showLink) {
      this._creatorLink.value = aCreator.name;
      this._creatorLink.href = url;
    } else {
      this._creatorName.value = aCreator.name;
    }
    this._creatorLink.hidden = !showLink;
    this._creatorName.hidden = showLink;
  }
}
customElements.define("firefox-creator-link", FirefoxCreatorLink);
