class MozCategory extends MozRichlistitem {
  connectedCallback() {
    super.connectedCallback()
    this.appendChild(MozXULElement.parseXULToFragment(`
      <image anonid="icon" class="category-icon"></image>
      <label anonid="name" class="category-name" crop="end" flex="1" inherits="value=name"></label>
      <label anonid="badge" class="category-badge" inherits="value=count"></label>
    `));

    if (!this.hasAttribute("count"))
      this.setAttribute("count", 0);

    this._setupEventListeners();
  }

  set badgeCount(val) {
    if (this.getAttribute("count") == val)
      return;

    this.setAttribute("count", val);
    var event = document.createEvent("Events");
    event.initEvent("CategoryBadgeUpdated", true, true);
    this.dispatchEvent(event);
  }

  get badgeCount() {
    return this.getAttribute("count");
  }

  _setupEventListeners() {

  }
}