class MozCreatorLink extends MozXULElement {
  connectedCallback() {

    this.appendChild(MozXULElement.parseXULToFragment(`
      <label anonid="label" value="FROM-DTD.addon.createdBy.label;"></label>
      <label anonid="creator-link" class="creator-link text-link"></label>
      <label anonid="creator-name" class="creator-name"></label>
    `));
    this._label = document.getAnonymousElementByAttribute(this, "anonid", "label");

    this._creatorLink = document.getAnonymousElementByAttribute(this, "anonid", "creator-link");

    this._creatorName = document.getAnonymousElementByAttribute(this, "anonid", "creator-name");

    if (this.hasAttribute("nameonly") &&
      this.getAttribute("nameonly") == "true") {
      this._label.hidden = true;
    }

    this._setupEventListeners();
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

  _setupEventListeners() {

  }
}